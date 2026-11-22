import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return NextResponse.json({ count: 0 });
    }

    const role = (session.user as { role?: string }).role;
    const count =
      role === "ADMIN"
        ? await prisma.booking.count({ where: { status: "PENDING" } })
        : await prisma.booking.count({
            where: { userId: session.user.id, status: { not: "PENDING" } },
          });

    return NextResponse.json({ count });
  } catch {
    return NextResponse.json({ count: 0 });
  }
}
