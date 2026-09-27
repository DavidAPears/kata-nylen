import { describe, it, expect } from "vitest";

/**
 * Colour contrast, guarded.
 *
 * The book's full-strength orange is beautiful on its navy but only reaches
 * 3.8:1, which fails WCAG AA for text. That is easy to reintroduce by reaching
 * for the "brand" colour during a design pass, so the pairs we actually use
 * are asserted here.
 */

function luminance(hex: string): number {
  const h = hex.replace("#", "");
  const channels = [0, 2, 4]
    .map((i) => parseInt(h.slice(i, i + 2), 16) / 255)
    .map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
}

function contrast(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

// The COVER palette, which the book-release page follows. The interior
// chapter openers use a lighter navy and a more vivid orange; those are kept
// below as the pair that must never be used for text.
const NAVY = "#0c2e4e";
const SAND = "#f7c17b";
const GREEN = "#76b06c";
const NAVY_DEEP = "#081f36";
const CREAM = "#fef3e1";

// Interior palette.
const INTERIOR_NAVY = "#444f69";
const INTERIOR_ORANGE = "#fc9a2d";
const INK = "#2c3327";
const SURFACE = "#fffaf3";

const AA = 4.5;

describe("colour pairs actually used for text", () => {
  it.each([
    ["site body: ink on cream surface", INK, SURFACE],
    ["book hero: cream on cover navy", CREAM, NAVY],
    ["book hero labels: sand on cover navy", SAND, NAVY],
    ["book CTA: deep navy on sand", NAVY_DEEP, SAND],
    ["cover green on cover navy", GREEN, NAVY],
  ])("%s meets AA", (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA);
  });

  it.each([
    ["interior orange on interior navy", INTERIOR_ORANGE, INTERIOR_NAVY],
    ["interior navy on interior orange", INTERIOR_NAVY, INTERIOR_ORANGE],
  ])("%s is known to FAIL, so must not be used for text", (_label, fg, bg) => {
    // Documented so nobody reaches for the interior colours for text. They
    // are fine as artwork, which is all the chapter motif uses them for.
    expect(contrast(fg, bg)).toBeLessThan(AA);
  });
});
