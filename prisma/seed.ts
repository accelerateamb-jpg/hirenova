import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding HireNova...");

  const adminPassword = await bcrypt.hash("Admin@2026", 12);
  const admin = await prisma.user.upsert({
    where: { email: "admin@hirenova.com" },
    update: {},
    create: {
      email: "admin@hirenova.com",
      password: adminPassword,
      name: "Super Admin",
      mobile: "+91 99999 00000",
      role: "ADMIN",
    },
  });

  console.log("✅ Admin ready:", admin.email);
  console.log("─────────────────────────────────────");
  console.log("  Email:    admin@hirenova.com");
  console.log("  Password: Admin@2026");
  console.log("─────────────────────────────────────");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
