import { Metadata } from "next";
import { getBlogPosts } from "../../sanity/lib/queries";
import { BlogExplorer } from "./blog-explorer";
import styles from "./blog.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
      <BlogExplorer posts={posts} />
    </main>
  );
}
