import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { parse } from "../utils";
import { APP_HEADERS } from "../constants";
import { redis } from "../upstash";
import { RedisLink } from "../types";

export const RootMiddleware = async (req: NextRequest, _: NextFetchEvent) => {
  const { domain } = parse(req);

  if (!domain) {
    return NextResponse.next();
  }

  const rootLink = await redis.get<RedisLink>(`root:${domain}`);

  // When link is not found or archived
  if (!rootLink || rootLink.archived) {
    return NextResponse.redirect(new URL("/", req.url), {
      headers: APP_HEADERS,
    });
  }

  return NextResponse.redirect(new URL(rootLink.url), { headers: APP_HEADERS });
};
