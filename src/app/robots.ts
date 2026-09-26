import type { MetadataRoute } from "next";
import { site } from "@/content/facts";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      // The API routes are POST endpoints and a calendar download — nothing
      // there is useful to a crawler.
      disallow: ["/api/"],
    },
    sitemap: `${site.url}/sitemap.xml`,
    host: site.url,
  };
}
