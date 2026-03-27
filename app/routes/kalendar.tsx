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
import { ChevronLeft, ChevronRight, Clock, ExternalLink, MapPin } from "lucide-react";
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

export default function Kalendar() {
  const { events, calendarError } = useLoaderData<typeof loader>();
  const [viewMonth, setViewMonth] = useState(() => new Date());

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
              onClick={() => setViewMonth((m) => subMonths(m, 1))}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold capitalize">
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
              return (
                <div
                  key={day.toISOString()}
                  className={cn(
                    "min-h-[60px] rounded-md p-1 flex flex-col",
                    outsideMonth && "opacity-30",
                    isToday(day) && "ring-2 ring-[#1DA2AC] bg-[#1DA2AC]/10"
                  )}
                >
                  <span
                    className={cn(
                      "text-xs font-medium self-end mb-1",
                      isToday(day) ? "text-[#1DA2AC]" : "text-gray-700"
                    )}
                  >
                    {format(day, "d")}
                  </span>
                  <div className="flex flex-wrap gap-0.5 justify-center">
                    {dayEvents.slice(0, 3).map((e) => (
                      <span
                        key={e.id}
                        className="w-1.5 h-1.5 rounded-full bg-[#1DA2AC]"
                        title={e.summary}
                      />
                    ))}
                    {dayEvents.length > 3 && (
                      <span className="text-[9px] text-[#687A7C]">+{dayEvents.length - 3}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-xl font-semibold text-gray-900 mb-4">Nadcházející události</h2>
        {upcomingEvents.length === 0 && !calendarError ? (
          <p className="text-[#687A7C]">Žádné nadcházející události.</p>
        ) : (
          <div className="space-y-3">
            {upcomingEvents.map((event) => (
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
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
