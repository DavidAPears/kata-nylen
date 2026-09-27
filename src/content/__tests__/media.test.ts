import { describe, it, expect } from "vitest";
import { media, publications } from "../facts";

/**
 * Media is credibility evidence, so it has to be accurate about what Kata
 * actually did. Moderating a panel is not the same as being interviewed, and
 * being quoted in someone else's guide is not authorship.
 */

describe("media", () => {
  it("links every item to something checkable", () => {
    for (const item of media) {
      expect(() => new URL(item.url), item.id).not.toThrow();
      expect(item.url.startsWith("https://"), `${item.id} must be https`).toBe(true);
      expect(item.source, `${item.id} must name the outlet`).toBeTruthy();
    }
  });

  it("carries no tracking parameters in the links", () => {
    // Publisher links arrive with srsltid and similar attached.
    for (const item of media) {
      expect(item.url, `${item.id}`).not.toMatch(/[?&](srsltid|utm_|fbclid|gclid)/);
    }
  });

  it("has unique ids", () => {
    const ids = media.map((m) => m.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("titles everything in both languages", () => {
    for (const item of media) {
      expect(item.title.sv, `${item.id} sv`).toBeTruthy();
      expect(item.title.en, `${item.id} en`).toBeTruthy();
    }
  });

  it("records what she actually did, not just that she appeared", () => {
    const byRole = (role: string) => media.filter((m) => m.role === role);
    // If these collapse to all-interview, the list is overstating.
    expect(byRole("moderator").length).toBeGreaterThan(0);
    expect(byRole("workshop").length).toBeGreaterThan(0);
    expect(byRole("contributor").length).toBeGreaterThan(0);
  });

  it("does not present the parents' guide as something she wrote", () => {
    // The PDF credits it to Frida Berry Eklund; Kata is quoted in it. It sits
    // in media as a contribution and must never appear as a publication.
    const guide = media.find((m) => m.id === "ourkidsclimate-guide")!;
    expect(guide.role).toBe("contributor");
    expect(publications.some((p) => p.url === guide.url)).toBe(false);
  });

  it("features a small enough selection to be a selection", () => {
    const featured = media.filter((m) => m.featured);
    expect(featured.length).toBeGreaterThan(2);
    expect(featured.length, "a highlights list should stay short").toBeLessThan(7);
  });

  it("covers more than one kind of outlet", () => {
    expect(new Set(media.map((m) => m.kind)).size).toBeGreaterThan(2);
  });
});

describe("Klimatpsykologi publication year", () => {
  it("shows the first publication, with the later edition noted", () => {
    const book = publications.find((p) => p.id === "klimatpsykologi")!;
    // Contemporary sources from 2020 and 2021 cite the 2019 original; the
    // publisher's page shows a 2025 edition. The first date says six years in
    // the field rather than one.
    expect(book.year).toBe("2019");
    expect(book.editionNote?.en).toMatch(/2025/);
  });
});
