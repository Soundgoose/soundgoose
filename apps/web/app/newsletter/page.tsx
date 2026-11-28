import { Metadata } from "next";
import { getNewsletterIssues } from "../../sanity/lib/queries";
import { NewsletterExplorer } from "./newsletter-explorer";
import styles from "./newsletter.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Weekly Digest | Soundgoose",
  description:
    "Weekly engineering dispatches, spatial audio research, and studio milestones from Soundgoose.",
  alternates: {
    canonical: "https://soundgoose.com/newsletter",
  },
  openGraph: {
    title: "Weekly Digest | Soundgoose",
    description:
      "Weekly engineering dispatches, spatial audio research, and studio milestones from Soundgoose.",
    url: "https://soundgoose.com/newsletter",
    siteName: "Soundgoose",
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
