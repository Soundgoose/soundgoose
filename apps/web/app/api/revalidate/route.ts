import { revalidatePath } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const secret = req.headers.get("x-sanity-webhook-secret");
    const configuredSecret = process.env.SANITY_REVALIDATE_SECRET;

    if (configuredSecret && secret !== configuredSecret) {
      return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
    }

    const body = await req.json().catch(() => ({}));
    const { _type, slug } = body;

    // Revalidate index pages
    revalidatePath("/blog");
    revalidatePath("/newsletter");
    revalidatePath("/sitemap.xml");

    // Revalidate individual article if slug is provided
    if (_type === "post" && slug?.current) {
      revalidatePath(`/blog/${slug.current}`);
    } else if (_type === "newsletter" && slug?.current) {
      revalidatePath(`/newsletter/${slug.current}`);
    }

    return NextResponse.json({
      revalidated: true,
      now: Date.now(),
      target: slug?.current || "indices",
    });
  } catch (err: unknown) {
    return NextResponse.json(
      { message: "Error revalidating", error: String(err) },
      { status: 500 },
    );
  }
}
