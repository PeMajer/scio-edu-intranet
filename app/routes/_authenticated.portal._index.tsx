import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { requireAuth } from "~/lib/supabase.server";
import { fetchCalendarEvents } from "~/lib/google-calendar.server";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { PageHeader } from "~/components/layout/page-header";
import { BookOpen, FileText, Calendar, ArrowRight, Clock } from "lucide-react";
import type { CalendarEvent } from "~/lib/types";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const env = context.env as Record<string, string>;
  let upcomingEvents: CalendarEvent[] = [];
  try {
    const events = await fetchCalendarEvents(
      env.GOOGLE_CALENDAR_ID,
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    );
    upcomingEvents = events.slice(0, 3);
  } catch {
    // Selhání kalendáře nesmí rozbít dashboard
  }

  return json({ user, profile, upcomingEvents }, { headers });
}

export default function Portal() {
  const { profile, upcomingEvents } = useLoaderData<typeof loader>();

  return (
    <>
      <PageHeader title={`Vítejte, ${profile?.full_name}!`} description="Co chcete dnes dělat?" />

      <div className="grid lg:grid-cols-2 gap-6 mb-8">
        <Card className="border-2 border-primary shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-primary flex items-center justify-center">
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
                <Link to="/vzdelavani">
                  Prohlédnout kurzy
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </Button>
              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link to="/vzdelavani/novacek">Pro nováčky</Link>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link to="/vzdelavani/rust">Osobní růst</Link>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link to="/vzdelavani/tymy">Pro týmy</Link>
                </Button>
                <Button variant="ghost" size="sm" className="justify-start" asChild>
                  <Link to="/moje-kurzy">Moje kurzy</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="shadow-lg">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center">
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
              <div className="p-4 rounded-lg bg-accent/30 border border-accent">
                <p className="text-sm text-muted-foreground mb-3">
                  Sekce se připravuje — ale už teď tu najdete užitečné zdroje
                </p>
                <Button variant="outline" className="w-full" asChild>
                  <Link to="/koncepce">
                    Zobrazit dostupné zdroje
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-accent flex items-center justify-center">
              <Calendar className="w-5 h-5 text-primary" />
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
          {upcomingEvents.length === 0 ? (
            <p className="text-muted-foreground text-sm py-4">Žádné nadcházející události.</p>
          ) : (
            <div className="space-y-2 mb-4">
              {(upcomingEvents as CalendarEvent[]).map((event) => {
                const start = parseISO(event.start.dateTime ?? event.start.date ?? "");
                const isAllDay = !event.start.dateTime;
                return (
                  <div key={event.id} className="flex items-start gap-3 py-2 border-b last:border-0">
                    <Badge variant="secondary" className="flex-shrink-0 mt-0.5">
                      {format(start, "d. MMM", { locale: cs })}
                    </Badge>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{event.summary}</p>
                      {!isAllDay && (
                        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
                          <Clock className="w-3 h-3" />
                          {format(start, "H:mm", { locale: cs })}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
          <Button variant="outline" asChild className="w-full">
            <Link to="/kalendar">Zobrazit celý kalendář</Link>
          </Button>
        </CardContent>
      </Card>
    </>
  );
}
