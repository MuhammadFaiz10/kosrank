import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(req: NextRequest) {
  const { name, email, password, phone, role } = await req.json()

  if (!name || !email || !password) {
    return NextResponse.json({ message: "Semua field wajib diisi." }, { status: 400 })
  }

  if (password.length < 8) {
    return NextResponse.json({ message: "Password minimal 8 karakter." }, { status: 400 })
  }

  if (!["USER", "SELLER"].includes(role)) {
    return NextResponse.json({ message: "Role tidak valid." }, { status: 400 })
  }

  const existing = await prisma.user.findUnique({ where: { email } })
  if (existing) {
    return NextResponse.json({ message: "Email sudah terdaftar." }, { status: 409 })
  }

  const hashed = await bcrypt.hash(password, 10)

  await prisma.user.create({
    data: { name, email, password: hashed, phone: phone || null, role },
  })

  return NextResponse.json({ message: "Berhasil mendaftar." }, { status: 201 })
}
