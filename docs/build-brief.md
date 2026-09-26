# Kata Nylén Website --- AI Build Brief

**Project:** Kata Nylén personal website\
**Domain:** `katanylen.com`\
**Launch scope:** Bilingual MVP (Swedish + English)\
**Primary purpose:** Establish Kata's personal digital home, promote her
new book and book-launch event, generate speaking/professional
enquiries, and create the technical foundations for a larger authority
platform.

------------------------------------------------------------------------

## 1. Project Context

Kata Nylén is a Swedish psychologist, author and speaker whose work sits
at the intersection of climate psychology, psychological resilience,
behavioural change, climate emotions, uncertainty, sustainability and
systemic change.

This website should **not** present her as a conventional therapist,
coach, wellness influencer, activist organisation or generic corporate
consultant.

The desired positioning is closer to:

> A modern Scandinavian authority on psychology, resilience, behavioural
> change and navigating systemic change.

A useful broad brand idea is:

> Psychology for a changing world.

This is a personal platform for Kata. It should complement and link to
the collective climate-psychology organisations she works with rather
than duplicate or replace them.

Relevant collective sites supplied by Kata:

-   Klimatpsykologerna: https://www.klimatpsykologerna.se/
-   Climate Psyched: https://www.climatepsyched.org/

Kata would like her personal site to retain some sense of kinship with
these organisations, but it should have its own more sophisticated,
editorial identity.

------------------------------------------------------------------------

## 2. Long-Term Strategic Goal

The long-term ambition is larger than the MVP.

Over time, `katanylen.com` should become an authority and discovery
platform that:

-   establishes Kata as a major Nordic voice in her field;
-   drives discovery and sales of her books;
-   generates keynote, panel and workshop enquiries;
-   generates enterprise and organisational engagements;
-   makes her useful to journalists and media;
-   ranks organically for subjects associated with her expertise;
-   makes her identity and expertise understandable to search engines
    and AI systems;
-   eventually supports essays, knowledge resources, media, books and
    original frameworks.

The MVP should therefore be **small in public scope but correctly
architected for expansion**.

Do not overbuild Phase 1, but do not make architectural decisions that
require a rebuild for Phase 2.

------------------------------------------------------------------------

## 3. MVP Business Goals

The initial site has four primary pages:

1.  Home
2.  Book Release / Book Launch
3.  Speaking
4.  Contact

The immediate priorities are:

### Book launch

Kata is launching a new book. Visitors should be able to learn about the
launch and RSVP directly on her website.

The functional inspiration supplied by Kata is:

https://jonathanstenvall.com/borealis-bokrelease.html

Do **not** copy the visual design of that page. Kata likes the
simplicity of having a dedicated book-release page with an RSVP
mechanism. We want a significantly stronger design and experience.

### Personal authority

Someone searching for Kata should immediately understand who she is,
what she works on, her books and her professional credibility.

### Speaking

Conference organisers, companies, universities, municipalities and other
organisations should have a clear route to understand her speaking
themes and contact her.

### Professional contact

Media, speaking and professional enquiries should have an obvious
conversion route.

------------------------------------------------------------------------

## 4. Audiences

### Readers / General Public

Interested in psychology, climate psychology, resilience, climate
emotions, sustainability and societal change.

Desired actions: - discover Kata; - discover/read/buy her books; -
attend the book launch; - return to her work.

### Speaking Buyers

Examples: - conferences; - universities; - leadership events; -
sustainability events; - HR / organisational events; - public-sector
organisations.

Desired actions: - understand Kata's expertise; - view relevant speaking
topics; - make an enquiry.

### Enterprise / Organisations

Potential future/high-value audience: - leadership teams; -
sustainability teams; - organisational development; - HR; -
transformation programmes; - public institutions.

Relevant themes include: - psychological resilience; - climate
psychology; - behavioural change; - climate emotions; - leadership
during uncertainty; - organisational resilience; - sustainability
transitions; - human responses to systemic change.

The MVP should signal this capability without creating an enormous
consulting-services section.

### Media

