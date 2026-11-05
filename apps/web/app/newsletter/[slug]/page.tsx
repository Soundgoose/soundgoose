import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import {
  getNewsletterIssueBySlug,
  getNewsletterSlugs,
} from "../../../sanity/lib/queries";
import { portableTextComponents } from "../../components/portable-text-components";
import { NewsletterSignupCard } from "../../components/newsletter-signup-card";
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
            item: `https://soundgoose.com/newsletter/${slug}`,
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
          "@id": `https://soundgoose.com/newsletter/${slug}`,
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

      <Link href="/newsletter" className={styles.backLink}>
        ← Back to all newsletter issues
      </Link>

      <header className={styles.header}>
        <div className={styles.issueMeta}>
          <span className={styles.issueBadge}>Issue #{issue.issueNumber}</span>
          <span className={styles.date}>Published on {formattedDate}</span>
        </div>

        <h1 className={styles.title}>{issue.title}</h1>

        {issue.emailSubject && (
          <div className={styles.subjectLine}>
            <span className={styles.subjectLabel}>Subject:</span>
            <span>{issue.emailSubject}</span>
          </div>
        )}
      </header>

      {issue.emailExcerpt && (
        <section
          className={styles.teaserCallout}
          aria-label="Email Teaser Excerpt"
        >
          <div className={styles.teaserTitle}>From the Email Dispatch</div>
          <p className={styles.teaserText}>{issue.emailExcerpt}</p>
        </section>
      )}

      <div className={styles.body}>
        {issue.fullBody && (
          <PortableText
            value={issue.fullBody}
            components={portableTextComponents}
          />
        )}
      </div>

      <div className={styles.footerNav}>
        <Link href="/newsletter" className={styles.backLink}>
          ← Back to newsletter archive
        </Link>
      </div>

      <NewsletterSignupCard
        title="Never miss an issue"
        description="Get the next edition of the Sound Goose Dispatch sent directly to your inbox every two weeks."
        source={`newsletter-issue-${slug}`}
      />
    </article>
  );
}
