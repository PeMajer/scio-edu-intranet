import { redirect, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { createSupabaseServerClient } from "~/lib/supabase.server";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");

  if (code) {
    const { supabase, headers } = createSupabaseServerClient(request, context);

    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (error) {
      return redirect(`/?error=${encodeURIComponent(error.message)}`, { headers });
    }

    if (data.user) {
      const email = data.user.email;

      if (!email || !email.endsWith("@scioskola.cz")) {
        await supabase.auth.signOut();
        return redirect("/?error=" + encodeURIComponent("Přístup povolen pouze zaměstnancům ScioPolis"), { headers });
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", data.user.id)
        .maybeSingle();

      if (!profile) {
        const fullName = data.user.user_metadata?.full_name ||
                        data.user.user_metadata?.name ||
                        email.split("@")[0];

        await supabase.from("profiles").insert({
          id: data.user.id,
          full_name: fullName,
          avatar_url: data.user.user_metadata?.avatar_url,
          role: "user",
        });
      }

      return redirect("/portal", { headers });
    }
  }

  return redirect("/", {});
}
