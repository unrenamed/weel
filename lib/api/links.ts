import { CreateLink, Link } from "../types";
import { redis } from "../upstash";

export const createLink = async (link: CreateLink) => {
  const { url, domain, key, expiresAt, ios, android, geo } = link;
  const exat = expiresAt ? new Date(expiresAt).getTime() / 1000 : null;

  const value = {
    url,
    protected: link.protected ?? false,
    archived: false,
    ...(geo && { geo }),
    ...(ios && { ios }),
    ...(android && { android }),
    ...(expiresAt && { expiresAt: new Date(expiresAt) }),
  };

  const opts = {
    nx: true, // only create if the key does not yet exist
    ...(exat && ({ exat } as any)), // expiration timestamp, in seconds
  };

  return await redis.set<Link>(`${domain}:${key}`, value, opts);
};

export const deleteLink = async (domain: string, key: string) => {
  return await redis.del(`${domain}:${key}`);
};
