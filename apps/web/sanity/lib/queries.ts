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

export interface NewsletterIssue {
  _id: string;
  issueNumber: number;
  title: string;
  slug: { current: string };
  publishedAt: string;
  coverImage?: any;
  emailSubject: string;
  emailExcerpt: string;
  fullBody?: any;
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
  emailSubject,
  emailExcerpt,
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
  emailSubject,
  emailExcerpt,
  fullBody,
  broadcastStatus,
  broadcastSentAt
}`;

export const newsletterSlugsQuery = groq`*[_type == "newsletter" && defined(slug.current)][].slug.current`;

// Fallback seed data for preview / when Sanity project is not connected yet
const FALLBACK_POSTS: BlogPost[] = [
  {
    _id: "seed-post-1",
    title: "Introducing Sound Goose: The Collaborative Audio Canvas",
    slug: { current: "introducing-sound-goose" },
    publishedAt: new Date("2026-10-15").toISOString(),
    excerpt:
      "A deep dive into how we are rethinking spatial sound, real-time audio collaboration, and the tools modern audio designers need.",
    author: { name: "Rachit", bio: "Founder & Audio Engineer at Sound Goose" },
    categories: [{ title: "Product" }, { title: "Audio Engineering" }],
    body: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Sound Goose was born out of frustration with disjointed audio workflows. Why should sharing a mix review feel like sending emails in 2004? Today, we're sharing our vision for fluid, spatial audio workflows.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Why Audio Workflows Need a Spatial Paradigm",
          },
        ],
        markDefs: [],
        style: "h2",
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Traditional timeline-based DAWs force linear thinking on fundamentally multi-dimensional soundscapes. By placing sound emitters on a shared canvas, artists and producers can collaborate with intuitive spatial awareness.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
  {
    _id: "seed-post-2",
    title:
      "Mastering Spatial Audio Dynamics for Modern Interactive Experiences",
    slug: { current: "mastering-spatial-audio-dynamics" },
    publishedAt: new Date("2026-10-28").toISOString(),
    excerpt:
      "Techniques and mental models for designing acoustic presence, binaural panning, and dynamic distance falloff.",
    author: { name: "Team Sound Goose", bio: "The sound engineering crew" },
    categories: [{ title: "Deep Dive" }, { title: "Sound Design" }],
    body: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "When mixing interactive sound, real-world physics matter. From Doppler effects to head-related transfer functions (HRTF), modern sound designers have immense power at their fingertips.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
];

const FALLBACK_NEWSLETTERS: NewsletterIssue[] = [
  {
    _id: "seed-issue-1",
    issueNumber: 1,
    title: "Issue #1: The Sound Goose Journey Begins",
    slug: { current: "issue-1-the-journey-begins" },
    publishedAt: new Date("2026-10-20").toISOString(),
    emailSubject: "Sound Goose Issue #1: Breaking the Timeline Barrier",
    emailExcerpt:
      "Welcome to the first edition of the Sound Goose Dispatch! In this issue, we take you behind the scenes of our initial sound engine benchmarks, announce our private beta timeline, and share 3 tips for crisp binaural mixes.",
    broadcastStatus: "sent",
    broadcastSentAt: new Date("2026-10-20").toISOString(),
    fullBody: [
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Welcome to our inaugural Sound Goose Dispatch! We are thrilled to have hundreds of early audio creators following along as we craft the future of interactive sound.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "Behind the Scenes: WebAudio Engine Benchmarks",
          },
        ],
        markDefs: [],
        style: "h2",
      },
      {
        _type: "block",
        children: [
          {
            _type: "span",
            text: "We spent the last month optimizing our real-time convolution reverb worker. Latency is now down to under 6ms on modern browsers, unlocking truly imperceptible acoustic simulations.",
          },
        ],
        markDefs: [],
        style: "normal",
      },
    ],
  },
];

// Helper Fetchers with graceful fallbacks
export async function getBlogPosts(): Promise<BlogPost[]> {
  if (!isConfigured) {
    return FALLBACK_POSTS;
  }
  try {
    const data = await client.fetch<BlogPost[]>(postsQuery);
    return data && data.length > 0 ? data : FALLBACK_POSTS;
  } catch (err) {
    console.warn(
      "Could not fetch blog posts from Sanity, using fallback:",
      err,
    );
    return FALLBACK_POSTS;
  }
}

export async function getBlogPostBySlug(
  slug: string,
): Promise<BlogPost | null> {
  if (!isConfigured) {
    return FALLBACK_POSTS.find((p) => p.slug.current === slug) || null;
  }
  try {
    const post = await client.fetch<BlogPost | null>(postBySlugQuery, { slug });
    return post || FALLBACK_POSTS.find((p) => p.slug.current === slug) || null;
  } catch (err) {
    console.warn(`Could not fetch post '${slug}' from Sanity:`, err);
    return FALLBACK_POSTS.find((p) => p.slug.current === slug) || null;
  }
}

export async function getBlogPostSlugs(): Promise<string[]> {
  if (!isConfigured) {
    return FALLBACK_POSTS.map((p) => p.slug.current);
  }
  try {
    const slugs = await client.fetch<string[]>(postSlugsQuery);
    return slugs && slugs.length > 0
      ? slugs
      : FALLBACK_POSTS.map((p) => p.slug.current);
  } catch (err) {
    return FALLBACK_POSTS.map((p) => p.slug.current);
  }
}

export async function getNewsletterIssues(): Promise<NewsletterIssue[]> {
  if (!isConfigured) {
    return FALLBACK_NEWSLETTERS;
  }
  try {
    const data = await client.fetch<NewsletterIssue[]>(newslettersQuery);
    return data && data.length > 0 ? data : FALLBACK_NEWSLETTERS;
  } catch (err) {
    console.warn(
      "Could not fetch newsletters from Sanity, using fallback:",
      err,
    );
    return FALLBACK_NEWSLETTERS;
  }
}

export async function getNewsletterIssueBySlug(
  slug: string,
): Promise<NewsletterIssue | null> {
  if (!isConfigured) {
    return FALLBACK_NEWSLETTERS.find((n) => n.slug.current === slug) || null;
  }
  try {
    const issue = await client.fetch<NewsletterIssue | null>(
      newsletterBySlugQuery,
      { slug },
    );
    return (
      issue || FALLBACK_NEWSLETTERS.find((n) => n.slug.current === slug) || null
    );
  } catch (err) {
    console.warn(`Could not fetch newsletter '${slug}' from Sanity:`, err);
    return FALLBACK_NEWSLETTERS.find((n) => n.slug.current === slug) || null;
  }
}

export async function getNewsletterSlugs(): Promise<string[]> {
  if (!isConfigured) {
    return FALLBACK_NEWSLETTERS.map((n) => n.slug.current);
  }
  try {
    const slugs = await client.fetch<string[]>(newsletterSlugsQuery);
    return slugs && slugs.length > 0
      ? slugs
      : FALLBACK_NEWSLETTERS.map((n) => n.slug.current);
  } catch (err) {
    return FALLBACK_NEWSLETTERS.map((n) => n.slug.current);
  }
}
