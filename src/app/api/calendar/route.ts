import { getCalendarEvent, buildIcs } from "@/lib/ics";
import { locales, defaultLocale, type Locale } from "@/i18n/routing";

export const runtime = "nodejs";

/** Serves the book-launch .ics file. No API key, no third party. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const requested = url.searchParams.get("locale");
  const locale: Locale = locales.includes(requested as Locale)
    ? (requested as Locale)
    : defaultLocale;

  const event = getCalendarEvent(locale);
  if (!event) {
    // Event details are not confirmed yet — never emit a calendar entry
    // containing invented dates (brief §21.3).
    return new Response("Event details are not yet confirmed.", { status: 404 });
  }

  return new Response(buildIcs(event), {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": 'attachment; filename="kata-nylen-book-release.ics"',
      "Cache-Control": "public, max-age=3600",
    },
  });
}
