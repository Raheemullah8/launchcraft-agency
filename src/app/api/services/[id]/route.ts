import { NextRequest, NextResponse } from "next/server";
import { getServiceBySlug, saveService, deleteService } from "@/lib/cms/store";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Check by ID or slug
    const service =
      (await prisma.service.findUnique({ where: { id } })) ||
      (await getServiceBySlug(id));

    if (!service) {
      return NextResponse.json({ error: "Service not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, service });
  } catch (error) {
    console.error("[SERVICE_GET_BY_ID_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch service" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const saved = await saveService({ ...body, id });
    return NextResponse.json({ success: true, service: saved });
  } catch (error) {
    console.error("[SERVICE_PUT_ERROR]:", error);
    return NextResponse.json({ error: "Failed to update service" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteService(id);
    return NextResponse.json({ success: true, message: "Service deleted successfully" });
  } catch (error) {
    console.error("[SERVICE_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to delete service" }, { status: 500 });
  }
}

