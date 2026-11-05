import { Metadata } from "next";
import { getBlogPosts } from "../../sanity/lib/queries";
import { BlogExplorer } from "./blog-explorer";
import styles from "./blog.module.css";

export const revalidate = 60; // On-demand ISR fallback

export const metadata: Metadata = {
  title: "Blog — Sound Goose",
  description:
    "Dispatches, technical deep dives, and perspectives on spatial audio, browser sound engines, and the future of music production.",
  alternates: {
    canonical: "https://soundgoose.com/blog",
  },
  openGraph: {
    title: "Blog — Sound Goose",
    description:
      "Dispatches and technical deep dives on spatial audio, browser sound engines, and the future of music production.",
    url: "https://soundgoose.com/blog",
    siteName: "Sound Goose",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <main className={styles.container}>
      <header className={styles.hero}>
        <div className={styles.heroMeta}>
          <span className={styles.eyebrow}>Studio Dispatch</span>
          <span className={styles.countBadge}>
            {posts.length} {posts.length === 1 ? "Article" : "Articles"}
          </span>
        </div>
        <h1 className={styles.title}>Field Notes & Engineering</h1>
        <p className={styles.description}>
          Deep dives on interactive spatial audio, WebAudio engine performance,
          and workflows for the next generation of independent artists.
        </p>
      </header>

      <BlogExplorer posts={posts} />
    </main>
  );
}
