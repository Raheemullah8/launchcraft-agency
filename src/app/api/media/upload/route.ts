import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB limit
const ALLOWED_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/svg+xml",
  "image/gif",
  "image/avif",
];

export async function POST(req: NextRequest) {
  try {
    // 1. Verify admin authorization
    const token = req.cookies.get("launchcraft_admin_token");
    if (token?.value !== "authenticated_session") {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const altText = (formData.get("altText") as string) || null;

    if (!file) {
      return NextResponse.json({ error: "No image file provided" }, { status: 400 });
    }

    // 2. Validate file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Invalid file type. Only JPEG, PNG, WebP, SVG, and GIF are permitted." },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: "File exceeds maximum size threshold of 10 MB." },
        { status: 400 }
      );
    }

    // 4. Convert to Buffer for PostgreSQL BYTEA
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // 5. Store in database
    const media = await prisma.media.create({
      data: {
        filename: file.name,
        mimeType: file.type,
        data: buffer,
        size: file.size,
        altText,
      },
    });

    return NextResponse.json({
      success: true,
      id: media.id,
      url: `/api/media/${media.id}`,
      filename: media.filename,
      size: media.size,
      mimeType: media.mimeType,
    });
  } catch (error) {
    console.error("[MEDIA_UPLOAD_ERROR]:", error);
    return NextResponse.json(
      { error: "Internal server error occurred while processing media upload." },
      { status: 500 }
    );
  }
}

