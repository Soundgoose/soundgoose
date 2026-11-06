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
        background:
          "linear-gradient(135deg, rgba(229, 218, 208, 0.7) 0%, rgba(217, 166, 137, 0.4) 100%)",
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
          fontSize: isFeatured ? "1.1rem" : "0.88rem",
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

  const featuredPost = filteredPosts[0];
  const gridPosts = filteredPosts.slice(1);

  return (
    <>
      <section
        className={styles.toolbar}
        aria-label="Search and filter articles"
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
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            type="search"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search articles..."
            className={styles.searchInput}
            aria-label="Search articles"
          />
        </div>
      </section>

      {filteredPosts.length === 0 ? (
        <div className={styles.emptyState}>
          <h3 className={styles.emptyTitle}>No matching articles</h3>
          <p className={styles.emptyText}>
            Try adjusting your search query or selecting a different category.
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
          {featuredPost && (
            <section
              className={styles.featuredSection}
              aria-label="Featured Story"
            >
              <Link
                href={`/blog/${featuredPost.slug.current}`}
                className={styles.featuredCard}
              >
                <div className={styles.featuredImageWrapper}>
                  {featuredPost.coverImage ? (
                    <Image
                      src={urlForImage(featuredPost.coverImage)?.url() || ""}
                      alt={featuredPost.coverImage.alt || featuredPost.title}
                      fill
                      className={styles.cardImage}
                      priority
                    />
                  ) : (
                    <WaveformPlaceholder size="featured" />
                  )}
                </div>

                <div className={styles.featuredContent}>
                  <div className={styles.featuredBadge}>
                    <span>★ Featured Story</span>
                    <span>•</span>
                    <span>
                      {featuredPost.categories?.[0]?.title || "Field Notes"}
                    </span>
                  </div>

                  <h2 className={styles.featuredTitle}>{featuredPost.title}</h2>

                  {featuredPost.excerpt && (
                    <p className={styles.featuredExcerpt}>
                      {featuredPost.excerpt}
                    </p>
                  )}

                  <div className={styles.articleMeta}>
                    <span>
                      {featuredPost.author?.name || "Sound Goose Team"}
                    </span>
                    <span>•</span>
                    <time dateTime={featuredPost.publishedAt}>
                      {new Date(featuredPost.publishedAt).toLocaleDateString(
                        "en-US",
                        { month: "short", day: "numeric", year: "numeric" },
                      )}
                    </time>
                    <span>•</span>
                    <span>
                      {calculateReadingTime(
                        featuredPost.body || featuredPost.excerpt,
                      )}{" "}
                      min read
                    </span>
                  </div>
                </div>
              </Link>
            </section>
          )}

          {gridPosts.length > 0 && (
            <section className={styles.grid} aria-label="Articles Grid">
              {gridPosts.map((post) => {
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

                return (
                  <article key={post._id}>
                    <Link
                      href={`/blog/${post.slug.current}`}
                      className={styles.card}
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

                      <div className={styles.cardContent}>
                        <div className={styles.cardMetaRow}>
                          <span className={styles.cardCategory}>
                            {post.categories?.[0]?.title || "Article"}
                          </span>
                          <span className={styles.readTime}>
                            {readTime} min read
                          </span>
                        </div>

                        <h3 className={styles.cardTitle}>{post.title}</h3>

                        {post.excerpt && (
                          <p className={styles.cardExcerpt}>{post.excerpt}</p>
                        )}

                        <div className={styles.cardFooter}>
                          <span className={styles.cardAuthor}>
                            {post.author?.name || "Sound Goose Team"}
                          </span>
                          <time
                            dateTime={post.publishedAt}
                            className={styles.cardDate}
                          >
                            {formattedDate}
                          </time>
                        </div>
                      </div>
                    </Link>
                  </article>
                );
              })}
            </section>
          )}
        </>
      )}
    </>
  );
}
