import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import {
  book,
  person,
  isResolved,
  resolved,
  bookTitlePlainFor,
  bookSubtitleFor,
  organisations,
  hostOf,
} from "@/content/facts";
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
  const cover = resolved(book.cover);

  return (
    <>
      {/* Hero */}
      <Container className="py-12 sm:py-16">
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
                // Capped at both sizes. Uncapped, the 2:3 portrait ran off
                // the bottom of the fold on a laptop, and since the columns
                // are vertically centred it left a slab of empty space above
                // the headline. object-top keeps her face in frame as it crops.
                className="max-h-[52vh] w-full rounded-xl object-cover object-top sm:max-h-[30rem]"
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
      <Section ornament id="about" heading={home.intro.heading}>
        <Prose>
          {home.intro.body.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </Prose>
      </Section>

      {/* Featured book — strongest conversion area during the campaign (§9) */}
      <Section ornament id="book" heading={home.featuredBook.heading} tone="sunken">
        <div className="grid gap-8 sm:grid-cols-[200px_1fr] sm:items-start">
          {cover ? (
            <Image
              src={cover.src}
              alt={cover.alt[locale]}
              width={cover.width}
              height={cover.height}
              sizes="(min-width: 640px) 200px, 55vw"
              className="w-full rounded-sm shadow-lg shadow-black/15"
            />
          ) : (
            <div className="flex aspect-[2/3] items-center justify-center border border-dashed border-[var(--color-line)] bg-white text-sm text-[var(--color-ink-muted)]">
              Book cover
            </div>
          )}
          <div>
            {/*
              The cover sits beside this at every size here, and already shows
              the Swedish title, so English pages give the English title and
              subtitle with no bracketed translation. Unlike the book-release
              hero, this needs no responsive split, because the cover never
              drops out of view.
            */}
            <h3 className="text-xl">
              {bookTitlePlainFor(locale) ?? home.featuredBook.heading}
            </h3>
            {bookSubtitleFor(locale) ? (
              <p className="mt-1 text-sm uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
                {bookSubtitleFor(locale)}
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
      <Section ornament id="areas" heading={home.areasOfWork.heading}>
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
      <Section ornament id="speaking" heading={home.speakingTeaser.heading} tone="sunken">
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
      {/*
        Names and links only. The detail on what each one is, and what Kata
        does in it, lives on the About page; repeating it here would turn the
        home page into a directory.

        Derived from `organisations` rather than listed again in the content
        files, which is where the old version had drifted: it still showed two
        entries after Kata named three more.
      */}
      <Section ornament id="organisations" heading={home.organisations.heading}>
        <Prose>
          <p>{home.organisations.body}</p>
        </Prose>
        <ul className="mt-6 space-y-2">
          {organisations.map((organisation) => (
            <li key={organisation.id}>
              <ExternalAnchor
                href={organisation.url}
                description={home.organisations.linkDescription.replace(
                  "{site}",
                  hostOf(organisation.url),
                )}
              >
                {organisation.name}
              </ExternalAnchor>
            </li>
          ))}
        </ul>
      </Section>
    </>
  );
}
