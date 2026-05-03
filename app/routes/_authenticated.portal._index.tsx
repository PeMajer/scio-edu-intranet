import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { Link, useLoaderData } from "@remix-run/react";
import { requireAuth } from "~/lib/supabase.server";
import { fetchCalendarEvents } from "~/lib/google-calendar.server";
import { Card } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Badge } from "~/components/ui/badge";
import { SectionHeader } from "~/components/layout/section-header";
import { PageHeader } from "~/components/layout/page-header";
import { CourseCard } from "~/components/course-card";
import { HighlightBox } from "~/components/highlight-box";
import { EventList } from "~/components/event-list";
import {
  BookOpen,
  FileText,
  CalendarDays,
  ArrowRight,
  GraduationCap,
  Users,
  Sparkles,
  BookMarked,
} from "lucide-react";
import type { CalendarEvent } from "~/lib/types";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { user, supabase, headers } = await requireAuth(request, context);

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const env = context.env;
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
    href: "/programy/novacek",
    icon: GraduationCap,
    color: "from-primary to-primary/80",
    image: "/images/hero-classroom.jpg",
  },
  {
    label: "Osobní růst",
    desc: "Kurzy pro rozvoj průvodcovských dovedností",
    href: "/programy/rust",
    icon: Sparkles,
    color: "from-secondary to-secondary/80",
    image: "/images/hero-learning.jpg",
  },
  {
    label: "Pro týmy",
    desc: "Programy pro celé průvodcovny a kvadriády",
    href: "/programy/tymy",
    icon: Users,
    color: "from-muted to-muted/80",
    image: "/images/hero-team.jpg",
  },
  {
    label: "Moje kurzy",
    desc: "Vaše přihlášené a absolvované kurzy",
    href: "/moje-kurzy",
    icon: BookMarked,
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
          <Badge variant="brand-accent" size="md" className="mb-3 w-fit">
            Vzdělávací portál ScioPolis
          </Badge>
        }
      />

      {/* 3-column layout */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main content (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Section header */}
          <div className="flex items-center justify-between">
            <SectionHeader icon={BookOpen} title="Programy" />
            <Link to="/programy" className="text-brand-primary font-medium text-sm hover:opacity-80 transition-opacity flex items-center gap-1">
              Všechny kategorie
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Quick link cards with images */}
          <div className="grid sm:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <CourseCard
                key={link.href}
                href={link.href}
                title={link.label}
                highlight={link.desc}
                imageUrl={link.image}
                icon={link.icon}
              />
            ))}
          </div>

          {/* CTA banner */}
          <HighlightBox className="flex flex-wrap sm:flex-nowrap justify-between items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-foreground">
                Hledáte kurz pro sebe nebo svůj tým?
              </p>
              <p className="text-sm text-muted-foreground mt-0.5">
                Prohlédněte si kompletní nabídku vzdělávacích programů
              </p>
            </div>
            <Button variant="primary" className="shrink-0 w-full sm:w-auto" asChild>
              <Link to="/programy">Prohlédnout kurzy</Link>
            </Button>
          </HighlightBox>
        </div>

        {/* Sidebar (1/3) */}
        <div className="space-y-6">
          {/* Calendar widget */}
          <Card className="p-5">
            <SectionHeader icon={CalendarDays} title="Nadcházející události" className="mb-4" />
            <EventList events={upcomingEvents as CalendarEvent[]} limit={3} />
            <Button
              variant="outline"
              asChild
              className="w-full mt-4"
            >
              <Link to="/kalendar">
                <CalendarDays className="w-3.5 h-3.5 mr-1.5" />
                Celý kalendář
              </Link>
            </Button>
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
              <Button variant="outline" className="w-full" asChild>
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
