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
        "Five movements for meeting hardship without shutting down: listening, loving, collectivising, acting, and giving and receiving support.",
      cta: { label: "Read about the book release", href: "/book-release" },
    },
    areasOfWork: {
      heading: "Areas of work",
      intro:
        "Five connected fields that run through Kata's writing, speaking and professional practice.",
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
          id: "systemic-change",
          title: "Navigating uncertainty",
          description:
            "How people lead, decide and stay functional inside systemic change they did not choose.",
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
      title: "Speaking",
      description:
        "Kata Nylén speaks about the psychology of climate, resilience, behaviour and change at conferences, universities and organisations.",
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
          id: "resilience",
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
      intro: "Books, previous events and professional background.",
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
        "Books on climate psychology, psychological resilience and behavioural change, written alone and with others.",
    },
    booksHeading: "Books",
    chaptersHeading: "Contributions",
    withLabel: "with",
    editorsLabel: "Edited by",
    viewLabel: "At the publisher",
    currentLabel: "New",
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
    privacyNotice:
      "We use your details only to answer your enquiry or manage your place at the event. We never sell or share them.",
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
    privacyLabel: "Privacy",
    copyright: "© {year} Kata Nylén",
  },

  notFound: {
    heading: "Page not found",
    body: "The page you were looking for isn't here.",
    cta: { label: "Back to the home page", href: "/" },
  },
};
