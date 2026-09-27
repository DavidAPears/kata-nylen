import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { book, person, isResolved, resolved, bookTitleFor } from "@/content/facts";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container, Section, Prose, ExternalAnchor } from "@/components/primitives";
import { TodoNote } from "@/components/TodoNote";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const { home } = getContent(locale);
  const portrait = resolved(person.portrait);

  return (
    <>
      {/* Hero */}
      <Container className="py-14 sm:py-20">
        <div className="grid items-center gap-10 sm:grid-cols-[1.1fr_0.9fr] sm:gap-14">
          <div>
            <p className="mb-4 text-sm uppercase tracking-[0.2em] text-[var(--color-ink-muted)]">
              {home.hero.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl lg:text-6xl">{home.hero.headline}</h1>
            <p className="mt-6 max-w-[var(--measure)] text-lg text-[var(--color-ink-muted)]">
              {home.hero.standfirst}
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href={home.hero.primaryCta.href}
                className="border border-[var(--color-ink)] px-5 py-2.5"
              >
                {home.hero.primaryCta.label}
              </Link>
              <Link
                href={home.hero.secondaryCta.href}
                className="px-5 py-2.5 underline underline-offset-4"
              >
                {home.hero.secondaryCta.label}
              </Link>
            </div>
          </div>

          {portrait ? (
            /* Text first on a phone: leading with a photo pushes the headline
               below the fold, so the first screen says nothing about who she
               is. On wider screens they sit side by side. */
            <div>
              <Image
                src={portrait.src}
                alt={portrait.alt[locale]}
                width={portrait.width}
                height={portrait.height}
                // Above the fold and the largest element on the page, so it is
                // the Largest Contentful Paint. Preloading it is the single
                // biggest thing we can do for that metric (brief §15).
                priority
                // Tells the browser how wide it will actually be, so it never
                // downloads the 3151px original for a phone.
                sizes="(min-width: 640px) 42vw, 100vw"
                // Capped on small screens so the portrait supports the
                // headline rather than swamping it.
                className="max-h-[60vh] w-full rounded-xl object-cover sm:max-h-none"
              />
            </div>
          ) : null}
        </div>
        {!portrait ? (
          <TodoNote>
            Approved portrait (<code>person.portrait</code>). Brief §6 wants
            it used prominently here.
          </TodoNote>
        ) : null}
      </Container>

      {/* Introduction */}
      <Section id="about" heading={home.intro.heading}>
        <Prose>
          {home.intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>
        {!isResolved(person.shortBio[locale]) ? (
          <TodoNote>
            Approved {locale === "sv" ? "Swedish" : "English"} short bio
            (<code>person.shortBio.{locale}</code>). The copy above is drafted
            direction, not Kata&apos;s approved biography.
          </TodoNote>
        ) : null}
      </Section>

      {/* Featured book — strongest conversion area during the campaign (§9) */}
      <Section id="book" heading={home.featuredBook.heading} tone="sunken">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
          <div className="flex aspect-[2/3] items-center justify-center border border-dashed border-[var(--color-line)] bg-white text-sm text-[var(--color-ink-muted)]">
            {isResolved(book.cover) ? "cover" : "Book cover"}
          </div>
          <div>
            <h3 className="text-xl">
              {bookTitleFor(locale) ?? home.featuredBook.heading}
            </h3>
            {isResolved(book.subtitle) ? (
              <p className="mt-1 text-sm uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                {book.subtitle}
              </p>
            ) : null}
            <Prose>
              <p>{home.featuredBook.description}</p>
            </Prose>
            <p className="mt-6">
              <Link
                href={home.featuredBook.cta.href}
                className="border border-[var(--color-ink)] px-5 py-2.5 inline-block"
              >
                {home.featuredBook.cta.label}
              </Link>
            </p>
            {!isResolved(book.title) ? (
              <TodoNote>
                Book title, cover asset and synopsis (<code>book.*</code>).
              </TodoNote>
            ) : null}
          </div>
        </div>
      </Section>

      {/* Areas of work */}
      <Section id="areas" heading={home.areasOfWork.heading}>
        <Prose>
          <p>{home.areasOfWork.intro}</p>
        </Prose>
        <ul className="mt-8 grid gap-6 sm:grid-cols-2">
          {home.areasOfWork.topics.map((topic) => (
            <li key={topic.id} className="border-t border-[var(--color-line)] pt-4">
              <h3 className="text-lg">{topic.title}</h3>
              <p className="mt-1 text-[var(--color-ink-muted)]">{topic.description}</p>
            </li>
          ))}
        </ul>
      </Section>

      {/* Speaking teaser */}
      <Section id="speaking" heading={home.speakingTeaser.heading} tone="sunken">
        <Prose>
          <p>{home.speakingTeaser.body}</p>
        </Prose>
        <p className="mt-6">
          <Link href={home.speakingTeaser.cta.href} className="underline underline-offset-4">
            {home.speakingTeaser.cta.label}
          </Link>
        </p>
      </Section>

      {/* Collectives — link out, never duplicate their content (§9) */}
      <Section id="collective" heading={home.collective.heading}>
        <Prose>
          <p>{home.collective.body}</p>
        </Prose>
        <ul className="mt-6 space-y-2">
          {home.collective.links.map((link) => (
            <li key={link.href}>
              <ExternalAnchor href={link.href} description={link.description}>
                {link.label}
              </ExternalAnchor>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
