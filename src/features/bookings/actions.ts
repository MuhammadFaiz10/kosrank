"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { BookingStatus } from "@prisma/client"
import { z } from "zod"

const statusSchema = z.enum(["APPROVED", "REJECTED"])

export async function updateBookingStatus(
  bookingId: string,
  status: BookingStatus
) {
  const session = await auth()
  const role = (session?.user as { role?: string } | undefined)?.role
  if (!session?.user?.id || role !== "ADMIN") {
    return { success: false, error: "Hanya admin yang dapat mengubah status booking." }
  }

  const statusParse = statusSchema.safeParse(status)
  if (!statusParse.success) {
    return { success: false, error: "Status tidak valid." }
  }

  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  })

  if (!booking) {
    return { success: false, error: "Booking tidak ditemukan." }
  }

  await prisma.booking.update({
    where: { id: bookingId },
    data: { status: statusParse.data },
  })

  revalidatePath("/admin/bookings")
  return { success: true }
}
