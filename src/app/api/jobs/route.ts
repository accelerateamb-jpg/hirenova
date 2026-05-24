import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { CompanyStatus, JobStatus, UserRole } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const location = searchParams.get("location") ?? "";
    const category = searchParams.get("category") ?? "";
    const remote = searchParams.get("remote") === "true";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const page = parseInt(searchParams.get("page") ?? "1");

    const where: any = {
      status: JobStatus.ACTIVE,
      isFlagged: false,
      company: { status: CompanyStatus.APPROVED },
      ...(search && {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { company: { name: { contains: search, mode: "insensitive" } } },
          { skills: { some: { skill: { contains: search, mode: "insensitive" } } } },
        ],
      }),
      ...(location && location !== "All" && {
        location: { contains: location, mode: "insensitive" },
      }),
      ...(category && category !== "All" && { category }),
      ...(remote && { isRemote: true }),
    };

    const [jobs, total] = await Promise.all([
      prisma.job.findMany({
        where,
        include: {
          company: { select: { name: true, logoColor: true, logoText: true } },
          skills: true,
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.job.count({ where }),
    ]);

    return NextResponse.json({ jobs, total, page, limit });
  } catch (error) {
    console.error("Jobs GET error:", error);
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "COMPANY") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const companyId = (session.user as any).companyId;
    if (!companyId) {
      return NextResponse.json({ error: "Company not found" }, { status: 404 });
    }

    const body = await req.json();
    const {
      title, description, location, isRemote, type, experience,
      salaryMin, salaryMax, category, contactEmail, deadline, skills,
    } = body;

    const job = await prisma.job.create({
      data: {
        companyId,
        title,
        description,
        location,
        isRemote: isRemote ?? false,
        type: type ?? "Full-time",
        experience,
        salaryMin: salaryMin ? parseInt(salaryMin) : null,
        salaryMax: salaryMax ? parseInt(salaryMax) : null,
        category,
        contactEmail,
        deadline: deadline ? new Date(deadline) : null,
        skills: {
          create: (skills ?? []).map((s: string) => ({ skill: s })),
        },
      },
      include: { skills: true, company: true },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error) {
    console.error("Job POST error:", error);
    return NextResponse.json({ error: "Failed to create job" }, { status: 500 });
  }
}
