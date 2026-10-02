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
      // This description is the sentence that shows in Google and on every
      // shared link, so it carries the positioning Kata asked for rather than
      // the old climate-first one.
      title: "Kata Nylén | Psychologist, author and speaker",
      description:
        "Licensed psychologist and specialist in organisational psychology, author and speaker. Kata Nylén works on change leadership, implementation and psychological resilience.",
    },
    hero: {
      eyebrow: "Kata Nylén",
      headline: "Psychology for a changing world.",
      // The headline stays exactly as it is. Kata asked for that, and it
      // already carries the new emphasis: "a world in change" read as climate
      // only because everything under it was climate.
      standfirst:
        "Licensed psychologist and specialist in organisational psychology, author and speaker. Kata works on turning knowledge, ambition and decisions into action inside organisations.",
      primaryCta: { label: "Explore Kata's work", href: "/speaking" },
      secondaryCta: { label: "Book release", href: "/book-release" },
    },
    intro: {
      heading: "About Kata",
      body: [
        "Kata Nylén is a licensed psychologist, a specialist in organisational psychology, an author and a speaker. She works on organisational development and change leadership, implementation, behavioural change and psychological resilience.",
        "The thread running through it is the distance between knowing and doing. What needs to change is usually already known; what is missing is what it takes for the change to happen and to hold. Climate psychology is one of the places where that question shows itself most sharply.",
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
        "Six connected fields that run through Kata's work, from how organisations change to the psychology of climate.",
      topics: [
        {
          id: "organisational",
          title: "Organisational psychology and change leadership",
          description:
            "How organisations actually change: senior teams under pressure, the relationships that carry the work, and what holds when the load rises.",
        },
        {
          id: "implementation",
          title: "Implementation",
          description:
            "Making evidence, methods and decisions work in daily practice, long after the decision has been taken.",
        },
        {
          id: "psychological-resilience",
          title: "Psychological resilience",
          description:
            "What actually carries people and groups through sustained pressure, beyond individual coping.",
        },
        {
          id: "behavioural-change",
          title: "Behavioural change",
          description:
            "Why knowing is not doing, and what genuinely shifts behaviour in individuals and organisations.",
        },
        {
          id: "climate-psychology",
          title: "Climate psychology",
          description:
            "How the climate crisis registers psychologically, and what helps people stay engaged rather than shut down.",
        },
        {
          id: "uncertainty",
          title: "Navigating uncertainty",
          description:
            "How people lead, decide and function inside a systemic change they did not choose.",
        },
      ],
    },
    speakingTeaser: {
      heading: "Speaking",
      body: "Kata speaks at conferences, universities, leadership events and public institutions on the psychology of climate, resilience, behaviour and change.",
      cta: { label: "Speaking topics and enquiries", href: "/speaking" },
    },
    organisations: {
      heading: "Organisations and programmes",
      body: "Alongside her own practice, Kata works through several organisations and programmes. Each has its own focus, but the thread is the same: the psychology of making change actually happen.",
      linkDescription: "Opens {site} in a new tab",
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
        // See the Swedish: the one "we" the site keeps, because an event
        // genuinely has hosts and the reader is one of the people being counted.
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
        "Reserve your place below. These details are used only for the event itself.",
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
          id: "organisational",
          title: "Organisational psychology and change leadership",
          description:
            "What happens between people at work: senior teams under pressure, the relationships that carry an organisation, and what holds when the load rises.",
        },
        {
          id: "implementation",
          title: "Implementation",
          description:
            "How evidence, methods and policy get taken up in a service that is already full. Often drawn from the work on SNAP in social services and schools.",
        },
        {
          id: "psychological-resilience",
          title: "Psychological resilience",
          description:
            "Sustaining people through prolonged uncertainty, without reducing resilience to individual endurance.",
        },
        {
          id: "behavioural-change",
          title: "Behavioural change",
          description:
            "The distance between intention and behaviour, and what closes it in practice.",
        },
        {
          id: "climate-psychology",
          title: "Climate psychology",
          description:
            "What the climate crisis does to how people think, feel and act, and what follows from that for organisations.",
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
    examples: {
      heading: "Examples of engagements",
      intro:
        "A selection of work across business, the public sector and civil society.",
      items: [
        {
          id: "svenska-kyrkan",
          label: "Change leadership in practice",
          description:
            "Worked with change leaders within the Church of Sweden to put its climate roadmap into practice across dioceses and parishes, focusing on leading change and building engagement.",
        },
        {
          id: "ledarskap",
          label: "Leadership and change management",
          description:
            "Delivered change management training for business leaders, including at PacsOn and AddLife, focusing on how leaders can create the conditions for change and turn ambitions into practical action.",
        },
        {
          id: "spp",
          label: "Sustainability in customer conversations",
          description:
            "Supported and trained sales and communications teams at SPP to bring sustainability into customer conversations and communicate the company's sustainability work. The assignment combined communication skills training with support for developing new ways of working.",
        },
        {
          id: "kultur",
          label: "Culture and sustainability",
          description:
            "Worked with public institutions including Musikverket and Moderna Museet to develop their sustainability work and explore how art, music and the performing arts can contribute to societal change.",
        },
        {
          id: "radda-barnen",
          label: "Social and psychosocial practice",
          description:
            "Delivered talks for Save the Children Sweden and supported the development and implementation of programmes and models for social and psychosocial practice.",
        },
      ],
      furtherHeading: "Clients also include",
      furtherNote: "Plus talks for bodies within the EU and the UN.",
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
      body: "Tell Kata a little about the event and she will come back to you.",
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
        id: "organisational",
        title: "Organisational psychology and change leadership",
        description:
          "What happens between people at work, and how an organisation actually changes. Senior teams under sustained pressure, the relationships that hold an organisation together, and what gives way when the load rises. This is where resilience stops being a personal matter and becomes a property of a group and how it is led. Change leadership and organisational development sit here too: knowing what needs to change rarely leads on its own to it happening.",
      },
      {
        id: "implementation",
        title: "Implementation",
        description:
          "Making knowledge, methods and decisions work in daily practice, long after the decision has been taken. Kata works on implementing SNAP in social services and schools, and supports organisations through training and practical work on putting evidence, methods and policy into use. The question is rarely whether something is good in itself, but what it takes for it to hold in a service that is already full.",
      },
      {
        id: "psychological-resilience",
        title: "Psychological resilience",
        description:
          "Resilience as the capacity to stay standing, adapt and keep moving through difficulty while it is still happening, rather than a trait some people are lucky enough to have. Psykologisk resiliens argues that it is not carried alone: it is built and maintained in the relationships and settings people belong to, and it can be cultivated deliberately in groups and teams as much as in individuals.",
      },
      {
        id: "behavioural-change",
        title: "Behavioural change",
        description:
          "The distance between intention and behaviour, and what closes it. Why information, urgency and moral pressure so often fail to change what people do, and what the research says works instead, both at the level of habit and in an organisation trying to change how it works.",
      },
      {
        id: "climate-psychology",
        title: "Climate psychology",
        description:
          "How the climate crisis registers psychologically, and why knowing about it does not reliably lead to acting on it. Climate psychology examines what happens between the information and the response: the avoidance, the numbing, the sudden alarm, and the conditions under which people stay engaged rather than shut down. Climate emotions belong here too. Grief, worry, anger and hope about the state of the world are information rather than symptoms to be managed away; the psychological question is what makes them bearable enough to act on. Klimatpsykologi, written with Frida Hylander and Kali Andersson, applies this to climate work itself.",
      },
      {
        id: "uncertainty",
        title: "Navigating uncertainty",
        description:
          "How people decide, lead and function inside a change they did not choose and cannot predict. Prolonged uncertainty is psychologically different from a single crisis: it does not end, and the strategies that carry someone through an acute emergency tend to fail over years.",
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
    organisationsHeading: "Organisations and programmes",
    organisationsBody:
      "Alongside her own practice, Kata works through several organisations and programmes. Each has its own focus, but the thread is the same: the psychology of making change actually happen.",
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
        "For speaking, media and professional enquiries. Kata reads everything and replies as soon as she can.",
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
      rsvp: "Your details are used only to manage your place at the event. They are never sold or shared.",
      contact: "Your details are used only to answer your enquiry. They are never sold or shared.",
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
      tooLong: "That is longer than the form can accept.",
      rateLimited: "Too many attempts. Please wait a moment and try again.",
      server: "Something went wrong. Please try again shortly.",
      summary: "Please check the following:",
    },
    success: {
      rsvpHeading: "You're on the list.",
      rsvpBody:
        "A confirmation has been sent to your email address with the event details.",
      contactHeading: "Thank you. Your message is on its way.",
      contactBody: "Kata will come back to you as soon as she can.",
    },
  },

  footer: {
    contactHeading: "Contact",
    organisationsHeading: "Organisations",
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
