import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { email, code, type } = await req.json();

    if (!email || !code || !type) {
      return NextResponse.json({ error: "Email, code and type are required" }, { status: 400 });
    }

    const otp = await prisma.otpCode.findFirst({
      where: { email, type, used: false },
      orderBy: { createdAt: "desc" },
    });

    if (!otp) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    if (new Date() > otp.expiresAt) {
      return NextResponse.json({ error: "OTP has expired. Please request a new one." }, { status: 400 });
    }

    if (otp.code !== code) {
      return NextResponse.json({ error: "Incorrect OTP" }, { status: 400 });
    }

    await prisma.otpCode.update({
      where: { id: otp.id },
      data: { used: true },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("OTP verify error:", error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
