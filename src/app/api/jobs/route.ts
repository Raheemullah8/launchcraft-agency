
import { NextRequest, NextResponse } from "next/server";
import { getJobs, saveJob } from "@/lib/cms/store";

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeAll = searchParams.get("all") === "true" && isAdmin(req);

    const jobs = await getJobs(!includeAll);
    return NextResponse.json({ success: true, count: jobs.length, jobs });
  } catch (error) {
    console.error("[JOBS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title || !body.slug || !body.department || !body.location) {
      return NextResponse.json(
        { error: "Title, slug, department, and location are required." },
        { status: 400 }
      );
    }

    const saved = await saveJob(body);
    return NextResponse.json({ success: true, job: saved }, { status: 201 });
  } catch (error) {
    console.error("[JOBS_POST_ERROR]:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
