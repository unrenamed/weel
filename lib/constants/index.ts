export * from "./bot-regexp-patterns";
export * from "./cctlds";
export * from "./countries";
export * from "./http-status-code";

export const LOCALHOST_GEO_DATA = {
  city: "Cherkasy",
  region: "Cherkasy Oblast",
  country: "UA",
  latitude: "49.4496",
  longitude: "32.0628",
};

export const LOCALHOST_IP = "127.0.0.1";

export const TINYBIRD_API_ENDPOINTS = [
  "timeseries",
  "clicks",
  "country",
  "city",
  "device",
  "browser",
  "os",
  "bot",
  "referrer",
] as const;

export const INTERVALS = ["1h", "24h", "7d", "30d", "90d", "all"] as const;

export const INTERVALS_DISPLAY_VALUES = [
  {
    value: "1h",
    displayValue: "Last hour",
  },
  {
    value: "24h",
    displayValue: "Last 24 hours",
  },
  {
    value: "7d",
    displayValue: "Last 7 days",
  },
  {
    value: "30d",
    displayValue: "Last 30 days",
  },
  {
    value: "90d",
    displayValue: "Last 3 months",
  },
  {
    value: "all",
    displayValue: "All Time",
  },
];

export const SECOND_LEVEL_DOMAINS = new Set([
  "com",
  "co",
  "net",
  "org",
  "edu",
  "gov",
  "in",
]);

export const SPECIAL_APEX_DOMAINS = new Set([
  "my.id",
  "github.io",
  "vercel.app",
  "now.sh",
  "pages.dev",
  "webflow.io",
  "netlify.app",
  "fly.dev",
  "web.app",
]);

export const APP_HEADERS = {
  "x-powered-by": "Weel - Link Management tool",
};
