/**
 * Estimates reading time in minutes from Portable Text blocks or text strings.
 */
export function calculateReadingTime(content: any): number {
  if (!content) return 1;

  let text = "";

  if (typeof content === "string") {
    text = content;
  } else if (Array.isArray(content)) {
    // Portable Text array
    for (const block of content) {
      if (block?.children && Array.isArray(block.children)) {
        for (const child of block.children) {
          if (child?.text) {
            text += " " + child.text;
          }
        }
      }
    }
  }

  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const wordsPerMinute = 200;
  const minutes = Math.ceil(words / wordsPerMinute);
  return Math.max(1, minutes);
}
