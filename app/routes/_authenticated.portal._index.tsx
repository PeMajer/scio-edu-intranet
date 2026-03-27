import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { requireAuth } from "~/lib/supabase.server";
import { fetchCalendarEvents } from "~/lib/google-calendar.server";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { SectionHeader } from "~/components/layout/section-header";
import {
  BookOpen,
  FileText,
  Calendar,
  ArrowRight,
  Clock,
  GraduationCap,
  Users,
  Compass,
  Sparkles,
  MapPin,
  ExternalLink,
} from "lucide-react";
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
    upcomingEvents = events.slice(0, 4);
  } catch {
    // Selhání kalendáře nesmí rozbít dashboard
  }

  return json({ user, profile, upcomingEvents }, { headers });
}

const quickLinks = [
  {
    label: "Pro nováčky",
    desc: "Úvod do ScioPolis a základní kurzy",
    href: "/vzdelavani/novacek",
    icon: Compass,
    color: "from-primary to-primary/80",
    image: "/images/hero-classroom.jpg",
  },
  {
    label: "Osobní růst",
    desc: "Kurzy pro rozvoj průvodcovských dovedností",
    href: "/vzdelavani/rust",
    icon: Sparkles,
    color: "from-secondary to-secondary/80",
    image: "/images/hero-learning.jpg",
  },
  {
    label: "Pro týmy",
    desc: "Programy pro celé průvodcovny a kvadriády",
    href: "/vzdelavani/tymy",
    icon: Users,
    color: "from-muted to-muted/80",
    image: "/images/hero-team.jpg",
  },
  {
    label: "Moje kurzy",
    desc: "Vaše přihlášené a absolvované kurzy",
    href: "/moje-kurzy",
    icon: GraduationCap,
    color: "from-primary to-primary/80",
    image: "/images/hero-discussion.jpg",
  },
];

