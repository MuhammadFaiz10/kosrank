"use server"

import { prisma } from "@/lib/prisma"
import { auth } from "@/auth"
import { revalidatePath } from "next/cache"
import { GenderType } from "@prisma/client"
import { calculateAndUpdateSAW } from "@/features/saw/engine"
import { z } from "zod"

const kosSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().trim().min(1),
  price: z.coerce.number().int().positive(),
  roomSize: z.string().trim().min(1),
  address: z.string().trim().min(1),
  campus: z.string().trim().min(1),
  genderType: z.enum(["PUTRA", "PUTRI", "CAMPUR"]),
  latitude: z.coerce.number(),
  longitude: z.coerce.number(),
  transit: z.preprocess(
    (v) => (v === "" ? undefined : v),
    z.string().default("Ojek online/kendaraan pribadi")
  ),
  phone: z.preprocess((v) => (v === "" ? null : v), z.string().max(20).nullable()),
  rating: z.preprocess((v) => (v === "" || v == null ? null : v), z.coerce.number().min(0).max(5).nullable()),
  facilities: z.array(z.string()).default([]),
})

interface KosInput {
  name: string
  description: string
  price: number
  roomSize: string
  address: string
  campus: string
  genderType: GenderType
  latitude: number
  longitude: number
  transit: string
  phone: string | null
  rating: number | null
  facilityIds: string[]
  imageUrls: string[]
}

function parseKosInput(formData: FormData): KosInput {
  const parsed = kosSchema.parse({
    name: formData.get("name"),
    description: formData.get("description"),
    price: formData.get("price"),
    roomSize: formData.get("roomSize"),
    address: formData.get("address"),
    campus: formData.get("campus"),
    genderType: formData.get("genderType"),
    latitude: formData.get("latitude"),
    longitude: formData.get("longitude"),
    transit: formData.get("transit"),
    phone: formData.get("phone"),
    rating: formData.get("rating"),
    facilities: formData.getAll("facilities"),
  })

  const imageUrls = String(formData.get("imageUrls") || "")
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean)

  return { ...parsed, facilityIds: parsed.facilities, imageUrls }
}

function kosFields(input: KosInput) {
  return {
    name: input.name,
    description: input.description,
    price: input.price,
    roomSize: input.roomSize,
    address: input.address,
    campus: input.campus,
    genderType: input.genderType,
    latitude: input.latitude,
    longitude: input.longitude,
    transit: input.transit,
    phone: input.phone,
    rating: input.rating,
  }
}

async function syncKosRelations(kosId: string, input: KosInput) {
  await prisma.kosFacility.deleteMany({ where: { kosId } })
  if (input.facilityIds.length > 0) {
    await prisma.kosFacility.createMany({
      data: input.facilityIds.map((facilityId) => ({ kosId, facilityId })),
    })
  }

  await prisma.kosImage.deleteMany({ where: { kosId } })
  if (input.imageUrls.length > 0) {
    await prisma.kosImage.createMany({
      data: input.imageUrls.map((url) => ({ kosId, url })),
    })
  }
}

function generateSlug(name: string) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-") + "-" + Date.now()
}

export async function createKos(formData: FormData) {
  const session = await auth()
  const input = parseKosInput(formData)

  const newKos = await prisma.kos.create({
    data: {
      ...kosFields(input),
      slug: generateSlug(input.name),
      // Admin pembuat menjadi pemilik kos (dipakai chat & notifikasi)
      ...(session?.user?.id ? { ownerId: session.user.id } : {}),
    },
  })
  await syncKosRelations(newKos.id, input)
  await calculateAndUpdateSAW()

  revalidatePath("/admin/kos")
}

export async function updateKos(id: string, formData: FormData) {
  const input = parseKosInput(formData)

  await prisma.kos.update({
    where: { id },
    data: kosFields(input),
  })
  await syncKosRelations(id, input)
  await calculateAndUpdateSAW()

  revalidatePath("/admin/kos")
  revalidatePath("/")
}

export async function deleteKos(id: string) {
  await prisma.kos.delete({
    where: { id },
  })

  await calculateAndUpdateSAW()

  revalidatePath("/admin/kos")
  revalidatePath("/")
}
