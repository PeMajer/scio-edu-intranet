import type { KVNamespace } from "@cloudflare/workers-types";

export interface Env {
  SUPABASE_URL: string;
  SUPABASE_ANON_KEY: string;
  SUPABASE_SERVICE_ROLE_KEY?: string;
  SANITY_PROJECT_ID: string;
  SANITY_DATASET?: string;
  SANITY_API_VERSION?: string;
  PUBLIC_SITE_URL?: string;
  GOOGLE_SERVICE_ACCOUNT_EMAIL: string;
  GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY: string;
  GOOGLE_CALENDAR_ID: string;
  SESSION_KV: KVNamespace;
}

declare module "@remix-run/cloudflare" {
  interface AppLoadContext {
    env: Env;
  }
}
