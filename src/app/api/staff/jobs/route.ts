import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/staff/jobs — staff: own jobs only
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const staffId = session.user?.id;

    const jobs = await prisma.job.findMany({
      where: { postedByStaffId: staffId },
      include: {
        company: { select: { name: true, logoColor: true, logoText: true } },
        skills: true,
        _count: { select: { applications: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ jobs });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch jobs" }, { status: 500 });
  }
}

// POST /api/staff/jobs — staff: post a job on behalf of a company
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const staffId = session.user?.id;

    const body = await req.json();
    const {
      companyId, title, description, location, isRemote, type, experience,
      salaryMin, salaryMax, category, contactEmail, deadline, skills, requiresResume,
    } = body;

    if (!companyId || !title || !description) {
      return NextResponse.json({ error: "Company, title and description are required" }, { status: 400 });
    }

    // Verify staff owns this company
    const company = await prisma.company.findFirst({
      where: { id: companyId, addedByStaffId: staffId },
    });
    if (!company) {
      return NextResponse.json({ error: "Company not found or not yours" }, { status: 403 });
    }

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
        requiresResume: requiresResume !== false,
        postedByStaffId: staffId,
        skills: {
          create: (skills ?? []).map((s: string) => ({ skill: s })),
        },
      },
      include: { skills: true, company: true },
    });

    return NextResponse.json(job, { status: 201 });
  } catch (error: any) {
    console.error("Staff job POST error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to post job" }, { status: 500 });
  }
}
