import { describe, it, expect } from "vitest";
import { en } from "../en";
import { sv } from "../sv";
import { furtherClients } from "@/content/facts";

/**
 * The speaking examples name real organisations Kata has worked for, supplied
 * and approved by her on 2 Oct 2026.
 *
 * Two kinds of mistake matter here. Naming a client she has not cleared, and
 * silently losing one in translation so the two languages advertise different
 * careers.
 */

const LOCALES = [
  ["Swedish", sv],
  ["English", en],
] as const;

describe("speaking examples", () => {
  it.each(LOCALES)("%s describes the work, not our approval process", (_label, content) => {
    /*
      This shipped live: "Sessions Kata has delivered, described without the
      client. Names are added only once they are approved." That is an internal
      note about how we work, and it told a visitor the examples were being
      withheld from them right before showing the examples.
    */
    const { intro } = content.speaking.examples;
    expect(intro).not.toMatch(/godkän|approv/i);
    expect(intro).not.toMatch(/utan uppdragsgivare|without the client/i);
  });

  it.each(LOCALES)("%s names the clients Kata cleared", (_label, content) => {
    // The whole point of the section after her 2 Oct email: it is no longer
    // anonymous. If these disappear, someone has reverted to the old copy.
    const all = content.speaking.examples.items.map((i) => i.description).join(" ");
    for (const client of ["PacsOn", "AddLife", "SPP", "Musikverket", "Moderna Museet"]) {
      expect(all, client).toContain(client);
    }
  });

  it("keeps the two languages describing the same engagements", () => {
    expect(sv.speaking.examples.items.map((i) => i.id)).toEqual(
      en.speaking.examples.items.map((i) => i.id),
    );
  });

  it.each(LOCALES)("%s gives every example a label and a description", (_label, content) => {
    for (const item of content.speaking.examples.items) {
      expect(item.label.trim(), `${item.id} label`).not.toBe("");
      expect(item.description.length, `${item.id} description`).toBeGreaterThan(80);
    }
  });
});

describe("furtherClients", () => {
  it("names every client in both languages", () => {
    // Held as one record per client precisely so a translation cannot drop
    // one. Several are Swedish public bodies whose English name is a
    // translation rather than the same word.
    for (const client of furtherClients) {
      expect(client.name.sv.trim(), `${client.id} sv`).not.toBe("");
      expect(client.name.en.trim(), `${client.id} en`).not.toBe("");
    }
    const ids = furtherClients.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("does not repeat a client already named in the examples", () => {
    // The list is the rest of them. Repeating SPP or Moderna Museet here would
    // read as padding out a thin list.
    const named = LOCALES.flatMap(([, content]) =>
      content.speaking.examples.items.map((i) => i.description),
    ).join(" ");
    for (const client of furtherClients) {
      expect(named, `${client.id} is already in the examples`).not.toContain(client.name.sv);
    }
  });
});
