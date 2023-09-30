import { ParsedURL } from "./types";
import { NextRequest } from "next/server";

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
