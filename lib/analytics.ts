import { NextRequest, userAgent } from "next/server";
import { capitalize, parse } from "./utils";
import {
  INTERVALS,
  LOCALHOST_GEO_DATA,
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

const isTinybirdPipe = (response: Object): response is TinybirdPipe => {
  return !response.hasOwnProperty("error");
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

  const ua = userAgent(req);
  const geo = req.geo ?? LOCALHOST_GEO_DATA;
  const referer = req.headers.get("referer");

  await fetch("https://api.tinybird.co/v0/events?name=link_clicks", {
    method: "POST",
    body: JSON.stringify({
      timestamp: new Date(),
      domain,
      key: decodeURIComponent(key),
      country: geo?.country ?? "Unknown",
      city: geo?.city ?? "Unknown",
      region: geo?.region ?? "Unknown",
      latitude: geo?.latitude ?? "Unknown",
      longitude: geo?.longitude ?? "Unknown",
      ua: ua.ua || "Unknown",
      browser: ua.browser.name ?? "Unknown",
      browser_version: ua.browser.version ?? "Unknown",
      engine: ua.engine.name ?? "Unknown",
      engine_version: ua.engine.version ?? "Unknown",
      os: ua.os.name ?? "Unknown",
      os_version: ua.os.version ?? "Unknown",
      device: ua.device.type ? capitalize(ua.device.type) : "desktop",
      device_vendor: ua.device.vendor ?? "Unknown",
      device_model: ua.device.model ?? "Unknown",
      cpu_architecture: ua.cpu?.architecture ?? "Unknown",
      bot: ua.isBot,
      referer: referer ?? "(direct)",
    }),
    headers: {
      Authorization: `Bearer ${process.env.TINYBIRD_API_TOKEN}`,
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
