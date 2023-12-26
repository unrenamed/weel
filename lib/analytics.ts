import { NextRequest, userAgent } from "next/server";
import { capitalize, isBot, parse } from "./utils";
import {
  INTERVALS,
  LOCALHOST_GEO_DATA,
  LOCALHOST_IP,
  TINYBIRD_API_ENDPOINTS,
} from "./constants";
import {
  GetStatsParams,
  Interval,
  IntervalData,
  TinybirdApiEndpoint,
  TinybirdError,
  TinybirdPipe,
} from "./types";
import { clicksRateLimit } from "./upstash";
import { prismaEdgeClient } from "./prisma";
import { ipAddress } from "@vercel/edge";

const intervalData: IntervalData = {
  "1h": {
    startDate: new Date(Date.now() - 60 * 60 * 1000),
    granularity: "minute",
  },
  "24h": {
    startDate: new Date(Date.now() - 24 * 60 * 60 * 1000),
    granularity: "hour",
  },
  "7d": {
    startDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
    granularity: "day",
  },
  "30d": {
    startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
    granularity: "day",
  },
  "90d": {
    startDate: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000),
    granularity: "month",
  },
  all: {
    startDate: new Date("2023-09-01"),
    granularity: "month",
  },
};

export const isTinybirdApiEndpoint = (
  endpoint: string
): endpoint is TinybirdApiEndpoint => {
  return TINYBIRD_API_ENDPOINTS.includes(endpoint as TinybirdApiEndpoint);
};

export const isValidInterval = (interval: string): interval is Interval => {
  return INTERVALS.includes(interval as Interval);
};

export const recordClick = async (req: NextRequest) => {
  const { key, domain } = parse(req);
  if (!key || !domain) return;

  const bot = isBot(req);
  if (bot) return;

  const ip = ipAddress(req) ?? LOCALHOST_IP;
  const { success } = await clicksRateLimit.limit(`${ip}:${domain}:${key}`);
  if (!success) return;

  const eventBody = buildClickEventBody(key, domain, req);

  await fetch("https://api.tinybird.co/v0/events?name=link_clicks", {
    method: "POST",
    body: JSON.stringify(eventBody),
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_TOKEN}`,
    },
  });

  await prismaEdgeClient.link.update({
    where: {
      domain_key: {
        domain,
        key,
      },
    },
    data: {
      totalClicks: {
        increment: 1,
      },
      lastClicked: new Date(),
    },
  });
};

export const getStats = async (
  params: GetStatsParams
): Promise<TinybirdPipe["data"]> => {
  const { domain, key, endpoint, interval } = params;

  const url = new URL(`https://api.tinybird.co/v0/pipes/${endpoint}.json`);
  url.searchParams.append("domain", domain);
  url.searchParams.append("key", decodeURIComponent(key));

  if (interval && intervalData[interval]) {
    url.searchParams.append(
      "start",
      intervalData[interval].startDate
        .toISOString()
        .substring(0, 19)
        .replace("T", " ")
    );

    url.searchParams.append(
      "end",
      new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ")
    );

    url.searchParams.append("granularity", intervalData[interval].granularity);
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_TOKEN}`,
    },
  });

  const json: TinybirdPipe | TinybirdError = await response.json();
  if (isTinybirdPipe(json)) {
    return json.data;
  } else {
    return Promise.reject(new Error(json.error));
  }
};

export const getCoordinates = async (
  interval: Interval
): Promise<
  {
    latitude: number;
    longitude: number;
  }[]
> => {
  const url = new URL(`https://api.tinybird.co/v0/pipes/top_coordinates.json`);
  if (interval && intervalData[interval]) {
    url.searchParams.append(
      "start",
      intervalData[interval].startDate
        .toISOString()
        .substring(0, 19)
        .replace("T", " ")
    );

    url.searchParams.append(
      "end",
      new Date(Date.now()).toISOString().substring(0, 19).replace("T", " ")
    );
  }

  const response = await fetch(url, {
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_TOKEN}`,
    },
    next: {
      revalidate: 3600, // every 1 hour
    },
  });

  const json: TinybirdPipe | TinybirdError = await response.json();
  if (isTinybirdPipe(json)) {
    return json.data as {
      latitude: number;
      longitude: number;
    }[];
  } else {
    return Promise.reject(new Error(json.error));
  }
};

const buildClickEventBody = (key: string, domain: string, req: NextRequest) => {
  const ua = userAgent(req);
  const geo = req.geo ?? LOCALHOST_GEO_DATA;
  const referrer = req.headers.get("referrer");

  return {
    timestamp: new Date(),
    domain,
    key: decodeURIComponent(key),
    country: getValueOrUnknown(geo?.country),
    city: getValueOrUnknown(geo?.city),
    region: getValueOrUnknown(geo?.region),
    latitude: getValueOrUnknown(geo?.latitude),
    longitude: getValueOrUnknown(geo?.longitude),
    ua: getValueOrUnknown(ua.ua),
    browser: getValueOrUnknown(ua.browser.name),
    browser_version: getValueOrUnknown(ua.browser.version),
    engine: getValueOrUnknown(ua.engine.name),
    engine_version: getValueOrUnknown(ua.engine.version),
    os: getValueOrUnknown(ua.os.name),
    os_version: getValueOrUnknown(ua.os.version),
    device: getDeviceType(ua.device.type),
    device_vendor: getValueOrUnknown(ua.device.vendor),
    device_model: getValueOrUnknown(ua.device.model),
    cpu_architecture: getValueOrUnknown(ua.cpu?.architecture),
    bot: ua.isBot,
    referrer: getReferrerValue(referrer),
    referrer_url: getReferrerValue(referrer),
  };
};

const getValueOrUnknown = (value?: string) => {
  return value ?? "Unknown";
};

const getReferrerValue = (referrer: string | null) => {
  return referrer ?? "(direct)";
};

const getDeviceType = (type?: string) => {
  return type ? capitalize(type) : "Desktop";
};

const isTinybirdPipe = (response: Object): response is TinybirdPipe => {
  return !response.hasOwnProperty("error");
};
