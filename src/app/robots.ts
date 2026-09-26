import type { MetadataRoute } from "next";
import { resolveSiteUrl, isIndexable } from "@/lib/site-url";

export default function robots(): MetadataRoute.Robots {
  const siteUrl = resolveSiteUrl();

  // On the temporary vercel.app address, refuse every crawler outright.
  // See src/lib/site-url.ts for why, and how this lifts itself.
  if (!isIndexable()) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The API routes are POST endpoints and a calendar download; nothing
      // there is useful to a crawler.
      disallow: ["/api/"],
    },
    sitemap: `${siteUrl}/sitemap.xml`,
    host: siteUrl,
  };
}
