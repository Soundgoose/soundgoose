import { Metadata } from "next";
import { getBlogPosts } from "../../sanity/lib/queries";
import { BlogExplorer } from "./blog-explorer";
import styles from "./blog.module.css";

export const revalidate = 60; // On-demand ISR fallback

export const metadata: Metadata = {
  title: "Liner Notes | Sound Goose",
  description:
    "Engineering dispatches, spatial audio research, and studio production notes from Sound Goose.",
  alternates: {
    canonical: "https://soundgoose.com/blog",
  },
  openGraph: {
    title: "Liner Notes | Sound Goose",
    description:
      "Engineering dispatches, spatial audio research, and studio production notes from Sound Goose.",
    url: "https://soundgoose.com/blog",
    siteName: "Sound Goose",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <main className={styles.container}>
      <header className={styles.masthead}>
        <div className={styles.mastheadTop}>
          <h1 className={styles.title}>Liner Notes</h1>
          <span className={styles.countBadge}>
            {posts.length} {posts.length === 1 ? "Dispatch" : "Dispatches"}
          </span>
        </div>
      </header>

      <BlogExplorer posts={posts} />
    </main>
  );
}
