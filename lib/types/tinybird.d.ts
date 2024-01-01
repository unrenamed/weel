import { INTERVALS, TINYBIRD_API_ENDPOINTS } from "../constants";

type Granularity = "minute" | "hour" | "day" | "month";
type IntervalDataValue = {
  startDate: Date;
  granularity: Granularity;
};

export type Interval = (typeof INTERVALS)[number];
export type IntervalData = Record<Interval, IntervalDataValue>;
export type TinybirdApiEndpoint = (typeof TINYBIRD_API_ENDPOINTS)[number];

export interface GetStatsParams {
  domain: string;
  key: string;
  endpoint: TinybirdApiEndpoint;
  interval?: Interval;
}

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
