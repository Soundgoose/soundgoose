"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./header-nav.module.css";

export function HeaderNav() {
  const pathname = usePathname();
  const [isStudioSubdomain, setIsStudioSubdomain] = useState(false);

  useEffect(() => {
    const hostname = window.location.hostname.toLowerCase();
    if (
      hostname === "studio.soundgoose.com" ||
      hostname.startsWith("studio.")
    ) {
      setIsStudioSubdomain(true);
    }
  }, []);

  // If in Sanity Studio, hide the regular website nav so Sanity takes the full screen
  if (pathname?.startsWith("/studio") || isStudioSubdomain) {
    return null;
  }

  const isBlog = pathname?.startsWith("/blog");
  const isNewsletter = pathname?.startsWith("/newsletter");

  return (
    <header className={styles.header}>
      <div className={styles.navContainer}>
        <Link href="/" className={styles.brandLink}>
          <Image
            src="/logo.png"
            alt="Sound Goose"
            width={150}
            height={50}
            style={{ width: "auto" }}
            className={styles.logo}
            priority
          />
        </Link>

        <nav aria-label="Main Navigation">
          <ul className={styles.links}>
            <li>
              <Link
                href="/blog"
                className={`${styles.navLink} ${isBlog ? styles.activeLink : ""}`}
              >
                Blog
              </Link>
            </li>
            <li>
              <Link
                href="/newsletter"
                className={`${styles.navLink} ${isNewsletter ? styles.activeLink : ""}`}
              >
                Newsletter
              </Link>
            </li>
            <li>
              <Link
                href="/studio"
                className={styles.studioLink}
                title="Open Content Studio"
              >
                Studio ✎
              </Link>
            </li>
            <li>
              <Link href="/#waitlist" className={styles.ctaLink}>
                Early Access
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
