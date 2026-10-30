import { NextRequest, NextResponse } from "next/server";
import { getSubscribers, createSubscriber } from "@/lib/cms/store";

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const activeParam = searchParams.get("active");
    const active = activeParam !== null ? activeParam === "true" : undefined;

    const subscribers = await getSubscribers({ active, search });
    return NextResponse.json({ success: true, count: subscribers.length, subscribers });
  } catch (error) {
    console.error("[SUBSCRIBERS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch subscribers" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = "footer" } = body;

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid email address." }, { status: 400 });
    }

    const { subscriber, alreadySubscribed } = await createSubscriber(email.trim(), source);

    return NextResponse.json(
      {
        success: true,
        alreadySubscribed,
        message: alreadySubscribed
          ? "You are already subscribed to LaunchCraft insights."
          : "Thank you for subscribing to LaunchCraft insights.",
        subscriber,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[SUBSCRIBERS_POST_ERROR]:", error);
    return NextResponse.json({ error: "Failed to process newsletter subscription" }, { status: 500 });
  }
}

