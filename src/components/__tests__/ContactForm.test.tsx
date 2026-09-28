// @vitest-environment jsdom
import { describe, it, expect, beforeEach, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ContactForm } from "../ContactForm";
import { en } from "@/content/en";
import { sv } from "@/content/sv";

/**
 * The contact form is a live conversion path: speaking enquiries, press and
 * collaboration all arrive through it. RsvpForm was covered from the start
 * and this one was not.
 */

function renderForm(overrides: Partial<React.ComponentProps<typeof ContactForm>> = {}) {
  return render(
    <ContactForm forms={en.forms} reasons={en.contact.reasons} {...overrides} />,
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

async function fillValid(user: ReturnType<typeof userEvent.setup>) {
  await user.type(screen.getByRole("textbox", { name: en.forms.fields.name }), "Organiser");
  await user.type(screen.getByRole("textbox", { name: en.forms.fields.email }), "org@example.com");
  await user.selectOptions(screen.getByLabelText(en.forms.fields.reason), "speaking");
  await user.type(
    screen.getByRole("textbox", { name: en.forms.fields.message }),
    "Would you speak at our conference?",
  );
}

describe("ContactForm", () => {
  beforeEach(() => vi.unstubAllGlobals());

  it("labels every field", () => {
    renderForm();
    for (const label of [
      en.forms.fields.name,
      en.forms.fields.email,
      en.forms.fields.message,
      en.forms.fields.reason,
    ]) {
      expect(screen.getByLabelText(new RegExp(label))).toBeInTheDocument();
    }
  });

  it("offers every enquiry reason", () => {
    renderForm();
    const select = screen.getByLabelText(en.forms.fields.reason) as HTMLSelectElement;
    const values = [...select.options].map((o) => o.value).filter(Boolean);
    expect(values).toEqual(en.contact.reasons.map((r) => r.value));
  });

  it("marks organisation as optional and does not require it", async () => {
    const fetchMock = mockFetch({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: en.forms.submit.contact }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(JSON.parse(init.body as string).organisation).toBe("");
  });

  it("posts the enquiry to the contact endpoint", async () => {
    const fetchMock = mockFetch({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: en.forms.submit.contact }));

    await waitFor(() => expect(fetchMock).toHaveBeenCalledOnce());
    const [url, init] = fetchMock.mock.calls[0] as unknown as [string, RequestInit];
    expect(url).toBe("/api/contact");
    expect(JSON.parse(init.body as string)).toMatchObject({
      name: "Organiser",
      email: "org@example.com",
      reason: "speaking",
      message: "Would you speak at our conference?",
    });
  });

  it("shows the success state and stops showing the form", async () => {
    mockFetch({ ok: true });
    const user = userEvent.setup();
    renderForm();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: en.forms.submit.contact }));

    expect(await screen.findByRole("status")).toHaveTextContent(
      en.forms.success.contactHeading,
    );
    expect(screen.queryByRole("button", { name: en.forms.submit.contact })).not.toBeInTheDocument();
  });

  it("translates server error codes rather than leaking them", async () => {
    mockFetch({ ok: false, fieldErrors: { email: "emailInvalid" } }, 422);
    const user = userEvent.setup();
    renderForm();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: en.forms.submit.contact }));

    expect(await screen.findByRole("alert")).toHaveTextContent(en.forms.errors.emailInvalid);
    expect(screen.queryByText("emailInvalid")).not.toBeInTheDocument();
  });

  it("surfaces a server failure as a readable message", async () => {
    mockFetch({ ok: false, error: "server" }, 500);
    const user = userEvent.setup();
    renderForm();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: en.forms.submit.contact }));

    expect(await screen.findByRole("alert")).toHaveTextContent(en.forms.errors.server);
  });

  it("recovers when the network fails outright", async () => {
    vi.stubGlobal("fetch", vi.fn(async () => { throw new Error("offline"); }));
    const user = userEvent.setup();
    renderForm();

    await fillValid(user);
    await user.click(screen.getByRole("button", { name: en.forms.submit.contact }));

    expect(await screen.findByRole("alert")).toHaveTextContent(en.forms.errors.server);
  });

  it("carries a honeypot that is hidden from assistive technology", () => {
    const { container } = renderForm();
    const honeypot = container.querySelector('input[name="website"]');
    expect(honeypot).toBeInTheDocument();
    expect(honeypot!.closest('[aria-hidden="true"]')).not.toBeNull();
    expect(honeypot).toHaveAttribute("tabindex", "-1");
  });

  it("renders in Swedish when given Swedish copy", () => {
    render(<ContactForm forms={sv.forms} reasons={sv.contact.reasons} />);
    expect(screen.getByRole("button", { name: sv.forms.submit.contact })).toBeInTheDocument();
  });
});

describe("privacy wording", () => {
  it("describes answering an enquiry, and nothing about the event", () => {
    // This form collects an enquiry. It previously told people their details
    // might be used to manage a place at the book launch, which it never does.
    render(<ContactForm forms={sv.forms} reasons={sv.contact.reasons} />);
    expect(screen.getByText(sv.forms.privacyNotice.contact)).toBeInTheDocument();
    expect(screen.queryByText(/evenemang/i)).toBeNull();
  });

  it("says the same in English, without mentioning the event", () => {
    render(<ContactForm forms={en.forms} reasons={en.contact.reasons} />);
    expect(screen.getByText(en.forms.privacyNotice.contact)).toBeInTheDocument();
    expect(screen.queryByText(/place at the event/i)).toBeNull();
  });
});
