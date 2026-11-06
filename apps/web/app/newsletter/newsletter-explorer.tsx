"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { NewsletterIssue } from "../../sanity/lib/queries";
import { calculateReadingTime } from "../lib/reading-time";
import styles from "./newsletter.module.css";

interface NewsletterExplorerProps {
  issues: NewsletterIssue[];
}

export function NewsletterExplorer({ issues }: NewsletterExplorerProps) {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredIssues = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return issues;
    return issues.filter(
      (issue) =>
        issue.title.toLowerCase().includes(q) ||
        (issue.emailSubject && issue.emailSubject.toLowerCase().includes(q)) ||
        (issue.emailExcerpt && issue.emailExcerpt.toLowerCase().includes(q)),
    );
  }, [issues, searchQuery]);

  return (
    <>
      <section
        className={styles.toolbar}
        aria-label="Search weekly digest issues"
      >
        <div className={styles.archiveNote}>
          Archive &bull; {filteredIssues.length} of {issues.length}{" "}
          {issues.length === 1 ? "edition" : "editions"}
        </div>

        <div className={styles.searchBox}>
          <svg
            className={styles.searchIcon}
            width="15"
            height="15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search digest archive..."
            className={styles.searchInput}
            aria-label="Search digest archive"
          />
        </div>
      </section>

      {filteredIssues.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No editions found</h3>
          <p className={styles.emptyText}>
            No digest editions matched your search query.
          </p>
          <button
            onClick={() => setSearchQuery("")}
            className={styles.resetButton}
          >
            Reset Search
          </button>
        </div>
      ) : (
        <section className={styles.timeline} aria-label="Weekly Digest Issues">
          {filteredIssues.map((issue) => {
            const formattedDate = new Date(
              issue.publishedAt,
            ).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            });
            const readTime = calculateReadingTime(
              issue.fullBody || issue.emailExcerpt,
            );

            return (
              <article key={issue._id}>
                <Link
                  href={`/newsletter/${issue.slug.current}`}
                  className={styles.issueCard}
                >
                  <div className={styles.issueColMeta}>
                    <span className={styles.issueNumber}>
                      Issue #{issue.issueNumber}
                    </span>
                    <time
                      dateTime={issue.publishedAt}
                      className={styles.issueDate}
                    >
                      {formattedDate}
                    </time>
                    <span className={styles.readTime}>{readTime} min read</span>
                  </div>

                  <div className={styles.issueColBody}>
                    <h2 className={styles.issueTitle}>{issue.title}</h2>

                    {issue.emailSubject && (
                      <div className={styles.subjectLineBox}>
                        <span className={styles.subjectLabel}>Subject:</span>
                        <span>&ldquo;{issue.emailSubject}&rdquo;</span>
                      </div>
                    )}

                    <p className={styles.issueExcerpt}>
                      {issue.metaDescription || issue.emailExcerpt}
                    </p>
                  </div>

                  <div className={styles.issueColAction} aria-hidden="true">
                    <span>Read Edition</span>
                    <span className={styles.actionArrow}>&rarr;</span>
                  </div>
                </Link>
              </article>
            );
          })}
        </section>
      )}
    </>
  );
}
