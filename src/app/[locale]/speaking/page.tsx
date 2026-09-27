import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname, Link } from "@/i18n/navigation";
import { Container, Section, Prose } from "@/components/primitives";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { speaking } = getContent(locale);
  return {
    title: speaking.seo.title,
    description: speaking.seo.description,
    alternates: {
      canonical: getPathname({ locale, href: "/speaking" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/speaking" }),
        en: getPathname({ locale: "en", href: "/speaking" }),
        "x-default": getPathname({ locale: "sv", href: "/speaking" }),
      },
    },
    openGraph: {
      title: speaking.seo.title,
      description: speaking.seo.description,
    },
  };
}

export default async function SpeakingPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { speaking } = getContent(locale);

  return (
    <>
      <Container className="py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl">{speaking.hero.heading}</h1>
        <p className="mt-6 max-w-[var(--measure)] text-lg text-[var(--color-ink-muted)]">
          {speaking.hero.standfirst}
        </p>
      </Container>

      <Section ornament id="themes" heading={speaking.themes.heading}>
        <Prose>
          <p>{speaking.themes.intro}</p>
        </Prose>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {speaking.themes.topics.map((topic) => (
            <li key={topic.id} className="border-t border-[var(--color-line)] pt-4">
              <h3 className="text-lg">{topic.title}</h3>
              <p className="mt-1 text-[var(--color-ink-muted)]">{topic.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      <Section ornament id="formats" heading={speaking.formats.heading} tone="sunken">
        <Prose>
          <p>{speaking.formats.intro}</p>
        </Prose>
        <ul className="mt-6 grid gap-4 sm:grid-cols-2">
          {speaking.formats.items.map((item) => (
            <li key={item.id}>
              <h3 className="font-medium">{item.title}</h3>
              <p className="text-[var(--color-ink-muted)]">{item.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/*
        Credibility. Deliberately empty: brief §11 says "Never fabricate client
        logos or testimonials." The section renders only its heading until real,
        verified material is supplied.
      */}
      <Section ornament id="credibility" heading={speaking.credibility.heading}>
        <Prose>
          <p>{speaking.credibility.intro}</p>
        </Prose>
      </Section>

      <Section ornament id="enquiry" heading={speaking.cta.heading} tone="sunken">
        <Prose>
          <p>{speaking.cta.body}</p>
        </Prose>
        <p className="mt-6">
          <Link
            href={speaking.cta.cta.href}
            className="inline-block border border-[var(--color-ink)] px-5 py-2.5 font-medium"
          >
            {speaking.cta.cta.label}
          </Link>
        </p>
      </Section>
    </>
  );
}
