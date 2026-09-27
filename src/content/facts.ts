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
  /**
    * §12: public contact address.
    *
    * ⚠️ This is Kata's personal Gmail. Publishing it invites scraping and
    * spam. Once katanylen.com exists, move to a role address such as
    * hej@katanylen.com forwarded to her, which can be changed later without
    * breaking anything.
    */
  email: "kata.nylen@gmail.com" as Fact<string>,
  /** §14: verified profiles for JSON-LD `sameAs`. Only add confirmed URLs. */
  sameAs: [
    "https://www.linkedin.com/in/kata-nyl%C3%A9n-147b31127/",
    // Her author page at Natur & Kultur. In sameAs because it is exactly what
    // that property is for: tying this site to an authoritative profile of the
    // same person, which is how search engines and assistants confirm identity.
    "https://www.nok.se/forfattare/n/kata-nylen/7370a788-9683-413c-adbe-c681b37e3e31",
  ] as string[],
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
  subtitleEnglish: "Meeting adversity in an uncertain world" as Fact<string>,
  publisher: "Natur & Kultur" as Fact<string>,
  /* CONFIRMED from the publisher's own title page. */
  publicationDate: "2026-11-06" as Fact<string>,
  purchaseUrl:
    "https://www.nok.se/titlar/laromedel-b2/psykologiskresiliens/c5b7d317-19dd-477c-9738-281a9556368b" as Fact<string>,
  /* Paperback. The epub is 9789127472747. */
  isbn: "9789127472730" as Fact<string>,
  pageCount: 220,
  /**
   * The publisher's own short description, as it appears on their title page.
   *
   * ⚠️ This is Natur & Kultur's marketing copy, not ours. Using a publisher's
   * blurb on the author's own site is normal, but confirm with Kata or with
   * their press contact (Mia Breitholtz) that they are happy for it to appear
   * here, and that this stays in step if they revise it.
   *
   * The English is our translation of that text and needs Kata's eye, since
   * she is the one who has to stand behind it.
   */
  synopsis: {
    sv: "Resiliens är förmågan att stå kvar, anpassa sig och navigera svårigheter medan de pågår. I Psykologisk resiliens: att möta motgång i en osäker värld visar psykologen Kata Nylén hur resiliens kan utvecklas både individuellt och tillsammans med andra." as Fact<string>,
    en: "Resilience is the capacity to stay standing, adapt, and navigate difficulty while it is still happening. In Psykologisk resiliens: att möta motgång i en osäker värld, psychologist Kata Nylén shows how resilience can be developed both on our own and together with others." as Fact<string>,
  },
  /* CONFIRMED: the book's own chapter structure. */
  themes: {
    sv: ["Lyssna", "Älska", "Kollektivisera", "Agera", "Ge och ta emot stöd"],
    en: ["Listen", "Love", "Collectivise", "Act", "Give and receive support"],
  },
  /**
   * Front cover. The publisher has a press-image download on their title page
   * (credit: John Persson), which is the authoritative source for this.
   */
  cover: {
    src: "/images/book-cover.webp",
    alt: {
      sv: "Omslaget till Psykologisk resiliens av Kata Nylén",
      en: "Cover of Psykologisk resiliens by Kata Nylén",
    },
    width: 1618,
    height: 2480,
  } as Fact<{ src: string; alt: { sv: string; en: string }; width: number; height: number }>,
};

