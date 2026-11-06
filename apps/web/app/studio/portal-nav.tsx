"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import styles from "./portal-nav.module.css";
import { projectId, dataset } from "../../sanity/env";

export function PortalNav() {
  const pathname = usePathname();
  const cleanPath = pathname?.replace(/^\/studio/, "") || "/";

  const isOverview = cleanPath === "/" || cleanPath === "";
  const isContent = cleanPath.startsWith("/content");
  const isWaitlist = cleanPath.startsWith("/waitlist");
  const isBroadcasts = cleanPath.startsWith("/broadcasts");
  const isTelemetry = cleanPath.startsWith("/telemetry");

  async function handleLockSession() {
    try {
      await fetch("/api/studio/auth", { method: "DELETE" });
      window.location.href = "/";
    } catch {
      window.location.reload();
    }
  }

  return (
    <header className={styles.navHeader}>
      <div className={styles.leftSection}>
        <Link href="/" className={styles.brandLockup}>
          <Image
            src="/logo.png"
            alt="Sound Goose"
            width={110}
            height={32}
            style={{ width: "auto", height: "24px" }}
            priority
          />
          <span className={styles.portalBadge}>Studio Ops</span>
        </Link>

        <nav aria-label="Studio Operations Navigation">
          <ul className={styles.tabsList}>
            <li>
              <Link
                href="/"
                className={`${styles.tabLink} ${isOverview ? styles.tabActive : ""}`}
              >
                Overview
              </Link>
            </li>
            <li>
              <Link
                href="/content"
                className={`${styles.tabLink} ${isContent ? styles.tabActive : ""}`}
              >
                Content Studio
              </Link>
            </li>
            <li>
              <Link
                href="/waitlist"
                className={`${styles.tabLink} ${isWaitlist ? styles.tabActive : ""}`}
              >
                Waitlist &amp; CRM
              </Link>
            </li>
            <li>
              <Link
                href="/broadcasts"
                className={`${styles.tabLink} ${isBroadcasts ? styles.tabActive : ""}`}
              >
                Broadcasts
              </Link>
            </li>
            <li>
              <Link
                href="/telemetry"
                className={`${styles.tabLink} ${isTelemetry ? styles.tabActive : ""}`}
              >
                Telemetry
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      <div className={styles.rightSection}>
        <div
          className={styles.statusPill}
          title={`Connected to Sanity project ${projectId} (${dataset})`}
        >
          <span className={styles.statusDot} />
          <span>
            Sanity: <strong>{projectId}</strong>
          </span>
        </div>

        <button
          onClick={handleLockSession}
          className={styles.lockBtn}
          title="End session and return to passcode gate"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          Lock Session
        </button>
      </div>
    </header>
  );
}
