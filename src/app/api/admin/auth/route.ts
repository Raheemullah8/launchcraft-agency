import { NextRequest, NextResponse } from "next/server";

const ADMIN_SECRET = process.env.ADMIN_SECRET_KEY || "launchcraft2026";

export async function POST(req: NextRequest) {
  try {
    const { passkey } = await req.json();

    if (passkey === ADMIN_SECRET) {
      const response = NextResponse.json({ success: true });
      response.cookies.set("launchcraft_admin_token", "authenticated_session", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24 * 7, // 7 days
      });
      return response;
    }

    return NextResponse.json({ error: "Invalid administrative credentials." }, { status: 401 });
  } catch {
    return NextResponse.json({ error: "Authentication failed." }, { status: 500 });
  }
}

export async function DELETE() {
  const response = NextResponse.json({ success: true, message: "Logged out." });
  response.cookies.set("launchcraft_admin_token", "", {
    path: "/",
    maxAge: 0,
  });
  return response;
}

