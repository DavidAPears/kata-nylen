/**
 * Renders the social sharing cards to static JPEGs.
 *
 * Run: npm run og  (also runs automatically before a build)
 *
 * Why not just use Next's dynamic opengraph-image route? Because it can only
 * emit PNG, and a PNG of a 1200x630 photograph is around 500KB. WhatsApp and
 * several other scrapers will not fetch a preview image that large, so the
 * card silently never appears, which is the worst possible failure: the link
 * looks fine to us and plain to everyone else.
 *
 * The same layout rendered once and saved as JPEG is roughly a tenth of the
 * size, and being a static file it is also faster and cacheable.
 */
import { ImageResponse } from "next/og";
import sharp from "sharp";
import { writeFileSync, readFileSync } from "node:fs";
import { join } from "node:path";
import React from "react";

const ROOT = process.cwd();
const SIZE = { width: 1200, height: 630 };

const C = {
  navy: "#0c2e4e",
  cream: "#fef3e1",
  sand: "#f7c17b",
  green: "#76b06c",
  siteCream: "#fffaf3",
  ink: "#2c3327",
  inkMuted: "#5f6857",
};

const LEAF =
  "M27.5 0C38 14 55 33 55 52.5 55 69 43 81 30.5 83.6V100h-6V83.6C12 81 0 69 0 52.5 0 33 17 14 27.5 0Z";

/*
  Everything on the cards is read from facts.ts rather than written here.

  These strings had drifted: the site card still described Kata as working
  "in and around climate psychology", which stopped being how she wants to be
  introduced, and the book card's date and venue were typed out by hand, so a
  change of venue would have left the shared link quietly advertising the
  wrong door. A card nobody looks at is exactly where a stale fact survives
  longest.
*/
const facts = await import("../src/content/facts");

const jobTitle = facts.resolved(facts.person.jobTitle.en);
const LINE = `${jobTitle}. Change leadership, implementation and psychological resilience.`;

/** "11 November 2026 · 17:00 · Djupet", built from the confirmed event. */
function eventLine(locale: "sv" | "en"): string {
  const { launchEvent } = facts;
  const startsAt = facts.resolved(launchEvent.startsAt);
  const venue = facts.resolved(launchEvent.venueName);
  if (!startsAt || !venue) return "";
  const date = new Date(startsAt);
  const day = new Intl.DateTimeFormat(locale === "sv" ? "sv-SE" : "en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: launchEvent.timeZone,
  }).format(date);
  const time = new Intl.DateTimeFormat("sv-SE", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: launchEvent.timeZone,
  }).format(date);
  return `${day} · ${time} · ${venue}`;
}

function asset(rel: string): string {
  const bytes = readFileSync(join(ROOT, "public", rel));
  const type = rel.endsWith(".jpg") ? "image/jpeg" : "image/png";
  return `data:${type};base64,${bytes.toString("base64")}`;
}

async function font(): Promise<ArrayBuffer | undefined> {
  const css = await fetch(
    "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,600&display=swap",
    { headers: { "User-Agent": "Mozilla/5.0" } },
  ).then((r) => r.text());
  const url = css.match(/src:\s*url\(([^)]+)\)\s*format\('(?:truetype|opentype)'\)/)?.[1];
  if (!url) throw new Error("Could not resolve the display font for the OG cards");
  return fetch(url).then((r) => r.arrayBuffer());
}

const h = React.createElement;

function siteCard() {
  return h("div", { style: { width: "100%", height: "100%", display: "flex", background: C.siteCream, fontFamily: "Display" } }, [
    h("img", { key: "p", src: asset("images/og-portrait.jpg"), width: 520, height: 630, style: { objectFit: "cover" } }),
    h("div", { key: "t", style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "60px 56px" } }, [
      h("div", { key: "n", style: { display: "flex", alignItems: "center", gap: 16 } }, [
        h("svg", { key: "l", width: 30, height: 55, viewBox: "0 0 55 100" }, h("path", { d: LEAF, fill: C.green })),
        h("div", { key: "x", style: { fontSize: 24, letterSpacing: 6, textTransform: "uppercase", color: C.ink } }, "Kata Nylén"),
      ]),
      h("div", { key: "m", style: { display: "flex", flexDirection: "column", gap: 24 } }, [
        h("div", { key: "h", style: { fontSize: 56, lineHeight: 1.08, color: C.ink } }, "Psychology for a changing world."),
        h("div", { key: "s", style: { fontSize: 25, lineHeight: 1.4, color: C.inkMuted } }, LINE),
      ]),
      h("div", { key: "u", style: { fontSize: 21, letterSpacing: 3, color: C.ink, opacity: 0.6 } }, "katanylen.com"),
    ]),
  ]);
}

function bookCard(eventName: string, title: string, when: string) {
  return h("div", { style: { width: "100%", height: "100%", display: "flex", flexDirection: "column", background: C.navy, fontFamily: "Display" } }, [
    h("div", { key: "r", style: { display: "flex", flex: 1 } }, [
      h("div", { key: "t", style: { flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 56px", gap: 20 } }, [
        h("div", { key: "n", style: { display: "flex", alignItems: "center", gap: 16 } }, [
          h("svg", { key: "l", width: 26, height: 48, viewBox: "0 0 55 100" }, h("path", { d: LEAF, fill: C.sand })),
          h("div", { key: "x", style: { fontSize: 21, letterSpacing: 5, textTransform: "uppercase", color: C.sand } }, eventName),
        ]),
        h("div", { key: "h", style: { fontSize: 56, lineHeight: 1.06, color: C.cream } }, title),
        h("div", { key: "w", style: { fontSize: 26, lineHeight: 1.35, color: C.cream, opacity: 0.9 } }, when),
        h("div", { key: "u", style: { fontSize: 21, letterSpacing: 3, color: C.sand, opacity: 0.85 } }, "katanylen.com"),
      ]),
      h("img", { key: "c", src: asset("images/book-cover-og.jpg"), width: 470, height: 630, style: { objectFit: "cover" } }),
    ]),
    h("div", { key: "b", style: { display: "flex", height: 14, background: C.sand } }),
  ]);
}

async function write(name: string, element: React.ReactElement, fontData: ArrayBuffer) {
  const png = await new ImageResponse(element, {
    ...SIZE,
    fonts: [{ name: "Display", data: fontData, style: "normal", weight: 600 }],
  }).arrayBuffer();

  // JPEG at 82 keeps the type crisp while landing around a tenth of the PNG.
  const jpeg = await sharp(Buffer.from(png)).jpeg({ quality: 82, mozjpeg: true }).toBuffer();
  const out = join(ROOT, "public", "og", `${name}.jpg`);
  writeFileSync(out, jpeg);
  console.log(
    `  og/${name}.jpg  ${Math.round(png.byteLength / 1024)}KB PNG -> ${Math.round(jpeg.byteLength / 1024)}KB JPEG`,
  );
}

const fontData = (await font())!;

await write("site", siteCard(), fontData);
for (const locale of ["sv", "en"] as const) {
  await write(
    `book-release-${locale}`,
    bookCard(
      facts.launchEventNameFor(locale),
      facts.bookTitlePlainFor(locale) ?? "",
      eventLine(locale),
    ),
    fontData,
  );
}
