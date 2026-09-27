// @vitest-environment jsdom
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { TodoNote, OutstandingContent } from "../TodoNote";
import { outstandingFacts } from "@/content/facts";

afterEach(() => {
  vi.unstubAllEnvs();
});

describe("TodoNote", () => {
  it("shows the placeholder while we are still building", () => {
    render(<TodoNote>Her professional title.</TodoNote>);
    expect(screen.getByText(/Her professional title\./)).toBeInTheDocument();
    expect(screen.getByText(/TODO/)).toBeInTheDocument();
  });

  it("renders nothing in production", () => {
    // The whole point of the sentinel: an unconfirmed fact must never reach a
    // real visitor dressed as real content.
    vi.stubEnv("NODE_ENV", "production");
    const { container } = render(<TodoNote>Her professional title.</TodoNote>);
    expect(container).toBeEmptyDOMElement();
  });
});

describe("OutstandingContent", () => {
  it("summarises what is still missing, for us", () => {
    const { container } = render(<OutstandingContent />);
    const missing = outstandingFacts();
    if (missing.length === 0) {
      expect(container).toBeEmptyDOMElement();
      return;
    }
    expect(screen.getByText(`${missing.length} unconfirmed facts (dev only)`)).toBeInTheDocument();
    for (const item of missing) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("renders nothing in production, however much is outstanding", () => {
    vi.stubEnv("NODE_ENV", "production");
    const { container } = render(<OutstandingContent />);
    expect(container).toBeEmptyDOMElement();
  });
});
