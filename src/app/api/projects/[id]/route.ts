import { NextRequest, NextResponse } from "next/server";
import { getProjectBySlug, saveProject, deleteProject } from "@/lib/cms/store";
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
    const project =
      (await prisma.project.findUnique({ where: { id } })) ||
      (await getProjectBySlug(id));

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error("[PROJECT_GET_BY_ID_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch project" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const saved = await saveProject({ ...body, id });
    return NextResponse.json({ success: true, project: saved });
  } catch (error) {
    console.error("[PROJECT_PUT_ERROR]:", error);
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteProject(id);
    return NextResponse.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("[PROJECT_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 });
  }
}

