import { NextRequest, NextResponse } from "next/server";
import { getJobBySlug, saveJob, deleteJob } from "@/lib/cms/store";
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
    const job =
      (await prisma.job.findUnique({ where: { id } })) ||
      (await getJobBySlug(id));

    if (!job) {
      return NextResponse.json({ error: "Job opening not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, job });
  } catch (error) {
    console.error("[JOB_GET_BY_ID_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch job" }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const saved = await saveJob({ ...body, id });
    return NextResponse.json({ success: true, job: saved });
  } catch (error) {
    console.error("[JOB_PUT_ERROR]:", error);
    return NextResponse.json({ error: "Failed to update job" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { id } = await params;
    await deleteJob(id);
    return NextResponse.json({ success: true, message: "Job deleted successfully" });
  } catch (error) {
    console.error("[JOB_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to delete job" }, { status: 500 });
  }
}

