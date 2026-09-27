import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";
import type { Locale } from "@/i18n/routing";
import { getContent } from "@/content";
import { getPathname } from "@/i18n/navigation";
import { publications, type Publication } from "@/content/facts";
import { Container, Section, Prose, ExternalAnchor } from "@/components/primitives";

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
  return (
    <li className="border-t border-[var(--color-line)] py-6">
      <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <h3 className="text-xl" lang="sv">
          {publication.title}
        </h3>
        {publication.isCurrent ? (
          <span className="bg-[var(--color-leaf)] px-2 py-0.5 text-xs uppercase tracking-[0.12em] text-white">
            {copy.currentLabel}
          </span>
        ) : null}
      </div>

      {publication.subtitle ? (
        <p className="mt-1 text-[var(--color-ink-muted)]" lang="sv">
          {publication.subtitle}
        </p>
      ) : null}

      <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
        {[
          publication.year,
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

      {publication.note ? (
        <p className="mt-1 text-sm text-[var(--color-accent)]">
          {publication.note[locale]}
        </p>
      ) : null}

      <p className="mt-3">
        <ExternalAnchor href={publication.url}>{copy.viewLabel}</ExternalAnchor>
      </p>
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
          <Prose>
            <p className="sr-only">{copy.chaptersHeading}</p>
          </Prose>
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
    </>
  );
}
