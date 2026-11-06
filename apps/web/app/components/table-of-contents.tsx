"use client";

import { HeadingItem } from "../lib/toc";
import styles from "./table-of-contents.module.css";

export function TableOfContents({ headings }: { headings: HeadingItem[] }) {
  if (!headings || headings.length === 0) return null;

  return (
    <nav className={styles.tocNav} aria-label="Table of Contents">
      <div className={styles.tocHeading}>Contents</div>
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
