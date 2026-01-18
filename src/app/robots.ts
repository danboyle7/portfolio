import type { MetadataRoute } from "next";

// Required for static export
export const dynamic = "force-static";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        // Allow major search engine bots
        userAgent: [
          "Googlebot",
          "Googlebot-Image",
          "Googlebot-News",
          "Googlebot-Video",
          "Bingbot",
          "Slurp", // Yahoo
          "DuckDuckBot",
          "facebot", // Facebook
        ],
        allow: "/",
      },
      {
        // Block all other bots
        userAgent: "*",
        disallow: "/",
      },
    ],
    sitemap: "https://daniel-boyle.com/sitemap.xml",
  };
}
