import { ImageResponse } from "next/og";
import {
  OG_SIZE,
  OG_COLOURS as C,
  asset,
  displayFontData,
  LEAF_PATH,
  COPY,
} from "@/lib/og";
import { locales, type Locale } from "@/i18n/routing";
import { launchEventNameFor, book, launchEvent, resolved } from "@/content/facts";

/**
 * The book-release card, in the book's own navy and sand.
 *
 * This is the page that gets shared: the link goes out by WhatsApp, LinkedIn
 * and QR code, so for most guests this card is the invitation. It carries the
 * date and venue, because someone glancing at a forwarded link wants to know
 * whether they can come before they decide to tap.
 */

export const runtime = "nodejs";
export const alt = "Resilienssalong, a book launch with Kata Nylén";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

function formatWhen(locale: Locale): string | null {
  const startsAt = resolved(launchEvent.startsAt);
  if (!startsAt) return null;
  const date = new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: launchEvent.timeZone,
  }).format(new Date(startsAt));
  const time = new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    timeStyle: "short",
    timeZone: launchEvent.timeZone,
  }).format(new Date(startsAt));
  const venue = resolved(launchEvent.venueName);
  return [date, time, venue].filter(Boolean).join(" · ");
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const font = await displayFontData();
  const when = formatWhen(locale);
  const title = resolved(book.title) ?? COPY[locale].name;

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          background: C.navy,
          fontFamily: font ? "Display" : "serif",
        }}
      >
        <div style={{ display: "flex", flex: 1 }}>
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              padding: "0 56px",
              gap: 20,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <svg width="26" height="48" viewBox="0 0 55 100">
                <path d={LEAF_PATH} fill={C.sand} />
              </svg>
              <div
                style={{
                  fontSize: 21,
                  letterSpacing: 5,
                  textTransform: "uppercase",
                  color: C.sand,
                }}
              >
                {launchEventNameFor(locale)}
              </div>
            </div>

            <div style={{ fontSize: 56, lineHeight: 1.06, color: C.cream }}>
              {title}
            </div>

            {when ? (
              <div style={{ fontSize: 26, lineHeight: 1.35, color: C.cream, opacity: 0.9 }}>
                {when}
              </div>
            ) : null}

            <div style={{ fontSize: 21, letterSpacing: 3, color: C.sand, opacity: 0.85 }}>
              katanylen.com
            </div>
          </div>

          <img
            src={asset("images/book-cover-og.jpg")}
            width={470}
            height={630}
            style={{ objectFit: "cover" }}
            alt=""
          />
        </div>
        <div style={{ display: "flex", height: 14, background: C.sand }} />
      </div>
    ),
    {
      ...size,
      fonts: font
        ? [{ name: "Display", data: font, style: "normal", weight: 600 }]
        : undefined,
    },
  );
}
