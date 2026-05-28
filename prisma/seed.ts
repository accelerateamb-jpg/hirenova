import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding HireNova...\n");

  // ─── Super Admin ────────────────────────────────────────────────────────────
  const adminPassword = await bcrypt.hash("Admin@2026", 12);
  await prisma.user.upsert({
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

  // ─── Test Company HR ────────────────────────────────────────────────────────
  const companyPassword = await bcrypt.hash("Company@2026", 12);
  const companyUser = await prisma.user.upsert({
    where: { email: "company@hirenova.com" },
    update: {},
    create: {
      email: "company@hirenova.com",
      password: companyPassword,
      name: "Priya Mehta",
      mobile: "+91 98765 11111",
      role: "COMPANY",
      company: {
        create: {
          name: "TechCorp India Pvt Ltd",
          hrName: "Priya Mehta",
          industry: "Information Technology",
          size: "201-500",
          location: "Bangalore, Karnataka",
          address: "No. 42, MG Road, Bangalore - 560001",
          description:
            "TechCorp India is a fast-growing product company building SaaS solutions for enterprise clients across India and Southeast Asia. We are hiring passionate engineers and product thinkers.",
          website: "https://techcorp.in",
          logoColor: "#4f46e5",
          logoText: "TC",
          isVerified: true,
          status: "APPROVED",
        },
      },
    },
    include: { company: true },
  });

  const company = companyUser.company!;

  // ─── Jobs posted by TechCorp ─────────────────────────────────────────────
  const job1 = await prisma.job.upsert({
    where: { id: "seed-job-001" },
    update: {},
    create: {
      id: "seed-job-001",
      companyId: company.id,
      title: "Senior Frontend Developer",
      description:
        "We are looking for a Senior Frontend Developer with strong React and TypeScript skills to lead our web product team. You will architect scalable UI components, mentor junior developers, and collaborate closely with product and design.\n\nResponsibilities:\n- Build and maintain high-quality React applications\n- Write clean, testable TypeScript code\n- Lead code reviews and mentor junior developers\n- Collaborate with designers to implement pixel-perfect UIs\n\nRequirements:\n- 3+ years of React experience\n- Strong TypeScript knowledge\n- Experience with Next.js\n- Familiarity with REST APIs and state management",
      location: "Bangalore, Karnataka",
      isRemote: false,
      type: "Full-time",
      experience: "3-5 years",
      salaryMin: 1200000,
      salaryMax: 1800000,
      category: "Engineering",
      contactEmail: "hr@techcorp.in",
      deadline: new Date("2026-07-31"),
      status: "ACTIVE",
      skills: {
        create: [
          { skill: "React" },
          { skill: "TypeScript" },
          { skill: "Next.js" },
          { skill: "Tailwind CSS" },
          { skill: "Git" },
        ],
      },
    },
  });

  const job2 = await prisma.job.upsert({
    where: { id: "seed-job-002" },
    update: {},
    create: {
      id: "seed-job-002",
      companyId: company.id,
      title: "Backend Engineer — Node.js",
      description:
        "Join our backend team to build robust APIs and microservices powering our SaaS platform. You will work with Node.js, PostgreSQL, and cloud infrastructure.\n\nResponsibilities:\n- Design and build RESTful APIs\n- Optimize database queries and schema design\n- Implement authentication, authorization, and security best practices\n- Deploy and monitor services on AWS\n\nRequirements:\n- 2+ years Node.js experience\n- PostgreSQL or MySQL proficiency\n- Experience with REST API design\n- Basic AWS or cloud knowledge",
      location: "Bangalore, Karnataka",
      isRemote: true,
      type: "Full-time",
      experience: "2-4 years",
      salaryMin: 1000000,
      salaryMax: 1600000,
      category: "Engineering",
      contactEmail: "hr@techcorp.in",
      deadline: new Date("2026-08-15"),
      status: "ACTIVE",
      skills: {
        create: [
          { skill: "Node.js" },
          { skill: "PostgreSQL" },
          { skill: "REST API" },
          { skill: "AWS" },
          { skill: "Docker" },
        ],
      },
    },
  });

  await prisma.job.upsert({
    where: { id: "seed-job-003" },
    update: {},
    create: {
      id: "seed-job-003",
      companyId: company.id,
      title: "Product Manager",
      description:
        "We need an experienced Product Manager to own our core SaaS product roadmap. You will work with engineering, design, and sales teams to define and deliver features that delight our customers.\n\nResponsibilities:\n- Define product vision and roadmap\n- Write detailed PRDs and user stories\n- Prioritise backlog and manage sprint planning\n- Analyse product metrics and user feedback\n\nRequirements:\n- 3+ years in product management\n- Experience with B2B SaaS products\n- Strong analytical and communication skills\n- Familiarity with Agile/Scrum",
      location: "Bangalore, Karnataka",
      isRemote: false,
      type: "Full-time",
      experience: "3-6 years",
      salaryMin: 1500000,
      salaryMax: 2500000,
      category: "Product",
      contactEmail: "hr@techcorp.in",
      deadline: new Date("2026-07-15"),
      status: "ACTIVE",
      skills: {
        create: [
          { skill: "Product Management" },
          { skill: "Agile" },
          { skill: "Roadmapping" },
          { skill: "Analytics" },
          { skill: "Figma" },
        ],
      },
    },
  });

  // ─── Test Candidate ──────────────────────────────────────────────────────
  const candidatePassword = await bcrypt.hash("Candidate@2026", 12);
  const candidateUser = await prisma.user.upsert({
    where: { email: "candidate@hirenova.com" },
    update: {},
    create: {
      email: "candidate@hirenova.com",
      password: candidatePassword,
      name: "Rahul Sharma",
      mobile: "+91 98765 22222",
      role: "CANDIDATE",
      candidate: {
        create: {
          location: "Bangalore, Karnataka",
          experience: 4,
          qualification: "B.Tech Computer Science — VIT Vellore (2020)",
          currentRole: "Frontend Developer",
          expectedSalary: 1500000,
          summary:
            "Passionate frontend developer with 4 years of experience building responsive web applications using React and TypeScript. I enjoy turning complex problems into simple, intuitive interfaces. Currently looking for senior roles in product-focused companies.",
          paymentStatus: "paid",
          profileCompletion: 90,
          skills: {
            create: [
              { skill: "React", level: "advanced" },
              { skill: "TypeScript", level: "advanced" },
              { skill: "Next.js", level: "intermediate" },
              { skill: "Tailwind CSS", level: "intermediate" },
              { skill: "Node.js", level: "intermediate" },
              { skill: "PostgreSQL", level: "beginner" },
              { skill: "Git", level: "advanced" },
              { skill: "Figma", level: "beginner" },
            ],
          },
          payments: {
            create: {
              amount: 100,
              status: "SUCCESS",
              method: "UPI",
              transactionId: "seed-txn-rahul-001",
            },
          },
        },
      },
    },
    include: { candidate: true },
  });

  const candidate = candidateUser.candidate!;

  // ─── Applications ────────────────────────────────────────────────────────
  await prisma.application.upsert({
    where: { candidateId_jobId: { candidateId: candidate.id, jobId: job1.id } },
    update: {},
    create: {
      candidateId: candidate.id,
      jobId: job1.id,
      status: "SHORTLISTED",
      coverNote:
        "I have 4 years of React and TypeScript experience and have built several production-grade applications. I am excited about this role and believe I can contribute to your frontend team from day one.",
    },
  });

  await prisma.application.upsert({
    where: { candidateId_jobId: { candidateId: candidate.id, jobId: job2.id } },
    update: {},
    create: {
      candidateId: candidate.id,
      jobId: job2.id,
      status: "PENDING",
      coverNote:
        "While my primary expertise is frontend, I have solid Node.js and PostgreSQL experience from full-stack projects. Happy to discuss further.",
    },
  });

  // ─── Summary ─────────────────────────────────────────────────────────────
  console.log("✅ Seeding complete!\n");
  console.log("┌─────────────────────────────────────────────────────┐");
  console.log("│                  LOGIN CREDENTIALS                  │");
  console.log("├─────────────────────────────────────────────────────┤");
  console.log("│  SUPER ADMIN                                        │");
  console.log("│  Email:    admin@hirenova.com                       │");
  console.log("│  Password: Admin@2026                               │");
  console.log("│  URL:      /admin/login                             │");
  console.log("├─────────────────────────────────────────────────────┤");
  console.log("│  CANDIDATE                                          │");
  console.log("│  Email:    candidate@hirenova.com                   │");
  console.log("│  Password: Candidate@2026                           │");
  console.log("│  URL:      /candidate/login                         │");
  console.log("├─────────────────────────────────────────────────────┤");
  console.log("│  COMPANY HR                                         │");
  console.log("│  Email:    company@hirenova.com                     │");
  console.log("│  Password: Company@2026                             │");
  console.log("│  URL:      /company/login                           │");
  console.log("└─────────────────────────────────────────────────────┘");
}

main()
  .catch((e) => { console.error("❌ Seed failed:", e); process.exit(1); })
  .finally(() => prisma.$disconnect());
