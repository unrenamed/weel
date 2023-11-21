import { CreateLink, EditLink, FindLinksParams, Link } from "../types";
import { redis } from "../upstash";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";
import { nanoid } from "../utils";
import { isBefore } from "date-fns";
import {
  DuplicateKeyError,
  InvalidExpirationTimeError,
  LinkNotFoundError,
} from "../error";

export const createLink = async (link: CreateLink) => {
  const { url, domain, key, ios, android, geo, password: rawPassword } = link;

  const exists = await findLinkByDomainKey(domain, key);
  if (exists) {
    throw new DuplicateKeyError("Key already exists in this domain");
  }

  // we are not interested in secs and millis of a key expiration time
  const expiresAt = link.expiresAt
    ? link.expiresAt.substring(0, 17) + "00.000Z"
    : null;

  if (expiresAt && isBefore(new Date(expiresAt), new Date())) {
    throw new InvalidExpirationTimeError(
      "Expiration time must be in the future"
    );
  }

  const exat = expiresAt ? new Date(expiresAt).getTime() / 1000 : null;
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

  const addLinkToRedis = redis.set<Link>(`${domain}:${key}`, value, opts);

  const addLinkToDB = prisma.link.create({
    data: {
      url,
      key,
      ios,
      geo,
      domain,
      android,
      password,
      expiresAt,
    },
  });

  const [dbLink, _] = await Promise.all([addLinkToDB, addLinkToRedis]);
  return dbLink;
};

export const editLink = async (id: string, newData: EditLink) => {
  const { url, ios, android, geo, password, domain, key } = newData;

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

  // we are not interested in secs and millis of a key expiration time
  const expiresAt = newData.expiresAt
    ? newData.expiresAt.substring(0, 17) + "00.000Z"
    : null;

  if (expiresAt && isBefore(new Date(expiresAt), new Date())) {
    throw new InvalidExpirationTimeError(
      "Expiration time must be in the future"
    );
  }

  const redisValue = {
    url,
    archived: false,
    ...(password && { password }),
    ...(geo && { geo }),
    ...(ios && { ios }),
    ...(android && { android }),
    ...(expiresAt && { expiresAt: new Date(expiresAt) }),
  };

  const exat = expiresAt ? new Date(expiresAt).getTime() / 1000 : null;
  const opts = {
    nx: true, // only create if the key does not yet exist
    ...(exat && ({ exat } as any)), // expiration timestamp, in seconds
  };

  const [updatedLink, _] = await Promise.all([
    // update link in SQL DB
    prisma.link.update({
      where: { id },
      data: {
        url,
        key,
        ios,
        geo,
        domain,
        android,
        password,
        expiresAt,
      },
    }),
    // upsert link in Redis DB
    redis.set<Link>(`${domain}:${key}`, redisValue, opts),
    // delete old Redis record if domain or key changed
    ...(domainChanged || keyChanged
      ? [redis.del(`${oldDomain}:${oldKey}`)]
      : []),
  ]);

  return updatedLink;
};

export const deleteLink = async (domain: string, key: string) => {
  const deleteFromDB = prisma.link.delete({
    where: { domain_key: { domain, key } },
  });
  const deleteFromRedis = redis.del(`${domain}:${key}`);
  await Promise.all([deleteFromDB, deleteFromRedis]);
};

export const findLinks = async ({
  domain,
  showArchived,
  search,
  sort = "createdAt",
  page,
  perPage = 10,
}: FindLinksParams) => {
  return await prisma.link.findMany({
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
  return await prisma.link.findUnique({
    where: { domain_key: { domain, key } },
  });
};

export const findLinkById = async (id: string) => {
  return await prisma.link.findUnique({
    where: { id },
  });
};
