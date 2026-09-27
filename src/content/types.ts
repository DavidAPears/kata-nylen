/**
 * The shape of all site copy, for one language.
 *
 * Both `src/content/sv.ts` and `src/content/en.ts` must satisfy this type, so
 * `npm run typecheck` fails the build if a piece of copy is added in one
 * language and forgotten in the other. That is the whole point of keeping copy
 * in TypeScript rather than loose JSON.
 *
 * Editing copy: change the strings in those two files only. No component
 * should ever contain user-visible text.
 */

export type Nav = {
  home: string;
  bookRelease: string;
  publications: string;
  speaking: string;
  contact: string;
  /** Accessible label for the language switcher, e.g. "Change language" */
  languageLabel: string;
  /** Accessible label for the mobile menu toggle */
  menuLabel: string;
  skipToContent: string;
};

export type Seo = {
  title: string;
  description: string;
  /** Optional override; falls back to `title` */
  ogTitle?: string;
  ogDescription?: string;
};

export type Cta = {
  label: string;
  /** Internal route key, matching `pathnames` in src/i18n/routing.ts */
  href:
    | "/"
    | "/book-release"
    | "/publications"
    | "/speaking"
    | "/contact"
    | "/about"
    | "/privacy";
};

export type ExternalLink = {
  label: string;
  href: string;
  /** Shown to screen readers to explain this leaves the site */
  description: string;
};

export type Topic = {
  id: string;
  title: string;
  description: string;
};

export type HomeContent = {
  seo: Seo;
  hero: {
    eyebrow: string;
    headline: string;
    standfirst: string;
    primaryCta: Cta;
    secondaryCta: Cta;
  };
  intro: {
    heading: string;
    body: string[];
  };
  featuredBook: {
    heading: string;
    description: string;
    cta: Cta;
  };
  areasOfWork: {
    heading: string;
    intro: string;
    topics: Topic[];
  };
  speakingTeaser: {
    heading: string;
    body: string;
    cta: Cta;
  };
  collective: {
    heading: string;
    body: string;
    links: ExternalLink[];
  };
};

export type BookReleaseContent = {
  seo: Seo;
  hero: {
    eyebrow: string;
    heading: string;
    /** Labels only — the values come from src/content/facts.ts */
    dateLabel: string;
    timeLabel: string;
    venueLabel: string;
    /** Shown in place of a detail Kata has not confirmed yet. */
    toBeConfirmed: string;
    /** Says plainly that this is a book launch, next to the event's own name. */
    launchLabel: string;
    rsvpCta: string;
  };
  invitation: {
    heading: string;
    body: string[];
    /** Heading above the list of what the evening holds. */
    includesHeading: string;
    /** Introduces the people appearing, e.g. "Kata Nylén with ...". */
    withLabel: string;
  };
  aboutBook: {
    heading: string;
    synopsisHeading: string;
    themesHeading: string;
    purchaseLabel: string;
  };
  programme: {
    heading: string;
  };
  location: {
    heading: string;
    directionsLabel: string;
    accessibilityHeading: string;
  };
  rsvp: {
    heading: string;
    intro: string;
    addToCalendarLabel: string;
    downloadIcsLabel: string;
    googleCalendarLabel: string;
  };
};

export type SpeakingContent = {
  seo: Seo;
  hero: {
    heading: string;
    standfirst: string;
  };
  themes: {
    heading: string;
    intro: string;
    topics: Topic[];
  };
  formats: {
    heading: string;
    intro: string;
    items: Topic[];
  };
  credibility: {
    heading: string;
    intro: string;
  };
  cta: {
    heading: string;
    body: string;
    cta: Cta;
  };
};

export type PublicationsContent = {
  seo: Seo;
  hero: {
    heading: string;
    standfirst: string;
  };
  booksHeading: string;
  chaptersHeading: string;
  /** Prefixes co-authors, e.g. "with Frida Hylander". */
  withLabel: string;
  /** Prefixes the editors of a volume she contributed to. */
  editorsLabel: string;
  /** Link text out to the publisher, and the thumbnail's hover label. */
  viewLabel: string;
  currentLabel: string;
};

export type ContactContent = {
  seo: Seo;
  hero: {
    heading: string;
    standfirst: string;
  };
  /** Options for the "reason for contact" select */
  reasons: { value: string; label: string }[];
  directEmailHeading: string;
};

/** Shared form copy — labels, validation messages, submission states. */
export type FormsContent = {
  fields: {
    name: string;
    email: string;
    organisation: string;
    guests: string;
    reason: string;
    message: string;
    marketingConsent: string;
  };
  optional: string;
  required: string;
  /** Placeholder option in a select, before a choice is made. */
  chooseOption: string;
  /** Honeypot field label, visually hidden but present for screen readers */
  honeypot: string;
  privacyNotice: string;
  submit: {
    rsvp: string;
    contact: string;
    pending: string;
  };
  errors: {
    nameRequired: string;
    emailRequired: string;
    emailInvalid: string;
    messageRequired: string;
    reasonRequired: string;
    guestsRange: string;
    tooLong: string;
    rateLimited: string;
    server: string;
    /** Shown above the form when one or more fields fail */
    summary: string;
  };
  success: {
    rsvpHeading: string;
    rsvpBody: string;
    contactHeading: string;
    contactBody: string;
  };
};

export type AboutSection = {
  heading: string;
  body: string[];
};

export type AboutContent = {
  seo: Seo;
  hero: {
    heading: string;
    standfirst: string;
  };
  intro: AboutSection;
  /** The subjects she works on, at depth. The substance of the page. */
  fieldsHeading: string;
  fields: Topic[];
  frameworkHeading: string;
  framework: {
    intro: string;
    steps: { title: string; description: string }[];
    closing: string;
  };
  booksHeading: string;
  booksIntro: string;
  booksCta: Cta;
  collectiveHeading: string;
  collectiveBody: string;
  speakingHeading: string;
  speakingBody: string;
  speakingCta: Cta;
  elsewhereHeading: string;
  elsewhereBody: string;
  recognitionHeading: string;
  mediaHeading: string;
};

export type FooterContent = {
  contactHeading: string;
  aboutLabel: string;
  collectiveHeading: string;
  followHeading: string;
  privacyLabel: string;
  /** Template containing `{year}`, e.g. "© {year} Kata Nylén". Must be a
   *  plain string: this object crosses into client components, and functions
   *  are not serialisable across that boundary. */
  copyright: string;
};

export type SiteContent = {
  locale: "sv" | "en";
  /** BCP-47 tag used for the <html lang> attribute */
  htmlLang: string;
  nav: Nav;
  home: HomeContent;
  bookRelease: BookReleaseContent;
  speaking: SpeakingContent;
  publications: PublicationsContent;
  about: AboutContent;
  contact: ContactContent;
  forms: FormsContent;
  footer: FooterContent;
  notFound: {
    heading: string;
    body: string;
    cta: Cta;
  };
};
