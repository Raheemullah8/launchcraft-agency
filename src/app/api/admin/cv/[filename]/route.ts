import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import { getPrivateCVFilePath } from "@/lib/cms/storage";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ filename: string }> }
) {
  // Check admin authorization
  const cookie = req.cookies.get("launchcraft_admin_token");
  if (cookie?.value !== "authenticated_session") {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const { filename } = await context.params;
  const filePath = getPrivateCVFilePath(filename);

  if (!filePath || !fs.existsSync(filePath)) {
    return new NextResponse("File not found", { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);
  const isPdf = filename.toLowerCase().endsWith(".pdf");
  const contentType = isPdf
    ? "application/pdf"
    : "application/vnd.openxmlformats-officedocument.wordprocessingml.document";

  return new NextResponse(fileBuffer, {
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}

