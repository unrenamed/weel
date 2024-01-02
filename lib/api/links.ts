import {
  CreateLink,
  DomainKey,
  EditLink,
  FindLinksParams,
  LinkProps,
  RedisLink,
  WithHasPassword,
  WithPassword,
} from "../types";
import { redis } from "../upstash";
import bcrypt from "bcrypt";
import { prismaLocalClient } from "@/lib/prisma";
import {
  exclude,
  generatePatchData,
  getUnixTimeSeconds,
  nanoid,
} from "../utils";
import { isBefore } from "date-fns";
import { InvalidExpirationTimeError, LinkNotFoundError } from "../error";
import { Link } from "@prisma/client";
import { deleteClickEvents } from "../analytics";

export const createLink = async (payload: CreateLink) => {
  const { domain, key, url, ios, android, geo, password, expiresAt } = payload;
  const domainKey = { domain, key };

  const [dbLink, _] = await Promise.all([
    addLinkToDb({
      key,
      domain,
      url,
      geo,
      ios,
      android,
      password,
      expiresAt,
      archived: false,
    }),
    upsertRedisLink(
      domainKey,
      {
        url,
        archived: false,
        ios: ios ?? undefined,
        android: android ?? undefined,
        geo: geo ?? undefined,
        password: password ?? undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
      { nx: true } // only create if the key does not yet exist
    ),
  ]);

  return dbLink;
};

export const editLink = async (
  id: string,
  prevDomainKey: DomainKey,
  payload: EditLink
) => {
  const { domain, key, url, ios, android, geo, expiresAt } = payload;
  const domainKey = { domain, key };

  const oldDomain = prevDomainKey.domain;
  const oldKey = prevDomainKey.key;
  const domainChanged = oldDomain !== domain;
  const keyChanged = oldKey !== key;

  const prevRedisValue = await getRedisLink(domainKey);

  const [updatedLink, _] = await Promise.all([
    updateDbLink(id, {
      key,
      domain,
      url,
      geo,
      ios,
      android,
      expiresAt,
    }),
    upsertRedisLink(domainKey, {
      url,
      archived: prevRedisValue?.archived ?? false,
      ios: ios ?? undefined,
      geo: geo ?? undefined,
      android: android ?? undefined,
      password: prevRedisValue?.password,
      expiresAt: expiresAt ? new Date(expiresAt) : undefined,
    }),
    // delete old Redis record if domain or key changed
    ...(domainChanged || keyChanged ? [deleteRedisLink(prevDomainKey)] : []),
  ]);

  return updatedLink;
};

export const deleteLink = async (domainKey: DomainKey) => {
  const deleteFromDB = deleteDbLink(domainKey);
  const deleteFromRedis = deleteRedisLink(domainKey);
  const deleteEventsFromTinybird = deleteClickEvents(domainKey);
  await Promise.all([deleteFromDB, deleteFromRedis, deleteEventsFromTinybird]);
};

export const findLinks = async ({
  domain,
  showArchived,
  search,
  sort = "createdAt",
  page,
  perPage = 10,
}: FindLinksParams) => {
  return await prismaLocalClient.link.findMany({
    where: {
      ...(domain && { domain }),
      ...(search && {
        OR: [
          {
            key: { contains: search },
          },
          {
            url: { contains: search },
          },
        ],
      }),
      archived: showArchived ? undefined : false,
    },
    orderBy: {
      [sort]: "desc",
    },
    take: perPage,
    ...(page && {
      skip: (page - 1) * perPage,
    }),
  });
};

export const generateRandomKey = async (domain: string): Promise<string> => {
  const key = nanoid(7);
  const link = await findLinkByDomainKey({ domain, key });
  return link ? generateRandomKey(domain) : key;
};

export const findLinkByDomainKey = async (domainKey: DomainKey) => {
  return await prismaLocalClient.link.findUnique({
    where: { domain_key: domainKey },
  });
};

export const findLinkById = async (id: string) => {
  return await prismaLocalClient.link.findUnique({ where: { id } });
};

export const setArchiveStatus = async (
  { id, domain, key }: Link,
  archived: boolean
) => {
  const domainKey = { domain, key };
  const prev = await getRedisLink(domainKey);
  await Promise.all([
    updateDbLink(id, { archived }),
    ...(prev ? [upsertRedisLink(domainKey, { ...prev, archived })] : []),
  ]);
};

export const setPassword = async (
  { id, domain, key }: Link,
  password: string | null
) => {
  const domainKey = { domain, key };
  const prev = await getRedisLink(domainKey);
  await Promise.all([
    updateDbLink(id, { password: password ?? null }),
    ...(prev
      ? [
          upsertRedisLink(domainKey, {
            ...prev,
            password: password ?? undefined,
          }),
        ]
      : []),
  ]);
};

export const verifyLinkPassword = async (
  domainKey: DomainKey,
  password: string
) => {
  const link = await getRedisLink(domainKey);
  if (!link?.password) {
    throw new LinkNotFoundError("Link is not found");
  }
  const isValid = await bcrypt.compare(password, link.password);
  return isValid;
};

export const excludePassword = (link: Link) => {
  const linkWithHasPassword = computeHasPassword(link);
  const linkWithoutPassword = exclude(linkWithHasPassword, ["password"]);
  return linkWithoutPassword;
};

export const hashLinkPassword = async (rawPassword: string) => {
  return await bcrypt.hash(rawPassword, 10);
};

export const validateExpirationTime = (expiresAt: string | null) => {
  if (expiresAt && isBefore(new Date(expiresAt), new Date())) {
    throw new InvalidExpirationTimeError(
      "Expiration time must be in the future"
    );
  }
};

const addLinkToDb = async (data: LinkProps) => {
  const { url, ios, android, archived, geo, password, expiresAt, domain, key } =
    data;

  return await prismaLocalClient.link.create({
    data: {
      key,
      domain,
      url,
      geo,
      ios,
      android,
      password,
      archived,
      expiresAt,
    },
  });
};

const updateDbLink = async (id: string, data: Partial<LinkProps>) => {
  const { url, ios, android, archived, geo, password, expiresAt, domain, key } =
    data;

  return await prismaLocalClient.link.update({
    where: { id },
    data: generatePatchData({
      key,
      domain,
      url,
      geo,
      ios,
      android,
      password,
      archived,
      expiresAt,
    }),
  });
};

const deleteDbLink = async (domainKey: DomainKey) => {
  return prismaLocalClient.link.delete({
    where: { domain_key: domainKey },
  });
};

const getRedisLink = async (domainKey: DomainKey) => {
  const { domain, key } = domainKey;
  return redis.get<RedisLink>(`${domain}:${key}`);
};

const upsertRedisLink = async (
  domainKey: DomainKey,
  data: RedisLink,
  opts?: { nx: boolean }
) => {
  const { domain, key } = domainKey;
  const { url, archived, ios, android, geo, password, expiresAt } = data;

  const exat = getUnixTimeSeconds(expiresAt?.toISOString() ?? null);

  const redisKey = `${domain}:${key}`;
  const redisValue = generatePatchData({
    url,
    archived,
    geo,
    ios,
    android,
    password,
    expiresAt,
  }) as RedisLink;
  const redisOpts = {
    ...(exat && ({ exat } as any)), // expiration timestamp, in seconds
    ...opts,
  };

  return await redis.set<RedisLink>(redisKey, redisValue, redisOpts);
};

const deleteRedisLink = async (domainKey: DomainKey) => {
  const { domain, key } = domainKey;
  return await redis.del(`${domain}:${key}`);
};

const computeHasPassword = <Link extends WithPassword>(
  link: Link
): WithHasPassword<Link> => {
  return {
    ...link,
    hasPassword: !!link.password,
  };
};
