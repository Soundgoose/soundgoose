import { Metadata } from "next";
import { getNewsletterIssues } from "../../sanity/lib/queries";
import { NewsletterExplorer } from "./newsletter-explorer";
import styles from "./newsletter.module.css";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "The Sound Goose Dispatch: Production & Acoustic Letters",
  description:
    "An archive of the Sound Goose Dispatch covering spatial sound design, browser audio performance, and engine updates.",
  alternates: {
    canonical: "https://soundgoose.com/newsletter",
  },
  openGraph: {
    title: "The Sound Goose Dispatch: Issue Archive",
    description:
      "An archive of the Sound Goose Dispatch covering spatial sound design and browser audio performance.",
    url: "https://soundgoose.com/newsletter",
    siteName: "Sound Goose",
    type: "website",
  },
};

export default async function NewsletterArchivePage() {
  const issues = await getNewsletterIssues();

  return (
    <main className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroMeta}>
          <span className={styles.eyebrow}>Studio Dispatch</span>
          <span className={styles.countBadge}>
            {issues.length} {issues.length === 1 ? "Edition" : "Editions"}
          </span>
        </div>
        <h1 className={styles.title}>The Sound Goose Dispatch</h1>
        <p className={styles.description}>
          Studio letters, acoustic engineering milestones, and interactive sound
          dispatches. Browse all past editions below.
        </p>
      </header>

      <NewsletterExplorer issues={issues} />
    </main>
  );
}
