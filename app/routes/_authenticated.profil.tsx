import { json, type LoaderFunctionArgs, type ActionFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData, useFetcher } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { PageHeader } from "~/components/layout/page-header";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, birth_date, birth_place, department, school")
    .eq("id", user.id)
    .maybeSingle();

  return json(
    {
      email: user.email ?? "",
      profile: {
        full_name: profile?.full_name ?? "",
        birth_date: profile?.birth_date ?? "",
        birth_place: profile?.birth_place ?? "",
        department: profile?.department ?? "",
        school: profile?.school ?? "",
      },
    },
    { headers },
  );
}

export async function action({ request, context }: ActionFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);
  const formData = await request.formData();
  const intent = formData.get("intent") as string | null;

  if (intent === "clear-birth") {
    const { error } = await supabase
      .from("profiles")
      .update({ birth_date: null, birth_place: null })
      .eq("id", user.id);
    if (error) return json({ error: error.message }, { status: 400, headers });
    return json({ success: true, cleared: true }, { headers });
  }

  const birthDate = (formData.get("birthDate") as string | null)?.trim() || null;
  const birthPlace = (formData.get("birthPlace") as string | null)?.trim() || null;

  const { error } = await supabase
    .from("profiles")
    .update({ birth_date: birthDate, birth_place: birthPlace })
    .eq("id", user.id);

  if (error) return json({ error: error.message }, { status: 400, headers });
  return json({ success: true }, { headers });
}

export default function Profil() {
  const { email, profile } = useLoaderData<typeof loader>();
  const fetcher = useFetcher<{ success?: boolean; error?: string; cleared?: boolean }>();
  const isSaving = fetcher.state === "submitting";
  const justSaved = fetcher.data?.success && !fetcher.data.cleared;
  const justCleared = fetcher.data?.cleared;

  return (
    <>
      <PageHeader
        fullWidth
        title="Můj profil"
        description="Údaje pro vystavování certifikátů a komunikaci"
        imageUrl="/images/hero-discussion.jpg"
        className="-mt-6 mb-8"
      />

      <div className="max-w-2xl">
        <Card className="p-6 space-y-6">
          <section className="space-y-2">
            <h2 className="font-[family-name:var(--font-poppins)] font-bold text-lg">Účet</h2>
            <div className="text-sm text-muted-foreground">
              <div>
                <span className="font-medium text-foreground">Jméno:</span> {profile.full_name || "—"}
              </div>
              <div>
                <span className="font-medium text-foreground">Email:</span> {email}
              </div>
              {profile.school && (
                <div>
                  <span className="font-medium text-foreground">Škola:</span> {profile.school}
                </div>
              )}
              {profile.department && (
                <div>
                  <span className="font-medium text-foreground">Oddělení:</span> {profile.department}
                </div>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              Tyto údaje se synchronizují z Google účtu, případně je spravují administrátoři.
            </p>
          </section>

          <hr className="border-border" />

          <section className="space-y-4">
            <div>
              <h2 className="font-[family-name:var(--font-poppins)] font-bold text-lg">Údaje pro certifikát</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Datum a místo narození potřebujeme pro tisk certifikátů z absolvovaných kurzů.
              </p>
            </div>

            <fetcher.Form method="post" className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide" htmlFor="birthDate">
                  Datum narození
                </label>
                <input
                  id="birthDate"
                  type="date"
                  name="birthDate"
                  defaultValue={profile.birth_date}
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wide" htmlFor="birthPlace">
                  Místo narození
                </label>
                <input
                  id="birthPlace"
                  type="text"
                  name="birthPlace"
                  defaultValue={profile.birth_place}
                  placeholder="např. Praha"
                  className="mt-1 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-brand-primary"
                />
              </div>

              {fetcher.data?.error && (
                <p className="text-sm text-destructive">{fetcher.data.error}</p>
              )}
              {justSaved && (
                <p className="text-sm text-brand-primary">Změny uloženy.</p>
              )}
              {justCleared && (
                <p className="text-sm text-brand-primary">Údaje smazány.</p>
              )}

              <div className="flex flex-wrap items-center gap-2">
                <Button type="submit" variant="primary" disabled={isSaving}>
                  {isSaving && !justCleared ? "Ukládám…" : "Uložit změny"}
                </Button>
                {(profile.birth_date || profile.birth_place) && (
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isSaving}
                    onClick={() => {
                      if (confirm("Opravdu smazat datum a místo narození?")) {
                        fetcher.submit({ intent: "clear-birth" }, { method: "post" });
                      }
                    }}
                  >
                    Smazat údaje
                  </Button>
                )}
              </div>
            </fetcher.Form>
          </section>
        </Card>
      </div>
    </>
  );
}
