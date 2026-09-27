// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Logo, LeafMark } from "../Logo";

// The logo links home through next-intl's locale-aware Link, which needs
// request context we don't have in a unit test. A plain anchor is enough to
// assert the accessibility contract.
vi.mock("@/i18n/navigation", () => ({
  Link: ({ href, children, ...rest }: { href: string; children: React.ReactNode }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("Logo", () => {
  it("is a single link home named by its visible text", () => {
    render(<Logo />);
    // One link, not two — a screen reader should hear "Kata Nylén, link",
    // not "image, link" followed by "link".
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(1);
    expect(links[0]).toHaveAccessibleName("Kata Nylén");
    expect(links[0]).toHaveAttribute("href", "/");
  });

  it("hides the decorative mark from assistive technology", () => {
    const { container } = render(<Logo />);
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    // Decorative images must not also claim a role.
    expect(svg).toHaveAttribute("role", "presentation");
  });
});

describe("LeafMark", () => {
  it("is decorative by default", () => {
    const { container } = render(<LeafMark />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
  });

  it("becomes an labelled image when given a title, for standalone use", () => {
    render(<LeafMark title="Kata Nylén" />);
    expect(screen.getByRole("img", { name: "Kata Nylén" })).toBeInTheDocument();
  });

  it("inherits colour so it works on any background", () => {
    const { container } = render(<LeafMark />);
    // One filled path, coloured by context: green on the site, orange on the
    // book page, cream on navy. No second asset, no build-time recolouring.
    expect(container.querySelectorAll('[fill="currentColor"]').length).toBe(1);
    // No hard-coded hex anywhere in the mark.
    expect(container.innerHTML).not.toMatch(/#[0-9a-f]{3,6}/i);
  });

  it("uses the real outline from the book by default", () => {
    const { container } = render(<LeafMark />);
    const d = container.querySelector("path")!.getAttribute("d")!;
    // The extracted outline is long and full of curves; the simplified
    // silhouette is short. This distinguishes them without pinning the exact
    // path, which would break on any re-extraction.
    expect(d.length).toBeGreaterThan(1000);
  });

  it("swaps to a simplified silhouette when asked", () => {
    const { container } = render(<LeafMark simplified />);
    const d = container.querySelector("path")!.getAttribute("d")!;
    // Below ~28px the toothed edge muds up, so small sizes drop the detail.
    expect(d.length).toBeLessThan(400);
    expect(container.querySelectorAll('[fill="currentColor"]').length).toBe(1);
  });

  it("keeps the same viewBox in both variants, so they swap without shifting", () => {
    const real = render(<LeafMark />).container.querySelector("svg")!;
    const simple = render(<LeafMark simplified />).container.querySelector("svg")!;
    expect(simple.getAttribute("viewBox")).toBe(real.getAttribute("viewBox"));
  });

  it("scales without a fixed size baked in", () => {
    const { container } = render(<LeafMark className="h-7" />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("viewBox");
    expect(svg).not.toHaveAttribute("width");
    expect(svg).not.toHaveAttribute("height");
  });
});
