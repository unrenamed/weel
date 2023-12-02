import { ReactNode } from "react";
import { ParsedURL, SWRError } from "./types";
import { NextRequest, userAgent } from "next/server";
import {
  format,
  differenceInMilliseconds,
  formatDistanceToNow,
  isThisYear,
} from "date-fns";
import { customAlphabet } from "nanoid";
import { botRegexp } from "./constants/bot-regexp-patterns";
import { SECOND_LEVEL_DOMAINS } from "./constants";
import { ccTLDs } from "./constants/cctlds";

// ----------------------Request utilities----------------------
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

// ----------------------String utilities----------------------
export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

export const uncapitalize = (str: string) =>
  str.charAt(0).toLowerCase() + str.slice(1);

export const pluralize = (count: number, noun: string, suffix = "s") =>
  `${Intl.NumberFormat("en-US").format(count)} ${noun}${
    count !== 1 ? suffix : ""
  }`;

export const pluralizeJSX = (
  func: (count: number, noun: string) => ReactNode,
  count: number,
  noun: string,
  suffix = "s"
) => {
  return func(count, `${noun}${count !== 1 ? suffix : ""}`);
};

export const nanoid = (size?: number) =>
  customAlphabet(
    // Numbers and english alphabet without lookalikes: 1, l, I, 0, O, o, u, v, 5, S, s, 2, Z.
    "346789ABCDEFGHJKLMNPQRTUVWXYabcdefghijkmnpqrtwxyz",
    size
  )();

// ----------------------Date & time utilities----------------------
export const dateTimeAgo = (timestamp: Date) => {
  const date = new Date(timestamp);
  const diff = differenceInMilliseconds(Date.now(), date);

  if (diff < 2 * 1000) {
    return "just now";
  } else if (diff < 24 * 60 * 60 * 1000) {
    return `${formatDistanceToNow(date)} ago`;
  } else {
    return format(date, `MMM d ${isThisYear(date) ? "" : "y"}`);
  }
};

export const dateTimeSoon = (timestamp: Date, addSuffix = false) => {
  const date = new Date(timestamp);
  const diff = differenceInMilliseconds(date, Date.now());

  if (diff < 1 * 1000) {
    return formatDistanceToNow(date, { addSuffix, includeSeconds: true });
  } else if (diff < 24 * 60 * 60 * 1000) {
    return formatDistanceToNow(date, { addSuffix });
  } else {
    const suffix = addSuffix ? "on " : "";
    return suffix + format(date, `ccc, MMM do ${isThisYear(date) ? "" : "y"}`);
  }
};

export const getDateTimeLocal = (d: Date | string): string => {
  const date = new Date(d);
  if (isNaN(date.getTime())) return "";
  const timePart = date.toLocaleTimeString().split(":").slice(0, 2).join(":");
  const datePart = date.toISOString().split("T")[0];
  return `${datePart}T${timePart}`;
};

// ----------------------URL utilities----------------------
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

// ----------------------Common utilities----------------------
export const pipe =
  <T>(...fns: Array<(arg: T) => T>) =>
  (value: T) =>
    fns.reduce((acc, fn) => fn(acc), value);

export function exclude<T>(obj: T, keys: (keyof T)[]): Partial<T> {
  const excludedObj: Partial<T> = {};

  for (const key in obj) {
    if (!keys.includes(key as keyof T)) {
      excludedObj[key] = obj[key];
    }
  }

  return excludedObj;
}

export const fetcher = async (input: RequestInfo | URL, init?: RequestInit) => {
  const res = await fetch(input, init);

  // If the status code is not in the range 200-299,
  // we still try to parse and throw it.
  if (!res.ok) {
    const error = new Error(
      "An error occurred while fetching the data."
    ) as SWRError;
    // Attach extra info to the error object.
    error.info = await res.json();
    error.status = res.status;
    throw error;
  }

  return res.json();
};

// ----------------------Number utilities----------------------
export const round = (num: number, decimalPlaces: number) =>
  Number(Math.round(Number(num + "e" + decimalPlaces)) + "e-" + decimalPlaces);

export const nFormatter = (num: number, digits: number = 1) => {
  const lookup = [
    { value: 1, symbol: "" },
    { value: 1e3, symbol: "k" },
    { value: 1e6, symbol: "M" },
    { value: 1e9, symbol: "G" },
    { value: 1e12, symbol: "T" },
    { value: 1e15, symbol: "P" },
    { value: 1e18, symbol: "E" },
  ];
  const rx = /\.0+$|(\.\d*[1-9])0+$/; // regexp to trim trailing zeros
  const item = lookup
    .slice()
    .reverse()
    .find(function (item) {
      return num >= item.value;
    });

  return item
    ? (num / item.value).toFixed(digits).replace(rx, "$1") + item.symbol
    : "0";
};
