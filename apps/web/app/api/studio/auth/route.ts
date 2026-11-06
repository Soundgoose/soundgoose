import { NextResponse } from "next/server";

const SESSION_COOKIE_NAME = "sg_studio_session";
const SESSION_MAX_AGE = 60 * 60 * 24 * 7; // 7 days in seconds

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const passcode = body?.passcode?.trim() || "";

    const expectedPasscode =
      process.env.STUDIO_PASSCODE?.trim() || "soundgoose";

    if (passcode === expectedPasscode) {
      const response = NextResponse.json({ ok: true });

      response.cookies.set({
        name: SESSION_COOKIE_NAME,
        value: "authenticated",
        httpOnly: true,
        path: "/",
        maxAge: SESSION_MAX_AGE,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
      });

      return response;
    }

    return NextResponse.json(
      { ok: false, error: "Incorrect team passcode. Please try again." },
      { status: 401 },
    );
  } catch {
    return NextResponse.json(
      { ok: false, error: "Authentication request failed." },
      { status: 500 },
    );
  }
}

export async function DELETE() {
  const response = NextResponse.json({ ok: true, message: "Logged out" });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    httpOnly: true,
    path: "/",
    maxAge: 0,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });
  return response;
}
