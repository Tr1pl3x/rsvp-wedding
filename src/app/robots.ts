import type { MetadataRoute } from "next";

// Keep crawlers away from the private tokenized invites and the admin.
// No trailing slash on the disallows: prefix match must cover /admin itself.
export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/rsvp"],
    },
  };
}