Journalists, producers, podcasters and researchers should be able to
understand Kata's expertise and contact her easily.

------------------------------------------------------------------------

## 5. Brand & Experience Principles

The website should feel:

-   Scandinavian;
-   intelligent;
-   calm;
-   contemporary;
-   warm;
-   human;
-   editorial;
-   organic;
-   credible;
-   sophisticated without being elitist.

It should **not** feel like:

-   a therapy clinic;
-   a coaching website;
-   a climate NGO;
-   a corporate consultancy template;
-   a SaaS startup;
-   a wellness influencer;
-   a generic author template;
-   a gardening website.

The key balance is:

> Editorial authority + human warmth + quiet commercial conversion.

------------------------------------------------------------------------

## 6. Visual Direction

### Overall concept

For the launch, explore:

> Psychology × cultivated nature

The new book contains themes around psychology, climate anxiety and
actions/ideas connected to gardens and cultivation. This gives the
launch site an opportunity for an organic visual world.

However, the book cover is **content to incorporate, not a master brand
style guide**. Kata's other books have different visual identities.

The personal brand therefore needs to sit above any individual book.

### Imagery

Use Kata's supplied portraits prominently.

Potential atmospheric visual material:

-   garden details;
-   leaves moving gently in wind;
-   plants and seed heads;
-   hands/soil where appropriate;
-   morning/evening natural light;
-   water;
-   growth;
-   natural textures;
-   subtle seasonal imagery.

Video could be used as a hero/background element if performance and
accessibility remain excellent.

Avoid obvious climate/nature clichés.

### Colour

Explore a restrained palette informed by, but not copied from, the new
book:

-   warm cream / ivory;
-   charcoal;
-   deep aubergine / plum;
-   muted botanical green;
-   dusty blue-grey;
-   restrained mineral rose/coral accent.

Avoid default bright "eco green".

### Typography

Use an editorial display face paired with a clean contemporary sans
serif.

Desired effect:

-   literary;
-   intellectual;
-   modern;
-   calm;
-   highly readable.

### Layout

Use:

-   generous whitespace;
-   strong editorial hierarchy;
-   asymmetry where appropriate;
-   large photography;
-   restrained navigation;
-   carefully controlled line lengths;
-   sophisticated responsive typography.

### Motion

Motion should be subtle:

-   gentle fades;
-   slow parallax where appropriate;
-   soft image reveals;
-   restrained background video.

Respect `prefers-reduced-motion`.

Avoid flashy startup animation.

------------------------------------------------------------------------

## 7. Language Architecture

The site must be genuinely bilingual: **Swedish and English**.

Do not use browser/automatic machine translation as the primary content
solution.

Both language versions should have editable, curated copy.

Recommended routing:

``` text
/sv
/sv/bokrelease
/sv/forelasningar
/sv/kontakt

/en
/en/book-release
/en/speaking
/en/contact
```

Provide a persistent but unobtrusive `SV | EN` language switcher.

Where possible, switching language should take the visitor to the
equivalent page rather than returning them to the homepage.

Implement correct:

-   `lang` attributes;
-   `hreflang`;
-   `x-default` where appropriate;
-   canonical URLs;
-   translated metadata;
-   translated OpenGraph metadata.

------------------------------------------------------------------------

## 8. MVP Sitemap

``` text
katanylen.com
│
├── /sv
│   ├── /sv/bokrelease
│   ├── /sv/forelasningar
│   └── /sv/kontakt
│
├── /en
│   ├── /en/book-release
│   ├── /en/speaking
│   └── /en/contact
│
└── External links
    ├── Klimatpsykologerna
    └── Climate Psyched
```

Primary navigation:

``` text
KATA NYLÉN       Home | Book Release | Speaking | Contact       SV | EN
```

Navigation labels should of course be localised.

------------------------------------------------------------------------

## 9. Homepage

### Purpose

The homepage should:

1.  establish Kata;
2.  explain her intellectual territory;
3.  prominently promote the current book launch;
4.  provide routes to speaking and professional work;
5.  connect her to her climate-psychology collectives;
6.  establish semantic/search context.

