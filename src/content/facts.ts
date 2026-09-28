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
  /**
   * §23: preferred professional title. CONFIRMED by Kata, 28 Sep 2026.
   *
   * She asked to be introduced as "legitimerad psykolog och specialist i
   * organisationspsykologi, författare och föreläsare", and that full
   * four-part form is what the visible copy uses.
   *
   * This field carries only the licensed credentials, because the other two
   * parts are already in the structured data as their own things: she is the
   * `author` of a Book, and `makesOffer` lists what she can be booked to
   * speak on. Repeating them here would say the same thing twice in a field
   * meant to be precise.
   */
  jobTitle: {
    sv: "Legitimerad psykolog och specialist i organisationspsykologi" as Fact<string>,
    en: "Licensed psychologist and specialist in organisational psychology" as Fact<string>,
  },
  /**
   * §23: approved short bio. Written by Kata, 28 Sep 2026.
   *
   * The Swedish is hers, with one change: her draft used an en dash before
   * "med ett särskilt intresse", and the site does not use en or em dashes in
   * anything a reader sees. It is a comma here instead.
   *
   * The English is our translation of her text and still needs her eye.
   */
  shortBio: {
    sv: "Kata Nylén är legitimerad psykolog, specialist i organisationspsykologi, författare och föreläsare. Hon arbetar med beteendeförändring, psykologisk resiliens och implementering, med ett särskilt intresse för hur kunskap och ambitioner blir till handling i organisationer. Hennes arbete spänner från hållbar omställning och klimatpsykologi till förebyggande insatser för barn och unga genom SNAP. Hon är medgrundare av Klimatpsykologerna, SNAP Sverige och SHIFT Collective och författare till bland annat Psykologisk resiliens: att möta motgångar i en osäker värld." as Fact<string>,
    en: "Kata Nylén is a licensed psychologist, a specialist in organisational psychology, an author and a speaker. She works with behavioural change, psychological resilience and implementation, with a particular interest in how knowledge and ambition become action inside organisations. Her work runs from sustainable transition and climate psychology to preventive work with children and young people through SNAP. She is a co-founder of Klimatpsykologerna, SNAP Sverige and SHIFT Collective, and the author of books including Psykologisk resiliens: att möta motgångar i en osäker värld." as Fact<string>,
  },
  /**
    * §12: public contact address.
    *
    * ⚠️ This is Kata's personal Gmail. Publishing it invites scraping and
    * spam. Once katanylen.com exists, move to a role address such as
    * hej@katanylen.com forwarded to her, which can be changed later without
    * breaking anything.
    */
  email: "kata.nylen@gmail.com" as Fact<string>,
  /**
    * A second, monochrome portrait. Used on the media page, where it reads as
    * a press photograph rather than a website picture.
    */
  portraitMono: {
    src: "/images/portrait-mono.webp",
    alt: {
      sv: "Porträtt av Kata Nylén i svartvitt",
      en: "Black and white portrait of Kata Nylén",
    },
    width: 1600,
    height: 2399,
  } as Fact<{ src: string; alt: { sv: string; en: string }; width: number; height: number }>,

  /** §14: verified profiles for JSON-LD `sameAs`. Only add confirmed URLs. */
  sameAs: [
    "https://www.linkedin.com/in/kata-nyl%C3%A9n-147b31127/",
    // Her author page at Natur & Kultur. In sameAs because it is exactly what
    // that property is for: tying this site to an authoritative profile of the
    // same person, which is how search engines and assistants confirm identity.
    "https://www.nok.se/forfattare/n/kata-nylen/7370a788-9683-413c-adbe-c681b37e3e31",
    // Her booking profile at MySpeaker. Another authoritative profile of the
    // same person, so it belongs in sameAs alongside the others.
    "https://myspeaker.se/moderatorer/kata-nylen/",
  ] as string[],
  /**
    * §6: portrait, used prominently on the home page.
    *
    * ⚠️ The filename says "placeholder". Confirm with Kata that this is the
    * approved image and that the photography rights are cleared (§23) before
    * launch; swap the src when the final one arrives.
    *
    * Her press portraits are credited to KARIN BOO, both by Natur & Kultur
    * and on the Klimatklubben interview. If this is one of hers, it likely
    * needs that credit.
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
  subtitle: "Att möta motgångar i en osäker värld" as Fact<string>,
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
    sv: "Resiliens är förmågan att stå kvar, anpassa sig och navigera svårigheter medan de pågår. I Psykologisk resiliens: att möta motgångar i en osäker värld visar psykologen Kata Nylén hur resiliens kan utvecklas både individuellt och tillsammans med andra." as Fact<string>,
    en: "Resilience is the capacity to stay standing, adapt, and navigate difficulty while it is still happening. In Psykologisk resiliens: att möta motgångar i en osäker värld, psychologist Kata Nylén shows how resilience can be developed both on our own and together with others." as Fact<string>,
  },
  /* CONFIRMED: the book's own chapter structure. */
  themes: {
    /*
      Four, not five. The initials spell LÄKA, which has four letters, so the
      earlier fifth movement ("Ge och ta emot stöd") was wrong on its own terms
      as well as wrong about the book. Corrected by Kata, 28 Sep 2026.
    */
    sv: ["Lyssna", "Älska", "Kollektivisera", "Agera"],
    en: ["Listen", "Love", "Collectivise", "Act"],
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
  /** Stage programme begins at 17.15. */
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
        sv: "Programmet börjar på scen.",
        en: "The stage programme begins.",
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

/**
 * Everything Kata has written, confirmed from each publisher's own page.
 *
 * `role` distinguishes what she actually did, which matters: presenting a
 * chapter contribution as authorship of the whole book would overstate it.
 *
 * Co-authors and editors are named because they are real people whose work
 * this is too.
 */
export type Publication = {
  id: string;
  /** The real, published Swedish title. */
  title: string;
  subtitle?: string;
  /**
   * English rendering of the title, shown on English pages.
   *
   * These books exist only in Swedish. The English is here so a reader knows
   * what they are looking at, not to suggest an English edition; the cover
   * beside it and the Swedish original in the details line keep the real
   * title visible and searchable.
   */
  titleEn?: string;
  subtitleEn?: string;
  /** Year of the edition linked to. */
  year?: string;
  publisher: string;
  url: string;
  role: "author" | "chapter";
  /** Other named authors, not including Kata. */
  withAuthors?: string[];
  /** Editors, for volumes she contributed a chapter to. */
  editors?: string[];
  /** Notes worth showing, e.g. that something is a free download. */
  note?: { sv: string; en: string };
  /** Where a later edition exists and `year` is the first publication. */
  editionNote?: { sv: string; en: string };
  /** Front cover, for the thumbnail. */
  cover?: { src: string; width: number; height: number };
  /**
   * A sentence or two on what the book is about.
   *
   * ⚠️ DRAFTS, written from each publisher's own description rather than
   * copied from it, and not checked by Kata. She should read these: they are
   * descriptions of her own work.
   */
  summary?: { sv: string; en: string };
  /** The current release, given prominence. */
  isCurrent?: boolean;
};

export const publications: Publication[] = [
  {
    id: "psykologisk-resiliens",
    title: "Psykologisk resiliens",
    subtitle: "Att möta motgångar i en osäker värld",
    titleEn: "Psychological resilience",
    subtitleEn: "Meeting adversity in an uncertain world",
    year: "2026",
    publisher: "Natur & Kultur",
    url: "https://www.nok.se/titlar/laromedel-b2/psykologiskresiliens/c5b7d317-19dd-477c-9738-281a9556368b",
    role: "author",
    isCurrent: true,
    cover: { src: "/images/book-cover.webp", width: 1618, height: 2480 },
    summary: {
      sv: "Om hur vi står kvar, anpassar oss och tar oss igenom svårigheter medan de pågår, och om hur motståndskraft kan odlas både enskilt och tillsammans med andra.",
      en: "On staying standing, adapting and finding a way through difficulty while it is still happening, and on how resilience can be built alone and together with others.",
    },
  },
  {
    id: "klimatpsykologi",
    title: "Klimatpsykologi",
    subtitle: "Hur vi skapar hållbar förändring",
    titleEn: "Climate psychology",
    subtitleEn: "How we create sustainable change",
    /**
     * First published autumn 2019. The publisher's current page shows
     * "Utkom 14 mars 2025", which is a later edition; contemporary sources
     * from 2020 and 2021 both cite the 2019 original.
     *
     * The first date is the one worth showing: it says six years of work in
     * this field rather than one.
     */
    year: "2019",
    editionNote: {
      sv: "Ny utgåva 2025",
      en: "New edition 2025",
    },
    publisher: "Natur & Kultur",
    url: "https://www.nok.se/titlar/akademisk-psykologi/klimatpsykologi/4cd7f427-fbf3-458d-b0cc-f75f3fbf71e8",
    role: "author",
    withAuthors: ["Frida Hylander", "Kali Andersson"],
    cover: { src: "/images/klimatpsykologi.webp", width: 640, height: 941 },
    summary: {
      sv: "Hur psykologisk kunskap om beteende, känslor och varseblivning kan göra klimatarbetet mer verkningsfullt. För den som leder, beslutar eller känner frustration över att förändring går långsamt.",
      en: "How psychological understanding of behaviour, emotion and perception can make climate work more effective. For people who lead, decide, or feel frustrated at how slowly change happens.",
    },
  },
  {
    id: "kbt-socialt-arbete",
    title: "KBT i socialt arbete med barn och unga",
    titleEn: "CBT in social work with children and young people",
    year: "2019",
    publisher: "Studentlitteratur",
    url: "https://www.studentlitteratur.se/kurslitteratur/psykologi/klinisk-psykologi---barn-och-ungdom/kbt-i-socialt-arbete-med-barn-och-unga/",
    role: "author",
    withAuthors: ["Jonas Fäldt"],
    cover: {
      src: "/images/KBT-i-socialt-arbete-med-barn-och-unga.webp",
      width: 556,
      height: 800,
    },
    summary: {
      sv: "Hur kognitiv beteendeterapi kan användas konkret i socialt behandlingsarbete, med exempel för den som möter barn, unga och familjer i socialtjänsten.",
      en: "How cognitive behavioural therapy can be used concretely in social work, with worked examples for people supporting children, young people and families.",
    },
  },
  {
    id: "lararens-guide",
    title: "Lärarens guide till klimatmedveten undervisning",
    titleEn: "A teacher's guide to climate-aware teaching",
    publisher: "Natur & Kultur",
    url: "https://www.nok.se/globalassets/ideella--overgripande/klimatkompensation/guide-klimatmedveten-undervisning_webb-sidvis.pdf",
    role: "author",
    cover: {
      src: "/images/lararens-guide-till-klimatmedveten-undervisning.png",
      width: 856,
      height: 1200,
    },
    note: {
      sv: "Fri guide att ladda ner (PDF)",
      en: "Free guide to download (PDF)",
    },
  },
  {
    id: "evidensbaserad-elevhalsa",
    title: "Evidensbaserad elevhälsa",
    titleEn: "Evidence-based student health",
    year: "2024",
    publisher: "Studentlitteratur",
    url: "https://www.studentlitteratur.se/kompetensutveckling/medicin/pediatrik/evidensbaserad-elevhalsa-37314-03/",
    role: "chapter",
    editors: ["Josef Milerad", "Carl Lindgren", "Louise Forslund"],
    cover: { src: "/images/evidensbaserad-elevhalsa.webp", width: 555, height: 800 },
    summary: {
      sv: "En antologi om evidensbaserad elevhälsa. Tredje upplagan är uppdaterad med bland annat klimatångest, neuropsykiatri och digitaliseringens påverkan på elevers lärande och mående. Kata Nylén har skrivit ett kapitel.",
      en: "An edited volume on evidence-based student health. The third edition adds chapters on climate anxiety, neuropsychiatry and how digitalisation affects pupils' learning and wellbeing. Kata Nylén contributed a chapter.",
    },
  },
  {
    /*
      Kata's chapter, supplied by her on 28 Sep 2026 with the Adlibris link.

      Publisher and year are from Libris, the Swedish national library
      catalogue (bib/5g5hjgrt37jkc6z0), rather than from the retailer page,
      which was unreachable. The catalogue record lists no contributors, so
      `editors` is deliberately absent rather than guessed.

      ⚠️ The summary is thin on purpose: all we can state is what the record
      says and what Kata told us. Ask her what her chapter is actually about
      and expand it then.
    */
    id: "vad-haller-ni-pa-med",
    title: "Vad håller ni på med?",
    subtitle: "En antologi om klimatet",
    titleEn: "What are you doing?",
    subtitleEn: "An anthology on the climate",
    year: "2019",
    publisher: "En bok för alla",
    url: "https://www.adlibris.com/sv/bok/vad-haller-ni-pa-med-en-antologi-om-klimatet-9789172218024",
    role: "chapter",
    summary: {
      // The subtitle already says it is an anthology about the climate, and it
      // renders directly above this, so repeating it just wastes the line.
      sv: "Kata Nylén har skrivit ett kapitel i antologin.",
      en: "Kata Nylén contributed a chapter to this anthology.",
    },
  },
];

/**
 * Third-party recognition and media, each with a link so any reader can check
 * it. Brief §11: never fabricate credentials. Everything here is quoted from,
 * or directly attributable to, the linked source.
 *
 * Note what is deliberately NOT claimed. Klimatklubben's list names
 * **Klimatpsykologerna**, the collective, not Kata individually: "Klimat-
 * psykologerna är med på Klimatklubbens lista över Sveriges 52 främsta
 * kvinnor". Presenting it as a personal accolade would overstate it, and it is
 * strong enough stated accurately.
 *
 * Likewise "Sveriges ledande experter på klimatpsykologi" is Klimatklubben's
 * description of the collective, so it is attributed to them rather than
 * asserted by us. An attributed claim a reader can verify is worth more than
 * an unattributed one anyway.
 */
export type Recognition = {
  id: string;
  url: string;
  source: string;
  /** What this is, in each language. */
  title: { sv: string; en: string };
  /** Why it counts, stated so a reader can check it. */
  detail: { sv: string; en: string };
};

export const recognition: Recognition[] = [
  {
    id: "klimatklubben-52",
    url: "https://klimatklubben.se/klimatsnack/kata-nylen-klimatpsykologerna-det-ar-fullt-mojlig-att-fa-till-storskalig-beteendeforandring/",
    source: "Klimatklubben",
    title: {
      sv: "Sveriges 52 främsta klimatkvinnor",
      en: "Sweden's 52 foremost climate women",
    },
    detail: {
      sv: "Klimatpsykologerna, kollektivet Kata är en del av, finns med på Klimatklubbens lista, som lanserades på Internationella kvinnodagen. Klimatklubben beskriver gruppen som legitimerade psykologer och Sveriges ledande experter på klimatpsykologi.",
      en: "Klimatpsykologerna, the collective Kata is part of, appears on Klimatklubben's list, published on International Women's Day. Klimatklubben describes the group as licensed psychologists and Sweden's leading experts in climate psychology.",
    },
  },
];

/**
 * Media appearances, each with a link so a reader can go and watch, read or
 * listen. Titles are the originals; most of her work is in Swedish and
 * translating a title would send someone looking for something that does not
 * exist under that name.
 *
 * `role` matters and is not decoration. Moderating a panel, running a
 * workshop and being interviewed are different things, and a credibility list
 * that blurs them is overstating.
 */
export type MediaKind = "tv" | "radio" | "print" | "web" | "podcast";
export type MediaRole = "interview" | "moderator" | "workshop" | "contributor";

export type MediaItem = {
  id: string;
  url: string;
  source: string;
  kind: MediaKind;
  role: MediaRole;
  /** Original title, and an English gloss for readers who need one. */
  title: { sv: string; en: string };
  year?: string;
  /** Show on the shorter selections used elsewhere. */
  featured?: boolean;
};

export const media: MediaItem[] = [
  {
    id: "nyhetsmorgon-2023",
    url: "https://www.youtube.com/watch?v=aWYJJdiOPWk",
    source: "Nyhetsmorgon",
    kind: "tv",
    role: "interview",
    year: "2023",
    featured: true,
    title: {
      sv: "Klimatsnack med Kata Nylén",
      en: "Climate talk with Kata Nylén",
    },
  },
  {
    id: "sydsvenskan",
    url: "https://www.sydsvenskan.se/inpa-livet/hon-kande-skuld-over-klimatkrisen-nar-hon-vantade-barn/",
    source: "Sydsvenskan",
    kind: "print",
    role: "interview",
    featured: true,
    title: {
      sv: "Hon kände skuld över klimatkrisen när hon väntade barn",
      en: "She felt guilt about the climate crisis while expecting a child",
    },
  },
  {
    id: "tv4-klimatangest",
    url: "https://www.tv4.se/artikel/1AgItnEkGSb8w1UgQ0kDsg/experten-sa-undviker-du-klimatangest",
    source: "TV4",
    kind: "tv",
    role: "interview",
    year: "2021",
    title: {
      sv: "Experten: Så undviker du klimatångest",
      en: "The expert: how to avoid climate anxiety",
    },
  },
  {
    id: "sveriges-radio-symbolhandling",
    url: "https://www.sverigesradio.se/artikel/star-en-symbolhandling-i-vagen-for-den-verkliga-losningen",
    source: "Sveriges Radio",
    kind: "radio",
    role: "interview",
    /**
     * ⚠️ TITLE UNVERIFIED. Sveriges Radio blocks automated fetching (403), so
     * this is reconstructed from the URL slug rather than read from the page.
     * Confirm the exact headline and which programme it was.
     */
    title: {
      sv: "Står en symbolhandling i vägen för den verkliga lösningen?",
      en: "Does a symbolic act stand in the way of the real solution?",
    },
  },
  {
    id: "vt-vastervik",
    url: "https://www.vt.se/nyheter/klimatet/artikel/vasterviksfodda-kata-tiden-ar-har-for-att-vara-modig/jngy2znl",
    source: "Västerviks-Tidningen",
    kind: "print",
    role: "interview",
    title: {
      sv: "Västerviksfödda Kata: \u201dTiden är här för att vara modig\u201d",
      en: "Västervik-born Kata: \u201cNow is the time to be brave\u201d",
    },
  },
  {
    id: "klimatklubben-intervju",
    url: "https://klimatklubben.se/klimatsnack/kata-nylen-klimatpsykologerna-det-ar-fullt-mojlig-att-fa-till-storskalig-beteendeforandring/",
    source: "Klimatklubben",
    kind: "web",
    role: "interview",
    featured: true,
    title: {
      sv: "Det är fullt möjligt att få till storskalig beteendeförändring",
      en: "Large-scale behavioural change is entirely possible",
    },
  },
  {
    id: "specialistpsykologi",
    url: "https://www.specialistpsykologi.se/kata-nylen-min-professionella-utveckling/",
    source: "Specialistpsykologi",
    kind: "web",
    role: "interview",
    title: {
      sv: "Kata Nylén: min professionella utveckling",
      en: "Kata Nylén: my professional development",
    },
  },
  {
    id: "sustainable-tomorrow-panel",
    url: "https://news.cision.com/se/a-sustainable-tomorrow/r/fran-dissonans-till-resonans-i-hallbarhetsomstallningen,c4036697",
    source: "A Sustainable Tomorrow",
    kind: "web",
    role: "moderator",
    featured: true,
    title: {
      sv: "Från dissonans till resonans i hållbarhetsomställningen",
      en: "From dissonance to resonance in the sustainability transition",
    },
  },
  {
    id: "sustainable-tomorrow-intervju",
    url: "https://asustainabletomorrow.com.se/intervju-kata-nylen/",
    source: "A Sustainable Tomorrow",
    kind: "web",
    role: "interview",
    title: { sv: "Intervju: Kata Nylén", en: "Interview: Kata Nylén" },
  },
  {
    id: "2047-workshop",
    url: "https://www.2047.nu/?view=article&id=543:klimatworkshop-med-kata-nylen&catid=44",
    source: "2047",
    kind: "web",
    role: "workshop",
    title: {
      sv: "Klimatworkshop med Kata Nylén",
      en: "Climate workshop with Kata Nylén",
    },
  },
  {
    id: "syre",
    url: "https://tidningensyre.se/2024/01-maj-2024/spela-dig-fri-fran-klimatangesten/",
    source: "Tidningen Syre",
    kind: "web",
    role: "interview",
    year: "2024",
    title: {
      sv: "Spela dig fri från klimatångesten",
      en: "Play your way free of climate anxiety",
    },
  },
  {
    id: "lulea-energi",
    url: "https://www.luleaenergi.se/arkiv/var-energi-2022/artiklar/hur-ska-vi-orka-bry-oss-om-var-storsta-kris/",
    source: "Luleå Energi",
    kind: "web",
    role: "interview",
    year: "2022",
    title: {
      sv: "Hur ska vi orka bry oss om vår största kris?",
      en: "How can we find the strength to care about our biggest crisis?",
    },
  },
  {
    id: "hallbarhetsutmaningen",
    url: "https://www.youtube.com/watch?v=sWlZ46zH2_M",
    source: "YouTube",
    kind: "web",
    role: "interview",
    title: {
      sv: "Hur kan vi som företag och individer ta oss an hållbarhetsutmaningen",
      en: "How companies and individuals can take on the sustainability challenge",
    },
  },
  {
    id: "greentopia",
    url: "https://greentopia.se/nyheter/kata-nylen-hur-organisationer-kan-oka-sin-hallbarhet-och-sin-forandringskraft/",
    source: "Greentopia",
    kind: "web",
    role: "interview",
    title: {
      sv: "Hur organisationer kan öka sin hållbarhet och sin förändringskraft",
      en: "How organisations can build sustainability and capacity for change",
    },
  },
  {
    id: "ourkidsclimate-guide",
    url: "https://varabarnsklimat.se/wp-content/uploads/2021/05/Talk-about-climate-guide-for-parents.pdf",
    source: "Our Kids' Climate",
    kind: "web",
    role: "contributor",
    year: "2021",
    title: {
      sv: "Talk to children about the climate crisis (guide för föräldrar)",
      en: "Talk to children about the climate crisis: a guide for parents",
    },
  },
  {
    id: "bryta-brod",
    url: "https://poddtoppen.se/podcast/1703802541/bryta-brod/kata-nylen-56-klimatpsykologerna-om-att-hantera-klimatangest-att-skapa-hopp-genom-handling-och-hitta-mening-i-en-varld-i-forandring",
    source: "Bryta Bröd",
    kind: "podcast",
    role: "interview",
    featured: true,
    title: {
      sv: "Klimatpsykologerna om att hantera klimatångest, skapa hopp genom handling och hitta mening i en värld i förändring",
      en: "On managing climate anxiety, creating hope through action, and finding meaning in a changing world",
    },
  },
  {
    id: "klimatekot",
    url: "https://poddkoll.se/podcast/klimatekot?episode=psykologisk-resiliens-med-kata-nylen&d=hm0g3c6i",
    source: "Klimatekot",
    kind: "podcast",
    role: "interview",
    title: {
      sv: "Psykologisk resiliens med Kata Nylén",
      en: "Psychological resilience with Kata Nylén",
    },
  },
  {
    id: "mind",
    url: "https://mind.se/podcast/hur-hanterar-du-din-klimatoro/",
    source: "Mind",
    kind: "podcast",
    role: "interview",
    title: {
      sv: "Hur hanterar du din klimatoro?",
      en: "How do you handle your climate worry?",
    },
  },
  {
    id: "bvcpodden",
    url: "https://bvcpodden.fireside.fm/guests/katanylen",
    source: "BVC-podden",
    kind: "podcast",
    role: "interview",
    title: {
      sv: "Klimatångest: ge barnen chansen att vara delaktiga",
      en: "Climate anxiety: give children the chance to take part",
    },
  },
  {
    id: "lara-fran-larda",
    url: "https://larafranlarda.com/klimatpsykologi-kata-nylen/",
    source: "Lära från Lärda",
    kind: "podcast",
    role: "interview",
    title: { sv: "Klimatpsykologi", en: "Climate psychology" },
  },
  {
    id: "innovate019",
    url: "https://innovate019.podbean.com/e/utkast-kata-nylen/",
    source: "Bryt Motståndet",
    kind: "podcast",
    role: "interview",
    title: {
      sv: "Vägen till hållbara och cirkulära affärer",
      en: "The road to sustainable and circular business",
    },
  },
];

/**
 * The bare hostname of a URL, for "opens example.com in a new tab".
 *
 * These descriptions used to be written out per link in the content files,
 * which meant adding an organisation meant remembering to add its sentence
 * too, in two languages.
 */
export function hostOf(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "");
  } catch {
    return url;
  }
}

