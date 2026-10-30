import { NextRequest, NextResponse } from "next/server";
import { connection } from "next/server";
import { getSettings, updateSettings } from "@/lib/cms/store";

function isAdmin(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET() {
  await connection();
  try {
    const settings = await getSettings();
    return NextResponse.json(
      { success: true, settings },
      {
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate",
        },
      }
    );
  } catch (error) {
    console.error("[SETTINGS_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to load site settings" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  if (!isAdmin(req)) {
    return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const updated = await updateSettings(body);
    return NextResponse.json({ success: true, settings: updated });
  } catch (error) {
    console.error("[SETTINGS_PATCH_ERROR]:", error);
    return NextResponse.json({ error: "Failed to update site settings" }, { status: 500 });
  }
}

