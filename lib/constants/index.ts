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
  "referer",
] as const;

export const INTERVALS = ["1h", "24h", "7d", "30d", "90d", "all"] as const;

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
