import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/" },
    sitemap: "https://alexandra.saas-e.com/sitemap.xml",
    host: "https://alexandra.saas-e.com",
  };
}
