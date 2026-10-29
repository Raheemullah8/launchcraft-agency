import { NextRequest, NextResponse } from "next/server";
import { createSubscriber } from "@/lib/cms/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, source = "email_popup", consentAccepted } = body;

    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Please provide a valid business email." }, { status: 400 });
    }

    if (!consentAccepted) {
      return NextResponse.json({ error: "Consent is required to subscribe to email updates." }, { status: 400 });
    }

    const { subscriber, alreadySubscribed } = await createSubscriber(email, source);

    return NextResponse.json(
      {
        success: true,
        alreadySubscribed,
        message: alreadySubscribed
          ? "You are already subscribed to LaunchCraft growth insights."
          : "Thank you for subscribing. Practical ideas will arrive directly to your inbox.",
        subscriberId: subscriber.id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in newsletter subscription:", error);
    return NextResponse.json(
      { error: "Could not process your subscription at this time." },
      { status: 500 }
    );
  }
}

