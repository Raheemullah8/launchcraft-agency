import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Check admin authentication
    const token = req.cookies.get("launchcraft_admin_token");
    if (token?.value !== "authenticated_session") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const mediaList = await prisma.media.findMany({
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        filename: true,
        mimeType: true,
        size: true,
        altText: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    const items = mediaList.map((m) => ({
      ...m,
      url: `/api/media/${m.id}`,
    }));

    return NextResponse.json({ media: items });
  } catch (error) {
    console.error("[MEDIA_LIST_ERROR]:", error);
    return NextResponse.json(
      { error: "Failed to fetch media assets from database" },
      { status: 500 }
    );
  }
}

