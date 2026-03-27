import { redirect, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function action({ request, context }: ActionFunctionArgs) {
  const { supabase, headers } = createSupabaseServerClient(request, context);
  await supabase.auth.signOut();
  return redirect("/", { headers });
}

export function loader() {
  return redirect("/");
}
