import type { MetadataRoute } from "next";
import fs from "fs";
import path from "path";
import yaml from "js-yaml";

// Required for static export
export const dynamic = "force-static";

const BASE_URL = "https://daniel-boyle.com";

interface BlogPost {
  slug: string;
  date?: string;
}

function getBlogSlugs(): BlogPost[] {
  const blogDir = path.join(process.cwd(), "content/blog");

  if (!fs.existsSync(blogDir)) {
    return [];
  }

  const files = fs.readdirSync(blogDir).filter((f) => f.endsWith(".yaml"));

  const posts: BlogPost[] = [];

  for (const file of files) {
    try {
      const content = fs.readFileSync(path.join(blogDir, file), "utf8");
      const data = yaml.load(content) as BlogPost;
      if (data.slug) {
        posts.push({
          slug: data.slug,
          date: data.date,
        });
      }
    } catch {
      // Skip invalid files
    }
  }

  return posts;
}

export default function sitemap(): MetadataRoute.Sitemap {
  const blogPosts = getBlogSlugs();

  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 1,
    },
    {
      url: `${BASE_URL}/blog`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/portfolio`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  const blogPages: MetadataRoute.Sitemap = blogPosts.map((post) => ({
    url: `${BASE_URL}/blog/${post.slug}`,
    lastModified: post.date ? new Date(post.date) : new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  return [...staticPages, ...blogPages];
}
