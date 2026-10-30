import { NextRequest, NextResponse } from "next/server";
import { getApplications } from "@/lib/cms/store";
import { ApplicationStatus } from "@/lib/cms/types";

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
    const jobId = searchParams.get("jobId") || undefined;
    const status = (searchParams.get("status") as ApplicationStatus) || undefined;
    const search = searchParams.get("search") || undefined;

    const applications = await getApplications({ jobId, status, search });
    return NextResponse.json({ success: true, count: applications.length, applications });
  } catch (error) {
    console.error("[APPLICATIONS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch candidate applications" }, { status: 500 });
  }
}

