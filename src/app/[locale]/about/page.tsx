import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname, Link } from "@/i18n/navigation";
import {
  person,
  publications,
  collectives,
  recognition,
  media,
  resolved,
} from "@/content/facts";
import { Container, Section, Prose, ExternalAnchor } from "@/components/primitives";
import { iconForProfile, labelForProfile } from "@/components/SocialIcons";
import { TodoNote } from "@/components/TodoNote";

/**
 * The deep page about Kata.
 *
 * Kept out of the main navigation and linked from the footer, but written to
 * be read. A page built only for crawlers and hidden from people is a doorway
 * page and is penalised; depth is rewarded, concealment is not. So everything
 * here is real and useful to a human, and the search value follows from that.
 *
 * Every claim is drawn from confirmed sources: the books and their publishers,
 * the collectives the brief supplied, and the content of the new book itself.
 * Nothing asserts credentials, clients or standing that has not been verified
 * (brief §21.3, §11).
 */

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const copy = getContent(locale).about;
  return {
    title: copy.seo.title,
    description: copy.seo.description,
    alternates: {
      canonical: getPathname({ locale, href: "/about" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/about" }),
        en: getPathname({ locale: "en", href: "/about" }),
        "x-default": getPathname({ locale: "sv", href: "/about" }),
      },
    },
    openGraph: {
      type: "profile",
      title: copy.seo.title,
      description: copy.seo.description,
    },
  };
}

