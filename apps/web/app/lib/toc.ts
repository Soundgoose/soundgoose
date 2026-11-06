export interface HeadingItem {
  id: string;
  text: string;
  level: "h2" | "h3";
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-");
}

export function extractHeadings(body: any): HeadingItem[] {
  if (!Array.isArray(body)) return [];

  const headings: HeadingItem[] = [];

  for (const block of body) {
    if (
      block?._type === "block" &&
      (block.style === "h2" || block.style === "h3")
    ) {
      const text = (block.children || [])
        .map((child: any) => child?.text || "")
        .join("")
        .trim();

      if (text) {
        headings.push({
          id: slugify(text),
          text,
          level: block.style as "h2" | "h3",
        });
      }
    }
  }

  return headings;
}
