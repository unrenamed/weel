declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NODE_ENV: string;
      LOG_LEVEL: string;
      UPSTASH_REDIS_REST_URL: string;
      UPSTASH_REDIS_REST_TOKEN: string;
      TINYBIRD_API_TOKEN: string;
      DATABASE_URL: string;
      DATABASE_PROXY_URL: string;
      DASHBOARD_HOSTNAMES: string;
      APP_LINK_DOMAIN: string;
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {};
