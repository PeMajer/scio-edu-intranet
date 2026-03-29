import { json, type LoaderFunctionArgs } from "@remix-run/cloudflare";
import { useLoaderData } from "@remix-run/react";
import { useState } from "react";
import {
  addMonths,
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  parseISO,
  startOfMonth,
  startOfWeek,
  subMonths,
  startOfDay,
} from "date-fns";
import { cs } from "date-fns/locale";
import { ChevronLeft, ChevronRight, X, Calendar } from "lucide-react";
import { EmptyState } from "~/components/empty-state";
import { requireAuth } from "~/lib/supabase.server";
import { fetchCalendarEvents } from "~/lib/google-calendar.server";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { SectionHeader } from "~/components/layout/section-header";
import { PageHeader } from "~/components/layout/page-header";
import { EventList } from "~/components/event-list";
import { cn } from "~/lib/cn";
import type { CalendarEvent } from "~/lib/types";

export async function loader({ request, context }: LoaderFunctionArgs) {
  const { headers } = await requireAuth(request, context);

  let events: CalendarEvent[] = [];
  let calendarError: string | null = null;

  const env = context.env as Record<string, string>;
  try {
    events = await fetchCalendarEvents(
      env.GOOGLE_CALENDAR_ID,
      env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      env.GOOGLE_SERVICE_ACCOUNT_PRIVATE_KEY
    );
  } catch (err) {
    console.error("[Google Calendar]", err instanceof Error ? err.message : err);
    calendarError = "Nepodařilo se načíst kalendář. Zkuste to prosím znovu.";
  }

  return json({ events, calendarError }, { headers });
}

function getEventStart(event: CalendarEvent): Date {
  return parseISO(event.start.dateTime ?? event.start.date ?? "");
}

function isAllDay(event: CalendarEvent): boolean {
  return !event.start.dateTime && !!event.start.date;
}

const DAY_HEADERS = ["Po", "Út", "St", "Čt", "Pá", "So", "Ne"];

