import { describe, it, expect } from "vitest";
import { rsvpSchema, contactSchema, toFieldErrors } from "../validation";

describe("rsvpSchema", () => {
  const valid = { name: "Kata", email: "kata@example.com" };

  it("accepts a minimal valid RSVP and defaults guests to 1", () => {
    const result = rsvpSchema.safeParse(valid);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.guests).toBe(1);
      expect(result.data.marketingConsent).toBe(false);
    }
  });

  it("never opts a visitor into marketing by default", () => {
    // Brief §10: consent must be explicit and never pre-selected. If this test
    // ever fails, the site has a GDPR problem, not a styling problem.
    const result = rsvpSchema.parse(valid);
    expect(result.marketingConsent).toBe(false);
  });

  it("rejects a missing name with the nameRequired code", () => {
    const result = rsvpSchema.safeParse({ ...valid, name: "   " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).name).toBe("nameRequired");
    }
  });

  it.each([
    ["not-an-email", "emailInvalid"],
    ["missing@tld", "emailInvalid"],
    ["", "emailRequired"],
  ])("rejects email %j with code %s", (email, code) => {
    const result = rsvpSchema.safeParse({ ...valid, email });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).email).toBe(code);
    }
  });

  it("trims surrounding whitespace from name and email", () => {
    const result = rsvpSchema.parse({ name: "  Kata  ", email: " kata@example.com " });
    expect(result.name).toBe("Kata");
    expect(result.email).toBe("kata@example.com");
  });

  it.each([0, -1, 11, 1.5])("rejects an out-of-range guest count: %s", (guests) => {
    const result = rsvpSchema.safeParse({ ...valid, guests });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).guests).toBe("guestsRange");
    }
  });

  it("rejects an over-long name rather than truncating it", () => {
    const result = rsvpSchema.safeParse({ ...valid, name: "a".repeat(201) });
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error).name).toBe("tooLong");
  });

  it("accepts a filled honeypot at the schema level (the route discards it)", () => {
    // Validation deliberately does not reject this — the route returns a fake
    // success so a bot cannot tell it was caught.
    const result = rsvpSchema.safeParse({ ...valid, website: "" });
    expect(result.success).toBe(true);
  });
});

describe("contactSchema", () => {
  const valid = {
    name: "Organiser",
    email: "org@example.com",
    reason: "speaking",
    message: "Would you speak at our conference?",
  };

  it("accepts a valid enquiry", () => {
    expect(contactSchema.safeParse(valid).success).toBe(true);
  });

  it("defaults organisation to an empty string when omitted", () => {
    expect(contactSchema.parse(valid).organisation).toBe("");
  });

  it("rejects an unknown reason", () => {
    const result = contactSchema.safeParse({ ...valid, reason: "spam" });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).reason).toBe("reasonRequired");
    }
  });

  it("requires a non-empty message", () => {
    const result = contactSchema.safeParse({ ...valid, message: "  " });
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(toFieldErrors(result.error).message).toBe("messageRequired");
    }
  });

  it("caps message length", () => {
    const result = contactSchema.safeParse({ ...valid, message: "x".repeat(4001) });
    expect(result.success).toBe(false);
    if (!result.success) expect(toFieldErrors(result.error).message).toBe("tooLong");
  });
});

describe("toFieldErrors", () => {
  it("reports the first error per field only", () => {
    const result = rsvpSchema.safeParse({ name: "", email: "" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const errors = toFieldErrors(result.error);
      expect(Object.keys(errors).sort()).toEqual(["email", "name"]);
    }
  });
});
