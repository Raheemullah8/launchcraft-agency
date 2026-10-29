import fs from "fs";
import path from "path";

// Private storage directory outside public/
const PRIVATE_STORAGE_DIR = path.join(process.cwd(), "storage", "private", "cvs");

export function ensureStorageDir(): void {
  if (!fs.existsSync(PRIVATE_STORAGE_DIR)) {
    fs.mkdirSync(PRIVATE_STORAGE_DIR, { recursive: true });
  }
}

export interface StoredFileInfo {
  key: string;
  originalName: string;
  size: number;
  mimeType: string;
}

export async function savePrivateCVFile(
  file: File
): Promise<StoredFileInfo> {
  ensureStorageDir();

  // Validate file size (max 5 MB)
  const MAX_SIZE = 5 * 1024 * 1024; // 5 MB
  if (file.size > MAX_SIZE) {
    throw new Error("File exceeds maximum allowed size of 5 MB.");
  }

  // Validate allowed extensions and mime types
  const lowerName = file.name.toLowerCase();
  const isPdf = lowerName.endsWith(".pdf") || file.type === "application/pdf";
  const isDocx =
    lowerName.endsWith(".docx") ||
    file.type === "application/vnd.openxmlformats-officedocument.wordprocessingml.document" ||
    lowerName.endsWith(".doc") ||
    file.type === "application/msword";

  if (!isPdf && !isDocx) {
    throw new Error("Invalid file format. Only PDF and DOCX files are permitted.");
  }

  // Clean filename and create unique storage key
  const ext = path.extname(file.name) || (isPdf ? ".pdf" : ".docx");
  const sanitizedBase = path
    .basename(file.name, ext)
    .replace(/[^a-zA-Z0-9_-]/g, "_")
    .substring(0, 40);
  const uniqueKey = `cv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}_${sanitizedBase}${ext}`;
  const filePath = path.join(PRIVATE_STORAGE_DIR, uniqueKey);

  const arrayBuffer = await file.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  fs.writeFileSync(filePath, buffer);

  return {
    key: uniqueKey,
    originalName: file.name,
    size: file.size,
    mimeType: isPdf ? "application/pdf" : "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  };
}

export function getPrivateCVFilePath(key: string): string | null {
  ensureStorageDir();
  // Prevent directory traversal attacks
  const safeKey = path.basename(key);
  const targetPath = path.join(PRIVATE_STORAGE_DIR, safeKey);
  if (fs.existsSync(targetPath)) {
    return targetPath;
  }
  return null;
}

