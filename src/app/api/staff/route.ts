import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/staff?from=&to=  — admin: list all staff with performance metrics
export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const from = searchParams.get("from");
    const to = searchParams.get("to");

    const dateFilter = from && to ? {
      createdAt: {
        gte: new Date(from),
        lte: new Date(new Date(to).setHours(23, 59, 59, 999)),
      },
    } : {};

    const staff = await prisma.user.findMany({
      where: { role: "STAFF" },
      select: {
        id: true, name: true, email: true, mobile: true,
        isBlocked: true, createdAt: true,
        _count: {
          select: {
            staffCompanies: { where: dateFilter },
            staffJobs: { where: dateFilter },
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ staff });
  } catch (error) {
    console.error("Staff GET error:", error);
    return NextResponse.json({ error: "Failed to fetch staff" }, { status: 500 });
  }
}

// POST /api/staff — admin: create a staff account
export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, email, mobile, password } = await req.json();
    if (!name || !email || !password) {
      return NextResponse.json({ error: "Name, email and password are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const staff = await prisma.user.create({
      data: { name, email, mobile, password: hashed, role: "STAFF" },
      select: { id: true, name: true, email: true, mobile: true, createdAt: true },
    });

    return NextResponse.json(staff, { status: 201 });
  } catch (error) {
    console.error("Staff POST error:", error);
    return NextResponse.json({ error: "Failed to create staff" }, { status: 500 });
  }
}

// PATCH /api/staff — admin: update staff password or block status
export async function PATCH(req: NextRequest) {
  try {
    const session = await auth();
    if (!session || (session.user as any).role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { staffId, password, isBlocked } = await req.json();
    if (!staffId) return NextResponse.json({ error: "staffId required" }, { status: 400 });

    const data: any = {};
    if (typeof isBlocked === "boolean") data.isBlocked = isBlocked;
    if (password) data.password = await bcrypt.hash(password, 12);

    const updated = await prisma.user.update({
      where: { id: staffId },
      data,
      select: { id: true, name: true, email: true, isBlocked: true },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Staff PATCH error:", error);
    return NextResponse.json({ error: "Failed to update staff" }, { status: 500 });
  }
}
