// @vitest-environment jsdom
import { describe, it, expect, vi } from "vitest";
import { render, screen, within } from "@testing-library/react";
import { Footer } from "../Footer";
import { en } from "@/content/en";
import { sv } from "@/content/sv";
import { collectives, person, isResolved } from "@/content/facts";

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

describe("Footer", () => {
  it("links to the secondary pages that are not in the main nav", () => {
    render(<Footer locale="en" />);
    // These three live only here. The Media link in particular was reported
    // missing on desktop once, so it is worth asserting rather than assuming.
    expect(screen.getByRole("link", { name: en.footer.mediaLabel })).toHaveAttribute(
      "href",
      "/media",
    );
    expect(screen.getByRole("link", { name: en.footer.aboutLabel })).toHaveAttribute(
      "href",
      "/about",
    );
    expect(screen.getByRole("link", { name: en.footer.privacyLabel })).toHaveAttribute(
      "href",
      "/privacy",
    );
  });

  it("uses Swedish labels on the Swedish site", () => {
    render(<Footer locale="sv" />);
    expect(screen.getByRole("link", { name: sv.footer.privacyLabel })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: sv.footer.contactHeading })).toBeInTheDocument();
  });

  it("substitutes the current year into the copyright line", () => {
    render(<Footer locale="en" />);
    const year = String(new Date().getFullYear());
    expect(screen.getByText(en.footer.copyright.replace("{year}", year))).toBeInTheDocument();
    // The template must never reach a visitor unrendered.
    expect(screen.queryByText(/\{year\}/)).not.toBeInTheDocument();
  });

  it("lists every collective, each opening safely in a new tab", () => {
    render(<Footer locale="en" />);
    for (const collective of collectives) {
      const link = screen.getByRole("link", { name: collective.name });
      expect(link).toHaveAttribute("href", collective.url);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });

  it("gives every icon-only profile link an accessible name", () => {
    render(<Footer locale="en" />);
    for (const url of person.sameAs) {
      const link = screen
        .getAllByRole("link")
        .find((el) => el.getAttribute("href") === url);
      expect(link, `no link for ${url}`).toBeDefined();
      // A bare glyph would leave this link unnamed for a screen reader.
      expect(link).toHaveAccessibleName();
      expect(link!.textContent?.trim()).not.toBe("");
    }
  });

  it("offers the email as a mailto when we have one", () => {
    render(<Footer locale="en" />);
    const heading = screen.getByRole("heading", { name: en.footer.contactHeading });
    const block = heading.parentElement!;
    if (isResolved(person.email)) {
      expect(
        within(block).getByRole("link", { name: person.email }),
      ).toHaveAttribute("href", `mailto:${person.email}`);
    } else {
      // Unconfirmed: a dev-only TODO, never an invented address.
      expect(within(block).queryByRole("link")).toBeNull();
      expect(within(block).getByText(/TODO/)).toBeInTheDocument();
    }
  });
});
