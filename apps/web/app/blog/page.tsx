import { Metadata } from "next";
import { getBlogPosts } from "../../sanity/lib/queries";
import { BlogExplorer } from "./blog-explorer";
import styles from "./blog.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blogs | Soundgoose",
  description:
    "Engineering dispatches, spatial audio research, and studio production notes from Soundgoose.",
  alternates: {
    canonical: "https://soundgoose.com/blog",
  },
  openGraph: {
    title: "Blogs | Soundgoose",
    description:
      "Engineering dispatches, spatial audio research, and studio production notes from Soundgoose.",
    url: "https://soundgoose.com/blog",
    siteName: "Soundgoose",
    type: "website",
  },
};

export default async function BlogIndexPage() {
  const posts = await getBlogPosts();

  return (
    <main className={styles.container}>
      <header className={styles.masthead}>
        <div className={styles.mastheadTop}>
          <h1 className={styles.title}>Blogs</h1>
          <span className={styles.countBadge}>
            {posts.length} {posts.length === 1 ? "Article" : "Articles"}
          </span>
        </div>
      </header>

      <BlogExplorer posts={posts} />
    </main>
  );
}
