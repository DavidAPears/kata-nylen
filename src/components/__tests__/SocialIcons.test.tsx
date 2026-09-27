// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import {
  iconForProfile,
  labelForProfile,
  LinkedInIcon,
  PublisherMark,
  MySpeakerMark,
} from "../SocialIcons";
import { person } from "@/content/facts";

describe("labelForProfile", () => {
  it("names the profiles we know by hand", () => {
    expect(labelForProfile("https://www.linkedin.com/in/kata")).toBe("LinkedIn");
    expect(labelForProfile("https://www.nok.se/forfattare/n/kata-nylen/")).toBe(
      "Natur & Kultur",
    );
    expect(labelForProfile("https://myspeaker.se/moderatorer/kata-nylen/")).toBe(
      "MySpeaker",
    );
  });

  it("falls back to a tidy hostname for anything new", () => {
    // Kata may send more profiles; an unlabelled one must still read sensibly
    // rather than showing a raw URL.
    expect(labelForProfile("https://www.instagram.com/kata")).toBe("instagram.com");
    expect(labelForProfile("https://klimatpsykologerna.se/om")).toBe(
      "klimatpsykologerna.se",
    );
  });

  it("returns the input rather than throwing on a malformed URL", () => {
    expect(labelForProfile("not a url")).toBe("not a url");
  });

  it("gives every profile we actually publish a non-empty label", () => {
    for (const url of person.sameAs) {
      expect(labelForProfile(url).trim()).not.toBe("");
    }
  });
});

describe("iconForProfile", () => {
  it("matches on the host, not the exact URL", () => {
    expect(iconForProfile("https://linkedin.com/in/kata")).toBe(LinkedInIcon);
    expect(iconForProfile("https://www.nok.se/forfattare/x")).toBe(PublisherMark);
    expect(iconForProfile("https://myspeaker.se/moderatorer/x")).toBe(MySpeakerMark);
  });

  it("returns null when we have no glyph, so the link falls back to text", () => {
    expect(iconForProfile("https://example.com/kata")).toBeNull();
  });
});

describe("the glyphs themselves", () => {
  it("are decorative: the link text carries the name", () => {
    const { container } = render(<LinkedInIcon />);
    expect(container.querySelector("svg")).toHaveAttribute("aria-hidden", "true");
    expect(container.querySelector("svg")).toHaveAttribute("focusable", "false");
  });

  it("carry explicit dimensions, so a missing class cannot blow them up to 300x150", () => {
    const { container } = render(<LinkedInIcon />);
    const svg = container.querySelector("svg")!;
    expect(svg).toHaveAttribute("width", "18");
    expect(svg).toHaveAttribute("height", "18");
  });

  it("render the publisher and speaker marks as empty-alt images", () => {
    for (const Mark of [PublisherMark, MySpeakerMark]) {
      const { container } = render(<Mark />);
      const img = container.querySelector("img")!;
      expect(img).toHaveAttribute("alt", "");
      expect(img).toHaveAttribute("loading", "lazy");
      expect(img.getAttribute("src")).toMatch(/^\/images\//);
    }
  });

  it("accept a className, so callers can size them", () => {
    const { container } = render(<LinkedInIcon className="h-4" />);
    expect(container.querySelector("svg")?.getAttribute("class")).toContain("h-4");
  });
});
