import { formatInTimeZone } from "date-fns-tz";
import { cs } from "date-fns/locale";

const TZ = "Europe/Prague";

/**
 * Format a Date in Europe/Prague timezone — produces identical output
 * on the server (UTC / Cloudflare Workers) and in the browser (CET/CEST),
 * avoiding React hydration mismatches.
 */
export function formatPrague(date: Date, fmt: string): string {
  return formatInTimeZone(date, TZ, fmt, { locale: cs });
}
