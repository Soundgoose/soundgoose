import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const passcode = body?.passcode?.trim() || "";

    const expectedPasscode =
      process.env.STUDIO_PASSCODE?.trim() || "soundgoose";

    if (passcode === expectedPasscode) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: "Incorrect team passcode. Please try again." },
      { status: 401 },
    );
  } catch (err: unknown) {
    return NextResponse.json(
      { ok: false, error: "Authentication request failed." },
      { status: 500 },
    );
  }
}
