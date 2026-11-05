import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { PortableText } from "@portabletext/react";
import {
  getNewsletterIssueBySlug,
  getNewsletterSlugs,
  getAdjacentNewsletterIssues,
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
      title: "Newsletter Issue Not Found | Sound Goose",
    };
  }

  // Lead with core topic in title tag
  const title = `${issue.title} (Issue #${issue.issueNumber}) | Sound Goose`;
  const description =
    issue.metaDescription ||
    issue.emailExcerpt ||
    "Read the Sound Goose technical dispatch on spatial audio and acoustic engineering.";
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

  const adjacent = await getAdjacentNewsletterIssues(issue.issueNumber);

  const formattedDate = new Date(issue.publishedAt).toLocaleDateString(
    "en-US",
    {
      month: "long",
      day: "numeric",
      year: "numeric",
    },
  );

  const readTime = calculateReadingTime(
    issue.fullBody || issue.tldr?.join(" ") || issue.emailExcerpt,
  );
  const headings = extractHeadings(issue.fullBody);
  const issueUrl = `https://soundgoose.com/newsletter/${slug}`;

  const authorName = issue.author?.name || "Sound Goose Audio Team";
  const authorBio =
    issue.author?.bio ||
    "Audio Systems Engineers and Sound Designers at Sound Goose, building real-time browser acoustics.";
  const authorInitials = authorName
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const metaDesc =
    issue.metaDescription ||
    issue.emailExcerpt ||
    "Sound Goose technical dispatch on browser acoustics.";

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
        description: metaDesc,
        datePublished: issue.publishedAt,
        author: {
          "@type": "Person",
          name: authorName,
          description: authorBio,
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

      {/* Breadcrumb Navigation */}
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

      {/* ─── Part 1: Header & Web Meta Data ─── */}
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
              aria-hidden="true"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {readTime} min read
          </span>
        </div>

        {/* Web Title / H1: Leads with the core topic/keyword */}
        <h1 className={styles.title}>{issue.title}</h1>

        {issue.emailSubject && (
          <div className={styles.subjectLineCard}>
            <span className={styles.subjectLabel}>Email Subject:</span>
            <span>&ldquo;{issue.emailSubject}&rdquo;</span>
          </div>
        )}

        {/* Date & Byline (E-E-A-T and AI timestamp tracking) */}
        <div className={styles.bylineCard}>
          <div className={styles.authorWrapper}>
            <div className={styles.authorAvatar} aria-hidden="true">
              {authorInitials}
            </div>
            <div className={styles.authorMeta}>
              <span className={styles.authorName}>{authorName}</span>
              <span className={styles.authorBio}>{authorBio}</span>
            </div>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1.25rem",
              flexWrap: "wrap",
            }}
          >
            <time className={styles.date} dateTime={issue.publishedAt}>
              Published on {formattedDate}
            </time>
            <ShareButtons title={issue.title} url={issueUrl} />
          </div>
        </div>
      </header>

      {/* ─── Part 2: The Hook / Executive Summary (AEO Focus) ─── */}
      <section
        className={styles.hookSection}
        aria-label="Executive Summary and Editorial Hook"
      >
        {/* The TL;DR Box (Concise direct answers extracted by AI engines) */}
        {issue.tldr && issue.tldr.length > 0 && (
          <div className={styles.tldrCard}>
            <div className={styles.tldrHeader}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="var(--brand)"
                strokeWidth="2.5"
                aria-hidden="true"
              >
                <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                <polyline points="14 2 14 8 20 8" />
                <line x1="16" y1="13" x2="8" y2="13" />
                <line x1="16" y1="17" x2="8" y2="17" />
                <polyline points="10 9 9 9 8 9" />
              </svg>
              <span className={styles.tldrBadge}>
                Executive Summary (TL;DR)
              </span>
            </div>
            <ul className={styles.tldrList}>
              {issue.tldr.map((point, index) => (
                <li key={index} className={styles.tldrItem}>
                  {point}
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Personalized Human Take / Intro */}
        {issue.personalizedIntro ? (
          <div className={styles.personalizedIntro}>
            {issue.personalizedIntro}
          </div>
        ) : (
          issue.emailExcerpt && (
            <div className={styles.personalizedIntro}>{issue.emailExcerpt}</div>
          )
        )}
      </section>

      {/* ─── Part 3: The Main Feature / Deep Dive ─── */}
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
        </div>

        {/* Sticky Table of Contents on Right */}
        {headings.length > 0 && (
          <aside className={styles.sidebar}>
            <div className={styles.stickySidebar}>
              <TableOfContents headings={headings} />
            </div>
          </aside>
        )}
      </div>

      {/* ─── Part 4: Quick Bites / Curated Signals ─── */}
      {issue.quickBites && issue.quickBites.length > 0 && (
        <section
          className={styles.quickBitesSection}
          aria-label="Quick Bites and Curated Signals"
        >
          <div className={styles.sectionHeader}>
            <div className={styles.sectionEyebrow}>Part 4: Curated Signals</div>
            <h2 className={styles.sectionTitle}>
              Quick Bites: Observed Data &amp; Direct Recommendations
            </h2>
            <p className={styles.sectionSubtitle}>
              Rigorous test results separated from prescriptive architecture
              takeaways.
            </p>
          </div>

          <div className={styles.signalGrid}>
            {issue.quickBites.map((signal, index) => (
              <div key={index} className={styles.signalCard}>
                <h3 className={styles.signalTitle}>{signal.title}</h3>

                <div className={styles.signalComparison}>
                  <div className={styles.observedBlock}>
                    <span className={styles.signalBlockLabel}>
                      What Was Tested / Observed
                    </span>
                    <p className={styles.signalText}>
                      {signal.testedObservation}
                    </p>
                  </div>

                  <div className={styles.recommendedBlock}>
                    <span className={styles.signalBlockLabel}>
                      What We Recommend
                    </span>
                    <p className={styles.signalText}>{signal.recommendation}</p>
                  </div>
                </div>

                {signal.link && (
                  <a
                    href={signal.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.signalLink}
                  >
                    Read reference documentation &rarr;
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ─── Part 5: Outro & Canonical CTA ─── */}
      <section
        className={styles.outroSection}
        aria-label="Outro and Next Steps"
      >
        {issue.actionableNextStep && (
          <div className={styles.actionableCard}>
            <div className={styles.actionableEyebrow}>
              Part 5: Actionable Next Step
            </div>
            <p className={styles.actionableText}>{issue.actionableNextStep}</p>
          </div>
        )}

        <div className={styles.canonicalCtaCard}>
          <h2 className={styles.canonicalCtaTitle}>
            Ready to experience collaborative audio?
          </h2>
          <p className={styles.canonicalCtaText}>
            Sound Goose is rethinking spatial audio and live sound collaboration
            directly in modern web browsers. Join our early access community.
          </p>
          <Link
            href={issue.canonicalCtaUrl || "/#waitlist"}
            className={styles.canonicalButton}
          >
            {issue.canonicalCtaLabel || "Join the Sound Goose Waitlist"} &rarr;
          </Link>
        </div>

        {/* Chronological Internal Linking Loops (Hub-and-Spoke Archive) */}
        <div className={styles.internalLoopSection}>
          <nav
            className={styles.internalLoopNav}
            aria-label="Chronological Issue Navigation"
          >
            {adjacent.prev ? (
              <Link
                href={`/newsletter/${adjacent.prev.slug.current}`}
                className={styles.loopCard}
              >
                <span className={styles.loopLabel}>&larr; Previous Issue</span>
                <span className={styles.loopTitle}>
                  #{adjacent.prev.issueNumber}: {adjacent.prev.title}
                </span>
              </Link>
            ) : (
              <div />
            )}

            {adjacent.next ? (
              <Link
                href={`/newsletter/${adjacent.next.slug.current}`}
                className={styles.loopCard}
                style={{ textAlign: "right" }}
              >
                <span className={styles.loopLabel}>Next Issue &rarr;</span>
                <span className={styles.loopTitle}>
                  #{adjacent.next.issueNumber}: {adjacent.next.title}
                </span>
              </Link>
            ) : (
              <div />
            )}
          </nav>
        </div>

        <footer className={styles.footerNav}>
          <Link href="/newsletter" className={styles.backButton}>
            &larr; Back to all newsletter editions
          </Link>
          <ShareButtons title={issue.title} url={issueUrl} />
        </footer>
      </section>
    </article>
  );
}