/** §1 / §9: the organisations Kata works through. These URLs are confirmed. */
export type Organisation = {
  id: string;
  name: string;
  url: string;
  /**
   * What the thing actually is.
   *
   * This exists because "collective" was doing duty for all of them and SNAP
   * is not one. Kata was explicit: SNAP is a programme and an area of her
   * work, not a collective of psychologists, even though she works on it with
   * colleagues. Calling it a collective would misdescribe it.
   */
  kind: "collective" | "company" | "programme";
  /** Kata's own relationship to it. Absent where she has not confirmed one. */
  role?: { sv: string; en: string };
  /** What it does, and what her work in it involves. */
  description?: { sv: string; en: string };
};

/**
 * The organisations and programmes Kata works through, alongside her own
 * practice. Confirmed by her on 28 Sep 2026, with the descriptions largely in
 * her own words.
 *
 * Ordered to match the site's emphasis: the organisational change work leads,
 * because that is the thread she asked the site to carry.
 */
export const organisations: Organisation[] = [
  {
    id: "shift-collective",
    name: "SHIFT Collective",
    url: "https://www.shiftcollective.se/",
    kind: "company",
    /*
      ⚠️ Kata wrote "I founded SHIFT Collective" in her notes, but her own
      draft bio says "medgrundare av Klimatpsykologerna, SNAP Sverige och
      SHIFT Collective". Founder and co-founder are different claims, and the
      difference matters to whoever else founded it, so this uses the more
      modest of the two until she confirms which is right.
    */
    role: { sv: "Medgrundare", en: "Co-founder" },
    description: {
      sv: "Organisationsutveckling och förändringsledning. Här ligger arbetet med hur organisationer förändras i praktiken.",
      en: "Organisational development and change leadership. This is where the work on how organisations actually change sits.",
    },
  },
  {
    id: "snap-sverige",
    name: "SNAP Sverige",
    url: "https://snap.nu/",
    kind: "programme",
    role: { sv: "Medgrundare", en: "Co-founder" },
    /*
      Her own wording, used as she sent it. The second paragraph names Malmö
      and Lerum: she confirmed the municipalities and the existence of the
      pilots are public, and asked that the site stay at that level. So no
      individual cases, no outcome claims, nothing about specific children or
      families. Do not add any.
    */
    description: {
      sv: "Kata arbetar med att implementera SNAP (Stop Now And Plan) i Sverige, inom socialtjänst och skola. Arbetet omfattar anpassning till svensk kontext, utbildning och handledning av yrkesverksamma samt stöd för att metoden ska fungera och hålla över tid i verksamheten. SNAP är ett program för barn och familjer som syftar till att förebygga normbrytande beteenden. Programmet har piloterats inom socialtjänsten i Malmö, och SNAP i skolan har introducerats i Lerum.",
      en: "Kata works on implementing SNAP (Stop Now And Plan) in Sweden, in social services and in schools. That covers adapting the material to the Swedish context, training and supervising practitioners, and supporting the method so it works and holds over time in practice. SNAP is a programme for children and families aimed at preventing antisocial behaviour. It has been piloted in social services in Malmö, and SNAP i skolan has been introduced in Lerum.",
    },
  },
  {
    id: "klimatpsykologerna",
    name: "Klimatpsykologerna",
    url: "https://www.klimatpsykologerna.se/",
    kind: "collective",
    role: { sv: "Medgrundare", en: "Co-founder" },
    description: {
      sv: "Klimatpsykologi. Kollektivet arbetar med de psykologiska sidorna av klimatkrisen och omställningen.",
      en: "Climate psychology. The collective works on the psychological side of the climate crisis and the transition.",
    },
  },
  {
    /*
      ⚠️ NEEDS KATA'S CONFIRMATION, and there are three reasons to ask.

      She did not mention Climate Psyched when she listed the organisations
      she works through, though it came from the original brief and has been
      on the site since the start. Their own site does not name her anywhere.
      And they publish "Klimatpsykologi", the same book Klimatpsykologerna
      did, so this may be that collective's English-language presence rather
      than a separate affiliation.

      Kept for now, because removing an affiliation nobody asked us to remove
      is worse than carrying one with a question against it. But it claims no
      role for her: the description below is the organisation's account of
      itself, taken from their homepage, and says nothing about what Kata does
      there. Add a role only when she confirms one.
    */
    id: "climate-psyched",
    name: "Climate Psyched",
    url: "https://www.climatepsyched.org/",
    kind: "collective",
    description: {
      sv: "En organisation av legitimerade psykologer som arbetar med klimatpsykologi och beteendeförändring, genom webbinarier, föreläsningar, workshops och rådgivning.",
      en: "An organisation of licensed psychologists working on climate psychology and behavioural change, through webinars, lectures, workshops and consultation.",
    },
  },
];

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