### Suggested structure

#### Navigation

Minimal navigation + language switcher.

#### Hero

Potential structure:

``` text
KATA NYLÉN

Psychology for a changing world.

[short positioning copy]

[Explore Kata's work] [Book release]
```

Use a strong portrait or restrained organic moving-image treatment.

The final headline/copy is not locked. Treat current wording as
strategic direction rather than approved final copy.

#### Introduction / About

Short introduction explaining that Kata is a Swedish psychologist,
author and speaker working with climate psychology, resilience,
behaviour and how people respond to uncertainty and change.

Keep it concise.

#### Featured Book / Book Release

Visually prominent section containing:

-   actual book artwork;
-   title;
-   short description;
-   launch date/location when supplied;
-   CTA: RSVP / Read about the book release.

This should be one of the strongest conversion areas on the homepage
during the launch campaign.

#### Areas of Work

A concise presentation of core areas such as:

-   Climate psychology
-   Psychological resilience
-   Behavioural change
-   Climate emotions
-   Navigating uncertainty / systemic change

Do not turn this into generic SaaS-style feature cards unless the design
genuinely calls for it.

#### Speaking

Brief speaking proposition with route to `/speaking`.

#### Climate Psychology Collective

Explain Kata's connection to the collective work and link externally to:

-   Klimatpsykologerna
-   Climate Psyched

Do not duplicate their content.

#### Footer

Potential content:

-   professional contact;
-   relevant social profiles;
-   collective links;
-   language switch;
-   privacy;
-   copyright.

------------------------------------------------------------------------

## 10. Book Release Page

This is the most important dedicated campaign page in the MVP.

### Purpose

Create a beautiful, frictionless event page that can be linked directly
from:

-   social media;
-   LinkedIn;
-   publisher activity;
-   email;
-   QR codes;
-   partner sites;
-   Klimatpsykologerna / Climate Psyched.

Primary CTA: **RSVP**.

Suggested memorable URLs:

-   `katanylen.com/sv/bokrelease`
-   `katanylen.com/en/book-release`

### Suggested structure

#### Event Hero

``` text
YOU'RE INVITED / VÄLKOMMEN

[Book title]

Book release
[Date]
[Time]
[Venue / Stockholm]

[RSVP]
```

Use the actual book artwork and/or garden/organic visual treatment.

#### About the Event

A short personal invitation from Kata.

#### About the Book

Include:

-   book cover;
-   synopsis;
-   key themes;
-   relevant publisher/purchase link if available.

Do not create an on-site shop for MVP.

#### Programme

Only include if the event has a meaningful programme.

Possible structure:

``` text
18:00 Doors
18:30 Conversation / presentation
19:15 Q&A
19:45 Drinks / signing
```

Do not invent event details.

#### Location

-   venue;
-   address;
-   map/directions link;
-   accessibility information if available.

#### RSVP

Keep friction low.

Recommended fields:

-   Name --- required
-   Email --- required
-   Number of guests --- only if guests are permitted
-   Optional marketing/newsletter consent --- explicit and separate

CTA:

``` text
Reserve my place
```

or suitable Swedish equivalent.

### RSVP behaviour

Requirements:

-   validate inputs;
-   prevent obvious spam;
-   persist registration securely;
-   show clear success/error states;
-   send attendee confirmation email;
-   optionally notify Kata/organiser;
-   provide a manageable/exportable attendee list;
-   avoid collecting unnecessary personal data;
-   include appropriate privacy information;
-   do not pre-check marketing consent.

After successful registration:

``` text
✓ You're on the list.
```

with event details repeated and, if technically appropriate, an Add to
Calendar option.

------------------------------------------------------------------------

## 11. Speaking Page

### Purpose

Convert conference, institutional and enterprise interest without
presenting Kata as a generic "speaker for hire".

Suggested structure:

#### Hero

``` text
Speaking

Kata Nylén speaks about the psychology of climate,
resilience, behaviour and change.
```

#### Selected Themes

Potential themes:

