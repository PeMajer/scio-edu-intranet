import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { LogIn, BookOpen, Calendar, Users, FileText } from "lucide-react";
import { Logo } from "~/components/logo";

export async function loader({ request, context }: LoaderFunctionArgs) {
  try {
    if (!context.env?.SUPABASE_URL || !context.env?.SUPABASE_ANON_KEY) {
      return json({
        supabaseConfigured: false,
        message: "Čekám na konfiguraci Supabase..."
      });
    }

    const { supabase, headers } = createSupabaseServerClient(request, context);
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      return redirect("/portal", { headers });
    }

    return json({ supabaseConfigured: true }, { headers });
  } catch (error: any) {
    console.error("Loader error:", error);
    return json({
      supabaseConfigured: false,
      message: "Chyba: " + (error?.message || "Neznámá chyba")
    });
  }
}

export async function action({ request, context }: ActionFunctionArgs) {
  const formData = await request.formData();
  const action = formData.get("action");

  if (action === "google-login") {
    try {
      const { supabase, headers } = createSupabaseServerClient(request, context);
      const origin = new URL(request.url).origin;

      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: `${origin}/auth/callback`,
        },
      });

      if (error) {
        return json({ error: error.message }, { headers });
      }

      if (data.url) {
        return redirect(data.url, { headers });
      }
    } catch (error: any) {
      return json({ error: error?.message || "Chyba při přihlašování" });
    }
  }

  return json({ error: "Neplatná akce" });
}

export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid lg:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <Logo size="lg" variant="color" />

          <div className="space-y-4">
            <h2 className="text-3xl font-bold text-foreground">
              Interní portál pro vzdělávání ScioPolis
            </h2>
            <p className="text-lg text-muted-foreground">
              Vítejte na vzdělávací platformě pro zaměstnance ScioPolis.
              Přihlaste se pomocí vašeho firemního Google účtu a získejte přístup k:
            </p>
          </div>

          <div className="grid gap-4">
            <div className="flex items-start gap-3">
              <div className="mt-1 w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <BookOpen className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Vzdělávací kurzy</h3>
                <p className="text-sm text-muted-foreground">Rozsáhlá nabídka kurzů pro nováčky i pokročilé průvodce</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <Calendar className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Kalendář akcí</h3>
                <p className="text-sm text-muted-foreground">Přehled nadcházejících školení a vzdělávacích aktivit</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Rozvoj týmů</h3>
                <p className="text-sm text-muted-foreground">Specializované programy pro týmy a kvadriády</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="mt-1 w-8 h-8 rounded-lg bg-accent flex items-center justify-center flex-shrink-0">
                <FileText className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Koncepční materiály</h3>
                <p className="text-sm text-muted-foreground">Metodické balíky, dokumenty a podcasty</p>
              </div>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-md mx-auto">
          <CardHeader className="space-y-2">
            <CardTitle className="text-2xl">Přihlášení</CardTitle>
            <CardDescription>
              Použijte váš firemní Google účet (@scioskola.cz)
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {actionData?.error && (
              <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive text-sm">
                {actionData.error}
              </div>
            )}

            {!loaderData?.supabaseConfigured && (
              <div className="p-3 rounded-lg bg-yellow-50 border border-yellow-200 text-yellow-700 text-sm">
                {loaderData?.message || "Konfigurace se načítá..."}
              </div>
            )}

            <Form method="post">
              <input type="hidden" name="action" value="google-login" />
              <Button
                type="submit"
                variant="accent"
                size="lg"
                className="w-full text-base font-semibold"
                disabled={!loaderData?.supabaseConfigured}
              >
                <LogIn className="w-5 h-5 mr-2" />
                Přihlásit se přes Google
              </Button>
            </Form>

            <div className="pt-4 border-t">
              <p className="text-xs text-center text-muted-foreground">
                Přístup je povolen pouze zaměstnancům ScioPolis s emailovou adresou @scioskola.cz
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
