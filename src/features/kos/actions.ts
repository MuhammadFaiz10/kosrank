"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { GenderType } from "@prisma/client"
import { calculateAndUpdateSAW } from "@/features/saw/engine"

export async function createKos(formData: FormData) {
  const name = formData.get("name") as string
  const description = formData.get("description") as string
  const price = parseInt(formData.get("price") as string)
  const roomSize = formData.get("roomSize") as string
  const address = formData.get("address") as string
  const campus = formData.get("campus") as string
  const genderType = formData.get("genderType") as GenderType
  
  const latitude = parseFloat(formData.get("latitude") as string || "0")
  const longitude = parseFloat(formData.get("longitude") as string || "0")
  const transit = formData.get("transit") as string || "Ojek online/kendaraan pribadi"
  const selectedFacilities = formData.getAll("facilities") as string[]

  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now()

  const newKos = await prisma.kos.create({
    data: {
      name,
      slug,
      description,
      price,
      roomSize,
      latitude,
      longitude,
      address,
      genderType,
      campus,
      transit
    }
  })

  if (selectedFacilities.length > 0) {
    await prisma.kosFacility.createMany({
      data: selectedFacilities.map((facilityId) => ({
        kosId: newKos.id,
        facilityId
      }))
    })
  }

  await calculateAndUpdateSAW()

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
  
  const latitude = parseFloat(formData.get("latitude") as string || "0")
  const longitude = parseFloat(formData.get("longitude") as string || "0")
  const transit = formData.get("transit") as string || "Ojek online/kendaraan pribadi"
  const selectedFacilities = formData.getAll("facilities") as string[]

  await prisma.kos.update({
    where: { id },
    data: {
      name,
      description,
      price,
      roomSize,
      address,
      genderType,
      campus,
      latitude,
      longitude,
      transit
    }
  })

  // Sync facilities
  await prisma.kosFacility.deleteMany({
    where: { kosId: id }
  })

  if (selectedFacilities.length > 0) {
    await prisma.kosFacility.createMany({
      data: selectedFacilities.map((facilityId) => ({
        kosId: id,
        facilityId
      }))
    })
  }

  await calculateAndUpdateSAW()

  revalidatePath("/admin/kos")
  revalidatePath("/")
}

export async function deleteKos(id: string) {
  await prisma.kos.delete({
    where: { id }
  })

  await calculateAndUpdateSAW()

  revalidatePath("/admin/kos")
  revalidatePath("/")
}
