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
import { NewsletterSignupCard } from "../../components/newsletter-signup-card";
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
      title: "Article Not Found — Sound Goose",
    };
  }

  const title = post.seo?.metaTitle || `${post.title} — Sound Goose`;
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
            item: `https://soundgoose.com/blog/${slug}`,
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
          "@id": `https://soundgoose.com/blog/${slug}`,
        },
      },
    ],
  };

  return (
    <article className={styles.container}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link href="/blog" className={styles.backLink}>
        ← Back to all articles
      </Link>

      <header className={styles.header}>
        {post.categories && post.categories.length > 0 && (
          <div className={styles.categories}>
            {post.categories.map((c) => (
              <span key={c.title} className={styles.categoryBadge}>
                {c.title}
              </span>
            ))}
          </div>
        )}

        <h1 className={styles.title}>{post.title}</h1>

        {post.excerpt && <p className={styles.excerpt}>{post.excerpt}</p>}

        <div className={styles.authorMeta}>
          <div className={styles.authorInfo}>
            <span className={styles.authorName}>
              {post.author?.name || "Sound Goose Team"}
            </span>
            <time className={styles.publishDate} dateTime={post.publishedAt}>
              Published on {formattedDate}
            </time>
          </div>
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

      <div className={styles.body}>
        {post.body && (
          <PortableText value={post.body} components={portableTextComponents} />
        )}
      </div>

      <div className={styles.footerNav}>
        <Link href="/blog" className={styles.backLink}>
          ← Back to all dispatches
        </Link>
      </div>

      <NewsletterSignupCard
        title="Liked this breakdown?"
        description="Join fellow audio artists and sound designers receiving the Sound Goose Dispatch every other week."
        source={`blog-post-${slug}`}
      />
    </article>
  );
}
