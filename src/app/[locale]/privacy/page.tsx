import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getPathname } from "@/i18n/navigation";
import { person, isResolved } from "@/content/facts";
import { Container, Prose } from "@/components/primitives";
import { TodoNote } from "@/components/TodoNote";

/**
 * Brief §16: a concise privacy notice, with exact legal wording to be reviewed
 * before production. The copy below describes what this site *actually* does —
 * it is not boilerplate, and it must be updated if the data flow changes.
 */

const copy = {
  sv: {
    title: "Integritetspolicy",
    description: "Hur personuppgifter hanteras på katanylen.com.",
    intro:
      "Den här sidan beskriver vilka uppgifter vi samlar in och varför. Vi samlar in så lite som möjligt.",
    sections: [
      {
        heading: "Anmälan till bokrelease",
        body: [
          "När du anmäler dig till bokreleasen sparar vi ditt namn, din e-postadress och antal gäster. Uppgifterna används enbart för att hantera din plats och skicka en bekräftelse.",
          "Uppgifterna raderas när evenemanget har genomförts, om du inte separat samtyckt till att få framtida utskick.",
        ],
      },
      {
        heading: "Kontaktformulär",
        body: [
          "Meddelanden du skickar via kontaktformuläret vidarebefordras till Kata via e-post. De lagras inte i någon databas på webbplatsen.",
        ],
      },
      {
        heading: "Utskick",
        body: [
          "Samtycke till utskick är frivilligt, separat från anmälan och aldrig förkryssat. Du kan när som helst be oss ta bort dig.",
        ],
      },
      {
        heading: "Kakor och mätning",
        body: [
          "Webbplatsen sätter inga kakor för spårning eller marknadsföring.",
        ],
      },
      { heading: "Dina rättigheter", body: ["Du har rätt att få veta vilka uppgifter vi har om dig, få dem rättade eller raderade. Kontakta oss så hjälper vi dig."] },
    ],
  },
  en: {
    title: "Privacy",
    description: "How personal data is handled on katanylen.com.",
    intro:
      "This page describes what we collect and why. We collect as little as possible.",
    sections: [
      {
        heading: "Book release RSVP",
        body: [
          "When you reserve a place we store your name, email address and number of guests. This is used only to manage your place and send you a confirmation.",
          "These details are deleted after the event has taken place, unless you separately consented to hear about future work.",
        ],
      },
      {
        heading: "Contact form",
        body: [
          "Messages sent through the contact form are forwarded to Kata by email. They are not stored in a database on this site.",
        ],
      },
      {
        heading: "Marketing",
        body: [
          "Consent to hear from us is optional, separate from registration, and never pre-selected. You can ask to be removed at any time.",
        ],
      },
      {
        heading: "Cookies and measurement",
        body: ["This site sets no tracking or marketing cookies."],
      },
      {
        heading: "Your rights",
        body: [
          "You have the right to know what data we hold about you, and to have it corrected or deleted. Contact us and we will help.",
        ],
      },
    ],
  },
} as const;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: copy[locale].title,
    description: copy[locale].description,
    alternates: {
      canonical: getPathname({ locale, href: "/privacy" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/privacy" }),
        en: getPathname({ locale: "en", href: "/privacy" }),
        "x-default": getPathname({ locale: "sv", href: "/privacy" }),
      },
    },
  };
}

export default async function PrivacyPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const page = copy[locale];
  const email = isResolved(person.email) ? person.email : null;

  return (
    <Container className="py-16 sm:py-20">
      <h1 className="text-4xl">{page.title}</h1>
      <Prose>
        <p className="mt-6">{page.intro}</p>
      </Prose>

      {page.sections.map((section) => (
        <section key={section.heading} className="mt-10">
          <h2 className="text-xl">{section.heading}</h2>
          <Prose>
            {section.body.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </Prose>
        </section>
      ))}

      {email ? (
        <p className="mt-10">
          <a href={`mailto:${email}`} className="underline underline-offset-4">
            {email}
          </a>
        </p>
      ) : null}

      <TodoNote>
        Brief §16: exact legal wording must be reviewed before production, and
        the data-controller contact details confirmed. Retention periods above
        are drafted assumptions — Kata needs to confirm them.
      </TodoNote>
    </Container>
  );
}
