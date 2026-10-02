import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname, Link } from "@/i18n/navigation";
import { Container, Section, Prose, ExternalAnchor } from "@/components/primitives";
import { recognition, speakingCredentials, furtherClients } from "@/content/facts";

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

/**
 * The small caps label above each entry. No icon beside it: the media-kind
 * glyphs would have put the same browser-window icon on two of the three
 * entries, which reads as a bug, and the role is the part that carries
 * meaning here anyway.
 */
const LABEL =
  "text-xs uppercase tracking-[0.12em] text-[var(--color-ink-muted)]";

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
        Real work she has done, described without the client. Kata supplied
        these and asked that no client be named until she has approved it, so
        the entries carry the format and the subject and nothing else. That is
        also the more useful half for a booker: what the session was, not who
        bought it.
      */}
      <Section ornament id="examples" heading={speaking.examples.heading}>
        <Prose>
          <p>{speaking.examples.intro}</p>
        </Prose>
        <ul className="mt-8 grid max-w-3xl gap-6 sm:grid-cols-2">
          {speaking.examples.items.map((item) => (
            <li key={item.id} className="border-t border-[var(--color-line)] pt-4">
              <p className={LABEL}>{item.label}</p>
              <p className="mt-1 text-[var(--color-ink-muted)]">{item.description}</p>
            </li>
          ))}
        </ul>

        {/*
          The rest of the client list, as names rather than logos.

          Deliberately not logos: Kata approved being named, which is not the
          same as licensing anyone's trademark, several of these are public
          bodies with strict identity rules, and a political party's logo would
          read as alignment rather than as a piece of paid work. Names set in
          the site's own type also age better than a wall of mismatched marks.
        */}
        <div className="mt-12 max-w-3xl border-t border-[var(--color-line)] pt-6">
          <h3 className={LABEL}>{speaking.examples.furtherHeading}</h3>
          {/*
            Commas rather than middle dots. A dot sits in its own box, so when
            the row wraps the separator lands at the start of the next line and
            several lines began with a stray mark. A comma is part of the name
            before it and always breaks in the right place.
          */}
          <ul className="mt-3 flex flex-wrap gap-x-1.5 gap-y-1 text-[var(--color-ink-muted)]">
            {furtherClients.map((client, index) => (
              <li key={client.id}>
                {client.name[locale]}
                {index < furtherClients.length - 1 ? "," : null}
              </li>
            ))}
          </ul>
          <p className="mt-3 text-sm text-[var(--color-ink-muted)]">
            {speaking.examples.furtherNote}
          </p>
        </div>
      </Section>

      {/*
        Credibility. Deliberately empty: brief §11 says "Never fabricate client
        logos or testimonials." The section renders only its heading until real,
        verified material is supplied.
      */}
      {/*
        Background. A conference organiser wants evidence she has done this
        before, so the same verified recognition and coverage that sits on the
        About page appears here, where it does a different job.
      */}
      <Section ornament id="credibility" heading={speaking.credibility.heading}>
        <Prose>
          <p>{speaking.credibility.intro}</p>
        </Prose>

        <ul className="mt-6 max-w-2xl space-y-5">
          {recognition.map((item) => (
            <li key={item.id}>
              <p className={LABEL}>{speaking.credibility.recognitionLabel}</p>
              <ExternalAnchor href={item.url}>{item.title[locale]}</ExternalAnchor>
              <span className="text-[var(--color-ink-muted)]"> · {item.source}</span>
              <p className="mt-1 max-w-[var(--measure)] text-sm text-[var(--color-ink-muted)]">
                {item.detail[locale]}
              </p>
            </li>
          ))}
          {/*
            A short, role-led selection rather than every featured item. What
            an organiser needs to know is what Kata actually did: chairing a
            panel and being interviewed are not the same credential, and the
            role is the part the Media page does not show. Listing all of them
            here just repeated that page's links and read as padding.
          */}
          {speakingCredentials().map((item) => (
            <li key={item.id}>
              <p className={LABEL}>{speaking.credibility.roles[item.role]}</p>
              <ExternalAnchor href={item.url}>{item.title[locale]}</ExternalAnchor>
              <span className="text-[var(--color-ink-muted)]"> · {item.source}</span>
            </li>
          ))}
        </ul>

        <p className="mt-6 flex flex-wrap gap-x-6 gap-y-2">
          <Link href="/media" className="underline underline-offset-4">
            {getContent(locale).media.viewAllLabel}
          </Link>
          <Link href="/about" className="underline underline-offset-4">
            {getContent(locale).footer.aboutLabel}
          </Link>
        </p>
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
