// @vitest-environment jsdom
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Container, Section, Prose, ExternalAnchor } from "../primitives";

describe("Section", () => {
  it("is a region named by its own heading, so it can be jumped to", () => {
    render(
      <Section heading="Publications" id="publications">
        <p>Body</p>
      </Section>,
    );
    const region = screen.getByRole("region", { name: "Publications" });
    expect(region).toHaveAttribute("id", "publications");
    expect(screen.getByRole("heading", { name: "Publications", level: 2 })).toHaveAttribute(
      "id",
      "publications-heading",
    );
  });

  it("does not claim a name it cannot provide", () => {
    // Without an id there is no heading to point at; aria-labelledby with a
    // dangling id is worse than none.
    const { container } = render(
      <Section heading="Publications">
        <p>Body</p>
      </Section>,
    );
    expect(container.querySelector("section")).not.toHaveAttribute("aria-labelledby");
  });

  it("renders without a heading at all", () => {
    render(
      <Section id="plain">
        <p>Body</p>
      </Section>,
    );
    expect(screen.queryByRole("heading")).toBeNull();
    expect(screen.getByText("Body")).toBeInTheDocument();
  });

  it("marks the heading with the leaf only when asked", () => {
    const { container: plain } = render(<Section heading="A">x</Section>);
    expect(plain.querySelector("svg")).toBeNull();

    const { container: ornamented } = render(
      <Section heading="B" ornament>
        x
      </Section>,
    );
    // The real leaf from the book, not the simplified favicon silhouette.
    expect(ornamented.querySelector("svg")).toBeInTheDocument();
  });
});

describe("ExternalAnchor", () => {
  it("never lets an external page reach back into ours", () => {
    render(<ExternalAnchor href="https://example.com">Example</ExternalAnchor>);
    const link = screen.getByRole("link", { name: "Example" });
    expect(link).toHaveAttribute("target", "_blank");
    expect(link).toHaveAttribute("rel", "noopener noreferrer");
  });

  it("adds a description for screen readers without showing it", () => {
    render(
      <ExternalAnchor href="https://example.com" description="opens at Example">
        Example
      </ExternalAnchor>,
    );
    const link = screen.getByRole("link", { name: /opens at Example/ });
    // Present for assistive technology, invisible on the page.
    expect(link.querySelector(".sr-only")).toHaveTextContent("opens at Example");
  });

  it("drops the underline for icon-only links", () => {
    const { container } = render(
      <ExternalAnchor href="https://example.com" underline={false}>
        <span>icon</span>
      </ExternalAnchor>,
    );
    expect(container.querySelector("a")?.className).not.toContain("underline");
  });
});

describe("Container and Prose", () => {
  it("pass their children through, and accept extra classes", () => {
    const { container } = render(<Container className="flex">child</Container>);
    expect(screen.getByText("child")).toBeInTheDocument();
    expect(container.firstElementChild?.className).toContain("flex");
  });

  it("constrains body text to a readable measure", () => {
    const { container } = render(
      <Prose>
        <p>Body</p>
      </Prose>,
    );
    expect(container.firstElementChild?.className).toContain("max-w-[var(--measure)]");
  });
});