export default async function AboutPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getContent(locale).about;
  const portrait = resolved(person.portrait);
  const authored = publications.filter((p) => p.role === "author");

  return (
    <>
      <Container className="py-14 sm:py-20">
        <div className="grid items-start gap-10 sm:grid-cols-[1.4fr_0.6fr] sm:gap-14">
          <div>
            <h1 className="text-4xl sm:text-5xl">{copy.hero.heading}</h1>
            <p className="mt-6 max-w-[var(--measure)] text-lg text-[var(--color-ink-muted)]">
              {copy.hero.standfirst}
            </p>
          </div>
          {portrait ? (
            <Image
              src={portrait.src}
              alt={portrait.alt[locale]}
              width={portrait.width}
              height={portrait.height}
              sizes="(min-width: 640px) 28vw, 100vw"
              className="max-h-[40vh] w-full rounded-xl object-cover object-top sm:max-h-none"
            />
          ) : null}
        </div>
      </Container>

      <Section ornament id="intro" heading={copy.intro.heading}>
        <Prose>
          {copy.intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>
        <TodoNote>
          Still unverified and therefore absent: her professional title and
          qualifications, where she trained, and any organisational clients.
          Brief §21.3 forbids inventing these, and naming a company needs both
          Kata&apos;s confirmation and theirs.
        </TodoNote>
      </Section>

      {/* The substance of the page, and where its search value comes from. */}
      <Section ornament id="fields" heading={copy.fieldsHeading} tone="sunken">
        <div className="grid gap-8 sm:grid-cols-2">
          {copy.fields.map((field) => (
            <article key={field.id}>
              <h3 className="text-lg">{field.title}</h3>
              <p className="mt-2 max-w-[var(--measure)] text-[var(--color-ink-muted)]">
                {field.description}
              </p>
            </article>
          ))}
        </div>
      </Section>

      <Section ornament id="framework" heading={copy.frameworkHeading}>
        <Prose>
          <p>{copy.framework.intro}</p>
        </Prose>
        <ol className="mt-6 max-w-2xl">
          {copy.framework.steps.map((step) => (
            <li
              key={step.title}
              /*
                Grid, not flex-wrap. With wrapping, a row broke onto two lines
                only when its description happened to be long, so some sat
                inline and others did not. A grid keeps every term in the same
                column and every description aligned beside it.
              */
              className="grid gap-x-5 gap-y-1 border-b border-[var(--color-line)] py-3 sm:grid-cols-[11rem_1fr]"
            >
              <span className="font-semibold" lang="sv">
                {step.title}
              </span>
              <span className="text-[var(--color-ink-muted)]">{step.description}</span>
            </li>
          ))}
        </ol>
        <Prose>
          <p className="mt-6">{copy.framework.closing}</p>
        </Prose>
      </Section>

      <Section ornament id="books" heading={copy.booksHeading} tone="sunken">
        <Prose>
          <p>{copy.booksIntro}</p>
        </Prose>
        <ul className="mt-6 max-w-2xl space-y-3">
          {authored.map((publication) => (
            <li key={publication.id}>
              <ExternalAnchor href={publication.url}>
                <span lang={locale === "en" && publication.titleEn ? "en" : "sv"}>
                  {locale === "en" && publication.titleEn
                    ? publication.titleEn
                    : publication.title}
                </span>
              </ExternalAnchor>
              <span className="text-[var(--color-ink-muted)]">
                {publication.year ? ` · ${publication.year}` : ""} · {publication.publisher}
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-6">
          <Link
            href={copy.booksCta.href}
            className="inline-block border border-[var(--color-ink)] px-5 py-2.5"
          >
            {copy.booksCta.label}
          </Link>
        </p>
      </Section>

      <Section ornament id="speaking" heading={copy.speakingHeading}>
        <Prose>
          <p>{copy.speakingBody}</p>
        </Prose>
        <p className="mt-6">
          <Link href={copy.speakingCta.href} className="underline underline-offset-4">
            {copy.speakingCta.label}
          </Link>
        </p>
      </Section>

      <Section ornament id="collective" heading={copy.collectiveHeading} tone="sunken">
        <Prose>
          <p>{copy.collectiveBody}</p>
        </Prose>
        <ul className="mt-4 space-y-2">
          {collectives.map((collective) => (
            <li key={collective.id}>
              <ExternalAnchor href={collective.url}>{collective.name}</ExternalAnchor>
            </li>
          ))}
        </ul>
      </Section>

      {/*
        Recognition, attributed rather than asserted. Klimatklubben's list
        names the collective, not Kata individually, and "Sweden's leading
        experts" is their description of the group. Both are stated that way
        and linked, so a reader can check them. An attributed claim someone
        can verify carries more weight than one we make about ourselves.
      */}
      {recognition.length > 0 ? (
        <Section ornament id="recognition" heading={copy.recognitionHeading}>
          <ul className="max-w-2xl space-y-6">
            {recognition.map((item) => (
              <li key={item.id}>
                <h3 className="text-lg">
                  <ExternalAnchor href={item.url}>{item.title[locale]}</ExternalAnchor>
                </h3>
                <p className="mt-1 text-sm uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                  {item.source}
                </p>
                <p className="mt-2 max-w-[var(--measure)] text-[var(--color-ink-muted)]">
                  {item.detail[locale]}
                </p>
              </li>
            ))}
          </ul>
        </Section>
      ) : null}

      {media.length > 0 ? (
        <Section ornament id="media" heading={copy.mediaHeading} tone="sunken">
          <ul className="max-w-2xl space-y-4">
            {media
              .filter((item) => item.featured)
              .map((item) => (
                <li key={item.id}>
                  <ExternalAnchor href={item.url}>{item.title[locale]}</ExternalAnchor>
                  <span className="text-[var(--color-ink-muted)]"> · {item.source}</span>
                </li>
              ))}
          </ul>
        </Section>
      ) : null}

      <Section ornament id="elsewhere" heading={copy.elsewhereHeading}>
        <Prose>
          <p>{copy.elsewhereBody}</p>
        </Prose>
        <ul className="mt-4 flex flex-wrap items-center gap-5">
          {person.sameAs.map((url) => {
            const Icon = iconForProfile(url);
            return (
              <li key={url}>
                <ExternalAnchor href={url}>
                  <span className="inline-flex items-center gap-2">
                    {Icon ? <Icon className="h-[18px] w-auto shrink-0" /> : null}
                    {labelForProfile(url)}
                  </span>
                </ExternalAnchor>
              </li>
            );
          })}
        </ul>
          <p className="mt-6">
            <Link href="/media" className="underline underline-offset-4">
              {getContent(locale).media.viewAllLabel}
            </Link>
          </p>
      </Section>
    </>
  );
}
