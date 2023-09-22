import { NextFetchEvent, NextResponse, userAgent } from "next/server";
import type { NextRequest } from "next/server";
import { redis } from "../upstash";
import { parse } from "../utils";
import { Link } from "../types";
import { LOCALHOST_GEO_DATA } from "../constants";

export const LinkMiddleware = async (req: NextRequest, ev: NextFetchEvent) => {
  const { key, domain } = parse(req);

  if (!domain || !key) {
    return NextResponse.next();
  }

  const link = await redis.get<Link>(`${domain}:${key}`);

  // When link is not found or archived
  if (!link || link.archived) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If link has expired
  if (link.expiresAt && new Date() > link.expiresAt) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If link is password-protected
  if (link.password) {
    return NextResponse.rewrite(
      new URL(`/protected/${domain}/${key}`, req.url)
    );
  }

  // If device targeting is enabled
  const { os } = userAgent(req);

  if (link.ios && os?.name === "iOS") {
    return NextResponse.redirect(new URL(link.ios));
  }

  if (link.android && os?.name === "Android") {
    return NextResponse.redirect(new URL(link.android));
  }

  // If geo targeting is enabled
  const { country } =
    req.geo && "country" in req.geo ? req.geo : LOCALHOST_GEO_DATA;

  if (link.geo && country && country in link.geo) {
    return NextResponse.redirect(new URL(link.geo[country]));
  }

  return NextResponse.redirect(new URL(link.url));
};
