import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
    },
    sitemap: "https://worthmeaning.com/sitemap.xml",
    host: "https://worthmeaning.com",
  };
}
