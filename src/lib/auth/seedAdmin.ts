import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export const DEFAULT_ADMIN_CONFIG = {
  email: process.env.ADMIN_EMAIL || "admin@launchcraft.agency",
  password: process.env.ADMIN_PASSWORD || "123",
  name: process.env.ADMIN_NAME || "LaunchCraft Admin",
  role: "ADMIN" as const,
};

/**
 * Ensures the administrator user defined in .env exists in the database.
 * If not present, creates the user with hashed password.
 * If present, verifies and updates credentials if .env was changed.
 */
export async function ensureAdminUser() {
  const email = (process.env.ADMIN_EMAIL || DEFAULT_ADMIN_CONFIG.email).toLowerCase().trim();
  const password = process.env.ADMIN_PASSWORD || DEFAULT_ADMIN_CONFIG.password;
  const name = process.env.ADMIN_NAME || DEFAULT_ADMIN_CONFIG.name;

  if (!email || !password) {
    return null;
  }

  // Check if admin user already exists
  const existingAdmin = await prisma.user.findUnique({
    where: { email },
  });

  const saltRounds = 10;

  if (existingAdmin) {
    // If password in .env or name does not match the stored record, update it
    const isPasswordSame = await bcrypt.compare(password, existingAdmin.password);
    const isNameSame = existingAdmin.name === name;
    const isAdminRole = existingAdmin.role === "ADMIN";

    if (!isPasswordSame || !isNameSame || !isAdminRole) {
      const hashedPassword = isPasswordSame ? existingAdmin.password : await bcrypt.hash(password, saltRounds);
      const updated = await prisma.user.update({
        where: { email },
        data: {
          name,
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log(`[AUTH] Admin user (${email}) synchronized from .env credentials in database.`);
      return updated;
    }

    return existingAdmin;
  }

  // Hash the admin password securely
  const hashedPassword = await bcrypt.hash(password, saltRounds);

  const newAdmin = await prisma.user.create({
    data: {
      email,
      name,
      password: hashedPassword,
      role: DEFAULT_ADMIN_CONFIG.role,
    },
  });

  console.log(`[AUTH] Admin user initialized successfully in database: ${email}`);
  return newAdmin;
}

