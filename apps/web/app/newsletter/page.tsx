import { Metadata } from "next";
import Link from "next/link";
import { getNewsletterIssues } from "../../sanity/lib/queries";
import { NewsletterSignupCard } from "../components/newsletter-signup-card";
import styles from "./newsletter.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Sound Goose Dispatch — Spatial Audio & Production Newsletter",
  description:
    "A bi-weekly newsletter covering the evolution of interactive audio, web sound engines, workflow deep dives, and early releases.",
  alternates: {
    canonical: "https://soundgoose.com/newsletter",
  },
  openGraph: {
    title: "The Sound Goose Dispatch — Newsletter Archive",
    description:
      "A bi-weekly newsletter covering the evolution of interactive audio, web sound engines, and workflow deep dives.",
    url: "https://soundgoose.com/newsletter",
    siteName: "Sound Goose",
    type: "website",
  },
};

export default async function NewsletterArchivePage() {
  const issues = await getNewsletterIssues();

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>The Sound Goose Dispatch</span>
        <h1 className={styles.title}>Studio Letters & Dispatches</h1>
        <p className={styles.description}>
          Curated thoughts on spatial sound, music engineering, and early
          product reveals sent directly to your inbox every two weeks.
        </p>
      </header>

      <NewsletterSignupCard
        eyebrow="Join the Dispatch"
        title="Subscribe to the Sound Goose Dispatch"
        description="Receive each new issue delivered straight to your email. Short, high-signal reads with full deep dives on the web."
        source="newsletter-archive-hero"
      />

      <section
        className={styles.archiveSection}
        aria-label="Past Issues Archive"
      >
        <h2 className={styles.sectionTitle}>Past Issues</h2>
        <div className={styles.issuesList}>
          {issues.map((issue) => {
            const formattedDate = new Date(
              issue.publishedAt,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });

            return (
              <article key={issue._id}>
                <Link
                  href={`/newsletter/${issue.slug.current}`}
                  className={styles.issueCard}
                >
                  <div className={styles.issueHeader}>
                    <span className={styles.issueBadge}>
                      Issue #{issue.issueNumber}
                    </span>
                    <time
                      className={styles.issueDate}
                      dateTime={issue.publishedAt}
                    >
                      {formattedDate}
                    </time>
                  </div>

                  <h3 className={styles.issueTitle}>{issue.title}</h3>

                  <p className={styles.issueExcerpt}>{issue.emailExcerpt}</p>

                  <span className={styles.readIssueLink}>
                    Read Full Issue →
                  </span>
                </Link>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}
