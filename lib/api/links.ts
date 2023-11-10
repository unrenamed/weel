import { CreateLink, EditLink, FindLinksParams, Link } from "../types";
import { redis } from "../upstash";
import bcrypt from "bcrypt";
import prisma from "@/lib/prisma";

export const createLink = async (link: CreateLink) => {
  const { url, domain, key, ios, android, geo, password: rawPassword } = link;

  // we are not interested in secs and millis of a key expiration time
  const expiresAt = link.expiresAt
    ? link.expiresAt.substring(0, 17) + "00.000Z"
    : null;

  const exat = expiresAt ? new Date(expiresAt).getTime() / 1000 : null;
  const password = rawPassword ? await bcrypt.hash(rawPassword, 10) : null;

  const addLinkToDB = prisma.link.create({
    data: {
      ...link,
      geo: geo,
      password,
      expiresAt,
    },
  });

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

  const [dbLink, _] = await Promise.all([addLinkToDB, addLinkToRedis]);
  return dbLink;
};

export const editLink = async (
  key: string,
  domain: string,
  newData: EditLink
) => {
  const { url, ios, android, geo } = newData;
  // we are not interested in secs and millis of a key expiration time
  const expiresAt = newData.expiresAt
    ? newData.expiresAt.substring(0, 17) + "00.000Z"
    : null;
  const exat = expiresAt ? new Date(expiresAt).getTime() / 1000 : null;

  const updatedLink = await prisma.link.update({
    where: { domain_key: { domain, key } },
    data: {
      ...newData,
      geo: geo,
      expiresAt,
    },
  });

  if (!updatedLink) {
    return null;
  }

  const value = {
    url,
    archived: false,
    ...(updatedLink.password && { password: updatedLink.password }),
    ...(geo && { geo }),
    ...(ios && { ios }),
    ...(android && { android }),
    ...(expiresAt && { expiresAt: new Date(expiresAt) }),
  };

  const opts = {
    nx: true, // only create if the key does not yet exist
    ...(exat && ({ exat } as any)), // expiration timestamp, in seconds
  };

  await redis.set<Link>(
    `${updatedLink.domain}:${updatedLink.key}`,
    value,
    opts
  );

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
