import { NextRequest, NextResponse } from "next/server";
import { getLeadById, updateLeadStatus, deleteLead } from "@/lib/cms/store";
import { LeadStatus } from "@/lib/cms/types";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const lead = await getLeadById(id);

    if (!lead) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead });
  } catch (error) {
    console.error("[LEAD_GET_BY_ID_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch lead" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    if (!body.status) {
      return NextResponse.json({ error: "Status field is required" }, { status: 400 });
    }

    const updated = await updateLeadStatus(id, body.status as LeadStatus);
    if (!updated) {
      return NextResponse.json({ error: "Lead not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, lead: updated });
  } catch (error) {
    console.error("[LEAD_STATUS_UPDATE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to update lead status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteLead(id);

    if (!deleted) {
      return NextResponse.json({ error: "Lead could not be deleted or does not exist" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Lead removed from system" });
  } catch (error) {
    console.error("[LEAD_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to delete lead" }, { status: 500 });
  }
}

