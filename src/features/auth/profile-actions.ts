"use server"

import { auth } from "@/auth"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { revalidatePath } from "next/cache"

export type ProfileUpdateResult = {
  success: boolean
  message: string
}

export async function updateProfile(formData: FormData): Promise<ProfileUpdateResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized. Silakan masuk terlebih dahulu." }
  }

  const userId = session.user.id
  const name = formData.get("name") as string
  const phone = formData.get("phone") as string
  const avatar = formData.get("avatar") as string

  if (!name || name.trim() === "") {
    return { success: false, message: "Nama tidak boleh kosong." }
  }

  try {
    await prisma.user.update({
      where: { id: userId },
      data: {
        name: name.trim(),
        phone: phone ? phone.trim() : null,
        avatar: avatar ? avatar.trim() : null,
      },
    })

    revalidatePath("/profile")
    return { success: true, message: "Profil berhasil diperbarui." }
  } catch (error: any) {
    console.error("Profile update error:", error)
    return { success: false, message: "Terjadi kesalahan: " + (error.message || "Gagal memperbarui profil") }
  }
}

export async function updatePassword(formData: FormData): Promise<ProfileUpdateResult> {
  const session = await auth()
  if (!session?.user?.id) {
    return { success: false, message: "Unauthorized. Silakan masuk terlebih dahulu." }
  }

  const userId = session.user.id
  const currentPassword = formData.get("currentPassword") as string
  const newPassword = formData.get("newPassword") as string
  const confirmPassword = formData.get("confirmPassword") as string

  if (!currentPassword || !newPassword || !confirmPassword) {
    return { success: false, message: "Semua kolom password wajib diisi." }
  }

  if (newPassword !== confirmPassword) {
    return { success: false, message: "Password baru dan konfirmasi password tidak cocok." }
  }

  if (newPassword.length < 8) {
    return { success: false, message: "Password baru minimal harus 8 karakter." }
  }

  try {
    // Fetch user to verify current password
    const user = await prisma.user.findUnique({
      where: { id: userId },
    })

    if (!user) {
      return { success: false, message: "User tidak ditemukan." }
    }

    const passwordsMatch = await bcrypt.compare(currentPassword, user.password)
    if (!passwordsMatch) {
      return { success: false, message: "Password saat ini salah." }
    }

    // Hash and save new password
    const hashed = await bcrypt.hash(newPassword, 10)
    await prisma.user.update({
      where: { id: userId },
      data: { password: hashed },
    })

    return { success: true, message: "Password berhasil diperbarui." }
  } catch (error: any) {
    console.error("Password update error:", error)
    return { success: false, message: "Terjadi kesalahan: " + (error.message || "Gagal memperbarui password") }
  }
}
