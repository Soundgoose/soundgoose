import { SignupForm } from "./signup-form";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.hero} id="waitlist">
        <h1 className={styles.headline}>Sound Goose</h1>
        <p className={styles.subheadline}>
          From unfinished demo to global release.
        </p>
        <SignupForm />
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} Sound Goose{" "}
          <span className={styles.separator}>•</span> Built for independent
          artists
        </p>
        <span className={styles.separator} aria-hidden="true">
          •
        </span>
        <div className={styles.socials} aria-label="Social links">
          <a
            href="https://www.instagram.com/soundgoosemusic"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Sound Goose on Instagram"
            title="Instagram"
          >
            <svg
              width="15"
              height="15"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
              <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
              <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
            </svg>
          </a>
          <a
            href="https://x.com/soundgoosemusic"
            target="_blank"
            rel="noopener noreferrer"
            className={styles.socialLink}
            aria-label="Sound Goose on X"
            title="X (Twitter)"
          >
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>
        </div>
      </footer>
    </div>
  );
}
