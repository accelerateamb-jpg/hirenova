import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { UserRole } from "@/generated/prisma/enums";

// GET /api/staff/companies — staff: get own companies only
export async function GET() {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const staffId = session.user?.id;

    const companies = await prisma.company.findMany({
      where: { addedByStaffId: staffId },
      include: {
        user: { select: { email: true, name: true } },
        _count: { select: { jobs: true } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}

// POST /api/staff/companies — staff: add a new organisation
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "STAFF") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const staffId = session.user?.id as string;

    const {
      companyName, hrName, hrEmail, hrMobile,
      industry, size, location, address, description, website,
      logoColor, logoText,
    } = await req.json();

    if (!companyName || !hrEmail) {
      return NextResponse.json({ error: "Company name and HR email are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: hrEmail } });
    if (existing) {
      return NextResponse.json({ error: "An account with this HR email already exists" }, { status: 409 });
    }

    const tempPassword = await bcrypt.hash("Welcome@HireNova1", 12);

    // Create user first, then company linked via userId
    const companyUser = await prisma.user.create({
      data: {
        email: hrEmail,
        name: hrName ?? companyName,
        mobile: hrMobile,
        password: tempPassword,
        role: UserRole.COMPANY,
      },
    });

    const company = await prisma.company.create({
      data: {
        userId: companyUser.id,
        name: companyName,
        hrName,
        industry,
        size,
        location,
        address,
        description,
        website,
        logoColor: logoColor ?? "#4f46e5",
        logoText: logoText ?? companyName.slice(0, 2).toUpperCase(),
        isVerified: true,
        status: "APPROVED",
        addedByStaffId: staffId,
      },
      include: {
        user: { select: { id: true, email: true, name: true } },
      },
    });

    return NextResponse.json(company, { status: 201 });
  } catch (error: any) {
    console.error("Staff company POST error:", error);
    return NextResponse.json({ error: error.message ?? "Failed to add company" }, { status: 500 });
  }
}
