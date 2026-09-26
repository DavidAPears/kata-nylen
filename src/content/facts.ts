/**
 * ─────────────────────────────────────────────────────────────────────────
 *  UNVERIFIED FACTS — every item here must be confirmed by Kata before launch
 * ─────────────────────────────────────────────────────────────────────────
 *
 * Build brief §21.3: never invent biography, credentials, clients, quotes,
 * talks, testimonials or event details. §23 lists what is still outstanding.
 *
 * Nothing in this file is real yet. Each `TODO` value renders as a visible
 * placeholder in development and is *hidden* in production (see `isResolved`),
 * so an unfilled fact can never be published as though it were true.
 *
 * To fill one in: replace the TODO sentinel with the confirmed value.
 */

/** Sentinel marking a fact that has not been confirmed yet. */
export const TODO = "__TODO__" as const;
export type Todo = typeof TODO;
export type Fact<T> = T | Todo;

/** True when a fact has been confirmed and is safe to render publicly. */
export function isResolved<T>(value: Fact<T>): value is T {
  return value !== TODO;
}

/** Returns the value if confirmed, otherwise `undefined`. */
export function resolved<T>(value: Fact<T>): T | undefined {
  return isResolved(value) ? value : undefined;
}

export type ProgrammeItem = { time: string; description: { sv: string; en: string } };

export const person = {
  fullName: "Kata Nylén",
  /** §23: preferred professional title, per language */
  jobTitle: { sv: TODO as Fact<string>, en: TODO as Fact<string> },
  /** §23: approved short bios */
  shortBio: { sv: TODO as Fact<string>, en: TODO as Fact<string> },
  /** §12: professional email — only rendered if Kata wants it public */
  email: TODO as Fact<string>,
  /** §14: verified profiles for JSON-LD `sameAs`. Only add confirmed URLs. */
  sameAs: [] as string[],
  /** §6: approved portrait. Path under /public once supplied. */
  portrait: TODO as Fact<{ src: string; alt: { sv: string; en: string }; width: number; height: number }>,
};

export const book = {
  title: TODO as Fact<string>,
  publisher: TODO as Fact<string>,
  publicationDate: TODO as Fact<string>,
  purchaseUrl: TODO as Fact<string>,
  isbn: TODO as Fact<string>,
  synopsis: { sv: TODO as Fact<string>, en: TODO as Fact<string> },
  themes: { sv: [] as string[], en: [] as string[] },
  cover: TODO as Fact<{ src: string; alt: { sv: string; en: string }; width: number; height: number }>,
};

export const launchEvent = {
  /** ISO 8601 with timezone, e.g. "2026-04-16T18:00:00+02:00" */
  startsAt: TODO as Fact<string>,
  endsAt: TODO as Fact<string>,
  timeZone: "Europe/Stockholm",
  venueName: TODO as Fact<string>,
  addressLine: TODO as Fact<string>,
  postalCode: TODO as Fact<string>,
  city: TODO as Fact<string>,
  country: "SE",
  /** Whether +1s are permitted. When false, the guests field is not rendered. */
  guestsAllowed: TODO as Fact<boolean>,
  maxGuestsPerRsvp: 1,
  /** Optional cap; when set, RSVPs beyond it are refused. */
  capacity: TODO as Fact<number>,
  /** Optional RSVP deadline, ISO 8601. */
  rsvpDeadline: TODO as Fact<string>,
  /** §10: only render a programme if there genuinely is one. */
  programme: [] as ProgrammeItem[],
  accessibility: { sv: TODO as Fact<string>, en: TODO as Fact<string> },
};

/** §1 / §9: the collectives Kata works with. These URLs are confirmed. */
export const collectives = [
  {
    id: "klimatpsykologerna",
    name: "Klimatpsykologerna",
    url: "https://www.klimatpsykologerna.se/",
  },
  {
    id: "climate-psyched",
    name: "Climate Psyched",
    url: "https://www.climatepsyched.org/",
  },
] as const;

export const site = {
  domain: "katanylen.com",
  url: "https://katanylen.com",
} as const;

/**
 * Human-readable audit of what is still missing. Surfaced by
 * `npm run check:content` and on the dev-only content status route.
 */
export function outstandingFacts(): string[] {
  const missing: string[] = [];
  const check = (label: string, value: unknown) => {
    if (value === TODO) missing.push(label);
  };

  check("person.jobTitle.sv", person.jobTitle.sv);
  check("person.jobTitle.en", person.jobTitle.en);
  check("person.shortBio.sv", person.shortBio.sv);
  check("person.shortBio.en", person.shortBio.en);
  check("person.email", person.email);
  check("person.portrait", person.portrait);
  if (person.sameAs.length === 0) missing.push("person.sameAs (no verified profiles yet)");

  check("book.title", book.title);
  check("book.publisher", book.publisher);
  check("book.publicationDate", book.publicationDate);
  check("book.purchaseUrl", book.purchaseUrl);
  check("book.synopsis.sv", book.synopsis.sv);
  check("book.synopsis.en", book.synopsis.en);
  check("book.cover", book.cover);
  if (book.themes.sv.length === 0) missing.push("book.themes.sv");
  if (book.themes.en.length === 0) missing.push("book.themes.en");

  check("launchEvent.startsAt", launchEvent.startsAt);
  check("launchEvent.venueName", launchEvent.venueName);
  check("launchEvent.addressLine", launchEvent.addressLine);
  check("launchEvent.city", launchEvent.city);
  check("launchEvent.guestsAllowed", launchEvent.guestsAllowed);

  return missing;
}
