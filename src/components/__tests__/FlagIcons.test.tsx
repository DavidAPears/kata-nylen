// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { flagFor, SwedishFlag, BritishFlag } from "../FlagIcons";
import { locales } from "@/i18n/routing";

describe("flagFor", () => {
  it("has a flag for every locale, and no strays", () => {
    // If a third language is ever added, the switcher would otherwise crash on
    // an undefined component rather than fail here.
    expect(Object.keys(flagFor).sort()).toEqual([...locales].sort());
  });

  it("gives each locale a distinct flag", () => {
    expect(flagFor.sv).not.toBe(flagFor.en);
  });
});

describe("the flags themselves", () => {
  it("are decorative: the SV/EN text carries the meaning", () => {
    for (const Flag of [SwedishFlag, BritishFlag]) {
      const { container } = render(<Flag />);
      const svg = container.querySelector("svg")!;
      expect(svg).toHaveAttribute("aria-hidden", "true");
      expect(svg).toHaveAttribute("focusable", "false");
    }
  });

  it("share one box, so the switcher row stays even", () => {
    for (const Flag of [SwedishFlag, BritishFlag]) {
      const { container } = render(<Flag />);
      expect(container.querySelector("svg")).toHaveAttribute("viewBox", "0 0 20 14");
    }
  });

  it("are inline SVG, not emoji, which Windows does not render", () => {
    for (const Flag of [SwedishFlag, BritishFlag]) {
      const { container } = render(<Flag />);
      expect(container.querySelector("svg")).toBeInTheDocument();
      expect(container.textContent).toBe("");
    }
  });

  it("accept a className, so the switcher can hide them on a phone", () => {
    const { container } = render(<SwedishFlag className="hidden sm:block" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("sm:block");
  });
});
