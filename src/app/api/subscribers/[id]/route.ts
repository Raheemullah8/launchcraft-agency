import { NextRequest, NextResponse } from "next/server";
import { updateSubscriberStatus, deleteSubscriber } from "@/lib/cms/store";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    if (typeof body.active !== "boolean") {
      return NextResponse.json({ error: "The 'active' boolean field is required" }, { status: 400 });
    }

    const updated = await updateSubscriberStatus(id, body.active);
    if (!updated) {
      return NextResponse.json({ error: "Subscriber not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, subscriber: updated });
  } catch (error) {
    console.error("[SUBSCRIBER_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Failed to update subscriber status" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const deleted = await deleteSubscriber(id);

    if (!deleted) {
      return NextResponse.json({ error: "Subscriber could not be deleted or does not exist" }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Subscriber removed from system" });
  } catch (error) {
    console.error("[SUBSCRIBER_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to delete subscriber" }, { status: 500 });
  }
}

