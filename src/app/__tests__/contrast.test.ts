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

const NAVY = "#444f69";
const ORANGE = "#fc9a2d";
const ORANGE_TEXT = "#ffbd7a";
const NAVY_DEEP = "#2a3348";
const CREAM = "#fff7ee";
const INK = "#2c3327";
const SURFACE = "#fffaf3";

const AA = 4.5;

describe("colour pairs actually used for text", () => {
  it.each([
    ["site body: ink on cream surface", INK, SURFACE],
    ["book hero: cream on navy", CREAM, NAVY],
    ["book hero labels: light orange on navy", ORANGE_TEXT, NAVY],
    ["book CTA: deep navy on orange", NAVY_DEEP, ORANGE],
  ])("%s meets AA", (_label, fg, bg) => {
    expect(contrast(fg, bg)).toBeGreaterThanOrEqual(AA);
  });

  it.each([
    ["full-strength orange on navy", ORANGE, NAVY],
    ["navy on full-strength orange", NAVY, ORANGE],
  ])("%s is known to FAIL, so must not be used for text", (_label, fg, bg) => {
    // Documented here so nobody "fixes" the lighter variants back to the
    // brand orange without realising why they exist.
    expect(contrast(fg, bg)).toBeLessThan(AA);
  });
});
