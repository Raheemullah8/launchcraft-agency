import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin", "/admin/*", "/thank-you", "/api/*"],
      },
    ],
    sitemap: "https://launchcraft.agency/sitemap.xml",
  };
}

