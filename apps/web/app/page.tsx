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
      </footer>
    </div>
  );
}
