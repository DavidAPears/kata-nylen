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
  href: "/" | "/book-release" | "/speaking" | "/contact" | "/privacy";
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
    rsvpCta: string;
  };
  invitation: {
    heading: string;
    body: string[];
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

export type FooterContent = {
  contactHeading: string;
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
  contact: ContactContent;
  forms: FormsContent;
  footer: FooterContent;
  notFound: {
    heading: string;
    body: string;
    cta: Cta;
  };
};
