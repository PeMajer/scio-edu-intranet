import { format, parseISO } from "date-fns";
import { cs } from "date-fns/locale";
import { Calendar, Clock, ExternalLink, MapPin } from "lucide-react";
import { EmptyState } from "~/components/empty-state";
import type { CalendarEvent } from "~/lib/types";

interface EventListProps {
  events: CalendarEvent[];
  /** Max počet zobrazených událostí. Výchozí: všechny. */
  limit?: number;
}

export function EventList({ events, limit }: EventListProps) {
  const visible = limit ? events.slice(0, limit) : events;

  if (visible.length === 0) {
    return <EmptyState icon={Calendar} message="Žádné nadcházející události" />;
  }

  return (
    <div>
      {visible.map((event, index) => {
        const start = parseISO(event.start.dateTime ?? event.start.date ?? "");
        const allDay = !event.start.dateTime;
        const isLast = index === visible.length - 1;

        return (
          <div key={event.id} className={`flex gap-3 py-3 ${isLast ? "" : "border-b border-border"}`}>
            <div className="inline-flex flex-col items-center justify-center bg-brand-light-pale text-brand-primary font-bold rounded-lg px-2.5 py-1.5 min-w-[48px] text-center text-xs shrink-0">
              <span className="uppercase">{format(start, "MMM", { locale: cs })}</span>
              <span className="text-lg leading-tight text-foreground">{format(start, "d")}</span>
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground leading-snug">{event.summary}</p>
              <div className="flex flex-wrap items-center gap-x-3 gap-y-0.5 mt-1">
                {!allDay && (
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
  );
}