/**
 * The handful of media items that count as evidence on the Speaking page.
 *
 * An organiser arriving there is asking one question: has she done this, at
 * the level I am booking for? So the chairing and workshop credits lead, since
 * they are the ones that match what is being booked. An interview shows she is
 * asked for her view, which is worth one slot and no more.
 *
 * Deliberately a short selection rather than the whole list. The Media page is
 * the archive; repeating it here made the same links read twice and turned a
 * credential list into link-stuffing.
 *
 * Chosen by role rather than by id, so a new moderating credit from Kata
 * surfaces on its own instead of waiting for someone to remember this file.
 */
const SPEAKING_ROLE_RANK: Record<MediaRole, number> = {
  moderator: 0,
  workshop: 1,
  interview: 2,
  contributor: 3,
};

export function speakingCredentials(limit = 3): MediaItem[] {
  return [...media]
    .sort((a, b) => {
      const byRole = SPEAKING_ROLE_RANK[a.role] - SPEAKING_ROLE_RANK[b.role];
      if (byRole !== 0) return byRole;
      // Within a role, anything we have already marked as a highlight wins.
      return Number(Boolean(b.featured)) - Number(Boolean(a.featured));
    })
    .slice(0, limit);
}

/**
 * Cardinal numbers as words, for counts that appear inside a sentence.
 *
 * Digits read as clinical in prose ("4 egna böcker"), and the numbers here are
 * always small. Falls back to the digit above the range rather than throwing,
 * since a slightly plain sentence beats a crashed page.
 */
