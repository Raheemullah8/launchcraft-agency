import { NextRequest, NextResponse } from "next/server";
import { getServices, saveService } from "@/lib/cms/store";

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const includeDrafts = searchParams.get("all") === "true" && isAdmin(req);

    const services = await getServices(!includeDrafts);
    return NextResponse.json({ success: true, count: services.length, services });
  } catch (error) {
    console.error("[SERVICES_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to fetch services" }, { status: 500 });
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

    const saved = await saveService(body);
    return NextResponse.json({ success: true, service: saved }, { status: 201 });
  } catch (error) {
    console.error("[SERVICES_POST_ERROR]:", error);
    return NextResponse.json({ error: "Failed to create service" }, { status: 500 });
  }
}

