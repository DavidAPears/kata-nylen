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
  /**
    * §6: portrait, used prominently on the home page.
    *
    * ⚠️ The filename says "placeholder". Confirm with Kata that this is the
    * approved image and that the photography rights are cleared (§23) before
    * launch; swap the src when the final one arrives.
    */
  portrait: {
    src: "/images/portrait-placeholder.jpg",
    alt: {
      sv: "Porträtt av Kata Nylén",
      en: "Portrait of Kata Nylén",
    },
    width: 3151,
    height: 4724,
  } as Fact<{ src: string; alt: { sv: string; en: string }; width: number; height: number }>,
};

export const book = {
  /* CONFIRMED from the book's own title page. */
  title: "Psykologisk resiliens" as Fact<string>,
  subtitle: "Att möta motgång i en osäker värld" as Fact<string>,
  /** The book is Swedish. On English pages the Swedish title leads and this
   *  follows in brackets, so the real title stays findable and searchable. */
  titleEnglish: "Psychological resilience" as Fact<string>,
  publisher: "Natur & Kultur" as Fact<string>,
  publicationDate: TODO as Fact<string>,
  purchaseUrl: TODO as Fact<string>,
  isbn: TODO as Fact<string>,
  /**
    * ⚠️ DRAFT, written from the book's own structure, NOT approved by Kata and
    * NOT the publisher's copy. Natur & Kultur will have official back-cover
    * and catalogue text; use that instead once we have it (§23).
    */
  synopsis: {
    sv: "Hur står vi upprätt när världen skakar? I Psykologisk resiliens visar psykologen Kata Nylén att motståndskraft inte är något vi bär ensamma. Med utgångspunkt i klimatkris, osäkerhet och förlust följer boken fem rörelser: att lyssna, älska, kollektivisera, agera och att ge och ta emot stöd. Tillsammans stavar de LÄKA. En bok om att möta motgång utan att stänga av, och om den kollektiva omsorg som bär oss." as Fact<string>,
    en: "How do we stay standing when the world shakes? In Psykologisk resiliens, psychologist Kata Nylén argues that resilience is not something we carry alone. Working from climate crisis, uncertainty and loss, the book follows five movements: listening, loving, collectivising, acting, and giving and receiving support. Together they spell LÄKA, the Swedish word for to heal. A book about meeting hardship without shutting down, and about the collective care that holds us." as Fact<string>,
  },
  /* CONFIRMED: the book's own chapter structure. */
  themes: {
    sv: ["Lyssna", "Älska", "Kollektivisera", "Agera", "Ge och ta emot stöd"],
    en: ["Listen", "Love", "Collectivise", "Act", "Give and receive support"],
  },
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
  /** Whether +1s are permitted. When false, the places field is not rendered.
   *  CONFIRMED 2026-09-26: yes, Kata wants as many people there as possible. */
  guestsAllowed: true as Fact<boolean>,
  /** Total places one person may reserve, INCLUDING themselves. */
  maxPlacesPerRsvp: 4,
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
 * The book's title as it should appear for a given language.
 *
 * The book is Swedish, so the Swedish title always leads. On English pages the
 * translation follows in brackets, which keeps the real, searchable title
 * intact while still telling an English reader what it means.
 */
export function bookTitleFor(locale: "sv" | "en"): string | undefined {
  const title = resolved(book.title);
  if (!title) return undefined;
  if (locale === "sv") return title;
  const english = resolved(book.titleEnglish);
  return english ? `${title} (${english})` : title;
}

/**
 * Human-readable audit of what is still missing. Surfaced by
 * `npm run check:content` and on the dev-only content status route.
 */
/** Things that have a value but are not yet approved by Kata. */
const TODO_APPROVED = { synopsis: false };

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
  if (book.synopsis.sv && !TODO_APPROVED.synopsis) {
    missing.push("book.synopsis — DRAFT, needs Kata's or the publisher's copy");
  }
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

  return missing;
}
