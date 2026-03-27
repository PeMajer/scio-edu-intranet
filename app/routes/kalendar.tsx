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
import { ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin, X } from "lucide-react";
import { requireAuth } from "~/lib/supabase.server";
import { fetchCalendarEvents } from "~/lib/google-calendar.server";
import { Card, CardContent, CardHeader } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
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

function EventRow({ event }: { event: CalendarEvent }) {
  return (
    <Card key={event.id}>
      <CardContent className="p-4 flex items-start gap-4">
        <div className="flex-shrink-0 min-w-[60px]">
          <Badge variant="secondary">
            {format(getEventStart(event), "d. MMM", { locale: cs })}
          </Badge>
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-semibold text-gray-900 truncate">{event.summary}</p>
          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-1 text-sm text-[#687A7C]">
            {!isAllDay(event) && (
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {format(getEventStart(event), "H:mm", { locale: cs })}
              </span>
            )}
            {event.location && (
              <span className="flex items-center gap-1 truncate">
                <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
                {event.location}
              </span>
            )}
          </div>
        </div>
        <a
          href={event.htmlLink}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-shrink-0 text-[#687A7C] hover:text-[#1DA2AC] transition-colors"
          title="Otevřít v Google Kalendáři"
        >
          <ExternalLink className="w-4 h-4" />
        </a>
      </CardContent>
    </Card>
  );
}

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
    <div className="container mx-auto p-6 max-w-5xl">
      <div className="mb-6">
        <h1 className="text-4xl font-bold text-gray-900 mb-2">Kalendář</h1>
        <p className="text-lg text-[#687A7C]">Nadcházející školení a vzdělávací události</p>
      </div>

      {calendarError && (
        <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {calendarError}
        </div>
      )}

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
          <div className="grid grid-cols-7 text-center text-xs font-medium text-[#687A7C] mb-1">
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
                    isToday(day) && "ring-2 ring-[#1DA2AC] bg-[#1DA2AC]/10",
                    isSelected && "bg-[#1DA2AC]/20 ring-2 ring-[#1DA2AC]",
                    hasEvents && !outsideMonth && "cursor-pointer hover:bg-[#1DA2AC]/10 transition-colors"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-medium self-end mb-1",
                      isToday(day) || isSelected ? "text-[#1DA2AC]" : "text-gray-700"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="flex flex-col gap-0.5">
                    {dayEvents.slice(0, 2).map((e) => (
                      <span
                        key={e.id}
                        className="block truncate rounded px-1 py-0.5 text-[10px] leading-tight font-medium bg-[#1DA2AC]/15 text-[#1DA2AC]"
                        title={e.summary}
                      >
                        {e.summary}
                      </span>
                    ))}
                    {dayEvents.length > 2 && (
                      <span className="text-[9px] text-[#687A7C] pl-1">+{dayEvents.length - 2}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {selectedDay && selectedDayEvents.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-gray-900">
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
              <div className="space-y-2">
                {selectedDayEvents.map((event) => (
                  <EventRow key={event.id} event={event} />
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Nadcházející události</h2>
        {upcomingEvents.length === 0 && !calendarError ? (
          <p className="text-[#687A7C]">Žádné nadcházející události.</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
              <EventRow key={event.id} event={event} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
