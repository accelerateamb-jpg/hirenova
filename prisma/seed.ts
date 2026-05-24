import "dotenv/config";
import { Pool } from "pg";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma/client";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: process.env.DIRECT_URL ?? process.env.DATABASE_URL! });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Seeding HireNova database...");

  // ─── Admin ──────────────────────────────────────────────────────────────────
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
  console.log("✅ Admin created:", admin.email);

  // ─── Companies ──────────────────────────────────────────────────────────────
  const companyData = [
    { name: "TechCorp India", hrName: "Priya Sharma", email: "hr@techcorp.in", industry: "Software & Technology", size: "500–1000", location: "Bangalore", description: "Building next-gen enterprise software solutions.", logoColor: "#4f46e5", logoText: "TC" },
    { name: "InnoVate Solutions", hrName: "Rahul Mehta", email: "talent@innovate.com", industry: "SaaS & Consulting", size: "200–500", location: "Hyderabad", description: "Digital transformation partner for Fortune 500 companies.", logoColor: "#2563eb", logoText: "IS" },
    { name: "CloudBase Systems", hrName: "Anita Verma", email: "jobs@cloudbase.io", industry: "Cloud Infrastructure", size: "100–200", location: "Pune", description: "Cloud-native infrastructure for modern businesses.", logoColor: "#0891b2", logoText: "CB" },
    { name: "AnalyticsPro", hrName: "Deepak Nair", email: "careers@analyticspro.ai", industry: "Data & Analytics", size: "200–500", location: "Chennai", description: "AI-powered analytics for enterprise decision-making.", logoColor: "#7c3aed", logoText: "AP" },
    { name: "ScaleTech", hrName: "Sneha Gupta", email: "hr@scaletech.in", industry: "FinTech", size: "100–200", location: "Gurgaon", description: "Building financial infrastructure for the next billion.", logoColor: "#059669", logoText: "ST" },
  ];

  const companies: any[] = [];
  const companyPass = await bcrypt.hash("Company@2026", 12);

  for (const c of companyData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        password: companyPass,
        name: c.hrName,
        role: "COMPANY",
        company: {
          create: {
            name: c.name,
            hrName: c.hrName,
            industry: c.industry,
            size: c.size,
            location: c.location,
            description: c.description,
            logoColor: c.logoColor,
            logoText: c.logoText,
            isVerified: true,
            status: "APPROVED",
          },
        },
      },
      include: { company: true },
    });
    companies.push(user.company);
    console.log("✅ Company created:", c.name);
  }

  // ─── Jobs ────────────────────────────────────────────────────────────────────
  const jobsData = [
    {
      companyIdx: 0,
      title: "Senior Frontend Developer",
      description: "We are looking for a passionate Senior Frontend Developer to join our growing engineering team. You'll work on cutting-edge products used by millions.",
      location: "Bangalore, Karnataka",
      isRemote: true,
      type: "Full-time",
      experience: "3–5 years",
      salaryMin: 1200000,
      salaryMax: 2000000,
      category: "Engineering",
      skills: ["React", "TypeScript", "Next.js", "Tailwind CSS"],
    },
    {
      companyIdx: 1,
      title: "Product Manager",
      description: "Drive product vision and strategy for our flagship SaaS platform. Collaborate with cross-functional teams to deliver exceptional user experiences.",
      location: "Hyderabad, Telangana",
      isRemote: false,
      type: "Full-time",
      experience: "5–8 years",
      salaryMin: 2000000,
      salaryMax: 3500000,
      category: "Product",
      skills: ["Product Strategy", "Agile", "Data Analysis", "Roadmapping"],
    },
    {
      companyIdx: 2,
      title: "DevOps Engineer",
      description: "Build and maintain robust cloud infrastructure. Automate deployment pipelines and ensure 99.9% uptime across our services.",
      location: "Pune, Maharashtra",
      isRemote: true,
      type: "Full-time",
      experience: "2–4 years",
      salaryMin: 1000000,
      salaryMax: 1600000,
      category: "Engineering",
      skills: ["AWS", "Docker", "Kubernetes", "CI/CD", "Terraform"],
    },
    {
      companyIdx: 3,
      title: "Data Scientist",
      description: "Build predictive models and derive insights from large datasets. Work on NLP, recommendation systems, and real-time analytics.",
      location: "Chennai, Tamil Nadu",
      isRemote: true,
      type: "Full-time",
      experience: "3–6 years",
      salaryMin: 1500000,
      salaryMax: 2500000,
      category: "Data",
      skills: ["Python", "Machine Learning", "SQL", "TensorFlow"],
    },
    {
      companyIdx: 4,
      title: "Backend Engineer (Node.js)",
      description: "Design and implement scalable backend services. Optimize database queries and build robust REST/GraphQL APIs.",
      location: "Gurgaon, Haryana",
      isRemote: false,
      type: "Full-time",
      experience: "2–5 years",
      salaryMin: 1000000,
      salaryMax: 1800000,
      category: "Engineering",
      skills: ["Node.js", "PostgreSQL", "Redis", "GraphQL", "Microservices"],
    },
    {
      companyIdx: 0,
      title: "UI/UX Designer",
      description: "Create beautiful, intuitive interfaces for web and mobile applications. Work closely with product and engineering teams.",
      location: "Bangalore, Karnataka",
      isRemote: false,
      type: "Full-time",
      experience: "2–4 years",
      salaryMin: 800000,
      salaryMax: 1400000,
      category: "Design",
      skills: ["Figma", "User Research", "Prototyping", "Design Systems"],
    },
  ];

  const deadline = new Date();
  deadline.setDate(deadline.getDate() + 30);

  for (const j of jobsData) {
    const company = companies[j.companyIdx];
    if (!company) continue;

    await prisma.job.create({
      data: {
        companyId: company.id,
        title: j.title,
        description: j.description,
        location: j.location,
        isRemote: j.isRemote,
        type: j.type,
        experience: j.experience,
        salaryMin: j.salaryMin,
        salaryMax: j.salaryMax,
        category: j.category,
        deadline,
        status: "ACTIVE",
        skills: {
          create: j.skills.map((s) => ({ skill: s })),
        },
      },
    });
    console.log("✅ Job created:", j.title);
  }

  // ─── Candidates ──────────────────────────────────────────────────────────────
  const candidateData = [
    {
      name: "Arjun Kumar",
      email: "arjun@hirenova.com",
      location: "Bangalore",
      experience: 4,
      qualification: "B.Tech Computer Science",
      currentRole: "Frontend Developer",
      summary: "Passionate frontend developer with 4 years of experience building scalable web applications.",
      expectedSalary: 1800000,
      skills: ["React", "TypeScript", "Node.js", "AWS"],
    },
    {
      name: "Priya Nair",
      email: "priya@hirenova.com",
      location: "Mumbai",
      experience: 2,
      qualification: "MBA Marketing",
      currentRole: "Associate PM",
      summary: "Results-driven product enthusiast with a knack for translating user needs into product solutions.",
      expectedSalary: 1200000,
      skills: ["Product Management", "SQL", "Figma", "Agile"],
    },
    {
      name: "Rohit Sharma",
      email: "rohit@hirenova.com",
      location: "Hyderabad",
      experience: 6,
      qualification: "B.E. Electronics",
      currentRole: "Senior Data Scientist",
      summary: "Data scientist specializing in NLP and computer vision.",
      expectedSalary: 2800000,
      skills: ["Python", "Machine Learning", "TensorFlow", "PostgreSQL"],
    },
  ];

  const candPass = await bcrypt.hash("Candidate@2026", 12);

  for (const c of candidateData) {
    const user = await prisma.user.upsert({
      where: { email: c.email },
      update: {},
      create: {
        email: c.email,
        password: candPass,
        name: c.name,
        role: "CANDIDATE",
        candidate: {
          create: {
            location: c.location,
            experience: c.experience,
            qualification: c.qualification,
            currentRole: c.currentRole,
            summary: c.summary,
            expectedSalary: c.expectedSalary,
            paymentStatus: "paid",
            profileCompletion: 85,
            skills: {
              create: c.skills.map((s) => ({ skill: s })),
            },
          },
        },
      },
      include: { candidate: true },
    });

    // Seed payment
    if (user.candidate) {
      await prisma.payment.create({
        data: {
          candidateId: user.candidate.id,
          amount: 100,
          status: "SUCCESS",
          method: "UPI",
          transactionId: `TXN-SEED-${user.id}`,
        },
      });
    }
    console.log("✅ Candidate created:", c.name);
  }

  console.log("\n🎉 Seeding complete!");
  console.log("─────────────────────────────────────");
  console.log("Admin Login:");
  console.log("  Email:    admin@hirenova.com");
  console.log("  Password: Admin@2026");
  console.log("─────────────────────────────────────");
  console.log("Sample Candidate Login:");
  console.log("  Email:    arjun@hirenova.com");
  console.log("  Password: Candidate@2026");
  console.log("─────────────────────────────────────");
  console.log("Sample Company Login:");
  console.log("  Email:    hr@techcorp.in");
  console.log("  Password: Company@2026");
  console.log("─────────────────────────────────────");
}

main()
  .catch((e) => {
    console.error("❌ Seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
