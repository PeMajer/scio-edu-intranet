import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { BookOpen, FileText, Calendar, ArrowRight } from "lucide-react";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return json({ user, profile }, { headers });
}

export default function Portal() {
  const { profile } = useLoaderData<typeof loader>();

  return (
    <div className="min-h-screen bg-[#F5F7F8]">
      <div className="container mx-auto p-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Vítejte, {profile?.full_name}!
          </h1>
          <p className="text-lg text-[#687A7C]">
            Co chcete dnes dělat?
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <Card className="border-2 border-[#1DA2AC] shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-[#1DA2AC] flex items-center justify-center">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Vzdělávání</CardTitle>
              </div>
              <CardDescription className="text-base">
                Objevte kurzy pro nováčky, pokročilé průvodce i specializované týmové programy
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="accent" size="lg" className="w-full justify-between group" asChild>
                  <a href="/vzdelavani">
                    Prohlédnout kurzy
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </a>
                </Button>
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="/vzdelavani/novacek">Pro nováčky</a>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="/vzdelavani/rust">Osobní růst</a>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="/vzdelavani/tymy">Pro týmy</a>
                  </Button>
                  <Button variant="ghost" size="sm" className="justify-start" asChild>
                    <a href="/moje-kurzy">Moje kurzy</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <div className="flex items-center gap-3 mb-2">
                <div className="w-12 h-12 rounded-lg bg-[#687A7C] flex items-center justify-center">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-2xl">Koncepce</CardTitle>
              </div>
              <CardDescription className="text-base">
                Metodické balíky, koncepční dokumenty a podcasty pro vaši inspiraci
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-[#BADEDF]/30 border border-[#BADEDF]">
                  <p className="text-sm text-[#687A7C] mb-3">
                    Sekce se připravuje — ale už teď tu najdete užitečné zdroje
                  </p>
                  <Button variant="outline" className="w-full" asChild>
                    <a href="/koncepce">
                      Zobrazit dostupné zdroje
                    </a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-[#BADEDF] flex items-center justify-center">
                <Calendar className="w-5 h-5 text-[#1DA2AC]" />
              </div>
              <div>
                <CardTitle>Nadcházející události</CardTitle>
                <CardDescription>
                  Přehled školení a vzdělávacích aktivit
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8">
              <p className="text-[#687A7C] mb-4">
                Zobrazení kalendáře událostí bude brzy k dispozici
              </p>
              <Button variant="outline" asChild>
                <a href="/kalendar">Zobrazit celý kalendář</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
