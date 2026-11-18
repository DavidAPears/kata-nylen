import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

const nextConfig: NextConfig = {
  /**
   * Build output directory.
   *
   * Next writes to `.next` for both `dev` and `build`. Running a build while a
   * dev server is live therefore overwrites the files that server is serving,
   * and the browser starts asking for CSS and JS chunks that no longer exist
   * ("No link element found for chunk ...").
   *
   * So verification builds go somewhere else:
   *
   *     NEXT_BUILD_DIR=.next-verify npm run build
   *
   * which leaves a running dev server untouched.
   */
  distDir: process.env.NEXT_BUILD_DIR || ".next",

  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
  },
  /**
   * The book-launch URLs, kept alive.
   *
   * /sv/bokrelease and /en/book-release went to 110 guests, sit in every
   * confirmation email already sent, and are baked into the sharing cards
   * people have shared. Renaming the route without these would break all of
   * it. Permanent, so search engines move the ranking across rather than
   * treating the new path as a new page.
   */
  async redirects() {
    return [
      { source: "/sv/bokrelease", destination: "/sv/psykologisk-resiliens", permanent: true },
      { source: "/en/book-release", destination: "/en/psychological-resilience", permanent: true },
    ];
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "X-Frame-Options", value: "DENY" },
          {
            key: "Permissions-Policy",
            value: "camera=(), microphone=(), geolocation=()",
          },
        ],
      },
    ];
  },
};

export default withNextIntl(nextConfig);
