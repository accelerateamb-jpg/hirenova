import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🧹 Cleaning up all dummy data...");

  await prisma.otpCode.deleteMany({});
  await prisma.savedJob.deleteMany({});
  await prisma.payment.deleteMany({});
  await prisma.application.deleteMany({});
  await prisma.jobSkill.deleteMany({});
  await prisma.job.deleteMany({});
  await prisma.candidateSkill.deleteMany({});
  await prisma.candidate.deleteMany({});
  await prisma.company.deleteMany({});
  await prisma.session.deleteMany({});

  // Delete all users except admin
  await prisma.user.deleteMany({
    where: { email: { not: "admin@hirenova.com" } },
  });

  console.log("✅ All dummy data removed.");
  console.log("✅ Admin account preserved: admin@hirenova.com / Admin@2026");
}

main()
  .catch((e) => { console.error("❌ Cleanup failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
