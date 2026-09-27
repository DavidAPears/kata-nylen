// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { Header } from "../Header";
import { en } from "@/content/en";
import { sv } from "@/content/sv";

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => "/",
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

describe("Header", () => {
  it("is a banner landmark holding both navigations", () => {
    render(<Header locale="en" />);
    expect(screen.getByRole("banner")).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: en.nav.menuLabel })).toBeInTheDocument();
    expect(screen.getByRole("navigation", { name: en.nav.languageLabel })).toBeInTheDocument();
  });

  it("keeps the wordmark pointing home, since Home is hidden on a phone", () => {
    render(<Header locale="en" />);
    expect(screen.getByRole("link", { name: /kata nyl/i })).toHaveAttribute("href", "/");
  });

  it("renders in Swedish for the Swedish site", () => {
    render(<Header locale="sv" />);
    expect(screen.getByRole("navigation", { name: sv.nav.menuLabel })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: sv.nav.bookRelease })).toBeInTheDocument();
  });

  it("names the two landmarks differently, so they can be told apart", () => {
    render(<Header locale="en" />);
    expect(en.nav.menuLabel).not.toBe(en.nav.languageLabel);
  });
});
