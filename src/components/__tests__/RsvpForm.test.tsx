// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RsvpForm } from "../RsvpForm";
import { en } from "@/content/en";
import { sv } from "@/content/sv";

const labels = en.bookRelease.rsvp;

function renderForm(overrides: Partial<React.ComponentProps<typeof RsvpForm>> = {}) {
  return render(
    <RsvpForm
      locale="en"
      forms={en.forms}
      labels={labels}
      guestsAllowed={false}
      maxGuests={2}
      calendar={null}
      {...overrides}
    />,
  );
}

function mockFetch(response: unknown, status = 200) {
  const fetchMock = vi.fn(async () =>
    new Response(JSON.stringify(response), {
      status,
      headers: { "content-type": "application/json" },
    }),
  );
  vi.stubGlobal("fetch", fetchMock);
  return fetchMock;
}

describe("RsvpForm", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("labels every field so it is reachable by name", () => {
    renderForm();
    expect(screen.getByLabelText(en.forms.fields.name)).toBeInTheDocument();
    expect(screen.getByLabelText(en.forms.fields.email)).toBeInTheDocument();
  });

  it("never pre-checks marketing consent", () => {
    renderForm();
    // Brief §10. This is a compliance requirement, not a preference.
    expect(screen.getByLabelText(en.forms.fields.marketingConsent)).not.toBeChecked();
  });

  it("hides the guests field when +1s are not permitted", () => {
    renderForm({ guestsAllowed: false });
    expect(screen.queryByLabelText(en.forms.fields.guests)).not.toBeInTheDocument();
  });

  it("shows the guests field when +1s are permitted", () => {
    renderForm({ guestsAllowed: true });
    expect(screen.getByLabelText(en.forms.fields.guests)).toBeInTheDocument();
  });

  it("submits the entered details to the RSVP endpoint", async () => {
    const fetchMock = mockFetch({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "guest@example.com");
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/rsvp");
    expect(JSON.parse(init.body as string)).toMatchObject({
      name: "Guest",
      email: "guest@example.com",
      locale: "en",
      marketingConsent: false,
    });
  });

  it("sends marketing consent only when the visitor ticks it", async () => {
    const fetchMock = mockFetch({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "guest@example.com");
    await user.click(screen.getByLabelText(en.forms.fields.marketingConsent));
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string).marketingConsent).toBe(true);
  });

  it("shows the success state after a successful submission", async () => {
    mockFetch({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "guest@example.com");
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      en.forms.success.rsvpHeading,
    );
  });

  it("offers calendar links on success when the event is confirmed", async () => {
    mockFetch({ ok: true });
    const user = userEvent.setup();
    renderForm({
      calendar: { icsHref: "/api/calendar?locale=en", googleHref: "https://calendar.google.com/x" },
    });

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "guest@example.com");
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    expect(
      await screen.findByRole("link", { name: labels.downloadIcsLabel }),
    ).toHaveAttribute("href", "/api/calendar?locale=en");
  });

  it("translates server field-error codes into the active language", async () => {
    mockFetch({ ok: false, fieldErrors: { email: "emailInvalid" } }, 422);
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "nope");
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    // The code never reaches the user — they see the English message.
    expect(await screen.findByRole("alert")).toHaveTextContent(
      en.forms.errors.emailInvalid,
    );
    expect(screen.queryByText("emailInvalid")).not.toBeInTheDocument();
  });

  it("marks the failing field as invalid for assistive technology", async () => {
    mockFetch({ ok: false, fieldErrors: { email: "emailInvalid" } }, 422);
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "nope");
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    await waitFor(() =>
      expect(screen.getByLabelText(en.forms.fields.email)).toHaveAttribute(
        "aria-invalid",
        "true",
      ),
    );
  });

  it("surfaces a rate-limit response as a readable message", async () => {
    mockFetch({ ok: false, error: "rateLimited" }, 429);
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "guest@example.com");
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      en.forms.errors.rateLimited,
    );
  });

  it("recovers with a readable error when the network fails outright", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const user = userEvent.setup();
    renderForm();

    await user.type(screen.getByLabelText(en.forms.fields.name), "Guest");
    await user.type(screen.getByLabelText(en.forms.fields.email), "guest@example.com");
    await user.click(screen.getByRole("button", { name: en.forms.submit.rsvp }));

    expect(await screen.findByRole("alert")).toHaveTextContent(en.forms.errors.server);
  });

  it("renders Swedish copy when the locale is sv", () => {
    render(
      <RsvpForm
        locale="sv"
        forms={sv.forms}
        labels={sv.bookRelease.rsvp}
        guestsAllowed={false}
        maxGuests={2}
        calendar={null}
      />,
    );
    expect(screen.getByRole("button", { name: "Anmäl mig" })).toBeInTheDocument();
  });
});
