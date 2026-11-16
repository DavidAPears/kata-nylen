import type { Metadata } from "next";
import Image from "next/image";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import {
  book,
  isResolved,
  resolved,
  bookTitleFor,
  bookTitlePlainFor,
  bookSubtitleFor,
} from "@/content/facts";
import { Container, Section, Prose, ExternalAnchor } from "@/components/primitives";
import { TodoNote } from "@/components/TodoNote";
import { BookJsonLd } from "@/components/StructuredData";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { bookRelease } = getContent(locale);
  return {
    title: bookRelease.seo.title,
    description: bookRelease.seo.description,
    alternates: {
      canonical: getPathname({ locale, href: "/book-release" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/book-release" }),
        en: getPathname({ locale: "en", href: "/book-release" }),
        "x-default": getPathname({ locale: "sv", href: "/book-release" }),
      },
    },
    /*
      Its own card, in the book's colourway and carrying the date and venue.
      This link goes out by WhatsApp, LinkedIn and QR code, so for most guests
      the card IS the invitation.
    */
    openGraph: {
      title: bookRelease.seo.title,
      description: bookRelease.seo.description,
      type: "website",
      images: [
        {
          url: `/og/book-release-${locale}.jpg`,
          width: 1200,
          height: 630,
          alt: "Resilienssalong, a book launch with Kata Nylén",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      images: [`/og/book-release-${locale}.jpg`],
    },
  };
}

export default async function BookReleasePage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const content = getContent(locale);
  const { bookRelease } = content;

  const cover = resolved(book.cover);

  return (
    // The book's own colourway, scoped to this page. Everything else on the
    // site keeps the green/brown palette; the leaf and the typeface carry
    // across so the two still read as one identity.
    <div className="theme-book">
      {/*
        Event hero, built to echo the book's chapter openers: the nested leaf
        motif on navy, with the content sitting in the leaf's calm centre.
        The pattern is a background image rather than inline SVG so its 21KB
        of path data is cached separately instead of bloating every request.
      */}
      {/*
        The chapter-opener motif is portrait; a wide hero fights it. So rather
        than stretching or over-zooming it, the pattern gets its own panel at
        its natural proportions on wide screens and the content sits beside it
        on flat navy, which also makes contrast a non-issue.

        On a phone the viewport is already portrait, so the pattern works
        full-bleed behind the content exactly as it does in the book.
      */}
      <div className="relative isolate overflow-hidden bg-[var(--color-book-navy)]">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-center bg-no-repeat sm:hidden"
          style={{
            backgroundImage: "url(/leaf-pattern.svg)",
            backgroundSize: "auto 155%",
          }}
        />
        {cover ? (
          <div className="absolute inset-y-0 left-0 hidden w-[44%] items-center justify-center sm:flex">
            <Image
              src={cover.src}
              alt={cover.alt[locale]}
              width={cover.width}
              height={cover.height}
              priority
              sizes="(min-width: 640px) 30vw, 0px"
              className="max-h-[78%] w-auto rounded-sm shadow-2xl shadow-black/40"
            />
          </div>
        ) : (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-y-0 left-0 hidden w-[44%] bg-cover bg-center sm:block"
            style={{ backgroundImage: "url(/leaf-pattern.svg)" }}
          />
        )}

        <Container className="relative py-24 text-center sm:py-28 sm:text-left">
          <div className="sm:ml-[46%]">
          {/*
            The book title stays the headline: this is a book launch, and the
            title is what people search for. The evening's own name sits above
            it so the page still matches the invitation, which leads with it.
          */}
          {/*
            The launch was on 11 November 2026. This line used to carry the
            evening's name and "Book launch"; now the book exists and the only
            thing worth saying above the title is that you can buy it.
          */}
          <p className="mx-auto mb-5 max-w-[15rem] text-xs uppercase tracking-[0.12em] text-[var(--color-book-orange-text)] sm:mx-0 sm:max-w-none sm:text-sm sm:tracking-[0.25em]">
            {bookRelease.hero.outNow}
          </p>
          {/*
            Two renderings of the same title, one shown at a time.

            On wide screens the cover sits beside this and already shows the
            Swedish title, so repeating it in brackets is clutter: English
            pages get the English title alone. On a phone the cover is not in
            the hero, so the Swedish title leads with the translation in
            brackets, keeping the real, searchable title visible.

            Both use `hidden`, which is display:none, so assistive technology
            reads whichever one is actually shown and never both.
          */}
          <h1 className="mx-auto max-w-[17rem] text-4xl text-[var(--color-book-cream-light)] sm:mx-0 sm:max-w-xl sm:text-5xl">
            <span className="sm:hidden">
              {bookTitleFor(locale) ?? bookRelease.hero.heading}
            </span>
            <span className="hidden sm:inline">
              {bookTitlePlainFor(locale) ?? bookRelease.hero.heading}
            </span>
          </h1>
          {bookSubtitleFor(locale) ? (
            <p className="mx-auto mt-4 max-w-[17rem] text-sm uppercase tracking-[0.12em] text-[var(--color-book-cream)]/80 sm:mx-0 sm:max-w-xl">
              {bookSubtitleFor(locale)}
            </p>
          ) : null}

          </div>
        </Container>
      </div>

      {/* About the book */}
      <Section ornament id="book" heading={bookRelease.aboutBook.heading} tone="sunken">
        {/*
          No cover here any more. The hero above shows it at full size, and
          with the event sections gone the two sat within one screen of each
          other, which reads as a mistake rather than a design.
        */}
        <div>
            <h3 className="text-lg">{bookRelease.aboutBook.synopsisHeading}</h3>
            {isResolved(book.synopsis[locale]) ? (
              <Prose>
                <p>{book.synopsis[locale]}</p>
              </Prose>
            ) : (
              <TodoNote>
                Book synopsis (<code>book.synopsis.{locale}</code>).
              </TodoNote>
            )}

            {book.themes[locale].length > 0 ? (
              <>
                <h3 className="mt-6 text-lg">{bookRelease.aboutBook.themesHeading}</h3>
                <ul className="mt-2 list-disc pl-5 text-[var(--color-ink-muted)]">
                  {book.themes[locale].map((theme) => (
                    <li key={theme}>{theme}</li>
                  ))}
                </ul>
              </>
            ) : null}

            {isResolved(book.purchaseUrl) ? (
              <p className="mt-6">
                <ExternalAnchor href={book.purchaseUrl}>
                  {bookRelease.aboutBook.purchaseLabel}
                </ExternalAnchor>
              </p>
            ) : (
              <TodoNote>
                Publisher / purchase link (<code>book.purchaseUrl</code>). No
                on-site shop for MVP (§21.14).
              </TodoNote>
            )}
        </div>
      </Section>

      {/* No EventJsonLd: the launch has happened, so there is no event to
          describe. BookJsonLd stays, because the book is the page now. */}
      <BookJsonLd locale={locale} />
    </div>
  );
}
