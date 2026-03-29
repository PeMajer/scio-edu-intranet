import { json, redirect, type ActionFunctionArgs, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { createSupabaseServerClient } from "~/lib/supabase.server";
import { LogIn, GraduationCap, CalendarDays, Users, Lightbulb } from "lucide-react";
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

const features = [
  {
    icon: GraduationCap,
    title: "Vzdělávací programy",
    desc: "Kurzy pro nováčky, pokročilé průvodce i celé týmy",
  },
  {
    icon: CalendarDays,
    title: "Kalendář školení",
    desc: "Přehled akcí a termínů na jednom místě",
  },
  {
    icon: Users,
    title: "Týmový rozvoj",
    desc: "Programy šité na míru pro vaši průvodcovnu",
  },
  {
    icon: Lightbulb,
    title: "Koncepce & metodika",
    desc: "Podcasty, balíčky a dokumenty pro inspiraci",
  },
];

export default function Index() {
  const actionData = useActionData<typeof action>();
  const loaderData = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hero section with background image */}
      <div className="relative flex-1 flex items-center">
        {/* Background image */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-classroom.jpg')" }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/70" />
        </div>

        {/* Content */}
        <div className="relative z-10 w-full">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl py-12 lg:py-20">
            <div className="grid lg:grid-cols-5 gap-12 lg:gap-16 items-center">
              {/* Left side — branding + features */}
              <div className="lg:col-span-3 space-y-8">
                <div className="space-y-6">
                  <Logo size="lg" variant="white" />
                  <h1 className="text-4xl sm:text-5xl font-extrabold text-white leading-tight">
                    Vzdělávání pro pedagogickou praxi{" "}
                    <span className="text-secondary">21. století</span>
                  </h1>
                  <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                    Interní portál pro zaměstnance ScioPolis. Ucelené vzdělávací
                    programy, které propojují vědění, jednání a hodnotové ukotvení.
                  </p>
                </div>

                {/* Feature grid */}
                <div className="grid sm:grid-cols-2 gap-4">
                  {features.map((f) => (
                    <div
                      key={f.title}
                      className="flex items-start gap-3 rounded-xl bg-white/10 backdrop-blur-sm p-4 border border-white/15"
                    >
                      <div className="mt-0.5 w-10 h-10 rounded-lg bg-secondary/90 flex items-center justify-center flex-shrink-0">
                        <f.icon className="w-5 h-5 text-secondary-foreground" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-white text-sm">{f.title}</h3>
                        <p className="text-sm text-white/70 mt-0.5">{f.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <p className="text-sm text-white/50 italic">
                  &ldquo;Vzdělávání učitelů má smysl jen pokud je ukotvené v praxi
                  a otevřené současným výzvám školy.&rdquo;
                </p>
              </div>

              {/* Right side — login card */}
              <div className="lg:col-span-2">
                <div className="bg-card rounded-2xl shadow-2xl p-8 space-y-6 border border-white/10">
                  <div className="space-y-2 text-center">
                    <h2 className="text-2xl font-bold text-foreground">
                      Přihlaste se
                    </h2>
                    <p className="text-muted-foreground text-sm">
                      Použijte váš firemní účet @scioskola.cz
                    </p>
                  </div>

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
                      variant="primary"
                      size="xl"
                      className="w-full"
                      disabled={!loaderData?.supabaseConfigured}
                    >
                      <LogIn className="w-5 h-5 mr-2" />
                      Přihlásit se přes Google
                    </Button>
                  </Form>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <span className="w-full border-t" />
                    </div>
                    <div className="relative flex justify-center text-xs uppercase">
                      <span className="bg-card px-2 text-muted-foreground">
                        pouze pro zaměstnance
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3 text-center text-sm text-muted-foreground">
                    <p>
                      Jste z rodiny{" "}
                      <a
                        href="https://scioedu.cz"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary hover:underline font-medium"
                      >
                        ScioEdu
                      </a>
                      ?
                    </p>
                    <p className="text-xs">
                      Přístup je povolen pouze s emailovou adresou @scioskola.cz
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom accent strip */}
      <div className="h-1.5 bg-gradient-to-r from-primary via-secondary to-primary" />
    </div>
  );
}
