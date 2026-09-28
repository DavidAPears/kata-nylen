import { describe, it, expect } from "vitest";
import { organisations, person, resolved } from "@/content/facts";

/**
 * The organisations Kata works through, and the professional identity she
 * signed off on 28 Sep 2026.
 *
 * Two of these describe other people's work, and one describes work with
 * children and social services. Getting them wrong misrepresents somebody
 * other than us.
 */

describe("organisations", () => {
  it("gives every entry a unique id and a reachable https URL", () => {
    const ids = organisations.map((o) => o.id);
    expect(new Set(ids).size).toBe(ids.length);
    for (const o of organisations) {
      expect(o.name.trim(), `${o.id} name`).not.toBe("");
      expect(() => new URL(o.url), `${o.id} url`).not.toThrow();
      expect(o.url.startsWith("https://"), `${o.id} must be https`).toBe(true);
    }
  });

  it("does not call SNAP a collective", () => {
    // Kata was explicit: SNAP is a programme and an area of her work, not a
    // collective of psychologists, even though she works on it with
    // colleagues. The old model had one shape for everything and miscast it.
    const snap = organisations.find((o) => o.id === "snap-sverige");
    expect(snap, "SNAP should be listed").toBeDefined();
    expect(snap!.kind).toBe("programme");
    expect(organisations.filter((o) => o.kind === "collective").length).toBeGreaterThan(0);
  });

  it("describes both languages wherever it describes anything", () => {
    // A half-translated entry would render as a gap on one language's page.
    for (const o of organisations) {
      if (o.description) {
        expect(o.description.sv.trim(), `${o.id} sv`).not.toBe("");
        expect(o.description.en.trim(), `${o.id} en`).not.toBe("");
      }
      if (o.role) {
        expect(o.role.sv.trim(), `${o.id} sv role`).not.toBe("");
        expect(o.role.en.trim(), `${o.id} en role`).not.toBe("");
      }
    }
  });

  it("keeps the SNAP description inside what Kata approved", () => {
    /*
      This is copy about work with children, families and social services.
      Kata approved a specific level of detail: the programme, her role, and
      the fact that pilots exist in named municipalities. She asked for no
      individual cases, no outcome claims and no details about the children or
      families involved.

      So this asserts her own wording is still there. If someone rewrites it,
      this fails, and the right response is to get her approval again rather
      than to update the test.
    */
    const snap = organisations.find((o) => o.id === "snap-sverige")!;
    const sv = snap.description!.sv;
    expect(sv).toContain("Stop Now And Plan");
    expect(sv).toContain("anpassning till svensk kontext");
    expect(sv).toContain("utbildning och handledning av yrkesverksamma");
    expect(sv).toContain("förebygga normbrytande beteenden");
    // The two municipalities she confirmed are public, and no others.
    expect(sv).toContain("Malmö");
    expect(sv).toContain("Lerum");
  });

  it("claims only the Climate Psyched role their own page supports", () => {
    /*
      She is on their team page with four other psychologists, so the
      affiliation is real. But that page names no founders, so this stays at
      "part of the team" rather than borrowing the co-founder wording used for
      the three organisations she told us she co-founded.
    */
    const cp = organisations.find((o) => o.id === "climate-psyched")!;
    expect(cp.role).toBeDefined();
    expect(cp.role!.sv).not.toMatch(/grundare/i);
    expect(cp.role!.en).not.toMatch(/founder/i);
    // The description is the organisation's account of itself, not of Kata.
    expect(cp.description!.sv).not.toMatch(/Kata/);
    expect(cp.description!.en).not.toMatch(/Kata/);
  });
});

describe("Kata's professional identity", () => {
  it("carries the licensed credentials in both languages", () => {
    expect(resolved(person.jobTitle.sv)).toContain("Legitimerad psykolog");
    expect(resolved(person.jobTitle.sv)).toContain("specialist i organisationspsykologi");
    expect(resolved(person.jobTitle.en)).toContain("Licensed psychologist");
  });

  it("has a short bio that names all four parts of how she is introduced", () => {
    // "legitimerad psykolog och specialist i organisationspsykologi,
    // författare och föreläsare". She said all four matter.
    const sv = resolved(person.shortBio.sv)!;
    for (const part of [
      "legitimerad psykolog",
      "specialist i organisationspsykologi",
      "författare",
      "föreläsare",
    ]) {
      expect(sv.toLowerCase(), part).toContain(part);
    }
  });

  it("names the organisations she co-founded, and spells them as the data does", () => {
    const sv = resolved(person.shortBio.sv)!;
    for (const id of ["klimatpsykologerna", "snap-sverige", "shift-collective"]) {
      const name = organisations.find((o) => o.id === id)!.name;
      expect(sv, name).toContain(name);
    }
  });
});
