// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import { NavLinks } from "../NavLinks";
import { en } from "@/content/en";
import { sv } from "@/content/sv";

const mockPathname = vi.fn(() => "/");

vi.mock("@/i18n/navigation", () => ({
  usePathname: () => mockPathname(),
  Link: ({
    href,
    children,
    ...rest
  }: {
    href: string;
    children: React.ReactNode;
  }) => (
    <a href={href} {...rest}>
      {children}
    </a>
  ),
}));

describe("NavLinks", () => {
  it("shows every section, in both languages", () => {
    render(<NavLinks locale="en" />);
    for (const label of [
      en.nav.home,
      en.nav.bookRelease,
      en.nav.publications,
      en.nav.speaking,
      en.nav.contact,
    ]) {
      expect(screen.getByRole("link", { name: label })).toBeInTheDocument();
    }
  });

  it("uses Swedish labels for the Swedish site", () => {
    render(<NavLinks locale="sv" />);
    expect(screen.getByRole("link", { name: sv.nav.publications })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: sv.nav.speaking })).toBeInTheDocument();
  });

  it("marks the current page for screen readers", () => {
    mockPathname.mockReturnValue("/publications");
    render(<NavLinks locale="en" />);
    expect(screen.getByRole("link", { name: en.nav.publications })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("marks only one page as current", () => {
    mockPathname.mockReturnValue("/speaking");
    const { container } = render(<NavLinks locale="en" />);
    expect(container.querySelectorAll('[aria-current="page"]')).toHaveLength(1);
  });

  it("is a labelled landmark, so it can be jumped to", () => {
    mockPathname.mockReturnValue("/");
    render(<NavLinks locale="sv" />);
    expect(screen.getByRole("navigation", { name: sv.nav.menuLabel })).toBeInTheDocument();
  });
});
