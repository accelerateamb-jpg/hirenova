import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

// GET /api/candidates — admin only: list all candidates
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") ?? "";
    const limit = parseInt(searchParams.get("limit") ?? "50");
    const page = parseInt(searchParams.get("page") ?? "1");

    const where: any = search
      ? {
          OR: [
            { user: { name: { contains: search, mode: "insensitive" } } },
            { user: { email: { contains: search, mode: "insensitive" } } },
            { location: { contains: search, mode: "insensitive" } },
          ],
        }
      : {};

    const [candidates, total] = await Promise.all([
      prisma.candidate.findMany({
        where,
        include: {
          user: { select: { id: true, name: true, email: true, mobile: true, isBlocked: true, createdAt: true } },
          skills: true,
          payments: { orderBy: { createdAt: "desc" }, take: 1 },
          _count: { select: { applications: true } },
        },
        orderBy: { createdAt: "desc" },
        take: limit,
        skip: (page - 1) * limit,
      }),
      prisma.candidate.count({ where }),
    ]);

    return NextResponse.json({ candidates, total });
  } catch (error) {
    console.error("Candidates GET error:", error);
    return NextResponse.json({ error: "Failed to fetch candidates" }, { status: 500 });
  }
}

// PATCH /api/candidates — update own profile
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const candidateId = (session.user as any).candidateId;
    const body = await req.json();
    const { location, experience, qualification, currentRole, expectedSalary, summary, resumeUrl, skills } = body;

    const updated = await prisma.candidate.update({
      where: { id: candidateId },
      data: {
        location,
        experience: experience ? parseInt(experience) : undefined,
        qualification,
        currentRole,
        expectedSalary: expectedSalary ? parseInt(expectedSalary) : undefined,
        summary,
        resumeUrl,
        ...(skills && {
          skills: {
            deleteMany: {},
            create: skills.map((s: string) => ({ skill: s })),
          },
        }),
      },
      include: { skills: true },
    });

    // Recalculate profile completion
    let completion = 20;
    if (updated.location) completion += 15;
    if (updated.qualification) completion += 15;
    if (updated.currentRole) completion += 10;
    if (updated.summary) completion += 15;
    if (updated.resumeUrl) completion += 15;
    if (updated.skills.length > 0) completion += 10;

    await prisma.candidate.update({
      where: { id: candidateId },
      data: { profileCompletion: Math.min(completion, 100) },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Candidate PATCH error:", error);
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