const NUMBER_WORDS: Record<"sv" | "en", string[]> = {
  sv: ["noll", "en", "två", "tre", "fyra", "fem", "sex", "sju", "åtta", "nio", "tio"],
  en: ["no", "one", "two", "three", "four", "five", "six", "seven", "eight", "nine", "ten"],
};

export function numberWord(n: number, locale: "sv" | "en"): string {
  return NUMBER_WORDS[locale][n] ?? String(n);
}

/**
 * How many publications of each kind there are.
 *
 * Counted rather than written into the copy. "Fem titlar" was wrong by one and
 * counted a chapter contribution as a book Kata wrote, which overstates what
 * she did. A sentence that counts its own list cannot drift away from it, and
 * the next publication she sends updates the prose for free.
 */
export function publicationCounts(): { authored: number; chapters: number } {
  return {
    authored: publications.filter((p) => p.role === "author").length,
    chapters: publications.filter((p) => p.role === "chapter").length,
  };
}

/**
 * The books intro with its count filled in, in the page's own language.
 *
 * Only the authored books are counted. Chapter contributions are described
 * rather than numbered, partly because Kata asked for them to read as
 * contributions rather than as books she wrote, and partly because a count of
 * one would need singular and plural forms of the noun in both languages for
 * a single sentence. A test keeps the authored count above one so the plural
 * here stays grammatical.
 */
export function booksIntroFor(locale: "sv" | "en", template: string): string {
  const { authored } = publicationCounts();
  const filled = template.replace("{authored}", numberWord(authored, locale));
  // The placeholder opens the sentence, and the number words are lowercase,
  // so without this the paragraph begins "fyra egna böcker".
  return filled.charAt(0).toUpperCase() + filled.slice(1);
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