-   Climate psychology
-   Psychological resilience
-   Climate emotions and action
-   Behavioural change
-   Navigating uncertainty
-   Human responses to systemic transformation

Final subjects must reflect Kata's actual offering; do not fabricate
talks or credentials.

#### Formats

Potentially:

-   Keynotes
-   Panels
-   Workshops
-   Moderated conversations

Only publish formats Kata confirms.

#### Credibility

Use verified:

-   books;
-   previous events;
-   organisations;
-   media;
-   testimonials;
-   academic/professional credentials.

Never fabricate client logos or testimonials.

#### CTA

``` text
Interested in inviting Kata?

[Speaking enquiry]
```

------------------------------------------------------------------------

## 12. Contact Page

Keep simple.

Suggested enquiry categories:

-   Speaking & events
-   Media & press
-   Professional collaboration
-   General enquiry

Suggested fields:

-   Name
-   Organisation (optional)
-   Email
-   Reason for contact
-   Message

Provide a direct professional email if Kata wants it public.

Implement:

-   validation;
-   spam protection;
-   clear success/error feedback;
-   privacy handling.

------------------------------------------------------------------------

## 13. SEO Foundations

Although Phase 1 contains only a few pages, SEO must be part of the
architecture from day one.

Every indexable page should support editable:

-   SEO title;
-   meta description;
-   canonical URL;
-   OpenGraph title;
-   OpenGraph description;
-   OpenGraph image;
-   language;
-   index/noindex;
-   structured data where relevant.

Also provide:

-   XML sitemap;
-   robots.txt;
-   clean semantic HTML;
-   logical heading hierarchy;
-   descriptive image alt text;
-   excellent Core Web Vitals;
-   responsive images;
-   meaningful link text;
-   breadcrumbs where they become useful.

### Initial semantic territory

The site should naturally establish Kata's relationship with:

-   climate psychology;
-   psychological resilience;
-   behavioural change;
-   climate emotions;
-   collective resilience;
-   uncertainty;
-   organisational resilience;
-   leadership/change;
-   sustainability transformation.

Do not keyword-stuff.

The copy should remain natural, useful and authoritative.

------------------------------------------------------------------------

## 14. Entity & AI/Agentic Discoverability Foundations

The website should help search engines and AI systems clearly answer:

-   Who is Kata Nylén?
-   What is she an expert in?
-   What has she written?
-   What organisations is she associated with?
-   What subjects does she speak about?
-   What is her official website?

### Structured data

Use appropriate JSON-LD.

At minimum consider:

#### Person

Represent Kata with:

-   full name;
-   professional description;
-   image;
-   official URL;
-   relevant verified `sameAs` profiles;
-   books/works where appropriate;
-   legitimate organisational affiliations.

#### Book

Individual book information where sufficient verified metadata exists.

#### Event

Use Event structured data for the book launch once real event details
are supplied.

#### WebSite / WebPage

Standard site/page relationships.

Do not add schema simply because a type exists. Structured data must
accurately describe visible content.

### Entity consistency

Kata's name, biography and professional description should remain
reasonably consistent across:

-   website;
-   publisher;
-   collective organisations;
-   LinkedIn/professional profiles;
-   conference bios;
-   podcast descriptions;
-   media appearances.

This helps humans and machines connect references to the same person.

### AI-readable content

Write pages with:

-   clear descriptive headings;
-   concise explanations;
-   factual attribution;
-   meaningful internal links;
-   extractable descriptions of expertise;
-   visible authorship.

Avoid hiding important content entirely inside animation, images or
client-side interactions.

------------------------------------------------------------------------

## 15. Performance & Accessibility

Target a high-quality implementation rather than visual effects at the
expense of usability.

Requirements:

-   responsive/mobile-first;
-   keyboard accessible;
-   visible focus states;
-   appropriate contrast;
-   semantic landmarks;
-   form labels;
-   useful error messages;
-   image alt text;
-   reduced-motion support;
-   video fallback/poster;
-   avoid autoplay audio;
-   lazy-load below-fold media;
-   optimise fonts;
-   optimise images/video.

