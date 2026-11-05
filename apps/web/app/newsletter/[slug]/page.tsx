import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import {
  getNewsletterIssueBySlug,
  getNewsletterSlugs,
} from "../../../sanity/lib/queries";
import { portableTextComponents } from "../../components/portable-text-components";
import { ReadingProgress } from "../../components/reading-progress";
import { ShareButtons } from "../../components/share-buttons";
import { TableOfContents } from "../../components/table-of-contents";
import { extractHeadings } from "../../lib/toc";
import { calculateReadingTime } from "../../lib/reading-time";
import styles from "./issue.module.css";

interface NewsletterIssueProps {
  params: Promise<{ slug: string }>;
}

export const revalidate = 60;

export async function generateStaticParams() {
  const slugs = await getNewsletterSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: NewsletterIssueProps): Promise<Metadata> {
  const { slug } = await params;
  const issue = await getNewsletterIssueBySlug(slug);

  if (!issue) {
    return {
      title: "Newsletter Issue Not Found — Sound Goose",
    };
  }

  const title = `Issue #${issue.issueNumber}: ${issue.title} — Sound Goose`;
  const description =
    issue.emailExcerpt || "Sound Goose Dispatch newsletter edition.";
  const canonical = `https://soundgoose.com/newsletter/${slug}`;

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
      publishedTime: issue.publishedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

export default async function NewsletterIssuePage({
  params,
}: NewsletterIssueProps) {
  const { slug } = await params;
  const issue = await getNewsletterIssueBySlug(slug);

  if (!issue) {
    notFound();
  }

  const formattedDate = new Date(issue.publishedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const readTime = calculateReadingTime(issue.fullBody || issue.emailExcerpt);
  const headings = extractHeadings(issue.fullBody);
  const issueUrl = `https://soundgoose.com/newsletter/${slug}`;

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
            name: "Newsletter",
            item: "https://soundgoose.com/newsletter",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: `Issue #${issue.issueNumber}: ${issue.title}`,
            item: issueUrl,
          },
        ],
      },
      {
        "@type": "Article",
        headline: issue.title,
        description: issue.emailExcerpt,
        datePublished: issue.publishedAt,
        author: {
          "@type": "Organization",
          name: "Sound Goose",
          url: "https://soundgoose.com",
        },
        publisher: {
          "@type": "Organization",
          name: "Sound Goose",
          logo: {
            "@type": "ImageObject",
            url: "https://soundgoose.com/logo.png",
          },
        },
        mainEntityOfPage: {
          "@type": "WebPage",
          "@id": issueUrl,
        },
      },
    ],
  };

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
        <Link href="/newsletter" className={styles.breadcrumbLink}>
          Newsletter
        </Link>
        <span>/</span>
        <span>Issue #{issue.issueNumber}</span>
      </nav>

      <header className={styles.header}>
        <div className={styles.metaRow}>
          <span className={styles.issueBadge}>Issue #{issue.issueNumber}</span>

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

        <h1 className={styles.title}>{issue.title}</h1>

        {issue.emailSubject && (
          <div className={styles.subjectLineCard}>
            <span className={styles.subjectLabel}>Email Subject:</span>
            <span>&ldquo;{issue.emailSubject}&rdquo;</span>
          </div>
        )}

        <div className={styles.actionBar}>
          <time className={styles.date} dateTime={issue.publishedAt}>
            Dispatched on {formattedDate}
          </time>

          <ShareButtons title={issue.title} url={issueUrl} />
        </div>
      </header>

      {issue.emailExcerpt && (
        <section
          className={styles.teaserCallout}
          aria-label="From the Email Dispatch"
        >
          <div className={styles.teaserEyebrow}>From the Email Dispatch</div>
          <p className={styles.teaserText}>{issue.emailExcerpt}</p>
        </section>
      )}

      {/* 2-Column Layout when headings exist; single centered column otherwise */}
      <div
        className={`${styles.contentLayout} ${headings.length > 0 ? styles.hasSidebar : ""}`}
      >
        <div className={styles.mainContent}>
          <div className={styles.body}>
            {issue.fullBody && (
              <PortableText
                value={issue.fullBody}
                components={portableTextComponents}
              />
            )}
          </div>

          <footer className={styles.footerNav}>
            <Link href="/newsletter" className={styles.backButton}>
              ← Back to all editions
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
