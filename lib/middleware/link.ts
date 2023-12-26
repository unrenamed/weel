import { NextFetchEvent, NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";
import { linksRateLimit, redis } from "../upstash";
import { parse } from "../utils";
import { RedisLink } from "../types";
import { APP_HEADERS, LOCALHOST_GEO_DATA, LOCALHOST_IP } from "../constants";
import { ipAddress } from "@vercel/edge";
import { recordClick } from "../analytics";

export const LinkMiddleware = async (req: NextRequest, ev: NextFetchEvent) => {
  const { key, domain } = parse(req);

  if (!domain || !key) {
    return NextResponse.next();
  }

  const ip = ipAddress(req) ?? LOCALHOST_IP;
  const { success, limit, reset, remaining } = await linksRateLimit.limit(
    `${ip}:${domain}:${key}`
  );

  if (!success) {
    const response = new Response(
      `You have made too many attempts to open this link. Please try again after ${new Date(
        reset
      ).toString()}`,
      { status: 429 }
    );
    response.headers.append("X-Rate-Limit-Limit", limit.toString());
    response.headers.append("X-Rate-Limit-Remaining", remaining.toString());
    response.headers.append("X-Rate-Limit-Reset", reset.toString());
    return response;
  }

  const link = await redis.get<RedisLink>(`${domain}:${key}`);

  // When link is not found or archived
  if (!link || link.archived) {
    return NextResponse.redirect(new URL("/", req.url), {
      headers: APP_HEADERS,
    });
  }

  // If link has expired
  if (link.expiresAt && new Date() > link.expiresAt) {
    return NextResponse.redirect(new URL("/", req.url), {
      headers: APP_HEADERS,
    });
  }

  ev.waitUntil(recordClick(req));

  const linkUrl = getRedirectUrl(link, req);

  // If link is password-protected
  if (link.password) {
    return NextResponse.rewrite(
      new URL(`/protected/${domain}/${key}?redirectUrl=${linkUrl}`, req.url)
    );
  }

  return NextResponse.redirect(new URL(linkUrl), { headers: APP_HEADERS });
};

const getRedirectUrl = (link: RedisLink, req: NextRequest) => {
  let url = new URL(link.url);

  // If IOS device targeting is enabled
  const { os } = userAgent(req);

  if (link.ios && os?.name === "iOS") {
    url = new URL(link.ios);
  }

  // If Android device targeting is enabled
  if (link.android && os?.name === "Android") {
    url = new URL(link.android);
  }

  const { country } =
    req.geo && "country" in req.geo ? req.geo : LOCALHOST_GEO_DATA;

  // If geo targeting is enabled
  if (link.geo && country && country in link.geo) {
    url = new URL(link.geo[country]);
  }

  return url;
};
