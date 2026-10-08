import { launchEvent } from "@/content/facts";

/**
 * Formatting dates and times in the event's own clock.
 *
 * Every time the site shows for the launch has to be rendered in
 * Europe/Stockholm, never in whatever timezone the code happens to be running
 * in. Vercel runs in UTC, so a formatter without an explicit `timeZone` turns
 * 17:00+01:00 into 16:00, and the site then tells guests the wrong hour.
 *
 * That shipped. The page, the calendar file and the sharing card all passed a
 * timeZone; the confirmation email called toLocaleString() without one, so
 * every guest was invited at 17.00 and then told 16.00. It was invisible in
 * development because the machine this was written on is in Stockholm, where
 * the two happen to agree. A guest spotted it and told Kata.
 *
 * Hence this module. Formatting the event's time anywhere else is a mistake
 * waiting to repeat, and `no-naive-date-formatting.test.ts` fails the build if
 * someone adds a date formatter without an explicit timeZone.
 */
export function eventDateTime(iso: string, locale: "sv" | "en"): string {
  return new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    dateStyle: "full",
    timeStyle: "short",
    timeZone: launchEvent.timeZone,
  }).format(new Date(iso));
}
