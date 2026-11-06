import { groq } from "next-sanity";
import { client, isConfigured } from "./client";

export interface Author {
  name: string;
  slug?: { current: string };
  image?: any;
  bio?: string;
}

export interface Category {
  title: string;
  slug?: { current: string };
}

export interface BlogPost {
  _id: string;
  title: string;
  slug: { current: string };
  publishedAt: string;
  coverImage?: any;
  excerpt?: string;
  author?: Author;
  categories?: Category[];
  body?: any;
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    canonicalUrl?: string;
  };
}

export interface QuickBiteSignal {
  title: string;
  testedObservation: string;
  recommendation: string;
  link?: string;
}

export interface NewsletterIssue {
  _id: string;
  issueNumber: number;
  title: string;
  slug: { current: string };
  publishedAt: string;
  coverImage?: any;
  metaDescription?: string;
  author?: Author;
  emailSubject: string;
  emailExcerpt: string;
  tldr?: string[];
  personalizedIntro?: string;
  fullBody?: any;
  quickBites?: QuickBiteSignal[];
  actionableNextStep?: string;
  canonicalCtaLabel?: string;
  canonicalCtaUrl?: string;
  broadcastStatus?: "draft" | "ready" | "sent";
  broadcastSentAt?: string;
}

// GROQ Queries
export const postsQuery = groq`*[_type == "post" && defined(slug.current)] | order(publishedAt desc) {
  _id,
  title,
  slug,
  publishedAt,
  coverImage,
  excerpt,
  "author": author->{name, slug, image},
  "categories": categories[]->{title, slug}
}`;

export const postBySlugQuery = groq`*[_type == "post" && slug.current == $slug][0] {
  _id,
  title,
  slug,
  publishedAt,
  coverImage,
  excerpt,
  "author": author->{name, slug, image, bio},
  "categories": categories[]->{title, slug},
  body,
  seo
}`;

export const postSlugsQuery = groq`*[_type == "post" && defined(slug.current)][].slug.current`;

export const newslettersQuery = groq`*[_type == "newsletter" && defined(slug.current)] | order(issueNumber desc, publishedAt desc) {
  _id,
  issueNumber,
  title,
  slug,
  publishedAt,
  coverImage,
  metaDescription,
  "author": author->{name, slug, image, bio},
  emailSubject,
  emailExcerpt,
  tldr,
  actionableNextStep,
  broadcastStatus,
  broadcastSentAt
}`;

export const newsletterBySlugQuery = groq`*[_type == "newsletter" && slug.current == $slug][0] {
  _id,
  issueNumber,
  title,
  slug,
  publishedAt,
  coverImage,
  metaDescription,
  "author": author->{name, slug, image, bio},
  emailSubject,
  emailExcerpt,
  tldr,
  personalizedIntro,
  fullBody,
  quickBites,
  actionableNextStep,
  canonicalCtaLabel,
  canonicalCtaUrl,
  broadcastStatus,
  broadcastSentAt
}`;

export const newsletterSlugsQuery = groq`*[_type == "newsletter" && defined(slug.current)][].slug.current`;

// Helper Fetchers
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isConfigured) return [];
  try {
    const data = await client.fetch<BlogPost[]>(postsQuery);
    return data || [];
  } catch (err) {
    console.warn("Could not fetch blog posts from Sanity:", err);
    return [];
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  if (!isConfigured) return null;
  try {
    const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug });
    return post || null;
  } catch (err) {
    console.warn(`Could not fetch post '${slug}' from Sanity:`, err);
    return null;
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  if (!isConfigured) return [];
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery);
    return slugs || [];
  } catch {
    return [];
  }
}

export async function getNewsletterIssues(): Promise<NewsletterIssue[]> {
  if (!isConfigured) return [];
  try {
    const data = await client.fetch<NewsletterIssue[]>(newslettersQuery);
    return data || [];
  } catch (err) {
    console.warn("Could not fetch newsletters from Sanity:", err);
    return [];
  }
}

export async function getNewsletterIssueBySlug(
  slug: string,
): Promise<NewsletterIssue | null> {
  if (!isConfigured) return null;
  try {
    const issue = await client.fetch<NewsletterIssue | null>(
      newsletterBySlugQuery,
      { slug },
    );
    return issue || null;
  } catch (err) {
    console.warn(`Could not fetch newsletter '${slug}' from Sanity:`, err);
    return null;
  }
}

export async function getNewsletterSlugs(): Promise<string[]> {
  if (!isConfigured) return [];
  try {
    const slugs = await client.fetch<string[]>(newsletterSlugsQuery);
    return slugs || [];
  } catch {
    return [];
  }
}

export async function getAdjacentNewsletterIssues(
  currentIssueNumber: number,
): Promise<{
  prev: NewsletterIssue | null;
  next: NewsletterIssue | null;
}> {
  const all = await getNewsletterIssues();
  const sorted = [...all].sort((a, b) => a.issueNumber - b.issueNumber);
  const currentIndex = sorted.findIndex(
    (item) => item.issueNumber === currentIssueNumber,
  );
  if (currentIndex === -1) {
    return { prev: null, next: null };
  }
  return {
    prev: currentIndex > 0 ? sorted[currentIndex - 1]! : null,
    next: currentIndex < sorted.length - 1 ? sorted[currentIndex + 1]! : null,
  };
}
