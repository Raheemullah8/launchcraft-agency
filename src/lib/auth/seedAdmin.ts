import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const DEFAULT_ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || "admin@launchcraft.agency",
  password: process.env.ADMIN_PASSWORD || "123",
  name: process.env.ADMIN_NAME || "LaunchCraft Admin",
  role: "ADMIN" as const,
};

/**
 * Ensures the default administrator user exists in the database.
 * If not present, creates the admin with hashed password.
 */
export async function ensureAdminUser() {
  const email = DEFAULT_ADMIN_CONFIG.email.toLowerCase().trim();

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    return existingAdmin;
  }

  // Hash the admin password securely
  const saltRounds = 10;
  const hashedPassword = await bcrypt.hash(DEFAULT_ADMIN_CONFIG.password, saltRounds);

  const newAdmin = await prisma.user.create({
    data: {
      email,
      name: DEFAULT_ADMIN_CONFIG.name,
      password: hashedPassword,
      role: DEFAULT_ADMIN_CONFIG.role,
    },
  });

  console.log(`[AUTH] Admin user initialized successfully: ${email}`);
  return newAdmin;
}

