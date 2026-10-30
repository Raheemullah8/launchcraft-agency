import { NextRequest, NextResponse } from "next/server";
import { getApplicationById, updateApplicationStatus, deleteApplication } from "@/lib/cms/store";
import { ApplicationStatus } from "@/lib/cms/types";

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
    const application = await getApplicationById(id);

    if (!application) {
      return NextResponse.json({ error: "Candidate application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("[APPLICATION_GET_BY_ID_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch application" }, { status: 500 });
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

    const updated = await updateApplicationStatus(id, body.status as ApplicationStatus);
    if (!updated) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, application: updated });
  } catch (error) {
    console.error("[APPLICATION_STATUS_UPDATE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to update application status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteApplication(id);
    return NextResponse.json({ success: true, message: "Application deleted successfully" });
  } catch (error) {
    console.error("[APPLICATION_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to delete application" }, { status: 500 });
  }
}

