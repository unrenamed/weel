import { ParsedURL, SWRError } from "./types";
import { NextRequest } from "next/server";
import {
  format,
  differenceInMilliseconds,
  formatDistanceToNow,
  isThisYear,
} from "date-fns";

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

export const capitalize = (str: string) =>
  str.charAt(0).toUpperCase() + str.slice(1);

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

export const formatDate = (timestamp: Date) => {
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

export const getApexDomain = (url: string) => {
  try {
    // replace any custom scheme (e.g. notion://) with https://
    return new URL(url.replace(/^[a-zA-Z]+:\/\//, "https://")).hostname;
  } catch (e) {
    return "";
  }
};