Aim for excellent Core Web Vitals.

------------------------------------------------------------------------

## 16. Privacy / GDPR

The audience is substantially European, so privacy should be designed in
rather than added later.

For MVP:

-   collect minimum RSVP/contact data;
-   document the purpose of collection;
-   define retention expectations;
-   keep marketing consent separate from event registration;
-   do not pre-select marketing consent;
-   use privacy-conscious analytics where possible;
-   only display cookie consent when the actual technologies used
    require it;
-   provide a concise privacy page/notice.

Exact legal wording should be reviewed appropriately before production.

------------------------------------------------------------------------

## 17. Content Management

Even if the MVP is mostly static, content should be structured so it can
later expand.

Suggested content entities:

``` text
Site Settings
Person / Kata Profile
Page
Book
Event
Speaking Topic
External Organisation
SEO Metadata
```

Future-ready entities:

``` text
Article
Knowledge/Pillar Page
Media Appearance
Podcast
Video
Testimonial
Framework
Organisation Engagement / Case Study
```

Do not expose future sections in navigation until they contain useful
content.

------------------------------------------------------------------------

## 18. Future Phase --- Authority Platform

The intended future architecture is:

``` text
Home
├── About
├── Books
│   └── [Individual Book]
├── Speaking
├── Organisations
│   ├── Organisational Resilience
│   ├── Behavioural Change
│   ├── Leadership / Uncertainty
│   └── Sustainability Transition
├── Writing
│   └── [Essay]
├── Knowledge
│   ├── Climate Psychology
│   ├── Psychological Resilience
│   ├── Climate Emotions
│   ├── Behavioural Change
│   └── Organisational Resilience
├── Media
└── Contact
```

This is **not** the Phase 1 build list. It is the architectural
destination.

------------------------------------------------------------------------

## 19. Future SEO / Knowledge Strategy

Later phases should build topic clusters rather than publishing random
blog posts.

Potential pillar resources include:

-   What is climate psychology?
-   What is psychological resilience?
-   What are climate emotions?
-   Psychological resilience in organisations
-   Behavioural change and sustainability
-   Leadership during uncertainty

Supporting essays should internally link to these pillar resources.

The goal is to develop genuine topical authority based on Kata's
expertise, not produce high-volume generic SEO content.

------------------------------------------------------------------------

## 20. Future Media & Discoverability

Future expansion should consider:

-   essays/perspectives;
-   podcast appearances;
-   interview pages;
-   keynote/video archive;
-   transcripts;
-   press/media kit;
-   approved photography;
-   short and long professional bios;
-   newsletter;
-   original named frameworks where these genuinely come from Kata's
    work.

The long-term objective is to make Kata highly referenceable by
journalists, organisations, search engines and AI assistants.

------------------------------------------------------------------------

## 21. Important Build Rules

1.  **Do not overbuild the MVP.**
2.  **Do not make the site visually generic.**
3.  **Do not invent Kata's biography, credentials, clients, quotes,
    talks, testimonials or event details.**
4.  Use placeholders/TODOs when verified content is missing.
5.  Treat Swedish and English as first-class content.
6.  Make every page technically SEO-ready.
7.  Use semantic, accessible HTML.
8.  Keep core information server-rendered/indexable.
9.  Optimise images and video aggressively.
10. Design reusable components without turning a four-page site into an
    unnecessary design-system project.
11. Keep the book launch easy to update/remove/promote after the event.
12. Build the content model so additional books and events can be added
    later.
13. External collective sites should open naturally and be clearly
    identified; Kata's personal site remains the primary brand
    environment.
14. Do not implement a shop for Phase 1.
15. Do not publish speculative SEO copy as factual biography.

------------------------------------------------------------------------

## 22. Recommended MVP Component Inventory

