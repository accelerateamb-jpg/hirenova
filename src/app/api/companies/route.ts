import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";
import { CompanyStatus, JobStatus, UserRole } from "@/generated/prisma/enums";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    const role = (session?.user as any)?.role;

    const where = role === "ADMIN" ? {} : { status: CompanyStatus.APPROVED };

    const companies = await prisma.company.findMany({
      where,
      include: {
        user: { select: { email: true, mobile: true, createdAt: true } },
        _count: { select: { jobs: { where: { status: JobStatus.ACTIVE } } } },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ companies });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch companies" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, hrName, email, mobile, address, description, password } = body;

    if (!name || !email || !password) {
      return NextResponse.json(
        { error: "Company name, email and password are required" },
        { status: 400 }
      );
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const logoText = name.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase();

    const user = await prisma.user.create({
      data: {
        name: hrName || name,
        email,
        mobile,
        password: hashed,
        role: UserRole.COMPANY,
        company: {
          create: {
            name,
            hrName,
            address,
            description,
            logoText,
            status: CompanyStatus.PENDING,
          },
        },
      },
      include: { company: true },
    });

    return NextResponse.json(
      { id: user.id, email: user.email, companyId: user.company?.id },
      { status: 201 }
    );
  } catch (error) {
    console.error("Company POST error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { companyId, status } = await req.json();
    if (!Object.values(CompanyStatus).includes(status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    const updated = await prisma.company.update({
      where: { id: companyId },
      data: {
        status: status as CompanyStatus,
        isVerified: status === CompanyStatus.APPROVED ? true : undefined,
      },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Company PATCH error:", error);
    return NextResponse.json({ error: "Failed to update company" }, { status: 500 });
  }
}
