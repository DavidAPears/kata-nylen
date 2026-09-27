import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { publications, type Publication } from "@/content/facts";
import Image from "next/image";
import { Link } from "@/i18n/navigation";
import { Container, Section, ExternalAnchor } from "@/components/primitives";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const { publications: copy } = getContent(locale);
  return {
    title: copy.seo.title,
    description: copy.seo.description,
    alternates: {
      canonical: getPathname({ locale, href: "/publications" }),
      languages: {
        sv: getPathname({ locale: "sv", href: "/publications" }),
        en: getPathname({ locale: "en", href: "/publications" }),
        "x-default": getPathname({ locale: "sv", href: "/publications" }),
      },
    },
    openGraph: {
      title: copy.seo.title,
      description: copy.seo.description,
    },
  };
}

/**
 * One entry in the list.
 *
 * Titles stay in Swedish in both languages: these are real published books and
 * that is what they are called, what a reader will search for, and what the
 * publisher's page says. Translating them would send people looking for
 * something that does not exist.
 */
function PublicationEntry({
  publication,
  locale,
  copy,
}: {
  publication: Publication;
  locale: Locale;
  copy: ReturnType<typeof getContent>["publications"];
}) {
  const translated = locale === "en" && Boolean(publication.titleEn);
  const title = translated ? publication.titleEn! : publication.title;
  const subtitle = translated
    ? publication.subtitleEn
    : publication.subtitle;
  // Mark the language honestly so screen readers pronounce it correctly.
  const titleLang = translated ? "en" : "sv";
  const showsTranslatedTitle = translated;

  return (
    <li className="border-t border-[var(--color-line)] py-8">
      <div className="grid gap-6 sm:grid-cols-[132px_1fr] sm:gap-8">
        {publication.cover ? (
          /*
            The cover is the link. It is aria-hidden and not focusable so it
            does not become a second tab stop to the same place; the title link
            below carries the accessible name.
          */
          <a
            href={publication.url}
            target="_blank"
            rel="noopener noreferrer"
            aria-hidden="true"
            tabIndex={-1}
            className="group relative block w-28 shrink-0 overflow-hidden rounded-sm shadow-md shadow-black/15 sm:w-full"
          >
            <Image
              src={publication.cover.src}
              alt=""
              width={publication.cover.width}
              height={publication.cover.height}
              sizes="(min-width: 640px) 132px, 112px"
              className="w-full transition-transform duration-300 group-hover:scale-[1.03]"
            />
            <span className="pointer-events-none absolute inset-0 flex items-end justify-center bg-[var(--color-ink)]/0 p-2 text-center text-xs font-medium text-white opacity-0 transition-all duration-200 group-hover:bg-[var(--color-ink)]/55 group-hover:opacity-100">
              {copy.viewLabel}
            </span>
          </a>
        ) : (
          <div aria-hidden="true" className="hidden sm:block" />
        )}

        <div>
          <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
            <h3 className="text-xl" lang={titleLang}>
              <ExternalAnchor href={publication.url} underline={false}>
                <span className="underline-offset-4 hover:underline">{title}</span>
              </ExternalAnchor>
            </h3>
            {publication.isCurrent ? (
              <span className="bg-[var(--color-leaf)] px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-white">
                {copy.currentLabel}
              </span>
            ) : null}
          </div>

          {subtitle ? (
            <p className="mt-1 text-[var(--color-ink-muted)]" lang={titleLang}>
              {subtitle}
            </p>
          ) : null}

          <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
            {[
              // On English pages the Swedish original comes first, so the real
              // title stays visible and searchable. These books exist only in
              // Swedish and nobody should go looking for an English edition.
              showsTranslatedTitle ? publication.title : null,
              publication.year,
              publication.editionNote ? publication.editionNote[locale] : null,
              publication.publisher,
              publication.withAuthors?.length
                ? `${copy.withLabel} ${publication.withAuthors.join(", ")}`
                : null,
              publication.editors?.length
                ? `${copy.editorsLabel} ${publication.editors.join(", ")}`
                : null,
            ]
              .filter(Boolean)
              .join(" · ")}
          </p>

          {publication.summary ? (
            <p className="mt-3 max-w-[var(--measure)]">
              {publication.summary[locale]}
            </p>
          ) : null}

          {publication.note ? (
            <p className="mt-2 text-sm text-[var(--color-accent)]">
              {publication.note[locale]}
            </p>
          ) : null}
        </div>
      </div>
    </li>
  );
}

export default async function PublicationsPage({
  params,
}: {
  params: Promise<{ locale: Locale }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const copy = getContent(locale).publications;

  // Split by what Kata actually did. Presenting a chapter contribution
  // alongside full authorship would overstate it.
  const authored = publications.filter((p) => p.role === "author");
  const contributions = publications.filter((p) => p.role === "chapter");

  return (
    <>
      <Container className="py-16 sm:py-20">
        <h1 className="text-4xl sm:text-5xl">{copy.hero.heading}</h1>
        <p className="mt-6 max-w-[var(--measure)] text-lg text-[var(--color-ink-muted)]">
          {copy.hero.standfirst}
        </p>
      </Container>

      <Section ornament id="books" heading={copy.booksHeading}>
        <ul className="max-w-3xl">
          {authored.map((publication) => (
            <PublicationEntry
              key={publication.id}
              publication={publication}
              locale={locale}
              copy={copy}
            />
          ))}
        </ul>
      </Section>

      {contributions.length > 0 ? (
        <Section ornament id="contributions" heading={copy.chaptersHeading} tone="sunken">
          <ul className="max-w-3xl">
            {contributions.map((publication) => (
              <PublicationEntry
                key={publication.id}
                publication={publication}
                locale={locale}
                copy={copy}
              />
            ))}
          </ul>
        </Section>
      ) : null}

      {/*
        A quiet pointer onward. Someone who has read to the end of the books
        is the most likely person to want the interviews, and nothing else on
        this page points at them.
      */}
      <Section id="media-nudge">
        <p className="max-w-[var(--measure)] text-[var(--color-ink-muted)]">
          {copy.mediaNudge}{" "}
          <Link href="/media" className="underline underline-offset-4">
            {copy.mediaNudgeLink}
          </Link>
          .
        </p>
      </Section>
    </>
  );
}
