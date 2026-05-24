import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { ApplicationStatus, PaymentStatus } from "@/generated/prisma/enums";

// GET /api/applications — candidate gets own, company gets for their jobs, admin gets all
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    const { searchParams } = new URL(req.url);
    const jobId = searchParams.get("jobId");
    const status = searchParams.get("status");

    let where: any = {};

    if (role === "CANDIDATE") {
      where.candidateId = (session.user as any).candidateId;
    } else if (role === "COMPANY") {
      where.job = { companyId: (session.user as any).companyId };
    }
    // ADMIN: no filter, sees all

    if (jobId) where.jobId = jobId;
    if (status && Object.values(ApplicationStatus).includes(status.toUpperCase() as ApplicationStatus)) {
      where.status = status.toUpperCase() as ApplicationStatus;
    }

    const applications = await prisma.application.findMany({
      where,
      include: {
        job: {
          include: {
            company: { select: { name: true, logoColor: true, logoText: true } },
            skills: true,
          },
        },
        candidate: {
          include: {
            user: { select: { name: true, email: true, mobile: true } },
            skills: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ applications });
  } catch (error) {
    console.error("Applications GET error:", error);
    return NextResponse.json({ error: "Failed to fetch applications" }, { status: 500 });
  }
}

// POST /api/applications — candidate applies to a job
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const candidateId = (session.user as any).candidateId;
    const { jobId, coverNote } = await req.json();

    if (!jobId) {
      return NextResponse.json({ error: "jobId is required" }, { status: 400 });
    }

    const candidate = await prisma.candidate.findUnique({
      where: { id: candidateId },
      include: { payments: { where: { status: PaymentStatus.SUCCESS } } },
    });

    if (!candidate || candidate.payments.length === 0) {
      return NextResponse.json(
        { error: "Payment required before applying" },
        { status: 402 }
      );
    }

    const application = await prisma.application.create({
      data: { candidateId, jobId, coverNote },
      include: { job: { include: { company: true } } },
    });

    return NextResponse.json(application, { status: 201 });
  } catch (error: any) {
    if (error?.code === "P2002") {
      return NextResponse.json(
        { error: "You have already applied to this job" },
        { status: 409 }
      );
    }
    console.error("Application POST error:", error);
    return NextResponse.json({ error: "Failed to apply" }, { status: 500 });
  }
}

// PATCH /api/applications — company updates application status
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { applicationId, status } = await req.json();
    if (!Object.values(ApplicationStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.application.update({
      where: { id: applicationId },
      data: { status: status as ApplicationStatus },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Application PATCH error:", error);
    return NextResponse.json({ error: "Failed to update application" }, { status: 500 });
  }
}
