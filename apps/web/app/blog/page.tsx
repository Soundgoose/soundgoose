import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getBlogPosts } from "../../sanity/lib/queries";
import { urlForImage } from "../../sanity/lib/image";
import { NewsletterSignupCard } from "../components/newsletter-signup-card";
import styles from "./blog.module.css";

export const revalidate = 60; // On-demand ISR fallback 60 seconds

export const metadata: Metadata = {
  title: "Blog — Sound Goose",
  description:
    "Dispatches, technical deep dives, and perspectives on spatial audio, music collaboration, and real-time sound design.",
  alternates: {
    canonical: "https://soundgoose.com/blog",
  },
  openGraph: {
    title: "Blog — Sound Goose",
    description:
      "Dispatches and technical deep dives on spatial audio, music collaboration, and real-time sound design.",
    url: "https://soundgoose.com/blog",
    siteName: "Sound Goose",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <div className={styles.container}>
      <header className={styles.hero}>
        <span className={styles.eyebrow}>Field Notes & Insights</span>
        <h1 className={styles.title}>The Sound Goose Blog</h1>
        <p className={styles.description}>
          Dispatches on spatial sound, browser audio engineering, and tools for
          the next generation of independent artists and producers.
        </p>
      </header>

      <section className={styles.grid} aria-label="Blog Articles">
        {posts.map((post) => {
          const coverUrl = post.coverImage
            ? urlForImage(post.coverImage)?.url()
            : null;
          const formattedDate = new Date(post.publishedAt).toLocaleDateString(
            "en-US",
            {
              month: "short",
              day: "numeric",
              year: "numeric",
            },
          );
          const categoryName = post.categories?.[0]?.title || "Article";

          return (
            <article key={post._id}>
              <Link href={`/blog/${post.slug.current}`} className={styles.card}>
                {coverUrl ? (
                  <div className={styles.cardImageWrapper}>
                    <Image
                      src={coverUrl}
                      alt={post.coverImage?.alt || post.title}
                      fill
                      className={styles.cardImage}
                    />
                  </div>
                ) : (
                  <div
                    className={styles.cardImageWrapper}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background:
                        "linear-gradient(135deg, #eee5dc 0%, #dfd3c5 100%)",
                      color: "#73513d",
                      fontFamily: "var(--font-display)",
                      fontSize: "1.1rem",
                      fontWeight: 600,
                      padding: "1rem",
                      textAlign: "center",
                    }}
                  >
                    Sound Goose 🪿
                  </div>
                )}

                <div className={styles.cardContent}>
                  <div className={styles.cardMeta}>
                    <span className={styles.cardCategory}>{categoryName}</span>
                    <span>•</span>
                    <time dateTime={post.publishedAt}>{formattedDate}</time>
                  </div>

                  <h2 className={styles.cardTitle}>{post.title}</h2>

                  {post.excerpt && (
                    <p className={styles.cardExcerpt}>{post.excerpt}</p>
                  )}

                  <div className={styles.cardFooter}>
                    <span className={styles.cardAuthor}>
                      {post.author?.name || "Sound Goose Team"}
                    </span>
                    <span className={styles.readMore}>Read Article →</span>
                  </div>
                </div>
              </Link>
            </article>
          );
        })}
      </section>

      <NewsletterSignupCard
        title="Subscribe to the Studio Dispatch"
        description="Get newly published articles, mix breakdowns, and product updates sent directly to your inbox."
        source="blog-index"
      />
    </div>
  );
}
