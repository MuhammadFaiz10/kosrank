"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { GenderType } from "@prisma/client"

export async function createKos(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseInt(formData.get("price") as string)
  const roomSize = formData.get("roomSize") as string
  const address = formData.get("address") as string
  const campus = formData.get("campus") as string
  const genderType = formData.get("genderType") as GenderType

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now()

  await prisma.kos.create({
    data: {
      name,
      slug,
      description,
      price,
      roomSize,
      latitude: 0,
      longitude: 0,
      address,
      genderType,
      campus
    }
  })

  revalidatePath("/admin/kos")
}

export async function updateKos(id: string, formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseInt(formData.get("price") as string)
  const roomSize = formData.get("roomSize") as string
  const address = formData.get("address") as string
  const campus = formData.get("campus") as string
  const genderType = formData.get("genderType") as GenderType

  await prisma.kos.update({
    where: { id },
    data: {
      name,
      description,
      price,
      roomSize,
      address,
      genderType,
      campus
    }
  })

  revalidatePath("/admin/kos")
  revalidatePath("/")
}

export async function deleteKos(id: string) {
  await prisma.kos.delete({
    where: { id }
  })

  revalidatePath("/admin/kos")
  revalidatePath("/")
}