``` text
Header
LanguageSwitcher
MobileNavigation
Hero
PortraitMedia
BackgroundVideo
EditorialTextSection
FeaturedBook
BookCover
TopicList
SpeakingTeaser
CollectiveLinks
CTASection
Footer

EventHero
EventDetails
BookDetails
EventProgramme
VenueDetails
RSVPForm
RSVPSuccess
AddToCalendar

SpeakingHero
SpeakingTopics
SpeakingFormats
CredibilitySection
EnquiryCTA

ContactForm

SEOHead / metadata utilities
StructuredData
ResponsiveImage
VideoBackground
```

Components are indicative, not mandatory. Prefer clean composition over
abstraction for its own sake.

------------------------------------------------------------------------

## 23. Content Still Required From Kata

Before production content is finalised, obtain/confirm:

-   preferred professional title;
-   approved short biography;
-   approved longer biography if required;
-   Swedish bio;
-   English bio;
-   exact book title;
-   book cover source asset;
-   publisher;
-   publication date;
-   purchase/publisher URL;
-   book synopsis;
-   book-launch date;
-   book-launch start/end time;
-   venue;
-   address;
-   capacity;
-   whether guests/+1s are permitted;
-   RSVP deadline if any;
-   event programme;
-   confirmation-email wording;
-   RSVP data retention requirements;
-   speaking topics;
-   formats offered;
-   previous speaking credentials;
-   approved testimonials if any;
-   approved client/event logos if any;
-   professional email;
-   social/profile links;
-   precise relationship/wording for Klimatpsykologerna and Climate
    Psyched;
-   photography rights/approved images;
-   privacy/contact details required for GDPR information.

Never infer missing factual content.

------------------------------------------------------------------------

## 24. Definition of MVP Success

At launch, a visitor should be able to:

1.  immediately identify Kata and her area of expertise;
2.  switch seamlessly between Swedish and English;
3.  understand and RSVP for the book launch;
4.  discover the new book;
5.  understand that Kata is available for relevant speaking/professional
    engagements;
6.  make an enquiry easily;
7.  discover her relationship with the climate-psychology collectives;
8.  find a fast, accessible and polished experience on mobile and
    desktop.

Search engines and machine systems should be able to:

1.  crawl all public content;
2.  distinguish the Swedish and English versions;
3.  identify Kata as the site's primary person/entity;
4.  understand her core areas of expertise;
5.  understand the book and event through accurate structured data;
6.  identify canonical URLs and page relationships.

------------------------------------------------------------------------

## 25. Design North Star

When making design decisions, use this test:

> Does this feel like the digital home of a thoughtful Scandinavian
> psychologist, author and public voice dealing with how humans respond
> to a changing world?

The site should have enough organic warmth to connect to the new book
and climate-psychology work, but enough restraint and editorial
authority to remain credible for a publisher, journalist, university,
conference organiser or major enterprise.

The MVP should feel **simple because it is focused --- not simple
because it is unfinished.**

------------------------------------------------------------------------

## 26. Build Priority

### P0 --- Launch Critical

-   bilingual routing;
-   homepage;
-   book-release page;
-   RSVP;
-   speaking page;
-   contact page;
-   responsive design;
-   accessibility baseline;
-   SEO metadata;
-   hreflang/canonicals;
-   Person + Event structured data where verified;
-   sitemap/robots;
-   privacy handling;
-   analytics/search-console readiness.

### P1 --- Strong Launch Enhancements

-   automated RSVP confirmation email;
-   attendee export/admin workflow;
-   Add to Calendar;
-   high-quality subtle video treatment;
-   Book structured data;
-   polished social sharing cards;
-   event-specific OG artwork.

### P2 --- Post-MVP

-   Books index/detail pages;
-   About page;
-   enterprise/organisations section;
-   Writing;
-   Knowledge;
-   Media;
-   newsletter;
-   deeper topic-cluster SEO;
-   video/transcript library;
-   original framework pages.

------------------------------------------------------------------------

## 27. Final Product Principle

Build **the first version of an authority platform**, not a temporary
event microsite.

The visible MVP is intentionally compact:

> **Home + Book Release + Speaking + Contact**

But its identity, bilingual architecture, structured content, SEO
foundations and entity modelling should allow it to evolve naturally
into Kata Nylén's long-term digital home.
