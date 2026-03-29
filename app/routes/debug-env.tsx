import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";

export async function loader({ context }: LoaderFunctionArgs) {
  const env = context.env || {};
  return json({
    hasEnv: !!context.env,
    envKeys: Object.keys(env),
    hasSupabaseUrl: !!env.SUPABASE_URL,
    hasSupabaseAnonKey: !!env.SUPABASE_ANON_KEY,
    supabaseUrlType: typeof env.SUPABASE_URL,
    contextKeys: Object.keys(context),
  });
}
