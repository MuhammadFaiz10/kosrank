import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { z } from "zod";

const createRoomSchema = z.object({
  kosId: z.string().min(1, "Kos ID dan Seller ID diperlukan."),
  sellerId: z.string().min(1),
});

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Get rooms where user is either the asker (user) or the owner (seller)
    const rooms = await prisma.chatRoom.findMany({
      where: {
        OR: [
          { userId: session.user.id },
          { sellerId: session.user.id }
        ]
      },
      include: {
        kos: {
          select: { name: true, slug: true, price: true }
        },
        user: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
        messages: {
          orderBy: { createdAt: "desc" },
          take: 1
        }
      },
      orderBy: { updatedAt: "desc" }
    });

    return NextResponse.json(rooms);
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Silakan masuk terlebih dahulu untuk memulai chat." }, { status: 401 });
    }

    const parsed = createRoomSchema.safeParse(await req.json());
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }
    const { kosId, sellerId } = parsed.data;

    if (session.user.id === sellerId) {
      return NextResponse.json({ error: "Anda tidak dapat memulai chat dengan diri Anda sendiri." }, { status: 400 });
    }

    // Find if chat room already exists
    let room = await prisma.chatRoom.findFirst({
      where: {
        userId: session.user.id,
        sellerId,
        kosId,
      },
      include: {
        kos: true,
        user: { select: { id: true, name: true, email: true } },
        seller: { select: { id: true, name: true, email: true } },
      },
    });

    if (!room) {
      room = await prisma.chatRoom.create({
        data: {
          userId: session.user.id,
          sellerId,
          kosId,
        },
        include: {
          kos: true,
          user: { select: { id: true, name: true, email: true } },
          seller: { select: { id: true, name: true, email: true } },
        },
      });
    }

    return NextResponse.json(room);
  } catch (error) {
    console.error("Chat room error:", error);
    return NextResponse.json({ error: error instanceof Error ? error.message : "Terjadi kesalahan." }, { status: 500 });
  }
}
