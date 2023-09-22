"use server";

import { Link } from "@/lib/types";
import { redis } from "@/lib/upstash";
import bcrypt from "bcrypt";

type Params = {
  domain: string;
  key: string;
  password: string;
};

export const verifyPassword = async (params: Params) => {
  const domain = decodeURIComponent(params.domain);
  const key = decodeURIComponent(params.key);

  const link = await redis.get<Link>(`${domain}:${key}`);
  if (!link?.password) return { error: "Link not found" };

  const isValid = await bcrypt.compare(params.password, link.password);
  if (!isValid) return { error: "Invalid password" };

  return { url: link.url };
};
