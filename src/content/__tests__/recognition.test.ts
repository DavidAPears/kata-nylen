import { describe, it, expect } from "vitest";
import { recognition, media } from "../facts";

/**
 * Brief §11: never fabricate credentials. Everything here has to be traceable
 * to a source a reader can open, and phrased so it does not claim more than
 * that source says.
 */

describe("recognition and media", () => {
  it.each([...recognition, ...media])("$id links to a checkable source", (item) => {
    expect(() => new URL(item.url)).not.toThrow();
    expect(item.url.startsWith("https://")).toBe(true);
    expect(item.source, "must name who said it").toBeTruthy();
  });

  it.each([...recognition, ...media])("$id is written in both languages", (item) => {
    expect(item.title.sv).toBeTruthy();
    expect(item.title.en).toBeTruthy();
  });

  it("does not present the Klimatklubben list as a personal accolade", () => {
    const item = recognition.find((r) => r.id === "klimatklubben-52")!;
    // The source says "Klimatpsykologerna är med på Klimatklubbens lista".
    // It is the collective on the list, not Kata individually, and the copy
    // has to say so.
    for (const locale of ["sv", "en"] as const) {
      expect(item.detail[locale]).toMatch(/Klimatpsykologerna/);
    }
    expect(item.detail.en.toLowerCase()).toContain("collective");
    expect(item.detail.sv.toLowerCase()).toContain("kollektivet");
  });

  it("attributes the 'leading experts' description rather than asserting it", () => {
    const item = recognition.find((r) => r.id === "klimatklubben-52")!;
    // "Sveriges ledande experter" is Klimatklubben's phrase about the group.
    // Said in our own voice it would be an unverifiable claim about Kata.
    expect(item.detail.en).toMatch(/Klimatklubben describes/);
    expect(item.detail.sv).toMatch(/Klimatklubben beskriver/);
  });

  it("has no em or en dashes, like the rest of the copy", () => {
    for (const item of [...recognition, ...media]) {
      for (const text of [item.title.sv, item.title.en]) {
        expect(text).not.toMatch(/[—–]/);
      }
    }
  });
});
