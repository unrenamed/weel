import { INTERVALS, TINYBIRD_API_ENDPOINTS } from "./constants";

export interface ParsedURL {
  domain: string;
  path: string;
  fullPath: string;
  key: string;
  route: string;
}

export type GeoObject = {
  [country: string]: string;
};

export interface Link {
  url: string;
  archived: boolean;
  password?: string;
  expiresAt?: Date;
  ios?: string;
  android?: string;
  geo?: GeoObject;
}

export interface CreateLink {
  domain: string;
  key: string;
  url: string;
  password?: string;
  expiresAt?: string;
  ios?: string;
  android?: string;
  geo?: GeoObject;
}

export interface DeleteLink {
  domain: string;
  key: string;
}

export type TimeUnit = "ms" | "s" | "m" | "h" | "d";
export type Duration = `${number} ${TimeUnit}` | `${number}${TimeUnit}`;
export type TinybirdApiEndpoint = (typeof TINYBIRD_API_ENDPOINTS)[number];
export type Interval = (typeof INTERVALS)[number];

export interface GetStatsParams {
  domain: string;
  key: string;
  endpoint: TinybirdApiEndpoint;
  interval?: Interval;
}

export type Granularity = "minute" | "hour" | "day" | "month";
export type IntervalDataValue = {
  startDate: Date;
  granularity: Granularity;
};
export type IntervalData = Record<Interval, IntervalDataValue>;

export interface TinybirdPipe {
  meta: Array<{ name: "string"; type: "sring" }>;
  data: Array<{}>;
  rows: number;
  statistics: { elapsed: number; rows_read: number; bytes_read: number };
}

export interface TinybirdError {
  error: string;
  documentation?: string;
}
