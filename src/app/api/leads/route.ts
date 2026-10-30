import { NextRequest, NextResponse } from "next/server";
import { getLeads, createLead } from "@/lib/cms/store";

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
    const status = searchParams.get("status") || undefined;
    const type = searchParams.get("type") || undefined;
    const search = searchParams.get("search") || undefined;

    const leads = await getLeads({ status, type, search });
    return NextResponse.json({ success: true, count: leads.length, leads });
  } catch (error) {
    console.error("[LEADS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch leads" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // Honeypot spam check
    if (body.website_trap && String(body.website_trap).length > 0) {
      return NextResponse.json({ success: true, message: "Inquiry received." }, { status: 200 });
    }

    const {
      type = "project_inquiry",
      name,
      businessName,
      email,
      phone,
      service,
      selectedServices,
      budget,
      budgetRange,
      timeline,
      message,
      description,
      source = "website",
    } = body;

    // Strict field validations
    if (!name || typeof name !== "string" || name.trim().length < 2) {
      return NextResponse.json({ error: "Please provide a valid name." }, { status: 400 });
    }

    if (!email || typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      return NextResponse.json({ error: "A valid email address is required." }, { status: 400 });
    }

    const finalMessage = (message || description || "").trim();
    if (finalMessage.length < 5) {
      return NextResponse.json({ error: "Please provide a description or message (at least 5 characters)." }, { status: 400 });
    }

    const lead = await createLead({
      type,
      name: name.trim(),
      businessName: businessName?.trim() || null,
      email: email.trim().toLowerCase(),
      phone: phone?.trim() || null,
      service: service || (Array.isArray(selectedServices) ? selectedServices.join(", ") : null),
      budget: budget || budgetRange || null,
      timeline: timeline?.trim() || null,
      message: finalMessage,
      source,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Your inquiry has been successfully submitted and logged in our system.",
        lead,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("[LEADS_POST_ERROR]:", error);
    return NextResponse.json({ error: "Failed to submit inquiry." }, { status: 500 });
  }
}

