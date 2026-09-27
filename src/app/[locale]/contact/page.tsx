import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { person, isResolved } from "@/content/facts";
import { Container, Section } from "@/components/primitives";
import { ContactForm } from "@/components/ContactForm";
import { TodoNote } from "@/components/TodoNote";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { contact } = getContent(locale);
  return {
    title: contact.seo.title,
    description: contact.seo.description,
    alternates: {
      canonical: getPathname({ locale, href: "/contact" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/contact" }),
        en: getPathname({ locale: "en", href: "/contact" }),
        "x-default": getPathname({ locale: "sv", href: "/contact" }),
      },
    },
    openGraph: {
      title: contact.seo.title,
      description: contact.seo.description,
    },
  };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContent(locale);
  const email = isResolved(person.email) ? person.email : null;

  return (
    <>
      <Container className="py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl">{content.contact.hero.heading}</h1>
        <p className="mt-6 max-w-[var(--measure)] text-lg text-[var(--color-ink-muted)]">
          {content.contact.hero.standfirst}
        </p>
      </Container>

      <Section id="form">
        <ContactForm forms={content.forms} reasons={content.contact.reasons} />
      </Section>

      <Section id="direct" heading={content.contact.directEmailHeading} tone="sunken">
        {email ? (
          <a
            href={`mailto:${email}`}
            className="inline-flex min-h-6 items-center underline underline-offset-4"
          >
            {email}
          </a>
        ) : (
          <TodoNote>
            Ask Kata whether she wants a public email address
            (<code>person.email</code>). If not, remove this section entirely.
          </TodoNote>
        )}
      </Section>
    </>
  );
}
