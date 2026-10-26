import Image from "next/image";
import { SignupForm } from "./signup-form";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <nav className={styles.nav}>
        <Image
          src="/logo.png"
          alt="Sound Goose"
          width={180}
          height={60}
          className={styles.logo}
          priority
        />
        <span className={styles.badge}>Early Access</span>
      </nav>

      <main className={styles.hero}>
        <h1 className={styles.headline}>Sound Goose</h1>
        <p className={styles.subheadline}>
          From unfinished demo to global release.
        </p>
        <SignupForm />
      </main>

      <footer className={styles.footer}>
        <p className={styles.footerText}>
          &copy; {new Date().getFullYear()} Sound Goose <span className={styles.separator}>•</span> Built for independent artists
        </p>
      </footer>
    </div>
  );
}
