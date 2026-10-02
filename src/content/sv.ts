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
      // This description is the sentence that shows in Google and on every
      // shared link, so it carries the positioning Kata asked for rather than
      // the old climate-first one.
      title: "Kata Nylén | Psykolog, författare och föreläsare",
      description:
        "Legitimerad psykolog och specialist i organisationspsykologi, författare och föreläsare. Kata Nylén arbetar med förändringsledning, implementering och psykologisk resiliens.",
    },
    hero: {
      eyebrow: "Kata Nylén",
      headline: "Psykologi för en värld i förändring.",
      // The headline stays exactly as it is. Kata asked for that, and it
      // already carries the new emphasis: "en värld i förändring" read as
      // climate only because everything under it was climate.
      standfirst:
        "Legitimerad psykolog och specialist i organisationspsykologi, författare och föreläsare. Kata arbetar med att få kunskap, ambitioner och beslut att bli handling i organisationer.",
      primaryCta: { label: "Utforska Katas arbete", href: "/speaking" },
      secondaryCta: { label: "Bokrelease", href: "/book-release" },
    },
    intro: {
      heading: "Om Kata",
      body: [
        "Kata Nylén är legitimerad psykolog, specialist i organisationspsykologi, författare och föreläsare. Hon arbetar med organisationsutveckling och förändringsledning, implementering, beteendeförändring och psykologisk resiliens.",
        "Tråden genom arbetet är avståndet mellan att veta och att göra. Det som behöver förändras är ofta känt; det som saknas är vad som krävs för att förändringen ska ske och hålla. Klimatpsykologin är ett av de områden där den frågan blir som tydligast.",
        "Hon skriver och talar om vad som händer med människor, enskilt och tillsammans, när världen omkring dem förändras snabbare än vad tanken hinner med.",
      ],
    },
    featuredBook: {
      heading: "Den nya boken",
      description:
        "Fyra rörelser för att möta motgångar utan att stänga av: att lyssna, älska, kollektivisera och agera.",
      cta: { label: "Läs om bokreleasen", href: "/book-release" },
    },
    areasOfWork: {
      heading: "Arbetsområden",
      intro:
        "Sex sammanhängande fält som löper genom Katas arbete, från hur organisationer förändras till klimatets psykologi.",
      topics: [
        {
          id: "organisational",
          title: "Organisationspsykologi och förändringsledning",
          description:
            "Hur organisationer förändras i praktiken: ledningsgrupper under press, relationerna som bär verksamheten och vad som håller när belastningen ökar.",
        },
        {
          id: "implementation",
          title: "Implementering",
          description:
            "Att få evidens, metoder och beslut att fungera i vardagen, långt efter att beslutet är fattat.",
        },
        {
          id: "psychological-resilience",
          title: "Psykologisk resiliens",
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
          id: "climate-psychology",
          title: "Klimatpsykologi",
          description:
            "Hur klimatkrisen registreras psykologiskt, och vad som hjälper människor att stanna kvar i engagemang i stället för att stänga av.",
        },
        {
          id: "uncertainty",
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
    organisations: {
      heading: "Organisationer och program",
      body: "Vid sidan av sin egen praktik arbetar Kata genom flera organisationer och program. Var och en har sitt eget fokus, men tråden är densamma: psykologin i att få förändring att faktiskt hända.",
      linkDescription: "Öppnar {site} i en ny flik",
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
        // The one "vi" the site keeps. An event has hosts, Kata and Sebastian
        // Ring among them, and "hur många vi blir" counts the reader in. It is
        // a real we, not the phantom company voice removed everywhere else.
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
        "Anmäl dig nedan. Uppgifterna används bara för själva evenemanget.",
      addToCalendarLabel: "Lägg till i kalender",
      downloadIcsLabel: "Ladda ner .ics-fil",
      googleCalendarLabel: "Lägg till i Google Kalender",
    },
  },

  speaking: {
    seo: {
      // Titled for what someone booking a speaker actually types. "Föreläsningar"
      // alone describes the page; this describes what she can be booked for.
      title: "Föreläsare inom klimatpsykologi och resiliens",
      description:
        "Keynote, workshop, panel och modererade samtal om klimatpsykologi, resiliens och beteendeförändring. För konferenser, universitet och organisationer.",
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
          id: "organisational",
          title: "Organisationspsykologi och förändringsledning",
          description:
            "Det som händer mellan människor på jobbet: ledningsgrupper under press, relationerna som bär en organisation, och vad som håller när belastningen ökar.",
        },
        {
          id: "implementation",
          title: "Implementering",
          description:
            "Hur evidens, metoder och policy tas i bruk i en verksamhet som redan är full. Utgår ofta från arbetet med SNAP inom socialtjänst och skola.",
        },
        {
          id: "psychological-resilience",
          title: "Psykologisk resiliens",
          description:
            "Att bära människor genom långvarig osäkerhet, utan att reducera resiliens till individuell uthållighet.",
        },
        {
          id: "behavioural-change",
          title: "Beteendeförändring",
          description:
            "Avståndet mellan avsikt och beteende, och vad som sluter det i praktiken.",
        },
        {
          id: "climate-psychology",
          title: "Klimatpsykologi",
          description:
            "Vad klimatkrisen gör med hur människor tänker, känner och handlar, och vad det innebär för organisationer.",
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
    examples: {
      heading: "Exempel på uppdrag",
      intro:
        "Ett urval av uppdrag inom näringsliv, offentlig sektor och civilsamhälle.",
      items: [
        {
          id: "svenska-kyrkan",
          label: "Förändringsledning i praktiken",
          description:
            "Arbetat tillsammans med förändringsledare inom Svenska kyrkan för att omsätta Färdplan för klimatet i praktiken i stift och församlingar, med fokus på att leda förändring och skapa engagemang.",
        },
        {
          id: "ledarskap",
          label: "Ledarskap och förändringsledning",
          description:
            "Utbildat företagsledare i förändringsledning, bland annat på PacsOn och AddLife, med fokus på hur ledare kan skapa förutsättningar för förändring och omsätta ambitioner i konkret handling.",
        },
        {
          id: "spp",
          label: "Hållbarhet i kunddialogen",
          description:
            "Stöttat och tränat säljare och kommunikatörer på SPP i att lyfta hållbarhet i kunddialogen och kommunicera företagets hållbarhetsarbete. Uppdraget kombinerade kommunikationsträning med stöd för att utveckla nya arbetssätt.",
        },
        {
          id: "kultur",
          label: "Kultur och hållbarhet",
          description:
            "Arbetat med myndigheter som Musikverket och Moderna Museet för att utveckla deras hållbarhetsarbete och utforska hur konst, musik och scenkonst kan bidra till samhällsomställningen.",
        },
        {
          id: "radda-barnen",
          label: "Socialt och psykosocialt arbete",
          description:
            "Hållit föreläsningar för Rädda Barnen och stöttat utveckling och implementering av program och modeller inom socialt och psykosocialt arbete.",
        },
      ],
      furtherHeading: "Fler uppdragsgivare",
      furtherNote: "Därtill föreläsningar för organ inom EU och FN.",
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
      body: "Berätta kort om sammanhanget så återkommer Kata.",
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
      // "Om Kata Nylén" became "Om Kata Nylén | Kata Nylén" once the title
      // template was applied, which spent the whole line saying her name twice.
      title: "Om Kata",
      description:
        "Kata Nylén är psykolog, författare och föreläsare inom klimatpsykologi, psykologisk resiliens, beteendeförändring och organisationspsykologi.",
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
        id: "organisational",
        title: "Organisationspsykologi och förändringsledning",
        description:
          "Det som händer mellan människor på jobbet, och hur en organisation faktiskt förändras. Ledningsgrupper under ihållande press, relationerna som håller ihop en verksamhet, och vad som ger vika när belastningen ökar. Det är här resiliens slutar vara en privat angelägenhet och blir en egenskap hos en grupp och hos hur den leds. Hit hör också förändringsledning och organisationsutveckling: att veta vad som behöver förändras leder sällan av sig självt till att det sker.",
      },
      {
        id: "implementation",
        title: "Implementering",
        description:
          "Att få kunskap, metoder och beslut att fungera i vardagen, långt efter att beslutet är fattat. Kata arbetar med implementeringen av SNAP inom socialtjänst och skola, och stödjer organisationer med utbildning och praktiskt arbete för att införa evidens, metoder och policy. Frågan är sällan om något är bra i sig, utan vad som krävs för att det ska hålla i en verksamhet som redan är full.",
      },
      {
        id: "psychological-resilience",
        title: "Psykologisk resiliens",
        description:
          "Resiliens som förmågan att stå kvar, anpassa sig och fortsätta röra sig genom svårigheter medan de pågår, snarare än ett personlighetsdrag som vissa har turen att äga. Boken Psykologisk resiliens driver tesen att den inte bärs ensam: den byggs och underhålls i de relationer och sammanhang människor ingår i, och den går att odla medvetet i grupper och team lika väl som hos enskilda.",
      },
      {
        id: "behavioural-change",
        title: "Beteendeförändring",
        description:
          "Avståndet mellan avsikt och beteende, och vad som sluter det. Varför information, brådska och moralisk press så ofta misslyckas med att förändra vad människor gör, och vad forskningen säger fungerar i stället, både på vanans nivå och i en organisation som försöker förändra hur den arbetar.",
      },
      {
        id: "climate-psychology",
        title: "Klimatpsykologi",
        description:
          "Hur klimatkrisen registreras psykologiskt, och varför kunskap om den inte tillförlitligt leder till handling. Klimatpsykologin undersöker det som händer mellan informationen och svaret: undvikandet, avdomningen, de plötsliga larmen, och under vilka förutsättningar människor stannar kvar i engagemang i stället för att stänga av. Hit hör också klimatkänslorna. Sorg, oro, ilska och hopp inför världens tillstånd är information snarare än symtom att hantera bort; den psykologiska frågan är vad som gör dem uthärdliga nog att handla utifrån. Boken Klimatpsykologi, skriven tillsammans med Frida Hylander och Kali Andersson, tillämpar detta på klimatarbetet självt.",
      },
      {
        id: "uncertainty",
        title: "Att navigera osäkerhet",
        description:
          "Hur människor beslutar, leder och fungerar inuti en förändring de inte valt och inte kan förutsäga. Långvarig osäkerhet är psykologiskt något annat än en enskild kris: den tar inte slut, och de strategier som bär någon genom en akut nödsituation brukar svikta över år.",
      },
    ],
    frameworkHeading: "LÄKA",
    framework: {
      intro:
        "Psykologisk resiliens är uppbyggd kring fyra rörelser. Deras begynnelsebokstäver stavar LÄKA.",
      steps: [
        { title: "Lyssna", description: "På dig själv, och på vad dina reaktioner försöker säga." },
        { title: "Älska", description: "Relationerna och banden som gör svårigheter möjliga att överleva." },
        { title: "Kollektivisera", description: "Från att bära det ensam till att bära det tillsammans." },
        { title: "Agera", description: "Gör något, i en skala som faktiskt är tillgänglig för dig." },
      ],
      closing:
        "Tanken som löper genom boken är att resiliens inte är uthållighet. Det handlar inte om att stå ut med mer, utan om vad människor bygger, och bygger tillsammans, så att mindre behöver bäras ensam.",
    },
    booksHeading: "Böcker",
    // {authored} and {chapters} are filled from the publications list itself,
    // so the sentence can never contradict the books printed under it.
    booksIntro:
      "{authored} egna böcker för Natur & Kultur och Studentlitteratur, om klimatpsykologi, resiliens, kognitiv beteendeterapi i socialt arbete och klimatmedveten undervisning, samt kapitel i antologier.",
    booksCta: { label: "Alla publikationer", href: "/publications" },
    organisationsHeading: "Organisationer och program",
    organisationsBody:
      "Vid sidan av sin egen praktik arbetar Kata genom flera organisationer och program. Var och en har sitt eget fokus, men tråden är densamma: psykologin i att få förändring att faktiskt hända.",
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
      tv: "TV",
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
        "För föreläsningar, media och professionella förfrågningar. Kata läser allt och svarar så snart hon kan.",
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
    privacyNotice: {
      rsvp: "Dina uppgifter används endast för att hantera din plats på evenemanget. De säljs eller delas aldrig.",
      contact: "Dina uppgifter används endast för att svara på din förfrågan. De säljs eller delas aldrig.",
    },
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
      tooLong: "Det är längre än formuläret kan ta emot.",
      rateLimited: "För många försök. Vänta en stund och försök igen.",
      server: "Något gick fel. Försök igen om en liten stund.",
      summary: "Kontrollera följande:",
    },
    success: {
      rsvpHeading: "Du står på listan.",
      rsvpBody:
        "En bekräftelse har skickats till din e-postadress med detaljerna för kvällen.",
      contactHeading: "Tack. Ditt meddelande är på väg.",
      contactBody: "Kata återkommer så snart hon kan.",
    },
  },

  footer: {
    contactHeading: "Kontakt",
    organisationsHeading: "Organisationer",
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
