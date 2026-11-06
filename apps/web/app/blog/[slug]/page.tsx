import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { PortableText } from "@portabletext/react";
import {
  getBlogPostBySlug,
  getBlogPostSlugs,
} from "../../../sanity/lib/queries";
import { urlForImage } from "../../../sanity/lib/image";
import { portableTextComponents } from "../../components/portable-text-components";
import { ReadingProgress } from "../../components/reading-progress";
import { ShareButtons } from "../../components/share-buttons";
import { TableOfContents } from "../../components/table-of-contents";
import { extractHeadings } from "../../lib/toc";
import { calculateReadingTime } from "../../lib/reading-time";
import styles from "./post.module.css";

interface PostPageProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getBlogPostSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: PostPageProps): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    return {
      title: "Article Not Found | Sound Goose",
    };
  }

  const title = post.seo?.metaTitle || `${post.title} | Sound Goose`;
  const description =
    post.seo?.metaDescription ||
    post.excerpt ||
    "Read this dispatch on Sound Goose.";
  const canonical =
    post.seo?.canonicalUrl || `https://soundgoose.com/blog/${slug}`;
  const coverUrl = post.coverImage
    ? urlForImage(post.coverImage)?.width(1200).height(630).url()
    : undefined;

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: "Sound Goose",
      type: "article",
      publishedTime: post.publishedAt,
      authors: post.author?.name ? [post.author.name] : undefined,
      images: coverUrl ? [{ url: coverUrl, width: 1200, height: 630 }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: coverUrl ? [coverUrl] : [],
    },
  };
}

export default async function BlogPostPage({ params }: PostPageProps) {
  const { slug } = await params;
  const post = await getBlogPostBySlug(slug);

  if (!post) {
    notFound();
  }

  const coverUrl = post.coverImage
    ? urlForImage(post.coverImage)?.width(1200).height(675).url()
    : null;
  const formattedDate = new Date(post.publishedAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const readTime = calculateReadingTime(post.body || post.excerpt);
  const headings = extractHeadings(post.body);
  const articleUrl = `https://soundgoose.com/blog/${slug}`;

  // JSON-LD Schema (BlogPosting & Breadcrumbs)
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://soundgoose.com",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Blog",
            item: "https://soundgoose.com/blog",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: post.title,
            item: articleUrl,
          },
        ],
      },
      {
        "@type": "BlogPosting",
        headline: post.title,
        description: post.excerpt,
        datePublished: post.publishedAt,
        dateModified: post.publishedAt,
        author: {
          "@type": "Person",
          name: post.author?.name || "Sound Goose Team",
        },
        publisher: {
          "@type": "Organization",
          name: "Sound Goose",
          logo: {
            "@type": "ImageObject",
            url: "https://soundgoose.com/logo.png",
          },
        },
        image: coverUrl || "https://soundgoose.com/logo.png",
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": articleUrl,
        },
      },
    ],
  };

  const authorInitials = (post.author?.name || "SG")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className={styles.articleContainer}>
      <ReadingProgress />

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <nav className={styles.breadcrumbs} aria-label="Breadcrumb">
        <Link href="/" className={styles.breadcrumbLink}>
          Home
        </Link>
        <span>/</span>
        <Link href="/blog" className={styles.breadcrumbLink}>
          Blog
        </Link>
        <span>/</span>
        <span>{post.title}</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.metaRow}>
          {post.categories && post.categories.length > 0 && (
            <div className={styles.categories}>
              {post.categories.map((c) => (
                <span key={c.title} className={styles.categoryBadge}>
                  {c.title}
                </span>
              ))}
            </div>
          )}

          <span className={styles.readTimeBadge}>
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            {readTime} min read
          </span>
        </div>

        <h1 className={styles.title}>{post.title}</h1>

        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

        <div className={styles.authorBar}>
          <div className={styles.authorMeta}>
            <div className={styles.authorAvatar}>{authorInitials}</div>
            <div className={styles.authorInfo}>
              <span className={styles.authorName}>
                {post.author?.name || "Sound Goose Team"}
              </span>
              <time className={styles.publishDate} dateTime={post.publishedAt}>
                Published on {formattedDate}
              </time>
            </div>
          </div>

          <ShareButtons title={post.title} url={articleUrl} />
        </div>
      </header>

      {coverUrl && (
        <div className={styles.featuredImage}>
          <Image
            src={coverUrl}
            alt={post.coverImage?.alt || post.title}
            width={1200}
            height={675}
            priority
            style={{ width: "100%", height: "auto", display: "block" }}
          />
        </div>
      )}

      {/* 2-Column Layout when headings exist; single centered column otherwise */}
      <div
        className={`${styles.contentLayout} ${headings.length > 0 ? styles.hasSidebar : ""}`}
      >
        <div className={styles.mainContent}>
          <div className={styles.body}>
            {post.body && (
              <PortableText
                value={post.body}
                components={portableTextComponents}
              />
            )}
          </div>

          <div className={styles.authorBioCard}>
            <div className={styles.bioAvatar}>{authorInitials}</div>
            <div>
              <h3 className={styles.bioName}>
                {post.author?.name || "Sound Goose Team"}
              </h3>
              <p className={styles.bioText}>
                {post.author?.bio ||
                  "Engineers and sound designers at Sound Goose, rethinking spatial audio, browser acoustics, and collaborative creation."}
              </p>
            </div>
          </div>

          <footer className={styles.footerNav}>
            <Link href="/blog" className={styles.backButton}>
              ← Back to all dispatches
            </Link>
          </footer>
        </div>

        {headings.length > 0 && (
          <aside className={styles.sidebar}>
            <div className={styles.stickySidebar}>
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>
    </article>
  );
}
