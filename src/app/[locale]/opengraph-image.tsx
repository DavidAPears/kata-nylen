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

/**
 * The site-wide sharing card.
 *
 * Uses the SITE colourway, green and cream, not the book's navy. Navy belongs
 * to the launch campaign and appears only on that page, so a link to anything
 * else should not arrive dressed as the book. The book-release page has its
 * own card.
 *
 * Generated from real data rather than exported by hand, so it cannot drift
 * out of date when the portrait or the wording changes.
 */

export const runtime = "nodejs";
export const alt = "Kata Nylén, psychologist, author and speaker";
export const size = OG_SIZE;
export const contentType = "image/png";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  const copy = COPY[locale] ?? COPY.sv;
  const font = await displayFontData();

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          background: C.siteCream,
          fontFamily: font ? "Display" : "serif",
        }}
      >
        <img
          src={asset("images/og-portrait.jpg")}
          width={520}
          height={630}
          style={{ objectFit: "cover" }}
          alt=""
        />
        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            padding: "60px 56px",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <svg width="30" height="55" viewBox="0 0 55 100">
              <path d={LEAF_PATH} fill={C.green} />
            </svg>
            <div
              style={{
                fontSize: 24,
                letterSpacing: 6,
                textTransform: "uppercase",
                color: C.ink,
              }}
            >
              {copy.name}
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ fontSize: 56, lineHeight: 1.08, color: C.ink }}>
              Psychology for a changing world.
            </div>
            <div style={{ fontSize: 25, lineHeight: 1.4, color: C.inkMuted }}>
              {copy.line}
            </div>
          </div>

          <div style={{ fontSize: 21, letterSpacing: 3, color: C.ink, opacity: 0.6 }}>
            katanylen.com
          </div>
        </div>
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
