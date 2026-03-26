import { createServerClient, parse, serialize } from "@supabase/ssr";
import type { AppLoadContext } from "@remix-run/cloudflare";

export function createSupabaseServerClient(
  request: Request,
  context: AppLoadContext
) {
  const cookies = parse(request.headers.get("Cookie") ?? "");
  const headers = new Headers();

  const supabase = createServerClient(
    context.env.SUPABASE_URL,
    context.env.SUPABASE_ANON_KEY,
    {
      cookies: {
        get(key) {
          return cookies[key];
        },
        set(key, value, options) {
          headers.append("Set-Cookie", serialize(key, value, options));
        },
        remove(key, options) {
          headers.append("Set-Cookie", serialize(key, "", options));
        },
      },
    }
  );

  return { supabase, headers };
}

export async function requireAuth(request: Request, context: AppLoadContext) {
  const { supabase, headers } = createSupabaseServerClient(request, context);

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Response("Unauthorized", {
      status: 401,
      headers,
    });
  }

  return { user, supabase, headers };
}

export async function requireAdmin(request: Request, context: AppLoadContext) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== "admin") {
    throw new Response("Forbidden", {
      status: 403,
      headers,
    });
  }

  return { user, profile, supabase, headers };
}
