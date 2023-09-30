import { CreateLink, Link } from "../types";
import { redis } from "../upstash";
import bcrypt from "bcrypt";

export const createLink = async (link: CreateLink) => {
  const { url, domain, key, ios, android, geo, password: rawPassword } = link;

  // we are not interested in secs and millis of a key expiration time
  const expiresAt = link.expiresAt
    ? link.expiresAt.substring(0, 17) + "00.000Z"
    : null;
    
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

  return await redis.set<Link>(`${domain}:${key}`, value, opts);
};

export const deleteLink = async (domain: string, key: string) => {
  return await redis.del(`${domain}:${key}`);
};
