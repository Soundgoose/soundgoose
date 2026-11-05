"use client";

import { HeadingItem } from "../lib/toc";
import styles from "./table-of-contents.module.css";

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav className={styles.tocCard} aria-label="Table of Contents">
      <div className={styles.tocTitle}>
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <line x1="8" y1="6" x2="21" y2="6"></line>
          <line x1="8" y1="12" x2="21" y2="12"></line>
          <line x1="8" y1="18" x2="21" y2="18"></line>
          <line x1="3" y1="6" x2="3.01" y2="6"></line>
          <line x1="3" y1="12" x2="3.01" y2="12"></line>
          <line x1="3" y1="18" x2="3.01" y2="18"></line>
        </svg>
        Table of Contents
      </div>
      <ul className={styles.tocList}>
        {headings.map((item) => (
          <li
            key={item.id}
            className={`${styles.tocItem} ${
              item.level === "h3" ? styles.tocItemH3 : ""
            }`}
          >
            <a href={`#${item.id}`} className={styles.tocLink}>
              {item.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
