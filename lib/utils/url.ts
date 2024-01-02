import { NextRequest, userAgent } from "next/server";
import { ParsedURL } from "../types";
import { botRegexp, SECOND_LEVEL_DOMAINS, ccTLDs } from "../constants";

export const parse = (req: NextRequest): ParsedURL => {
  let domain = req.headers.get("host") as string;
  domain = domain.replace("www.", ""); // remove www. from domain

  // path is the path of the URL (e.g. acme.com/dashboard/settings -> /dashboard/settings)
  const path = req.nextUrl.pathname;

  // fullPath is the full URL path (along with search params)
  const searchParams = req.nextUrl.searchParams.toString();
  const fullPath = `${req.nextUrl.pathname}${
    searchParams.length > 0 ? `?${searchParams}` : ""
  }`;

  // decodeURIComponent is used below to handle foreign languages
  // First segment after `/`, a unique identifier for a link saved, e.g. acme.com/dashboard/settings --> dashboard
  const key = decodeURIComponent(path.split("/")[1]);
  // Full path without first `/` e.g. acme.com/dashboard/settings --> dashboard/settings
  const route = decodeURIComponent(path.slice(1));

  return { domain, path, fullPath, key, route };
};

export const isBot = (req: NextRequest) => {
  const ua = userAgent(req);
  if (ua.isBot) return true;
  return botRegexp.test(ua.ua);
};

export const getApexDomain = (url: string) => {
  let domain;
  try {
    // replace any custom scheme (e.g. notion://) with https://
    domain = new URL(url.replace(/^[a-zA-Z]+:\/\//, "https://")).hostname;
  } catch (e) {
    domain = "";
  }

  const hostParts = domain.split(".");
  if (hostParts.length < 3) {
    return domain;
  }

  const topLevelDomain = hostParts.at(-1);
  const secondLevelDomain = hostParts.at(-2);

  // if this is a country code top-level domain (e.g. co.uk, .com.ua, .org.tt), we return the last 3 parts
  if (
    secondLevelDomain &&
    SECOND_LEVEL_DOMAINS.has(secondLevelDomain) &&
    topLevelDomain &&
    ccTLDs.has(topLevelDomain)
  ) {
    return hostParts.slice(-3).join(".");
  }

  // if hostname starts with www, remove it from the apex domain
  if (hostParts[0] === "www") {
    return hostParts.slice(1, hostParts.length).join(".");
  }

  return hostParts.slice(-3).join(".");
};
