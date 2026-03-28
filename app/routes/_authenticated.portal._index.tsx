import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { requireAuth } from "~/lib/supabase.server";
import { fetchCalendarEvents } from "~/lib/google-calendar.server";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { SectionHeader } from "~/components/layout/section-header";
import { PageHeader } from "~/components/layout/page-header";
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
    upcomingEvents = events.slice(0, 3);
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
      {/* Welcome hero */}
      <PageHeader
        fullWidth
        title={`Vítejte, ${profile?.full_name}!`}
        description="Rozvíjejte své dovednosti a inspirujte se. Jsme tu, abychom vám pomohli růst."
        imageUrl="/images/hero-classroom.jpg"
        className="-mt-6 mb-8"
        preTitle={
          <span className="inline-flex items-center bg-brand-light text-brand-primary text-xs font-semibold px-3 py-1 rounded-full mb-3 w-fit">
            ✦ Vzdělávací portál ScioPolis
          </span>
        }
      />

      {/* 3-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <SectionHeader icon={BookOpen} title="Vzdělávání" />
            <Link to="/vzdelavani" className="text-brand-primary font-medium text-sm hover:opacity-80 transition-opacity flex items-center gap-1">
              Všechny kategorie
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick link cards with images */}
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className="group relative h-[260px] rounded-2xl overflow-hidden cursor-pointer"
              >
                <img
                  src={link.image}
                  alt={link.label}
                  className="absolute inset-0 w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-300"
                />
                <div
                  className="absolute inset-x-0 bottom-0 h-3/5"
                  style={{ background: 'linear-gradient(to top, color-mix(in srgb, var(--color-scioedu-primary) 90%, black) 0%, color-mix(in srgb, var(--color-scioedu-primary) 50%, transparent) 60%, transparent 100%)' }}
                />
                {/* Content */}
                <div className="absolute bottom-0 left-0 right-0 p-5">
                  <div className="flex items-center gap-2 text-white font-semibold text-lg mb-1" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
                    <link.icon className="w-5 h-5" />
                    {link.label}
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-base text-white/90 flex-1">{link.desc}</span>
                    <span className="text-white text-lg">→</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* CTA banner */}
          <div
            className="rounded-2xl p-6 flex flex-wrap sm:flex-nowrap justify-between items-center gap-4 border-l-4 border-brand-accent"
            style={{ background: 'linear-gradient(to right, color-mix(in srgb, var(--color-scioedu-accent) 15%, white), color-mix(in srgb, var(--color-scioedu-accent) 5%, white))' }}
          >
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                Hledáte kurz pro sebe nebo svůj tým?
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Prohlédněte si kompletní nabídku vzdělávacích programů
              </p>
            </div>
            <Link
              to="/vzdelavani"
              className="bg-brand-accent hover:opacity-90 text-black font-semibold rounded-xl px-6 py-3 text-sm transition-opacity shrink-0"
            >
              Prohlédnout kurzy
            </Link>
          </div>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Calendar widget */}
          <div className="bg-card rounded-2xl border border-border shadow-sm p-5">
            <SectionHeader icon={Calendar} title="Nadcházející události" className="mb-4" />
            {upcomingEvents.length === 0 ? (
              <div className="text-center py-6">
                <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                <p className="text-muted-foreground text-sm">
                  Žádné nadcházející události
                </p>
              </div>
            ) : (
              <div>
                {(upcomingEvents as CalendarEvent[]).map((event, index) => {
                  const start = parseISO(
                    event.start.dateTime ?? event.start.date ?? ""
                  );
                  const isAllDay = !event.start.dateTime;
                  const isLast = index === (upcomingEvents as CalendarEvent[]).length - 1;
                  return (
                    <div key={event.id} className={`flex gap-3 py-3 ${isLast ? '' : 'border-b border-border'}`}>
                      {/* Date chip */}
                      <div className="inline-flex flex-col items-center justify-center bg-brand-light text-brand-primary font-bold rounded-lg px-2.5 py-1.5 min-w-[48px] text-center text-xs shrink-0">
                        <span className="uppercase">
                          {format(start, "MMM", { locale: cs })}
                        </span>
                        <span className="text-lg leading-tight">
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
                              className="text-xs text-muted-foreground hover:text-brand-primary transition-colors flex items-center gap-1"
                            >
                              <ExternalLink className="w-3 h-3" />
                              Google
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
            <Button
              variant="outline"
              asChild
              className="w-full mt-4"
            >
              <Link to="/kalendar">
                <Calendar className="w-3.5 h-3.5 mr-1.5" />
                Celý kalendář
              </Link>
            </Button>
          </div>

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
