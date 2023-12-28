import { CreateLink, EditLink, FindLinksParams, RedisLink } from "../types";
import { redis } from "../upstash";
import bcrypt from "bcrypt";
import { prismaLocalClient } from "@/lib/prisma";
import { nanoid } from "../utils";
import { isBefore } from "date-fns";
import {
  DuplicateKeyError,
  InvalidExpirationTimeError,
  LinkNotFoundError,
} from "../error";
import { Link } from "@prisma/client";
import { deleteClickEvents } from "../analytics";

export const createLink = async (link: CreateLink) => {
  const { url, domain, key, ios, android, geo, password: rawPassword } = link;

  const exists = await findLinkByDomainKey(domain, key);
  if (exists) {
    throw new DuplicateKeyError("Key already exists in this domain");
  }

  const expiresAt = cutMillisOff(link.expiresAt);
  validateExpirationTime(expiresAt);
  const exat = getUnixTimeSeconds(expiresAt);
  const password = rawPassword ? await bcrypt.hash(rawPassword, 10) : null;

  const value = {
    url,
    archived: false,
    ...(password && { password }),
    ...(geo && { geo }),
    ...(ios && { ios }),
    ...(android && { android }),
    ...(expiresAt && { expiresAt: new Date(expiresAt) }),
  };

  const opts = {
    nx: true, // only create if the key does not yet exist
    ...(exat && ({ exat } as any)), // expiration timestamp, in seconds
  };

  const addLinkToRedis = redis.set<RedisLink>(`${domain}:${key}`, value, opts);

  const addLinkToDB = prismaLocalClient.link.create({
    data: {
      url,
      key,
      ios,
      domain,
      android,
      password,
      expiresAt,
      ...(geo && { geo }),
    },
  });

  const [dbLink, _] = await Promise.all([addLinkToDB, addLinkToRedis]);
  return dbLink;
};

export const editLink = async (id: string, newData: EditLink) => {
  const { url, ios, android, geo, domain, key } = newData;

  const link = await findLinkById(id);
  if (!link) {
    throw new LinkNotFoundError("Link is not found");
  }

  const oldDomain = link.domain;
  const oldKey = link.key;
  const domainChanged = oldDomain !== domain;
  const keyChanged = oldKey !== key;

  if (domainChanged || keyChanged) {
    const otherExists = await findLinkByDomainKey(domain, key);
    if (otherExists) {
      throw new DuplicateKeyError("Key already exists in this domain");
    }
  }

  const expiresAt = cutMillisOff(newData.expiresAt);
  validateExpirationTime(expiresAt);

  const redisValue = {
    url,
    archived: link.archived,
    ...(geo && { geo }),
    ...(ios && { ios }),
    ...(android && { android }),
    ...(expiresAt && { expiresAt: new Date(expiresAt) }),
    ...(link.password && { password: link.password }),
  };

  const exat = getUnixTimeSeconds(expiresAt);
  const opts = {
    ...(exat && ({ exat } as any)), // expiration timestamp, in seconds
  };

  const [updatedLink, _] = await Promise.all([
    // update link in SQL DB
    prismaLocalClient.link.update({
      where: { id },
      data: {
        url,
        key,
        ios,
        domain,
        android,
        expiresAt,
        ...(geo && { geo }),
      },
    }),
    // upsert new link in Redis DB
    redis.set<RedisLink>(`${domain}:${key}`, redisValue, opts),
    // delete old Redis record if domain or key changed
    ...(domainChanged || keyChanged
      ? [redis.del(`${oldDomain}:${oldKey}`)]
      : []),
  ]);

  return updatedLink;
};

export const deleteLink = async (domain: string, key: string) => {
  const deleteFromDB = prismaLocalClient.link.delete({
    where: { domain_key: { domain, key } },
  });
  const deleteFromRedis = redis.del(`${domain}:${key}`);
  const deleteEventsFromTinybird = deleteClickEvents(domain, key);
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
  const link = await findLinkByDomainKey(domain, key);
  return link ? generateRandomKey(domain) : key;
};

export const findLinkByDomainKey = async (domain: string, key: string) => {
  return await prismaLocalClient.link.findUnique({
    where: { domain_key: { domain, key } },
  });
};

export const findLinkById = async (id: string) => {
  return await prismaLocalClient.link.findUnique({
    where: { id },
  });
};

export const setArchiveStatus = async (
  { id, domain, key }: Link,
  archived: boolean
) => {
  const prevValue = await redis.get<RedisLink>(`${domain}:${key}`);
  await Promise.all([
    prismaLocalClient.link.update({ where: { id }, data: { archived } }),
    ...(prevValue
      ? [
          redis.set<RedisLink>(`${domain}:${key}`, {
            ...prevValue,
            archived,
          }),
        ]
      : []),
  ]);
};

const cutMillisOff = (timestamp: string | null) => {
  return timestamp ? timestamp.substring(0, 17) + "00.000Z" : null;
};

const getUnixTimeSeconds = (timestamp: string | null) => {
  return timestamp ? new Date(timestamp).getTime() / 1000 : null;
};

const validateExpirationTime = (expiresAt: string | null) => {
  if (expiresAt && isBefore(new Date(expiresAt), new Date())) {
    throw new InvalidExpirationTimeError(
      "Expiration time must be in the future"
    );
  }
};
