import { NextRequest, NextResponse } from "next/server";
import {
  getCMSData,
  saveService,
  deleteService,
  saveProject,
  deleteProject,
  saveJob,
  deleteJob,
  updateApplicationStatus,
  updateLeadStatus,
  updateSettings,
} from "@/lib/cms/store";

function isAuthenticated(req: NextRequest): boolean {
  const cookie = req.cookies.get("launchcraft_admin_token");
  return cookie?.value === "authenticated_session";
}

export async function GET(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const data = await getCMSData();
  return NextResponse.json(data);
}

export async function POST(req: NextRequest) {
  if (!isAuthenticated(req)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { action, payload } = await req.json();

    switch (action) {
      case "save_service":
        await saveService(payload);
        break;
      case "delete_service":
        await deleteService(payload.id);
        break;
      case "save_project":
        await saveProject(payload);
        break;
      case "delete_project":
        await deleteProject(payload.id);
        break;
      case "save_job":
        await saveJob(payload);
        break;
      case "delete_job":
        await deleteJob(payload.id);
        break;
      case "update_app_status":
        await updateApplicationStatus(payload.id, payload.status);
        break;
      case "update_lead_status":
        await updateLeadStatus(payload.id, payload.status);
        break;
      case "update_settings":
        await updateSettings(payload);
        break;
      default:
        return NextResponse.json({ error: "Unknown action" }, { status: 400 });
    }

    const updated = await getCMSData();
    return NextResponse.json({ success: true, data: updated });
  } catch (err) {
    console.error("Admin data action error:", err);
    return NextResponse.json({ error: "Operation failed." }, { status: 500 });
  }
}

