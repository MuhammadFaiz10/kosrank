import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const bookingSchema = z.object({
  kosId: z.string().min(1, "Kos ID diperlukan."),
  durationMonths: z.coerce.number().int().min(1).max(36).default(1),
  startDate: z
    .string()
    .optional()
    .refine((v) => v === undefined || !isNaN(new Date(v).getTime()), {
      message: "Tanggal mulai sewa tidak valid.",
    }),
});

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu untuk mengajukan sewa." }, { status: 401 });
    }

    const parsed = bookingSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { kosId, durationMonths, startDate } = parsed.data;

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
        durationMonths,
        startDate: startDate ? new Date(startDate) : new Date(),
        status: "PENDING",
      },
    });

    return NextResponse.json({ success: true, booking }, { status: 201 });
  } catch (error) {
    console.error("Booking error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 500 });
  }
}
