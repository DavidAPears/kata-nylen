import type { SiteContent } from "./types";

/**
 * English copy.
 *
 * Brief §9: current wording is strategic direction, not approved final copy.
 * Treat every string here as a draft for Kata to review and edit.
 *
 * Facts (book title, dates, venue, bio) are NOT here — they live in
 * `facts.ts` so that unconfirmed details cannot be published by accident.
 */
export const en: SiteContent = {
  locale: "en",
  htmlLang: "en",

  nav: {
    home: "Home",
    bookRelease: "Book Release",
    publications: "Publications",
    speaking: "Speaking",
    contact: "Contact",
    languageLabel: "Change language",
    menuLabel: "Menu",
    skipToContent: "Skip to content",
  },

  home: {
    seo: {
      title: "Kata Nylén | Psychologist, author and speaker",
      description:
        "Kata Nylén is a Swedish psychologist, author and speaker working with climate psychology, psychological resilience, behavioural change and how people respond to uncertainty.",
    },
    hero: {
      eyebrow: "Kata Nylén",
      headline: "Psychology for a changing world.",
      standfirst:
        "Psychologist, author and speaker working with climate psychology, resilience and how people and organisations respond to profound change.",
      primaryCta: { label: "Explore Kata's work", href: "/speaking" },
      secondaryCta: { label: "Book release", href: "/book-release" },
    },
    intro: {
      heading: "About Kata",
      body: [
        "Kata Nylén is a Swedish psychologist, author and speaker. Her work sits at the intersection of climate psychology, psychological resilience, behavioural change and the human response to uncertainty.",
        "She writes and speaks about what happens to people, individually and collectively, when the world around them changes faster than the mind expects.",
      ],
    },
    featuredBook: {
      heading: "The new book",
      description:
        "Four movements for meeting hardship without shutting down: listening, loving, collectivising and acting.",
      cta: { label: "Read about the book release", href: "/book-release" },
    },
    areasOfWork: {
      heading: "Areas of work",
      intro:
        "Six connected fields that run through Kata's writing, speaking and professional practice.",
      topics: [
        {
          id: "climate-psychology",
          title: "Climate psychology",
          description:
            "How the climate crisis registers psychologically, and what helps people stay engaged rather than shut down.",
        },
        {
          id: "psychological-resilience",
          title: "Psychological resilience",
          description:
            "What actually sustains people and groups under prolonged pressure, beyond individual coping.",
        },
        {
          id: "behavioural-change",
          title: "Behavioural change",
          description:
            "Why knowing is not doing, and what genuinely moves behaviour at individual and organisational scale.",
        },
        {
          id: "climate-emotions",
          title: "Climate emotions",
          description:
            "Grief, anxiety, anger and hope as information rather than symptoms to be managed away.",
        },
        {
          id: "uncertainty",
          title: "Navigating uncertainty",
          description:
            "How people lead, decide and stay functional inside systemic change they did not choose.",
        },
        {
          id: "organisational",
          title: "Organisational psychology",
          description:
            "Senior teams under pressure, and the relationships that carry an organisation when the load rises.",
        },
      ],
    },
    speakingTeaser: {
      heading: "Speaking",
      body: "Kata speaks at conferences, universities, leadership events and public institutions on the psychology of climate, resilience, behaviour and change.",
      cta: { label: "Speaking topics and enquiries", href: "/speaking" },
    },
    collective: {
      heading: "Collective work",
      body: "Alongside her own practice, Kata works with collectives of psychologists focused on climate and sustainability. Their work is separate from this site and continues in its own right.",
      links: [
        {
          label: "Klimatpsykologerna",
          href: "https://www.klimatpsykologerna.se/",
          description: "Opens klimatpsykologerna.se in a new tab",
        },
        {
          label: "Climate Psyched",
          href: "https://www.climatepsyched.org/",
          description: "Opens climatepsyched.org in a new tab",
        },
      ],
    },
  },

  bookRelease: {
    seo: {
      title: "Book release",
      description:
        "You're invited to the release of Kata Nylén's new book. Reserve your place.",
    },
    hero: {
      eyebrow: "You're invited",
      heading: "Book release",
      dateLabel: "Date",
      timeLabel: "Time",
      venueLabel: "Venue",
      toBeConfirmed: "To be confirmed",
      launchLabel: "Book launch",
      rsvpCta: "Reserve my place",
    },
    invitation: {
      heading: "About the evening",
      body: [
        "An evening to mark the release of the new book: an experience of the book, and an occasion to cultivate psychological resilience together.",
        "You are warmly welcome. Please reserve a place so we know how many to expect.",
      ],
      includesHeading: "The evening holds",
      withLabel: "with",
    },
    aboutBook: {
      heading: "About the book",
      synopsisHeading: "Synopsis",
      themesHeading: "Themes",
      purchaseLabel: "Find the book",
    },
    programme: { heading: "Programme" },
    location: {
      heading: "Location",
      directionsLabel: "Get directions",
      accessibilityHeading: "Accessibility",
    },
    rsvp: {
      heading: "RSVP",
      intro:
        "Reserve your place below. We only use these details for the event itself.",
      addToCalendarLabel: "Add to calendar",
      downloadIcsLabel: "Download .ics file",
      googleCalendarLabel: "Add to Google Calendar",
    },
  },

  speaking: {
    seo: {
      // Titled for what someone booking a speaker actually types. "Speaking"
      // alone describes the page; this describes what she can be booked for.
      title: "Speaker on climate psychology and resilience",
      description:
        "Keynotes, workshops, panels and moderated conversations on climate psychology, resilience and behavioural change, for conferences, universities and organisations.",
    },
    hero: {
      heading: "Speaking",
      standfirst:
        "Kata Nylén speaks about the psychology of climate, resilience, behaviour and change.",
    },
    themes: {
      heading: "Selected themes",
      intro:
        "Talks are shaped around the audience rather than delivered from a fixed set. These are the themes they usually draw on.",
      topics: [
        {
          id: "climate-psychology",
          title: "Climate psychology",
          description:
            "What the climate crisis does to how people think, feel and act, and what follows from that for organisations.",
        },
        {
          id: "psychological-resilience",
          title: "Psychological resilience",
          description:
            "Sustaining people through prolonged uncertainty, without reducing resilience to individual endurance.",
        },
        {
          id: "climate-emotions",
          title: "Climate emotions and action",
          description:
            "Why difficult feelings about the climate are a resource rather than an obstacle to action.",
        },
        {
          id: "behavioural-change",
          title: "Behavioural change",
          description:
            "The distance between intention and behaviour, and what closes it in practice.",
        },
        {
          id: "uncertainty",
          title: "Leading through uncertainty",
          description:
            "Decision-making and leadership when the conditions keep moving.",
        },
        {
          id: "organisational",
          title: "Organisational psychology",
          description:
            "What happens between people at work: senior teams under pressure, the relationships that carry an organisation, and what holds when the load rises.",
        },
      ],
    },
    formats: {
      heading: "Formats",
      intro: "Sessions are adapted to the setting and the time available.",
      items: [
        { id: "keynote", title: "Keynote", description: "A single talk for a larger audience." },
        { id: "panel", title: "Panel", description: "Contribution to a moderated discussion." },
        { id: "workshop", title: "Workshop", description: "Longer, participatory work with a group." },
        { id: "conversation", title: "Moderated conversation", description: "An interview or on-stage conversation." },
      ],
    },
    credibility: {
      heading: "Background",
      intro: "A selection of previous engagements. The full list is under Media.",
      roles: {
        moderator: "Moderator",
        workshop: "Workshop",
        interview: "Interview",
        contributor: "Contributor",
      },
      recognitionLabel: "Mention",
    },
    cta: {
      heading: "Interested in inviting Kata?",
      body: "Tell us a little about the event and we'll come back to you.",
      cta: { label: "Speaking enquiry", href: "/contact" },
    },
  },

  publications: {
    seo: {
      title: "Publications",
      description:
        "Books by Kata Nylén on climate psychology, psychological resilience, behavioural change and cognitive behavioural therapy.",
    },
    hero: {
      heading: "Publications",
      standfirst:
        "Books on climate psychology, psychological resilience and behavioural change.",
    },
    booksHeading: "Books",
    chaptersHeading: "Contributions",
    withLabel: "with",
    editorsLabel: "Edited by",
    viewLabel: "At the publisher",
    currentLabel: "New",
    mediaNudge:
      "Kata also appears regularly across television, radio, press and podcasts.",
    mediaNudgeLink: "See where her work has been covered",
  },

  about: {
    seo: {
      // "About Kata Nylén" became "About Kata Nylén | Kata Nylén" once the
      // title template was applied, which spent the whole line saying her
      // name twice.
      title: "About Kata",
      description:
        "Kata Nylén is a Swedish psychologist, author and speaker working on climate psychology, psychological resilience, behavioural change and organisational psychology.",
    },
    hero: {
      heading: "About Kata Nylén",
      standfirst:
        "Psychologist, author and speaker, working on what happens to people when the world around them changes faster than the mind expects.",
    },
    intro: {
      heading: "Her work",
      body: [
        "Kata Nylén is a Swedish psychologist, author and speaker. Her work sits where climate psychology, psychological resilience, behavioural change and organisational psychology meet: not as separate specialisms, but as one question asked from different directions. What happens to people, individually and together, when conditions shift faster than they can absorb, and what actually helps.",
        "She writes and speaks for readers outside the clinic as much as inside it. Her books are published by Natur & Kultur and Studentlitteratur, and are used by practitioners, teachers, leaders and people trying to make sense of their own reactions to a changing world.",
      ],
    },
    fieldsHeading: "The subjects she works on",
    fields: [
      {
        id: "climate-psychology",
        title: "Climate psychology",
        description:
          "How the climate crisis registers psychologically, and why knowing about it does not reliably produce action. Climate psychology looks at what happens between the information and the response: the avoidance, the numbing, the bursts of alarm, and the conditions under which people stay engaged instead of shutting down. Her book Klimatpsykologi, written with Frida Hylander and Kali Andersson, applies this to climate work itself, for people who lead or decide and find that facts alone are not moving anyone.",
      },
      {
        id: "psychological-resilience",
        title: "Psychological resilience",
        description:
          "Resilience as the capacity to stay standing, adapt and keep moving through difficulty while it is still happening, rather than a personality trait some people are lucky enough to have. Her book Psykologisk resiliens argues that it is not carried alone: it is built and maintained in the relationships and contexts people are part of, and it can be deliberately cultivated by groups and teams as well as individuals.",
      },
      {
        id: "climate-emotions",
        title: "Climate emotions",
        description:
          "Grief, anxiety, anger and hope about the state of the world, treated as information rather than symptoms to be managed away. Difficult feelings about the climate are a reasonable response to a real situation; the psychological question is what makes them bearable enough to act on, and what turns them into paralysis instead.",
      },
      {
        id: "behavioural-change",
        title: "Behavioural change",
        description:
          "The distance between intention and behaviour, and what closes it. Why information, urgency and moral pressure so often fail to change what people do, and what the evidence says works instead, at the scale of an individual habit and at the scale of an organisation trying to transform how it operates.",
      },
      {
        id: "uncertainty",
        title: "Navigating uncertainty",
        description:
          "How people decide, lead and stay functional inside change they did not choose and cannot predict. Prolonged uncertainty is psychologically distinct from a single crisis: it does not resolve, and the strategies that carry someone through an acute emergency tend to fail over years.",
      },
      {
        id: "organisational",
        title: "Organisational psychology",
        description:
          "What happens between people at work. Senior teams under sustained pressure, the relationships that hold an organisation together, and what gives way when the load rises. This is where resilience stops being a personal matter and becomes a property of a group and how it is led.",
      },
    ],
    frameworkHeading: "LÄKA",
    framework: {
      intro:
        "Psykologisk resiliens is organised around four movements. Their initials spell LÄKA, which is also the Swedish word for to heal.",
      steps: [
        { title: "Lyssna", description: "Listen. To yourself, and to what your reactions are telling you." },
        { title: "Älska", description: "Love. The relationships and attachments that make difficulty survivable." },
        { title: "Kollektivisera", description: "Collectivise. Move from carrying it alone to carrying it together." },
        { title: "Agera", description: "Act. Do something, at a scale that is actually available to you." },
      ],
      closing:
        "The argument running through it is that resilience is not endurance. It is not about withstanding more; it is about what people build, and build together, so that less has to be withstood alone.",
    },
    booksHeading: "Books",
    // {authored} and {chapters} are filled from the publications list itself,
    // so the sentence can never contradict the books printed under it.
    booksIntro:
      "{authored} books of her own for Natur & Kultur and Studentlitteratur, on climate psychology, resilience, cognitive behavioural therapy in social work, and climate-aware teaching, plus chapters in edited volumes.",
    booksCta: { label: "All publications", href: "/publications" },
    collectiveHeading: "Collective work",
    collectiveBody:
      "Alongside her own practice, Kata works with collectives of psychologists focused on climate and sustainability. Their work is separate from this site and continues in its own right.",
    speakingHeading: "Speaking",
    speakingBody:
      "She speaks at conferences, universities, leadership events and public institutions, and works with organisations on resilience, behavioural change and leading through uncertainty.",
    speakingCta: { label: "Speaking topics and enquiries", href: "/speaking" },
    elsewhereHeading: "Elsewhere",
    elsewhereBody: "Professional profiles and where to book her.",
    recognitionHeading: "Recognition",
    mediaHeading: "Interviews and coverage",
  },

  media: {
    seo: {
      title: "Media",
      description:
        "Kata Nylén in television, press, podcasts and online: interviews and appearances on climate psychology, resilience, climate anxiety and behavioural change.",
    },
    hero: {
      heading: "Media",
      standfirst:
        "Interviews and appearances on climate psychology, resilience and how people respond to a changing world. Most are in Swedish.",
    },
    kinds: {
      tv: "Television",
      radio: "Radio",
      print: "Press",
      podcast: "Podcasts",
      web: "Online",
    },
    roles: {
      moderator: "as moderator",
      workshop: "workshop",
      contributor: "contributor",
    },
    viewAllLabel: "All media",
    jumpIntro: "Jump to",
  },

  contact: {
    seo: {
      title: "Contact",
      description:
        "Get in touch with Kata Nylén about speaking, media, professional collaboration or general enquiries.",
    },
    hero: {
      heading: "Contact",
      standfirst:
        "For speaking, media and professional enquiries. We read everything and reply as soon as we can.",
    },
    reasons: [
      { value: "speaking", label: "Speaking & events" },
      { value: "media", label: "Media & press" },
      { value: "collaboration", label: "Professional collaboration" },
      { value: "general", label: "General enquiry" },
    ],
    directEmailHeading: "Or email directly",
  },

  forms: {
    fields: {
      name: "Name",
      email: "Email",
      organisation: "Organisation",
      guests: "Number of places, including you",
      reason: "Reason for contact",
      message: "Message",
      marketingConsent:
        "I'd like to hear about Kata's future work and events by email.",
    },
    optional: "optional",
    required: "required",
    chooseOption: "Choose an option",
    honeypot: "Leave this field empty",
    privacyNotice: {
      rsvp: "We use your details only to manage your place at the event. We never sell or share them.",
      contact: "We use your details only to answer your enquiry. We never sell or share them.",
    },
    submit: {
      rsvp: "Reserve my place",
      contact: "Send enquiry",
      pending: "Sending…",
    },
    errors: {
      nameRequired: "Please enter your name.",
      emailRequired: "Please enter your email address.",
      emailInvalid: "That doesn't look like a valid email address.",
      messageRequired: "Please enter a message.",
      reasonRequired: "Please choose a reason for contact.",
      guestsRange: "Please enter a valid number of guests.",
      tooLong: "That's longer than we can accept.",
      rateLimited: "Too many attempts. Please wait a moment and try again.",
      server: "Something went wrong at our end. Please try again shortly.",
      summary: "Please check the following:",
    },
    success: {
      rsvpHeading: "You're on the list.",
      rsvpBody:
        "We've sent a confirmation to your email address with the event details.",
      contactHeading: "Thank you. Your message is on its way.",
      contactBody: "We'll come back to you as soon as we can.",
    },
  },

  footer: {
    contactHeading: "Contact",
    collectiveHeading: "Collective work",
    followHeading: "Elsewhere",
    aboutLabel: "About Kata",
    mediaLabel: "Media",
    privacyLabel: "Privacy",
    copyright: "© {year} Kata Nylén",
  },

  notFound: {
    heading: "Page not found",
    body: "The page you were looking for isn't here.",
    cta: { label: "Back to the home page", href: "/" },
  },
};