export default function Portal() {
  const { profile, upcomingEvents } = useLoaderData<typeof loader>();

  return (
    <div className="space-y-8">
      {/* Welcome hero with photo background */}
      <div className="relative overflow-hidden rounded-2xl h-48 sm:h-56">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url('/images/hero-classroom.jpg')" }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/80 to-primary/60" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-secondary/15 rounded-full -translate-y-1/2 translate-x-1/4" />
        <div className="relative z-10 h-full flex flex-col justify-center p-8 lg:p-10">
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-2">
            Vítejte, {profile?.full_name}!
          </h1>
          <p className="text-white/80 text-lg max-w-lg">
            Rozvíjejte své dovednosti a inspirujte se. Jsme tu, abychom vám pomohli růst.
          </p>
        </div>
      </div>

      {/* 3-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-primary" />
              <h2 className="text-xl font-semibold">Vzdělávání</h2>
            </div>
            <Button variant="ghost" size="sm" className="text-primary" asChild>
              <Link to="/vzdelavani">
                Všechny kategorie
                <ArrowRight className="w-4 h-4 ml-1" />
              </Link>
            </Button>
          </div>

          {/* Quick link cards with images */}
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group relative overflow-hidden rounded-xl border bg-card hover:shadow-lg transition-all"
              >
                {/* Card image */}
                <div className="h-40 relative overflow-hidden">
                  <div
                    className="absolute inset-0 bg-cover bg-center group-hover:scale-105 transition-transform duration-500"
                    style={{ backgroundImage: `url('${link.image}')` }}
                  />
                  <div className={`absolute inset-0 bg-gradient-to-t ${link.color} opacity-60`} />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <div className="absolute bottom-3 left-3 flex items-center gap-2">
                    <div className="w-8 h-8 rounded-lg bg-white/20 backdrop-blur-sm flex items-center justify-center">
                      <link.icon className="w-4 h-4 text-white" />
                    </div>
                    <span className="font-semibold text-white text-sm drop-shadow-md">
                      {link.label}
                    </span>
                  </div>
                </div>
                {/* Card body */}
                <div className="p-3.5 flex items-center justify-between">
                  <p className="text-sm text-muted-foreground line-clamp-1">
                    {link.desc}
                  </p>
                  <ArrowRight className="w-4 h-4 text-muted-foreground/40 shrink-0 ml-2 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
                </div>
              </Link>
            ))}
          </div>

          {/* CTA banner */}
          <div className="relative overflow-hidden rounded-xl border border-secondary/30 bg-gradient-to-r from-secondary/10 via-secondary/5 to-transparent p-6">
            <div className="absolute right-0 top-0 w-32 h-32 bg-secondary/10 rounded-full -translate-y-1/2 translate-x-1/2" />
            <div className="relative flex items-center gap-4">
              <div className="w-12 h-12 rounded-full bg-secondary/20 flex items-center justify-center shrink-0">
                <GraduationCap className="w-6 h-6 text-secondary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-foreground">
                  Hledáte kurz pro sebe nebo svůj tým?
                </p>
                <p className="text-sm text-muted-foreground mt-0.5">
                  Prohlédněte si kompletní nabídku vzdělávacích programů
                </p>
              </div>
              <Button variant="accent" className="shrink-0 hidden sm:flex" asChild>
                <Link to="/vzdelavani">Prohlédnout kurzy</Link>
              </Button>
            </div>
            <Button variant="accent" className="w-full mt-4 sm:hidden" asChild>
              <Link to="/vzdelavani">Prohlédnout kurzy</Link>
            </Button>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Calendar widget */}
          <Card>
            <div className="p-5">
              <SectionHeader icon={Calendar} title="Nadcházející události" className="mb-4" />
              {upcomingEvents.length === 0 ? (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">
                    Žádné nadcházející události
                  </p>
                </div>
              ) : (
                <div className="space-y-0">
                  {(upcomingEvents as CalendarEvent[]).map((event, index) => {
                    const start = parseISO(
                      event.start.dateTime ?? event.start.date ?? ""
                    );
                    const isAllDay = !event.start.dateTime;
                    return (
                      <div key={event.id}>
                        {index > 0 && <Separator className="my-3" />}
                        <div className="flex gap-3">
                          {/* Date pill */}
                          <div className="flex flex-col items-center shrink-0 w-12">
                            <span className="text-xs font-medium text-primary uppercase">
                              {format(start, "MMM", { locale: cs })}
                            </span>
                            <span className="text-xl font-bold text-foreground leading-tight">
                              {format(start, "d")}
                            </span>
                          </div>
                          {/* Event info */}
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground leading-snug">
                              {event.summary}
                            </p>
                            <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                              {!isAllDay && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {format(start, "H:mm", { locale: cs })}
                                </span>
                              )}
                              {event.location && (
                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                  <MapPin className="w-3 h-3" />
                                  <span className="truncate max-w-[120px]">
                                    {event.location}
                                  </span>
                                </span>
                              )}
                              {event.htmlLink && (
                                <a
                                  href={event.htmlLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-muted-foreground hover:text-primary transition-colors flex items-center gap-1"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  Google
                                </a>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              <Button
                variant="outline"
                size="sm"
                asChild
                className="w-full mt-4"
              >
                <Link to="/kalendar">
                  <Calendar className="w-3.5 h-3.5 mr-1.5" />
                  Celý kalendář
                </Link>
              </Button>
            </div>
          </Card>

          {/* Koncepce card with photo */}
          <Card className="overflow-hidden">
            <div
              className="h-32 bg-cover bg-center relative"
              style={{ backgroundImage: "url('/images/hero-workshop.jpg')" }}
            >
              <div className="absolute inset-0 bg-gradient-to-t from-card via-card/50 to-transparent" />
            </div>
            <div className="p-5 pt-3">
              <SectionHeader icon={FileText} title="Koncepce" className="mb-3" />
              <p className="text-sm text-muted-foreground mb-3">
                Podcasty, metodické balíčky a koncepční dokumenty pro vaši inspiraci.
              </p>
              <Button variant="outline" size="sm" className="w-full" asChild>
                <Link to="/koncepce">
                  <FileText className="w-3.5 h-3.5 mr-1.5" />
                  Zobrazit zdroje
                </Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
}
