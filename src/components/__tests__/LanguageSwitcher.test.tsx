// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { LanguageSwitcher } from "../LanguageSwitcher";
import { locales } from "@/i18n/routing";

const mockPathname = vi.fn(() => "/");

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockPathname(),
  Link: ({
    href,
    locale,
    children,
    ...rest
  }: {
    href: string;
    locale?: string;
    children: React.ReactNode;
  }) => (
    <a href={href} data-locale={locale} {...rest}>
      {children}
    </a>
  ),
}));

describe("LanguageSwitcher", () => {
  it("offers every locale the site is built in", () => {
    render(<LanguageSwitcher locale="sv" label="Language" />);
    const links = screen.getAllByRole("link");
    expect(links).toHaveLength(locales.length);
    expect(links.map((l) => l.getAttribute("data-locale")).sort()).toEqual(
      [...locales].sort(),
    );
  });

  it("switches to the equivalent page, not back to the homepage", () => {
    // Brief §7. next-intl maps this internal path to each locale's public URL,
    // so the switcher must hand it the path it is on rather than "/".
    mockPathname.mockReturnValue("/book-release");
    render(<LanguageSwitcher locale="en" label="Language" />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("href", "/book-release");
    }
  });

  it("marks exactly one language as current", () => {
    mockPathname.mockReturnValue("/");
    const { container } = render(<LanguageSwitcher locale="en" label="Language" />);
    const current = container.querySelectorAll('[aria-current="true"]');
    expect(current).toHaveLength(1);
    expect(current[0].getAttribute("data-locale")).toBe("en");
  });

  it("declares each link's language, so it is announced correctly", () => {
    render(<LanguageSwitcher locale="sv" label="Language" />);
    for (const link of screen.getAllByRole("link")) {
      expect(link).toHaveAttribute("hreflang", link.getAttribute("data-locale"));
    }
  });

  it("is a labelled landmark", () => {
    render(<LanguageSwitcher locale="sv" label="Språk" />);
    expect(screen.getByRole("navigation", { name: "Språk" })).toBeInTheDocument();
  });

  it("hides the divider and the flags from assistive technology", () => {
    const { container } = render(<LanguageSwitcher locale="sv" label="Language" />);
    // The flags denote countries, not languages: the "SV"/"EN" text carries
    // the meaning, so the glyphs must stay decorative.
    for (const svg of container.querySelectorAll("svg")) {
      expect(svg).toHaveAttribute("aria-hidden", "true");
    }
    expect(screen.queryByText("|")).toHaveAttribute("aria-hidden", "true");
  });
});
