import { Metadata } from "next";
import { getBlogPosts } from "../../sanity/lib/queries";
import { BlogExplorer } from "./blog-explorer";
import styles from "./blog.module.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Liner Notes | Soundgoose",
  description:
    "Engineering dispatches, spatial audio research, and studio production notes from Soundgoose.",
  alternates: {
    canonical: "https://soundgoose.com/blog",
  },
  openGraph: {
    title: "Liner Notes | Soundgoose",
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
      <BlogExplorer posts={posts} />
    </main>
  );
}
