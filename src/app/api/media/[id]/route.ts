import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(req: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json({ error: "Media ID required" }, { status: 400 });
    }

    const media = await prisma.media.findUnique({
      where: { id },
      select: {
        data: true,
        mimeType: true,
        size: true,
        filename: true,
        updatedAt: true,
      },
    });

    if (!media) {
      return NextResponse.json({ error: "Media asset not found" }, { status: 404 });
    }

    // Convert to Uint8Array for Next.js / Web Response
    const binaryData = new Uint8Array(media.data);

    return new Response(binaryData, {
      status: 200,
      headers: {
        "Content-Type": media.mimeType || "application/octet-stream",
        "Content-Length": media.size.toString(),
        // 1-year immutable cache - browser will cache it permanently
        "Cache-Control": "public, max-age=31536000, immutable",
        "Last-Modified": media.updatedAt.toUTCString(),
      },
    });
  } catch (error) {
    console.error("[MEDIA_GET_ERROR]:", error);
    return NextResponse.json({ error: "Failed to stream media" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: RouteParams) {
  try {
    // Check admin authentication
    const token = req.cookies.get("launchcraft_admin_token");
    if (token?.value !== "authenticated_session") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    await prisma.media.delete({
      where: { id },
    });

    return NextResponse.json({ success: true, message: "Media deleted successfully" });
  } catch (error) {
    console.error("[MEDIA_DELETE_ERROR]:", error);
    return NextResponse.json({ error: "Failed to delete media" }, { status: 500 });
  }
}

