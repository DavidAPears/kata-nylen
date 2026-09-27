import { Fraunces, Literata } from "next/font/google";

/**
 * ⚠️ BOTH ARE STAND-INS. The book uses two commercial faces, confirmed from
 * the embedded fonts in the print PDF and checked against which text spans
 * actually use them:
 *
 *   • Rita Smith   — book title, chapter titles, orange section headings.
 *                    The distinctive one: rounded, chunky, warm, a bit quirky.
 *   • TT Jenevers  — body text, subheads, page numbers. The workhorse:
 *                    sturdy wedge serifs, moderate contrast.
 *
 * Kata's print licences do not cover web use. If the budget allows, licence
 * the real pair and swap them in here; the design's whole premise is that the
 * site and the book read as one object, and only the real faces do that.
 *
 * The substitutes below were chosen by rendering the book's own words against
 * candidates side by side, not from memory.
 */

/**
 * Display, standing in for Rita Smith. Fraunces is a variable face whose SOFT
 * and WONK axes get close to Rita Smith's rounded, slightly quirky warmth.
 * Rejected: Crete Round (too evenly rounded), Bitter (too rigid a slab).
 */
export const displayFont = Fraunces({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-display-loaded",
  // Variable font: weights come from CSS, so no `weight` here. Declaring the
  // axes lets us dial in SOFT and WONK, which is what gets us near Rita Smith.
  axes: ["SOFT", "WONK", "opsz"],
});

/**
 * Body, standing in for TT Jenevers. Literata shares its sturdy wedge serifs
 * and moderate contrast, and is built for long-form reading on screen.
 * Rejected: Source Serif 4 (too neutral), Newsreader (too much contrast).
 */
export const bodyFont = Literata({
  subsets: ["latin", "latin-ext"],
  display: "swap",
  variable: "--font-body-loaded",
  weight: ["400", "600"],
});
