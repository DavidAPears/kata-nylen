import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { Locale } from "@/i18n/routing";

/**
 * Shared pieces for the social sharing card.
 *
 * The card is what people actually see when the site is forwarded in
 * WhatsApp, Slack or LinkedIn, which for a book launch is most of the traffic.
 * It is generated rather than hand-made so it cannot drift out of date.
 *
 * English in both locales on purpose: nearly every Swedish reader also reads
 * English, and very few English readers read Swedish. A shared link travels
 * further than the page it points at.
 */

export const OG_SIZE = { width: 1200, height: 630 };

/** Read a local asset as a data URI. Satori cannot fetch relative paths. */
export function asset(relativePath: string): string {
  const bytes = readFileSync(join(process.cwd(), "public", relativePath));
  const type = relativePath.endsWith(".jpg") ? "image/jpeg" : "image/png";
  return `data:${type};base64,${bytes.toString("base64")}`;
}

/**
 * The display face, fetched at build time.
 *
 * Satori needs real font data; it cannot use a CSS font-family. Fraunces is
 * the same stand-in the site uses, so the card matches the page it opens.
 */
export async function displayFontData(): Promise<ArrayBuffer | null> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0" } },
    ).then((r) => r.text());

    const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
    if (!url) return null;
    return await fetch(url).then((r) => r.arrayBuffer());
  } catch {
    // A missing font must not break sharing; satori falls back.
    return null;
  }
}

export const LEAF_PATH =
  "M27.5 0C38 14 55 33 55 52.5 55 69 43 81 30.5 83.6V100h-6V83.6C12 81 0 69 0 52.5 0 33 17 14 27.5 0Z";

export const OG_COLOURS = {
  navy: "#0c2e4e",
  cream: "#fef3e1",
  sand: "#f7c17b",
  green: "#76b06c",
  siteCream: "#fffaf3",
  ink: "#2c3327",
  inkMuted: "#5f6857",
} as const;

export const COPY: Record<Locale, { name: string; line: string }> = {
  sv: {
    name: "Kata Nylén",
    line: "Psychologist, author and speaker working in and around climate psychology, at a personal and an organisational level.",
  },
  en: {
    name: "Kata Nylén",
    line: "Psychologist, author and speaker working in and around climate psychology, at a personal and an organisational level.",
  },
};
