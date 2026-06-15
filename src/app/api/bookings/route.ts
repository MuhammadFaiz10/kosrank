import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu untuk mengajukan sewa." }, { status: 401 });
    }

    const body = await req.json();
    const { kosId, durationMonths } = body;

    if (!kosId) {
      return NextResponse.json({ error: "Kos ID diperlukan." }, { status: 400 });
    }

    // Check if kos exists
    const kos = await prisma.kos.findUnique({
      where: { id: kosId },
    });

    if (!kos) {
      return NextResponse.json({ error: "Kos tidak ditemukan." }, { status: 404 });
    }

    // Check if booking already exists for this user and kos
    const existing = await prisma.booking.findFirst({
      where: {
        userId: session.user.id,
        kosId,
        status: "PENDING",
      },
    });

    if (existing) {
      return NextResponse.json({ error: "Anda sudah mengajukan sewa untuk kos ini dan sedang menunggu persetujuan." }, { status: 400 });
    }

    // Create booking
    const booking = await prisma.booking.create({
      data: {
        userId: session.user.id,
        kosId,
        durationMonths: durationMonths || 1,
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error: any) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
