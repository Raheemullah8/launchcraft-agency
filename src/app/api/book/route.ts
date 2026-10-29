import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/cms/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      name,
      email,
      businessName,
      serviceInterest,
      date,
      timeSlot,
      timezone,
      notes,
      consentAccepted,
    } = body;

    if (!name || name.trim().length < 2) {
      return NextResponse.json({ error: "Name is required." }, { status: 400 });
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "Valid email is required." }, { status: 400 });
    }
    if (!date || !timeSlot) {
      return NextResponse.json({ error: "Please select an available date and time slot." }, { status: 400 });
    }
    if (!consentAccepted) {
      return NextResponse.json({ error: "Consent to policy is required." }, { status: 400 });
    }

    const lead = await createLead({
      type: "project_inquiry",
      name: name.trim(),
      businessName: businessName?.trim(),
      email: email.trim().toLowerCase(),
      selectedServices: serviceInterest ? [serviceInterest] : ["Consultation"],
      description: `[BOOKING REQUEST] Scheduled Date: ${date} at ${timeSlot} (${timezone || "UTC"}). Notes: ${notes || "None"}`,
      consentAccepted: true,
      consentTimestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        bookingId: lead.id,
        appointment: {
          date,
          timeSlot,
          timezone: timezone || "UTC",
        },
        message: "Your consultation request has been confirmed. A calendar invitation has been reserved.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating booking:", error);
    return NextResponse.json(
      { error: "Booking could not be scheduled. Please try again." },
      { status: 500 }
    );
  }
}

