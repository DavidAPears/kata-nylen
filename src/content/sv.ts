import type { SiteContent } from "./types";

/**
 * Swedish copy.
 *
 * ⚠️  DRAFT — written to give the site working Swedish from day one, but it
 * has NOT been reviewed by a native speaker. Kata should read this file end to
 * end and correct tone as well as wording; Swedish is a first-class language
 * here (brief §21.5), not a translation of the English.
 *
 * Facts live in `facts.ts`, not here.
 */
export const sv: SiteContent = {
  locale: "sv",
  htmlLang: "sv",

  nav: {
    home: "Hem",
    bookRelease: "Bokrelease",
    speaking: "Föreläsningar",
    contact: "Kontakt",
    languageLabel: "Byt språk",
    menuLabel: "Meny",
    skipToContent: "Hoppa till innehåll",
  },

  home: {
    seo: {
      title: "Kata Nylén — Psykolog, författare och föreläsare",
      description:
        "Kata Nylén är psykolog, författare och föreläsare. Hon arbetar med klimatpsykologi, psykologisk motståndskraft, beteendeförändring och hur människor möter osäkerhet.",
    },
    hero: {
      eyebrow: "Kata Nylén",
      headline: "Psykologi för en värld i förändring.",
      standfirst:
        "Psykolog, författare och föreläsare som arbetar med klimatpsykologi, motståndskraft och hur människor och organisationer möter genomgripande förändring.",
      primaryCta: { label: "Utforska Katas arbete", href: "/speaking" },
      secondaryCta: { label: "Bokrelease", href: "/book-release" },
    },
    intro: {
      heading: "Om Kata",
      body: [
        "Kata Nylén är psykolog, författare och föreläsare. Hennes arbete rör sig i skärningspunkten mellan klimatpsykologi, psykologisk motståndskraft, beteendeförändring och människans svar på osäkerhet.",
        "Hon skriver och talar om vad som händer med människor — enskilt och tillsammans — när världen omkring dem förändras snabbare än vad tanken hinner med.",
      ],
    },
    featuredBook: {
      heading: "Den nya boken",
      description:
        "En ny bok om psykologi, klimatkänslor och vad det innebär att fortsätta vårda något medan marken rör sig.",
      cta: { label: "Läs om bokreleasen", href: "/book-release" },
    },
    areasOfWork: {
      heading: "Arbetsområden",
      intro:
        "Fem sammanhängande fält som löper genom Katas texter, föreläsningar och praktik.",
      topics: [
        {
          id: "climate-psychology",
          title: "Klimatpsykologi",
          description:
            "Hur klimatkrisen registreras psykologiskt, och vad som hjälper människor att stanna kvar i engagemang i stället för att stänga av.",
        },
        {
          id: "psychological-resilience",
          title: "Psykologisk motståndskraft",
          description:
            "Vad som faktiskt bär människor och grupper under långvarig press — bortom individuell coping.",
        },
        {
          id: "behavioural-change",
          title: "Beteendeförändring",
          description:
            "Varför vetande inte är görande, och vad som verkligen förflyttar beteende hos individer och organisationer.",
        },
        {
          id: "climate-emotions",
          title: "Klimatkänslor",
          description:
            "Sorg, oro, ilska och hopp som information snarare än symtom att hantera bort.",
        },
        {
          id: "systemic-change",
          title: "Att navigera osäkerhet",
          description:
            "Hur människor leder, beslutar och fungerar inuti en systemförändring de inte valt.",
        },
      ],
    },
    speakingTeaser: {
      heading: "Föreläsningar",
      body: "Kata föreläser på konferenser, universitet, ledarskapsevent och inom offentlig sektor om klimatets psykologi, motståndskraft, beteende och förändring.",
      cta: { label: "Teman och förfrågningar", href: "/speaking" },
    },
    collective: {
      heading: "Kollektivt arbete",
      body: "Vid sidan av sin egen praktik arbetar Kata i kollektiv av psykologer med fokus på klimat och hållbarhet. Deras arbete är fristående från den här sidan och fortsätter i egen rätt.",
      links: [
        {
          label: "Klimatpsykologerna",
          href: "https://www.klimatpsykologerna.se/",
          description: "Öppnar klimatpsykologerna.se i en ny flik",
        },
        {
          label: "Climate Psyched",
          href: "https://www.climatepsyched.org/",
          description: "Öppnar climatepsyched.org i en ny flik",
        },
      ],
    },
  },

  bookRelease: {
    seo: {
      title: "Bokrelease",
      description:
        "Du är varmt välkommen till releasen av Kata Nyléns nya bok. Anmäl dig här.",
    },
    hero: {
      eyebrow: "Välkommen",
      heading: "Bokrelease",
      dateLabel: "Datum",
      timeLabel: "Tid",
      venueLabel: "Plats",
      rsvpCta: "Anmäl mig",
    },
    invitation: {
      heading: "Om kvällen",
      body: [
        "En kväll för att fira släppet av den nya boken — ett samtal, en läsning och tid att prata.",
        "Du är varmt välkommen. Anmäl dig gärna så att vi vet hur många vi blir.",
      ],
    },
    aboutBook: {
      heading: "Om boken",
      synopsisHeading: "Sammanfattning",
      themesHeading: "Teman",
      purchaseLabel: "Hitta boken",
    },
    programme: { heading: "Program" },
    location: {
      heading: "Plats",
      directionsLabel: "Vägbeskrivning",
      accessibilityHeading: "Tillgänglighet",
    },
    rsvp: {
      heading: "Anmälan",
      intro:
        "Anmäl dig nedan. Vi använder bara dina uppgifter för själva evenemanget.",
      addToCalendarLabel: "Lägg till i kalender",
      downloadIcsLabel: "Ladda ner .ics-fil",
      googleCalendarLabel: "Lägg till i Google Kalender",
    },
  },

  speaking: {
    seo: {
      title: "Föreläsningar",
      description:
        "Kata Nylén föreläser om klimatets psykologi, motståndskraft, beteende och förändring för konferenser, universitet och organisationer.",
    },
    hero: {
      heading: "Föreläsningar",
      standfirst:
        "Kata Nylén föreläser om klimatets psykologi, motståndskraft, beteende och förändring.",
    },
    themes: {
      heading: "Utvalda teman",
      intro:
        "Föreläsningarna formas efter sammanhanget snarare än hämtas ur en fast repertoar. Det här är de teman de oftast utgår från.",
      topics: [
        {
          id: "climate-psychology",
          title: "Klimatpsykologi",
          description:
            "Vad klimatkrisen gör med hur människor tänker, känner och handlar — och vad det innebär för organisationer.",
        },
        {
          id: "resilience",
          title: "Psykologisk motståndskraft",
          description:
            "Att bära människor genom långvarig osäkerhet, utan att reducera motståndskraft till individuell uthållighet.",
        },
        {
          id: "climate-emotions",
          title: "Klimatkänslor och handling",
          description:
            "Varför svåra känslor inför klimatet är en resurs snarare än ett hinder för handling.",
        },
        {
          id: "behavioural-change",
          title: "Beteendeförändring",
          description:
            "Avståndet mellan avsikt och beteende, och vad som sluter det i praktiken.",
        },
        {
          id: "uncertainty",
          title: "Ledarskap i osäkerhet",
          description: "Beslut och ledarskap när förutsättningarna hela tiden rör sig.",
        },
      ],
    },
    formats: {
      heading: "Format",
      intro: "Upplägget anpassas efter sammanhanget och tiden som finns.",
      items: [
        { id: "keynote", title: "Keynote", description: "En föreläsning för en större publik." },
        { id: "panel", title: "Panel", description: "Medverkan i ett modererat samtal." },
        { id: "workshop", title: "Workshop", description: "Längre, deltagande arbete med en grupp." },
        { id: "conversation", title: "Modererat samtal", description: "En intervju eller ett samtal på scen." },
      ],
    },
    credibility: {
      heading: "Bakgrund",
      intro: "Böcker, tidigare uppdrag och professionell bakgrund.",
    },
    cta: {
      heading: "Vill du bjuda in Kata?",
      body: "Berätta kort om sammanhanget så återkommer vi.",
      cta: { label: "Förfrågan om föreläsning", href: "/contact" },
    },
  },

  contact: {
    seo: {
      title: "Kontakt",
      description:
        "Kontakta Kata Nylén om föreläsningar, media, professionellt samarbete eller övriga frågor.",
    },
    hero: {
      heading: "Kontakt",
      standfirst:
        "För föreläsningar, media och professionella förfrågningar. Vi läser allt och svarar så snart vi kan.",
    },
    reasons: [
      { value: "speaking", label: "Föreläsningar & event" },
      { value: "media", label: "Media & press" },
      { value: "collaboration", label: "Professionellt samarbete" },
      { value: "general", label: "Övrig fråga" },
    ],
    directEmailHeading: "Eller mejla direkt",
  },

  forms: {
    fields: {
      name: "Namn",
      email: "E-post",
      organisation: "Organisation",
      guests: "Antal gäster",
      reason: "Anledning till kontakt",
      message: "Meddelande",
      marketingConsent:
        "Jag vill gärna höra om Katas kommande arbete och evenemang via e-post.",
    },
    optional: "valfritt",
    required: "obligatoriskt",
    honeypot: "Lämna detta fält tomt",
    privacyNotice:
      "Vi använder dina uppgifter endast för att svara på din fråga eller hantera din plats på evenemanget. Vi säljer eller delar dem aldrig.",
    submit: {
      rsvp: "Anmäl mig",
      contact: "Skicka förfrågan",
      pending: "Skickar…",
    },
    errors: {
      nameRequired: "Fyll i ditt namn.",
      emailRequired: "Fyll i din e-postadress.",
      emailInvalid: "Det ser inte ut som en giltig e-postadress.",
      messageRequired: "Skriv ett meddelande.",
      reasonRequired: "Välj en anledning till kontakt.",
      guestsRange: "Ange ett giltigt antal gäster.",
      tooLong: "Det är längre än vi kan ta emot.",
      rateLimited: "För många försök. Vänta en stund och försök igen.",
      server: "Något gick fel hos oss. Försök igen om en liten stund.",
      summary: "Kontrollera följande:",
    },
    success: {
      rsvpHeading: "Du står på listan.",
      rsvpBody:
        "Vi har skickat en bekräftelse till din e-postadress med detaljerna för kvällen.",
      contactHeading: "Tack — ditt meddelande är på väg.",
      contactBody: "Vi återkommer så snart vi kan.",
    },
  },

  footer: {
    contactHeading: "Kontakt",
    collectiveHeading: "Kollektivt arbete",
    followHeading: "Andra platser",
    privacyLabel: "Integritetspolicy",
    copyright: "© {year} Kata Nylén",
  },

  notFound: {
    heading: "Sidan hittades inte",
    body: "Sidan du sökte finns inte här.",
    cta: { label: "Till startsidan", href: "/" },
  },
};