export const launchEvent = {
  /**
   * CONFIRMED from the launch poster.
   *
   * The evening has a name of its own: "Resilienssalong", subtitled
   * "Odla psykologisk resiliens tillsammans".
   */
  name: {
    sv: "Resilienssalong" as Fact<string>,
    /**
     * The Swedish name leads and the English follows in brackets, as the book
     * title does: the evening is called Resilienssalong, and that is what the
     * signage and everyone there will say.
     *
     * "Salong" is a salon in the cultural sense, an evening gathering for
     * conversation, music and ideas. Note that "salon" in English leans
     * towards hairdressing; if that reads badly, "Resilienssalong (An evening
     * of resilience)" is the alternative.
     */
    en: "Resilienssalong (Resilience Salon)" as Fact<string>,
  },
  tagline: {
    sv: "Odla psykologisk resiliens tillsammans" as Fact<string>,
    en: "Cultivating psychological resilience together" as Fact<string>,
  },
  /** Doors 17.00. Sweden is on CET (UTC+1) in November. */
  startsAt: "2026-11-11T17:00:00+01:00" as Fact<string>,
  /** No end time published. The calendar file falls back to two hours. */
  endsAt: TODO as Fact<string>,
  /** Stage programme begins at 17.15, and guests are asked to be seated by then. */
  stageStartsAt: "2026-11-11T17:15:00+01:00" as Fact<string>,
  timeZone: "Europe/Stockholm",
  /**
   * Djupet is Knackeriet's event space and has its OWN address. Knackeriet's
   * office is at Sankt Paulsgatan 25; the venue guests should walk to is
   * Björngårdsgatan 1A. Confirmed against both the poster and Knackeriet's
   * own Djupet page. Getting this wrong would send guests to the wrong door.
   */
  venueName: "Djupet" as Fact<string>,
  addressLine: "Björngårdsgatan 1A" as Fact<string>,
  /** Not published for the Björngårdsgatan entrance, so deliberately absent. */
  postalCode: TODO as Fact<string>,
  city: "Stockholm" as Fact<string>,
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
  /** The two published times. */
  programme: [
    {
      time: "17.00",
      description: { sv: "Dörrarna öppnar", en: "Doors open" },
    },
    {
      time: "17.15",
      description: {
        sv: "Programmet börjar på scen. Var på plats senast 17.15.",
        en: "The stage programme begins. Please be seated by 17.15.",
      },
    },
  ] as ProgrammeItem[],
  /** What the evening holds, as listed on the poster. */
  includes: {
    sv: ["Musik", "Text", "Samtal", "Möten", "Mingel", "Boksignering"],
    /* "Möten" and "Mingel" are distinct in Swedish but collapse into one idea
       in English, so they become a single item rather than reading as a
       repetition. */
    en: ["Music", "Readings", "Conversation", "Networking", "Book signing"],
  },
  /** Performing with Kata. A real person: credit, never drop. */
  guests: [
    {
      name: "Sebastian Ring",
      role: { sv: "musiker och kompositör", en: "musician and composer" },
    },
  ],
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
export function launchEventNameFor(locale: "sv" | "en"): string {
  const name = resolved(launchEvent.name[locale]);
  if (name) return name;
  const title = resolved(book.title);
  return title
    ? `${locale === "sv" ? "Bokrelease" : "Book release"}: ${title}`
    : locale === "sv"
      ? "Bokrelease med Kata Nylén"
      : "Book release with Kata Nylén";
}

/**
 * The title with no bracketed translation: the Swedish title on Swedish pages,
 * the English one on English pages.
 *
 * Used where the cover is visible beside the text, which is the case on the
 * book-release hero at `sm` and up. The cover already shows the Swedish title,
 * so repeating it there just reads as clutter.
 */
export function bookTitlePlainFor(locale: "sv" | "en"): string | undefined {
  if (locale === "sv") return resolved(book.title);
  return resolved(book.titleEnglish) ?? resolved(book.title);
}

/** Subtitle, in the page's own language. */
export function bookSubtitleFor(locale: "sv" | "en"): string | undefined {
  if (locale === "sv") return resolved(book.subtitle);
  return resolved(book.subtitleEnglish) ?? resolved(book.subtitle);
}

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
  if (!TODO_APPROVED.synopsis) {
    missing.push(
      "book.synopsis: now the publisher's official copy. Confirm Natur & Kultur are happy for it to be used, and have Kata check the English translation.",
    );
  }
  check("book.publicationDate", book.publicationDate);
  check("book.purchaseUrl", book.purchaseUrl);
  check("book.synopsis.sv", book.synopsis.sv);
  check("book.synopsis.en", book.synopsis.en);
  check("book.cover", book.cover);
  if (book.themes.sv.length === 0) missing.push("book.themes.sv");
  if (book.themes.en.length === 0) missing.push("book.themes.en");

  // Deliberately NOT listed: endsAt, capacity, postalCode and accessibility.
  // David has decided none of them are needed for this launch. The calendar
  // file falls back to a two-hour event, RSVPs are uncapped, and the address
  // renders without a postcode. Revisit only if that changes.

  return missing;
}
