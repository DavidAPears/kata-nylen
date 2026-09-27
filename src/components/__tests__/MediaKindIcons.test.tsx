// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MEDIA_KIND_ICONS } from "../MediaKindIcons";
import { media } from "@/content/facts";

describe("MEDIA_KIND_ICONS", () => {
  it("covers every kind that appears in the media list", () => {
    for (const item of media) {
      expect(MEDIA_KIND_ICONS[item.kind], `no icon for "${item.kind}"`).toBeTypeOf(
        "function",
      );
    }
  });

  it("gives each kind its own glyph", () => {
    const glyphs = Object.values(MEDIA_KIND_ICONS);
    expect(new Set(glyphs).size).toBe(glyphs.length);
  });

  it("draws every glyph on the same grid, at the same weight", () => {
    for (const [kind, Icon] of Object.entries(MEDIA_KIND_ICONS)) {
      const { container } = render(<Icon />);
      const svg = container.querySelector("svg");
      expect(svg, `"${kind}" rendered nothing`).toBeInTheDocument();
      expect(svg).toHaveAttribute("viewBox", "0 0 24 24");
      expect(svg).toHaveAttribute("stroke", "currentColor");
      expect(svg).toHaveAttribute("stroke-width", "1.6");
    }
  });

  it("hides every glyph from assistive technology, since its label sits beside it", () => {
    for (const Icon of Object.values(MEDIA_KIND_ICONS)) {
      const { container } = render(<Icon />);
      expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("accepts a className on every glyph", () => {
    for (const Icon of Object.values(MEDIA_KIND_ICONS)) {
      const { container } = render(<Icon className="h-5" />);
      expect(container.querySelector("svg")?.getAttribute("class")).toContain("h-5");
    }
  });
});
