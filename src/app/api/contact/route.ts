import { NextRequest, NextResponse } from "next/server";
import { createLead } from "@/lib/cms/store";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot spam check
    if (body.website_trap && body.website_trap.length > 0) {
      return NextResponse.json({ success: true, message: "Inquiry received." }, { status: 200 });
    }

    const {
      type = "general_contact",
      name,
      businessName,
      email,
      phone,
      subject,
      selectedServices = [],
      description,
      timeline,
      budgetRange,
      consentAccepted,
    } = body;

    // Strict validation
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please provide your name." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    if (!description || typeof description !== "string" || description.trim().length < 5) {
      return NextResponse.json({ error: "Please provide brief details regarding your inquiry." }, { status: 400 });
    }

    if (!consentAccepted) {
      return NextResponse.json({ error: "Consent to privacy policy is required." }, { status: 400 });
    }

    const lead = await createLead({
      type: type === "project_inquiry" ? "project_inquiry" : "general_contact",
      name: name.trim(),
      businessName: businessName?.trim(),
      email: email.trim().toLowerCase(),
      phone: phone?.trim(),
      subject: subject?.trim(),
      selectedServices: Array.isArray(selectedServices) ? selectedServices : [],
      description: description.trim(),
      timeline: timeline?.trim(),
      budgetRange: budgetRange?.trim(),
      consentAccepted: Boolean(consentAccepted),
      consentTimestamp: new Date().toISOString(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been received. Our team will review and respond within 1 business day.",
        leadId: lead.id,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error submitting contact inquiry:", error);
    return NextResponse.json(
      { error: "An unexpected error occurred while processing your submission. Please try again." },
      { status: 500 }
    );
  }
}