export default function Kalendar() {
  const { events, calendarError } = useLoaderData<typeof loader>();
  const [viewMonth, setViewMonth] = useState(() => new Date());
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const monthStart = startOfMonth(viewMonth);
  const monthEnd = endOfMonth(viewMonth);
  const gridStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const gridDays = eachDayOfInterval({ start: gridStart, end: gridEnd });

  const today = new Date();
  const upcomingEvents = (events as CalendarEvent[])
    .filter((e) => !getEventStart(e).valueOf() || getEventStart(e) >= startOfDay(today))
    .sort((a, b) => getEventStart(a).getTime() - getEventStart(b).getTime());

  const monthEvents = (events as CalendarEvent[])
    .filter((e) => {
      const d = getEventStart(e);
      return d >= monthStart && d <= monthEnd;
    })
    .sort((a, b) => getEventStart(a).getTime() - getEventStart(b).getTime());

  function eventsOnDay(day: Date): CalendarEvent[] {
    return (events as CalendarEvent[]).filter((e) => isSameDay(getEventStart(e), day));
  }

  const selectedDayEvents = selectedDay ? eventsOnDay(selectedDay) : [];

  function handleDayClick(day: Date, dayEvents: CalendarEvent[]) {
    if (dayEvents.length === 0) {
      setSelectedDay(null);
      return;
    }
    if (selectedDay && isSameDay(day, selectedDay)) {
      setSelectedDay(null);
    } else {
      setSelectedDay(day);
    }
  }

  return (
    <>
      <PageHeader fullWidth title="Kalendář" description="Přehled vzdělávacích akcí a školení" imageUrl="/images/hero-workshop.jpg" className="-mt-6 mb-8" />

      {calendarError && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {calendarError}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar grid (2/3) — desktop only */}
        <div className="lg:col-span-2">
          {/* Mobile: month list */}
          <Card className="md:hidden p-5">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMonth((m) => subMonths(m, 1))}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <h2 className="font-[family-name:var(--font-poppins)] font-bold text-lg capitalize">
                {format(viewMonth, "LLLL yyyy", { locale: cs })}
              </h2>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setViewMonth((m) => addMonths(m, 1))}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            {monthEvents.length === 0 ? (
              <EmptyState icon={Calendar} message="Žádné události v tomto měsíci" />
            ) : (
              <EventList events={monthEvents as CalendarEvent[]} />
            )}
          </Card>

          {/* Desktop: calendar grid */}
          <Card className="hidden md:block">
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setViewMonth((m) => subMonths(m, 1)); setSelectedDay(null); }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="font-[family-name:var(--font-poppins)] font-bold text-lg capitalize">
                  {format(viewMonth, "LLLL yyyy", { locale: cs })}
                </h2>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setViewMonth((m) => addMonths(m, 1)); setSelectedDay(null); }}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-7 text-center text-xs font-medium text-muted-foreground mb-1">
                {DAY_HEADERS.map((d) => (
                  <div key={d} className="py-1">
                    {d}
                  </div>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-px">
                {gridDays.map((day) => {
                  const dayEvents = eventsOnDay(day);
                  const outsideMonth = !isSameMonth(day, viewMonth);
                  const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
                  const hasEvents = dayEvents.length > 0;
                  return (
                    <div
                      key={day.toISOString()}
                      onClick={() => handleDayClick(day, dayEvents)}
                      className={cn(
                        "min-h-[80px] rounded-xl p-1 flex flex-col border-2",
                        outsideMonth && "opacity-30",
                        isSelected && "bg-brand-light-pale",
                        !isSelected && hasEvents && !outsideMonth && "cursor-pointer hover:bg-brand-light-hover transition-colors"
                      )}
                      style={{ borderColor: isSelected ? 'var(--color-scioedu-primary)' : 'hsl(var(--border) / 0.6)' }}
                    >
                      <div className="self-end mb-1">
                        {isToday(day) ? (
                          <span className="bg-brand-accent text-black font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs">
                            {format(day, "d")}
                          </span>
                        ) : isSelected ? (
                          <span className="bg-brand-primary text-white font-bold rounded-full w-7 h-7 flex items-center justify-center text-xs">
                            {format(day, "d")}
                          </span>
                        ) : (
                          <span className="text-xs font-medium w-7 h-7 flex items-center justify-center text-muted-foreground">
                            {format(day, "d")}
                          </span>
                        )}
                      </div>
                      <div className="flex flex-col gap-0.5">
                        {dayEvents.slice(0, 2).map((e) => (
                          <span
                            key={e.id}
                            className={cn(
                              "block truncate rounded px-1 py-0.5 text-[10px] leading-tight font-medium",
                              isToday(day) ? "bg-white/80 text-brand-primary" : "bg-brand-light-pale text-brand-primary"
                            )}
                            title={e.summary}
                          >
                            {e.summary}
                          </span>
                        ))}
                        {dayEvents.length > 2 && (
                          <span className="text-[9px] text-muted-foreground pl-1">+{dayEvents.length - 2}</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedDay && selectedDayEvents.length > 0 && (
                <div className="mt-4 pt-4 border-t border-border">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-[family-name:var(--font-poppins)] font-bold text-base capitalize">
                      {format(selectedDay, "EEEE d. MMMM", { locale: cs })}
                    </h3>
                    <button
                      className="text-muted-foreground hover:text-foreground transition-colors p-1"
                      onClick={() => setSelectedDay(null)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                  <EventList events={selectedDayEvents as CalendarEvent[]} />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming events sidebar (1/3) */}
        <div>
          <Card className="p-5">
            <SectionHeader icon={Calendar} title="Nadcházející události" className="mb-4" />
            <EventList events={upcomingEvents as CalendarEvent[]} limit={8} />
          </Card>
        </div>
      </div>
    </>
  );
}
