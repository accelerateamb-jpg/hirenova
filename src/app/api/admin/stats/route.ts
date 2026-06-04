import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const now = new Date();

    const [
      totalCandidates,
      totalCompanies,
      totalActiveJobs,
      totalExpiredJobs,
      totalApplications,
      successPayments,
      todayRegistrations,
      totalStaff,
    ] = await Promise.all([
      prisma.candidate.count(),
      prisma.company.count({ where: { status: "APPROVED" } }),
      prisma.job.count({
        where: {
          status: "ACTIVE",
          OR: [{ deadline: null }, { deadline: { gte: now } }],
        },
      }),
      prisma.job.count({
        where: {
          status: "ACTIVE",
          deadline: { lt: now },
        },
      }),
      prisma.application.count(),
      prisma.payment.aggregate({
        where: { status: "SUCCESS" },
        _sum: { amount: true },
        _count: true,
      }),
      prisma.user.count({
        where: {
          createdAt: { gte: new Date(new Date().setHours(0, 0, 0, 0)) },
        },
      }),
      prisma.user.count({ where: { role: "STAFF" } }),
    ]);

    return NextResponse.json({
      totalCandidates,
      totalCompanies,
      totalActiveJobs,
      totalExpiredJobs,
      totalApplications,
      revenueGenerated: successPayments._sum.amount ?? successPayments._count * 100,
      dailyRegistrations: todayRegistrations,
      totalStaff,
    });
  } catch (error) {
    console.error("Admin stats error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
