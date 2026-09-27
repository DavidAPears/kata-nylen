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
    publications: "Publikationer",
    speaking: "Föreläsningar",
    contact: "Kontakt",
    languageLabel: "Byt språk",
    menuLabel: "Meny",
    skipToContent: "Hoppa till innehåll",
  },

  home: {
    seo: {
      title: "Kata Nylén | Psykolog, författare och föreläsare",
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
        "Hon skriver och talar om vad som händer med människor, enskilt och tillsammans, när världen omkring dem förändras snabbare än vad tanken hinner med.",
      ],
    },
    featuredBook: {
      heading: "Den nya boken",
      description:
        "Fem rörelser för att möta motgång utan att stänga av: att lyssna, älska, kollektivisera, agera och att ge och ta emot stöd.",
      cta: { label: "Läs om bokreleasen", href: "/book-release" },
    },
    areasOfWork: {
      heading: "Arbetsområden",
      intro:
        "Sex sammanhängande fält som löper genom Katas texter, föreläsningar och praktik.",
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
            "Vad som faktiskt bär människor och grupper under långvarig press, bortom individuell coping.",
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
          id: "uncertainty",
          title: "Att navigera osäkerhet",
          description:
            "Hur människor leder, beslutar och fungerar inuti en systemförändring de inte valt.",
        },
        {
          id: "organisational",
          title: "Organisationspsykologi",
          description:
            "Ledningsgrupper under press, och relationerna som bär en organisation när belastningen ökar.",
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
      toBeConfirmed: "Meddelas snart",
      launchLabel: "Bokrelease",
      rsvpCta: "Anmäl mig",
    },
    invitation: {
      heading: "Om kvällen",
      body: [
        "En kväll för att fira släppet av den nya boken: en upplevelse av boken och ett tillfälle att odla psykologisk resiliens tillsammans.",
        "Du är varmt välkommen. Anmäl dig gärna så att vi vet hur många vi blir.",
      ],
      includesHeading: "Kvällen innehåller",
      withLabel: "med",
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
            "Vad klimatkrisen gör med hur människor tänker, känner och handlar, och vad det innebär för organisationer.",
        },
        {
          id: "psychological-resilience",
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
        {
          id: "organisational",
          title: "Organisationspsykologi",
          description:
            "Det som händer mellan människor på jobbet: ledningsgrupper under press, relationerna som bär en organisation, och vad som håller när belastningen ökar.",
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
      intro: "Tidigare uppdrag, i urval. Hela listan finns under Medier.",
      roles: {
        moderator: "Moderator",
        workshop: "Workshop",
        interview: "Intervju",
        contributor: "Medverkande",
      },
      recognitionLabel: "Omnämnande",
    },
    cta: {
      heading: "Vill du bjuda in Kata?",
      body: "Berätta kort om sammanhanget så återkommer vi.",
      cta: { label: "Förfrågan om föreläsning", href: "/contact" },
    },
  },

  publications: {
    seo: {
      title: "Publikationer",
      description:
        "Böcker av Kata Nylén om klimatpsykologi, psykologisk resiliens, beteendeförändring och kognitiv beteendeterapi.",
    },
    hero: {
      heading: "Publikationer",
      standfirst:
        "Böcker om klimatpsykologi, psykologisk resiliens och beteendeförändring.",
    },
    booksHeading: "Böcker",
    chaptersHeading: "Bidrag",
    withLabel: "med",
    editorsLabel: "Redaktörer",
    viewLabel: "Hos förlaget",
    currentLabel: "Ny",
    mediaNudge:
      "Kata medverkar också regelbundet i tv, radio, press och poddar.",
    mediaNudgeLink: "Se var hennes arbete har uppmärksammats",
  },

  about: {
    seo: {
      title: "Om Kata Nylén",
      description:
        "Kata Nylén är psykolog, författare och föreläsare inom klimatpsykologi, psykologisk resiliens, beteendeförändring och organisationspsykologi. Författare till Psykologisk resiliens och medförfattare till Klimatpsykologi.",
    },
    hero: {
      heading: "Om Kata Nylén",
      standfirst:
        "Psykolog, författare och föreläsare, med fokus på vad som händer med människor när världen omkring dem förändras snabbare än vad tanken hinner med.",
    },
    intro: {
      heading: "Hennes arbete",
      body: [
        "Kata Nylén är psykolog, författare och föreläsare. Hennes arbete rör sig där klimatpsykologi, psykologisk resiliens, beteendeförändring och organisationspsykologi möts: inte som skilda specialiteter, utan som en och samma fråga ställd från olika håll. Vad händer med människor, var för sig och tillsammans, när förutsättningarna förändras snabbare än de hinner ta in, och vad hjälper faktiskt.",
        "Hon skriver och talar lika mycket för läsare utanför mottagningsrummet som innanför. Böckerna ges ut av Natur & Kultur och Studentlitteratur och används av yrkesverksamma, lärare, ledare och av människor som försöker förstå sina egna reaktioner på en värld i förändring.",
      ],
    },
    fieldsHeading: "Områden hon arbetar med",
    fields: [
      {
        id: "climate-psychology",
        title: "Klimatpsykologi",
        description:
          "Hur klimatkrisen registreras psykologiskt, och varför kunskap om den inte tillförlitligt leder till handling. Klimatpsykologin undersöker det som händer mellan informationen och svaret: undvikandet, avdomningen, de plötsliga larmen, och under vilka förutsättningar människor stannar kvar i engagemang i stället för att stänga av. Boken Klimatpsykologi, skriven tillsammans med Frida Hylander och Kali Andersson, tillämpar detta på klimatarbetet självt, för den som leder eller beslutar och märker att fakta ensamt inte förflyttar någon.",
      },
      {
        id: "psychological-resilience",
        title: "Psykologisk resiliens",
        description:
          "Resiliens som förmågan att stå kvar, anpassa sig och fortsätta röra sig genom svårigheter medan de pågår, snarare än ett personlighetsdrag som vissa har turen att äga. Boken Psykologisk resiliens driver tesen att den inte bärs ensam: den byggs och underhålls i de relationer och sammanhang människor ingår i, och den går att odla medvetet i grupper och team lika väl som hos enskilda.",
      },
      {
        id: "climate-emotions",
        title: "Klimatkänslor",
        description:
          "Sorg, oro, ilska och hopp inför världens tillstånd, behandlade som information snarare än symtom att hantera bort. Svåra känslor inför klimatet är ett rimligt svar på en verklig situation; den psykologiska frågan är vad som gör dem uthärdliga nog att handla utifrån, och vad som i stället förvandlar dem till förlamning.",
      },
      {
        id: "behavioural-change",
        title: "Beteendeförändring",
        description:
          "Avståndet mellan avsikt och beteende, och vad som sluter det. Varför information, brådska och moralisk press så ofta misslyckas med att förändra vad människor gör, och vad forskningen säger fungerar i stället, både på vanans nivå och i en organisation som försöker förändra hur den arbetar.",
      },
      {
        id: "uncertainty",
        title: "Att navigera osäkerhet",
        description:
          "Hur människor beslutar, leder och fungerar inuti en förändring de inte valt och inte kan förutsäga. Långvarig osäkerhet är psykologiskt något annat än en enskild kris: den tar inte slut, och de strategier som bär någon genom en akut nödsituation brukar svikta över år.",
      },
      {
        id: "organisational",
        title: "Organisationspsykologi",
        description:
          "Det som händer mellan människor på jobbet. Ledningsgrupper under ihållande press, relationerna som håller ihop en organisation, och vad som ger vika när belastningen ökar. Det är här resiliens slutar vara en privat angelägenhet och blir en egenskap hos en grupp och hos hur den leds.",
      },
    ],
    frameworkHeading: "LÄKA",
    framework: {
      intro:
        "Psykologisk resiliens är uppbyggd kring fem rörelser. Deras begynnelsebokstäver stavar LÄKA.",
      steps: [
        { title: "Lyssna", description: "På dig själv, och på vad dina reaktioner försöker säga." },
        { title: "Älska", description: "Relationerna och banden som gör svårigheter möjliga att överleva." },
        { title: "Kollektivisera", description: "Från att bära det ensam till att bära det tillsammans." },
        { title: "Agera", description: "Gör något, i en skala som faktiskt är tillgänglig för dig." },
        { title: "Stöd", description: "Att ge det och att ta emot det, vilket är två olika färdigheter." },
      ],
      closing:
        "Tanken som löper genom boken är att resiliens inte är uthållighet. Det handlar inte om att stå ut med mer, utan om vad människor bygger, och bygger tillsammans, så att mindre behöver bäras ensam.",
    },
    booksHeading: "Böcker",
    booksIntro:
      "Fem titlar för Natur & Kultur och Studentlitteratur, om klimatpsykologi, resiliens, kognitiv beteendeterapi i socialt arbete och klimatmedveten undervisning.",
    booksCta: { label: "Alla publikationer", href: "/publications" },
    collectiveHeading: "Kollektivt arbete",
    collectiveBody:
      "Vid sidan av sin egen praktik arbetar Kata i kollektiv av psykologer med fokus på klimat och hållbarhet. Deras arbete är fristående från den här sidan och fortsätter i egen rätt.",
    speakingHeading: "Föreläsningar",
    speakingBody:
      "Hon föreläser på konferenser, universitet, ledarskapsevent och inom offentlig sektor, och arbetar med organisationer kring motståndskraft, beteendeförändring och ledarskap i osäkerhet.",
    speakingCta: { label: "Teman och förfrågningar", href: "/speaking" },
    elsewhereHeading: "Andra platser",
    elsewhereBody: "Professionella profiler och var hon kan bokas.",
    recognitionHeading: "Erkännanden",
    mediaHeading: "Intervjuer och omnämnanden",
  },

  media: {
    seo: {
      title: "I medier",
      description:
        "Kata Nylén i tv, press, poddar och på nätet: intervjuer och medverkan om klimatpsykologi, resiliens, klimatångest och beteendeförändring.",
    },
    hero: {
      heading: "I medier",
      standfirst:
        "Intervjuer och medverkan om klimatpsykologi, resiliens och hur människor möter en värld i förändring.",
    },
    kinds: {
      tv: "Television",
      radio: "Radio",
      print: "Press",
      podcast: "Poddar",
      web: "På nätet",
    },
    roles: {
      moderator: "som moderator",
      workshop: "workshop",
      contributor: "medverkande",
    },
    viewAllLabel: "Allt i medier",
    jumpIntro: "Hoppa till",
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
      guests: "Antal platser, inklusive dig",
      reason: "Anledning till kontakt",
      message: "Meddelande",
      marketingConsent:
        "Jag vill gärna höra om Katas kommande arbete och evenemang via e-post.",
    },
    optional: "valfritt",
    required: "obligatoriskt",
    chooseOption: "Välj ett alternativ",
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
      contactHeading: "Tack. Ditt meddelande är på väg.",
      contactBody: "Vi återkommer så snart vi kan.",
    },
  },

  footer: {
    contactHeading: "Kontakt",
    collectiveHeading: "Kollektivt arbete",
    followHeading: "Andra platser",
    aboutLabel: "Om Kata",
    mediaLabel: "I medier",
    privacyLabel: "Integritetspolicy",
    copyright: "© {year} Kata Nylén",
  },

  notFound: {
    heading: "Sidan hittades inte",
    body: "Sidan du sökte finns inte här.",
    cta: { label: "Till startsidan", href: "/" },
  },
};
