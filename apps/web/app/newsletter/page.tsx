import { Metadata } from "next";
import { getNewsletterIssues } from "../../sanity/lib/queries";
import { NewsletterExplorer } from "./newsletter-explorer";
import styles from "./newsletter.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Weekly Digest | Sound Goose",
  description:
    "Weekly engineering dispatches, spatial audio research, and studio milestones from Sound Goose.",
  alternates: {
    canonical: "https://soundgoose.com/newsletter",
  },
  openGraph: {
    title: "Weekly Digest | Sound Goose",
    description:
      "Weekly engineering dispatches, spatial audio research, and studio milestones from Sound Goose.",
    url: "https://soundgoose.com/newsletter",
    siteName: "Sound Goose",
    type: "website",
  },
};

export default async function NewsletterArchivePage() {
  const issues = await getNewsletterIssues();

  return (
    <main className={styles.container}>
      <header className={styles.masthead}>
        <div className={styles.mastheadTop}>
          <h1 className={styles.title}>Weekly Digest</h1>
          <span className={styles.countBadge}>
            {issues.length} {issues.length === 1 ? "Edition" : "Editions"}
          </span>
        </div>
      </header>

      <NewsletterExplorer issues={issues} />
    </main>
  );
}
