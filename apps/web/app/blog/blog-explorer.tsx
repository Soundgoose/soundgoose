"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { BlogPost } from "../../sanity/lib/queries";
import { urlForImage } from "../../sanity/lib/image";
import { calculateReadingTime } from "../lib/reading-time";
import styles from "./blog.module.css";

interface BlogExplorerProps {
  posts: BlogPost[];
}

function WaveformPlaceholder({
  size = "default",
}: {
  size?: "featured" | "default";
}) {
  const isFeatured = size === "featured";
  return (
    <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: isFeatured ? "0.85rem" : "0.5rem",
        background: "linear-gradient(135deg, #e5dad0 0%, #d9a689 100%)",
        color: "#40271e",
      }}
      aria-hidden="true"
    >
      <svg
        width={isFeatured ? 56 : 38}
        height={isFeatured ? 32 : 22}
        viewBox="0 0 64 36"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.75"
        strokeLinecap="round"
      >
        <line x1="6" y1="18" x2="6" y2="18.01" />
        <line x1="14" y1="12" x2="14" y2="24" />
        <line x1="22" y1="6" x2="22" y2="30" />
        <line x1="30" y1="2" x2="30" y2="34" />
        <line x1="38" y1="8" x2="38" y2="28" />
        <line x1="46" y1="14" x2="46" y2="22" />
        <line x1="54" y1="18" x2="54" y2="18.01" />
      </svg>
      <span
        style={{
          fontFamily: "var(--font-display)",
          fontSize: isFeatured ? "1.1rem" : "0.85rem",
          fontWeight: 700,
          letterSpacing: "-0.01em",
          color: "#40271e",
        }}
      >
        Sound Goose
      </span>
    </div>
  );
}

function formatIndex(index: number): string {
  const num = index + 1;
  return num < 10 ? `0${num}` : `${num}`;
}

export function BlogExplorer({ posts }: BlogExplorerProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Extract unique category names
  const categories = useMemo(() => {
    const set = new Set<string>();
    posts.forEach((p) => {
      p.categories?.forEach((c) => {
        if (c.title) set.add(c.title);
      });
    });
    return ["All", ...Array.from(set)];
  }, [posts]);

  // Filter posts based on category & search query
  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All" ||
        post.categories?.some((c) => c.title === selectedCategory);

      const q = searchQuery.toLowerCase().trim();
      const matchesQuery =
        !q ||
        post.title.toLowerCase().includes(q) ||
        (post.excerpt && post.excerpt.toLowerCase().includes(q));

      return matchesCategory && matchesQuery;
    });
  }, [posts, selectedCategory, searchQuery]);

  const leadPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  if (posts.length === 0) {
    return (
      <div className={styles.emptyState} style={{ padding: "5rem 1.5rem" }}>
        <h2 className={styles.emptyTitle}>Nothing to show here</h2>
        <p className={styles.emptyText}>No blog posts found.</p>
      </div>
    );
  }

  return (
    <>
      <section
        className={styles.toolbar}
        aria-label="Filter and search Liner Notes"
      >
        <div className={styles.categoriesList}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`${styles.categoryButton} ${
                selectedCategory === cat ? styles.activeCategory : ""
              }`}
            >
              {cat}
            </button>
          ))}
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
            placeholder="Search entries..."
            className={styles.searchInput}
            aria-label="Search entries"
          />
        </div>
      </section>

      {filteredPosts.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No entries found</h3>
          <p className={styles.emptyText}>
            No articles matched your search or category filter.
          </p>
          <button
            onClick={() => {
              setSelectedCategory("All");
              setSearchQuery("");
            }}
            className={styles.resetButton}
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <>
          {/* Lead Dispatch / Billboard Hero Story (01) */}
          {leadPost && (
            <section className={styles.leadSection} aria-label="Lead Story">
              <Link
                href={`/blog/${leadPost.slug.current}`}
                className={styles.leadLink}
              >
                <div className={styles.leadImageWrapper}>
                  {leadPost.coverImage ? (
                    <Image
                      src={urlForImage(leadPost.coverImage)?.url() || ""}
                      alt={leadPost.coverImage.alt || leadPost.title}
                      fill
                      className={styles.leadImage}
                      priority
                    />
                  ) : (
                    <WaveformPlaceholder size="featured" />
                  )}
                </div>

                <div className={styles.leadContent}>
                  <div className={styles.leadRankRow}>
                    <span className={styles.rankNumber}>01</span>
                    <span className={styles.kicker}>
                      {leadPost.categories?.[0]?.title || "Lead Dispatch"}
                    </span>
                  </div>

                  <h2 className={styles.leadTitle}>{leadPost.title}</h2>

                  {leadPost.excerpt && (
                    <p className={styles.leadExcerpt}>{leadPost.excerpt}</p>
                  )}

                  <div className={styles.leadMeta}>
                    <span className={styles.bylineAuthor}>
                      By {leadPost.author?.name || "Sound Goose Team"}
                    </span>
                    <span className={styles.metaDot}>·</span>
                    <time dateTime={leadPost.publishedAt}>
                      {new Date(leadPost.publishedAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </time>
                    <span className={styles.metaDot}>·</span>
                    <span>
                      {calculateReadingTime(leadPost.body || leadPost.excerpt)}{" "}
                      min read
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {/* Follow-up Entries in Editorial Roster (02, 03, ...) */}
          {gridPosts.length > 0 && (
            <section aria-label="Liner Notes Entries">
              <div className={styles.rosterHeader}>
                <h3 className={styles.rosterTitle}>Dispatches</h3>
              </div>

              <div className={styles.grid}>
                {gridPosts.map((post, idx) => {
                  const coverUrl = post.coverImage
                    ? urlForImage(post.coverImage)?.url()
                    : null;
                  const formattedDate = new Date(
                    post.publishedAt,
                  ).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  });
                  const readTime = calculateReadingTime(
                    post.body || post.excerpt,
                  );
                  const rank = formatIndex(idx + 1);

                  return (
                    <article key={post._id} className={styles.articleItem}>
                      <Link
                        href={`/blog/${post.slug.current}`}
                        className={styles.articleLink}
                      >
                        <div className={styles.cardImageWrapper}>
                          {coverUrl ? (
                            <Image
                              src={coverUrl}
                              alt={post.coverImage?.alt || post.title}
                              fill
                              className={styles.cardImage}
                            />
                          ) : (
                            <WaveformPlaceholder />
                          )}
                        </div>

                        <div className={styles.articleHeaderRow}>
                          <span className={styles.itemRank}>{rank}</span>
                          <span className={styles.itemKicker}>
                            {post.categories?.[0]?.title || "Studio Note"}
                          </span>
                        </div>

                        <h3 className={styles.cardTitle}>{post.title}</h3>

                        {post.excerpt && (
                          <p className={styles.cardExcerpt}>{post.excerpt}</p>
                        )}

                        <div className={styles.cardFooter}>
                          <span>{post.author?.name || "Sound Goose Team"}</span>
                          <span>·</span>
                          <time dateTime={post.publishedAt}>
                            {formattedDate}
                          </time>
                          <span>·</span>
                          <span>{readTime} min read</span>
                        </div>
                      </Link>
                    </article>
                  );
                })}
              </div>
            </section>
          )}
        </>
      )}
    </>
  );
}
