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
import { ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin, X, Calendar } from "lucide-react";
import { requireAuth } from "~/lib/supabase.server";
import { fetchCalendarEvents } from "~/lib/google-calendar.server";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { SectionHeader } from "~/components/layout/section-header";
import { PageHeader } from "~/components/layout/page-header";
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
      <PageHeader title="Kalendář" description="Přehled vzdělávacích akcí a školení" imageUrl="/images/hero-workshop.jpg" />

      {calendarError && (
        <div className="mb-6 rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-3 text-sm text-destructive">
          {calendarError}
        </div>
      )}

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Calendar grid (2/3) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => { setViewMonth((m) => subMonths(m, 1)); setSelectedDay(null); }}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <h2 className="text-lg font-semibold capitalize">
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
                        "min-h-[80px] rounded-md p-1 flex flex-col",
                        outsideMonth && "opacity-30",
                        isToday(day) && "ring-2 ring-ring bg-primary/10",
                        isSelected && "bg-primary/20 ring-2 ring-ring",
                        hasEvents && !outsideMonth && "cursor-pointer hover:bg-primary/10 transition-colors"
                      )}
                    >
                      <span
                        className={cn(
                          "text-xs font-medium self-end mb-1",
                          isToday(day) || isSelected ? "text-primary" : "text-muted-foreground"
                        )}
                      >
                        {format(day, "d")}
                      </span>
                      <div className="flex flex-col gap-0.5">
                        {dayEvents.slice(0, 2).map((e) => (
                          <span
                            key={e.id}
                            className="block truncate rounded px-1 py-0.5 text-[10px] leading-tight font-medium bg-primary/15 text-primary"
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
                <div className="mt-4 border-t pt-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-foreground">
                      {format(selectedDay, "EEEE d. MMMM", { locale: cs })}
                    </h3>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6"
                      onClick={() => setSelectedDay(null)}
                    >
                      <X className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                  <div className="space-y-0">
                    {selectedDayEvents.map((event, index) => (
                      <div key={event.id}>
                        {index > 0 && <Separator className="my-3" />}
                        <EventItem event={event} />
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Upcoming events sidebar (1/3) */}
        <div>
          <Card>
            <div className="p-5">
              <SectionHeader icon={Calendar} title="Nadcházející události" className="mb-4" />
              {upcomingEvents.length === 0 && !calendarError ? (
                <div className="text-center py-6">
                  <Calendar className="w-8 h-8 text-muted-foreground/30 mx-auto mb-2" />
                  <p className="text-muted-foreground text-sm">Žádné nadcházející události</p>
                </div>
              ) : (
                <div className="space-y-0">
                  {upcomingEvents.slice(0, 8).map((event, index) => (
                    <div key={event.id}>
                      {index > 0 && <Separator className="my-3" />}
                      <EventItem event={event} />
                    </div>
                  ))}
                </div>
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}

function EventItem({ event }: { event: CalendarEvent }) {
  const start = getEventStart(event);
  return (
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
          {!isAllDay(event) && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {format(start, "H:mm", { locale: cs })}
            </span>
          )}
          {event.location && (
            <span className="text-xs text-muted-foreground flex items-center gap-1">
              <MapPin className="w-3 h-3" />
              <span className="truncate max-w-[120px]">{event.location}</span>
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
  );
}
