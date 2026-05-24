import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { PaymentStatus } from "@/generated/prisma/enums";

// GET /api/payments — admin sees all, candidate sees own
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    const where = role === "ADMIN" ? {} : { candidateId: (session.user as any).candidateId };

    const payments = await prisma.payment.findMany({
      where,
      include: {
        candidate: {
          include: { user: { select: { name: true, email: true } } },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    const stats = role === "ADMIN" ? {
      total: payments.length,
      success: payments.filter((p) => p.status === PaymentStatus.SUCCESS).length,
      failed: payments.filter((p) => p.status === PaymentStatus.FAILED).length,
      refunded: payments.filter((p) => p.status === PaymentStatus.REFUNDED).length,
      revenue: payments.filter((p) => p.status === PaymentStatus.SUCCESS).length * 100,
    } : null;

    return NextResponse.json({ payments, stats });
  } catch (error) {
    console.error("Payments GET error:", error);
    return NextResponse.json({ error: "Failed to fetch payments" }, { status: 500 });
  }
}

// POST /api/payments — create payment record (called after Razorpay/Stripe webhook)
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "CANDIDATE") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const candidateId = (session.user as any).candidateId;
    const { method, transactionId, status = PaymentStatus.SUCCESS } = await req.json();

    const payment = await prisma.payment.create({
      data: {
        candidateId,
        amount: 100,
        method,
        transactionId,
        status: status as PaymentStatus,
      },
    });

    if (status === PaymentStatus.SUCCESS) {
      await prisma.candidate.update({
        where: { id: candidateId },
        data: { paymentStatus: "paid" },
      });
    }

    return NextResponse.json(payment, { status: 201 });
  } catch (error) {
    console.error("Payment POST error:", error);
    return NextResponse.json({ error: "Failed to record payment" }, { status: 500 });
  }
}
