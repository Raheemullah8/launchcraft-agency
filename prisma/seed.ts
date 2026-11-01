import "dotenv/config";
import bcrypt from "bcryptjs";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

const connectionString = process.env.DATABASE_URL;

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  const adminEmail = (process.env.ADMIN_EMAIL || "").toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || "";
  const adminName = process.env.ADMIN_NAME || "";

  console.log(`Checking for admin user: ${adminEmail}...`);

  const existing = await prisma.user.findUnique({
    where: { email: adminEmail },
  });

  if (existing) {
    const isPasswordSame = await bcrypt.compare(adminPassword, existing.password);
    const isNameSame = existing.name === adminName;
    if (!isPasswordSame || !isNameSame) {
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await prisma.user.update({
        where: { email: adminEmail },
        data: {
          name: adminName,
          password: hashedPassword,
          role: "ADMIN",
        },
      });
      console.log(`Admin user (${adminEmail}) credentials updated from .env!`);
    } else {
      console.log(`Admin user (${adminEmail}) is already up to date.`);
    }
    return;
  }

  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  const admin = await prisma.user.create({
    data: {
      email: adminEmail,
      name: adminName,
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log(`Admin user created successfully!`);
  console.log(`ID: ${admin.id}`);
  console.log(`Email: ${admin.email}`);
  console.log(`Role: ${admin.role}`);
}

main()
  .catch((e) => {
    console.error("Seed error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });

