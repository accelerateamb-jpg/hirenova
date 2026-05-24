import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [
      totalCandidates,
      totalCompanies,
      totalJobs,
      totalApplications,
      successPayments,
      todayRegistrations,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.company.count(),
      prisma.job.count({ where: { status: "ACTIVE" } }),
      prisma.application.count(),
      prisma.payment.count({ where: { status: "SUCCESS" } }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
    ]);

    return NextResponse.json({
      totalCandidates,
      totalCompanies,
      totalJobs,
      totalApplications,
      revenueGenerated: successPayments * 100,
      dailyRegistrations: todayRegistrations,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
