import { NextRequest, NextResponse } from "next/server";
import { getPortfolioProjects, saveProject } from "@/lib/cms/store";

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category") || undefined;
    const search = searchParams.get("search") || undefined;
    const includeDrafts = searchParams.get("all") === "true" && isAdmin(req);

    const projects = await getPortfolioProjects({
      category,
      search,
      onlyPublished: !includeDrafts,
    });

    return NextResponse.json({ success: true, count: projects.length, projects });
  } catch (error) {
    console.error("[PROJECTS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();

    if (!body.title || !body.slug) {
      return NextResponse.json({ error: "Title and slug are required" }, { status: 400 });
    }

    const saved = await saveProject(body);
    return NextResponse.json({ success: true, project: saved }, { status: 201 });
  } catch (error) {
    console.error("[PROJECTS_POST_ERROR]:", error);
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 });
  }
}

