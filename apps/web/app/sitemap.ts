import { MetadataRoute } from "next";
import { getBlogPostSlugs, getNewsletterSlugs } from "../sanity/lib/queries";

export const revalidate = 3600; // 1 hour

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://soundgoose.com";

  const [blogSlugs, newsletterSlugs] = await Promise.all([
    getBlogPostSlugs(),
    getNewsletterSlugs(),
  ]);

  const blogUrls: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  const newsletterUrls: MetadataRoute.Sitemap = newsletterSlugs.map((slug) => ({
    url: `${baseUrl}/newsletter/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.7,
  }));

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/newsletter`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    ...blogUrls,
    ...newsletterUrls,
  ];
}
