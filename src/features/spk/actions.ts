"use server"

import { prisma } from "@/lib/prisma"
import { revalidatePath } from "next/cache"
import { z } from "zod"
import { GenderType } from "@prisma/client"
import {
  facilityLevelFromCount,
  nextCriteriaCode,
  nextKode,
  syncRatingKecocokan,
  syncAllRatingKecocokan,
  validateBobotTotal,
} from "./spk"
import { DEFAULT_CRITERIA } from "./default-rubric"

function revalidateSpk() {
  for (const base of ["/kos", "/app/kos"]) {
    revalidatePath(base)
    revalidatePath(`${base}/alternatif`)
    revalidatePath(`${base}/bobot`)
    revalidatePath(`${base}/hasil`)
  }
}

// ─── FR-3: atur bobot (total wajib tepat 1,0) ───────────────────────────────

export async function updateBobot(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const criteria = await prisma.criteria.findMany({ orderBy: { code: "asc" } })
  const weights: Record<string, number> = {}
  for (const c of criteria) {
    weights[c.code] = parseFloat(String(formData.get(`bobot_${c.code}`) ?? "0"))
  }

  const check = validateBobotTotal(weights)
  if (!check.ok) {
    return { success: false, error: check.error }
  }

  for (const c of criteria) {
    await prisma.criteria.update({
      where: { code: c.code },
      data: { weight: weights[c.code] },
    })
  }

  revalidateSpk()
  revalidatePath("/")
  revalidatePath("/explore")
  revalidatePath("/saw")
  return { success: true }
}

// ─── FR-1 & FR-2: kelola alternatif + input nilai kriteria ──────────────────

const alternatifSchema = z.object({
  name: z.string().trim().min(1, "Nama kos wajib diisi."),
  address: z.string().trim().min(1, "Lokasi/alamat wajib diisi."),
  genderType: z.enum(["PUTRA", "PUTRI", "CAMPUR"]),
  price: z.coerce.number().int().positive("Harga harus lebih dari 0."),
  jarakKm: z.coerce.number().min(0, "Jarak tidak boleh negatif."),
  panjangM: z.coerce.number().positive("Panjang harus lebih dari 0."),
  lebarM: z.coerce.number().positive("Lebar harus lebih dari 0."),
  rating: z.preprocess(
    (v) => (v === "" || v == null ? null : v),
    z.coerce.number().min(0).max(5).nullable()
  ),
  fasilitasTeks: z.string().default(""),
  phone: z.preprocess((v) => (v === "" ? null : v), z.string().max(20).nullable()),
})

function parseAlternatif(formData: FormData) {
  return alternatifSchema.parse({
    name: formData.get("name"),
    address: formData.get("address"),
    genderType: formData.get("genderType"),
    price: formData.get("price"),
    jarakKm: formData.get("jarakKm"),
    panjangM: formData.get("panjangM"),
    lebarM: formData.get("lebarM"),
    rating: formData.get("rating"),
    fasilitasTeks: formData.get("fasilitasTeks"),
    phone: formData.get("phone"),
  })
}

export async function createAlternatif(
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const input = parseAlternatif(formData)
  const fasilitasCount = input.fasilitasTeks.split(";").filter((s) => s.trim()).length

  const kos = await prisma.kos.create({
    data: {
      name: input.name,
      slug:
        input.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") +
        "-" +
        Date.now().toString(36),
      description: `Alternatif KosRank: kos ${input.genderType === "PUTRA" ? "putra" : input.genderType === "PUTRI" ? "putri" : "campur"} di ${input.address}.`,
      price: input.price,
      roomSize: `${input.panjangM} x ${input.lebarM} meter`,
      address: input.address,
      campus: "UBSI Margonda",
      genderType: input.genderType as GenderType,
      phone: input.phone,
      rating: input.rating,
      jarakKm: input.jarakKm,
      panjangM: input.panjangM,
      lebarM: input.lebarM,
      fasilitasLevel: facilityLevelFromCount(fasilitasCount),
      fasilitasTeks: input.fasilitasTeks,
      kode: await nextKode(),
    },
  })

  await syncRatingKecocokan(kos.id)
  revalidateSpk()
  return { success: true }
}

export async function updateAlternatif(
  id: string,
  formData: FormData
): Promise<{ success: boolean; error?: string }> {
  const input = parseAlternatif(formData)
  const fasilitasCount = input.fasilitasTeks.split(";").filter((s) => s.trim()).length

  const existing = await prisma.kos.findUnique({ where: { id }, select: { kode: true } })
  if (!existing) return { success: false, error: "Alternatif tidak ditemukan." }

  await prisma.kos.update({
    where: { id },
    data: {
      name: input.name,
      address: input.address,
      genderType: input.genderType as GenderType,
      price: input.price,
      roomSize: `${input.panjangM} x ${input.lebarM} meter`,
      phone: input.phone,
      rating: input.rating,
      jarakKm: input.jarakKm,
      panjangM: input.panjangM,
      lebarM: input.lebarM,
      fasilitasLevel: facilityLevelFromCount(fasilitasCount),
      fasilitasTeks: input.fasilitasTeks,
    },
  })

  await syncRatingKecocokan(id)
  revalidateSpk()
  return { success: true }
}

export async function deleteAlternatif(id: string): Promise<{ success: boolean }> {
  await prisma.kos.delete({ where: { id } })
  revalidateSpk()
  return { success: true }
}

// ─── Seleksi alternatif untuk perangkingan ──────────────────────────────────

export async function setAlternatifSelection(
  ids: string[],
  dipilih: boolean
): Promise<{ success: boolean }> {
  if (ids.length === 0) return { success: true }
  await prisma.kos.updateMany({
    where: { id: { in: ids } },
    data: { dipilih },
  })
  revalidateSpk()
  return { success: true }
}

export async function selectAllAlternatif(dipilih: boolean): Promise<{ success: boolean }> {
  await prisma.kos.updateMany({ data: { dipilih } })
  revalidateSpk()
  return { success: true }
}

// ─── CRUD Kriteria (tambah, edit, delete) ────────────────────────────────────

const kriteriaSchema = z.object({
  name: z.string().trim().min(1, "Nama kriteria wajib diisi."),
  attribute: z.enum(["COST", "BENEFIT"]),
  weight: z.coerce.number().min(0, "Bobot tidak boleh negatif.").max(1, "Bobot maksimal 1."),
})

export async function createKriteria(
  data: { name: string; attribute: "COST" | "BENEFIT"; weight: number }
): Promise<{ success: boolean; error?: string; code?: string; warning?: string }> {
  const parsed = kriteriaSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  const code = await nextCriteriaCode()
  await prisma.criteria.create({
    data: { code, name: parsed.data.name, attribute: parsed.data.attribute, weight: parsed.data.weight },
  })

  // Kriteria baru (tanpa sumber nilai mentah) mulai dengan skor 20
  // untuk semua alternatif aktif — seragam, sehingga urutan ranking tidak berubah.
  const kosList = await prisma.kos.findMany({ where: { isActive: true }, select: { id: true } })
  if (kosList.length > 0) {
    await prisma.ratingKecocokan.createMany({
      data: kosList.map((k) => ({ kosId: k.id, criteriaCode: code, nilai: 20 })),
    })
  }

  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/")

  const total = (await prisma.criteria.findMany()).reduce((acc, c) => acc + c.weight, 0)
  const warning =
    Math.abs(total - 1) > 1e-9
      ? `Perhatian: total bobot semua kriteria kini ${total.toFixed(2)} — sesuaikan di halaman Bobot Kriteria.`
      : undefined
  return { success: true, code, warning }
}

export async function updateKriteria(
  id: string,
  data: { name: string; attribute: "COST" | "BENEFIT"; weight: number }
): Promise<{ success: boolean; error?: string; warning?: string }> {
  const parsed = kriteriaSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  await prisma.criteria.update({
    where: { id },
    data: { name: parsed.data.name, attribute: parsed.data.attribute, weight: parsed.data.weight },
  })

  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/")
  revalidatePath("/explore")

  const total = (await prisma.criteria.findMany()).reduce((acc, c) => acc + c.weight, 0)
  const warning =
    Math.abs(total - 1) > 1e-9
      ? `Perhatian: total bobot semua kriteria kini ${total.toFixed(2)} — sesuaikan di halaman Bobot Kriteria.`
      : undefined
  return { success: true, warning }
}

export async function deleteKriteria(id: string): Promise<{ success: boolean; error?: string }> {
  const count = await prisma.criteria.count()
  if (count <= 1) {
    return { success: false, error: "Minimal satu kriteria harus tersisa." }
  }

  await prisma.criteria.delete({ where: { id } })
  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/")
  revalidatePath("/explore")
  return { success: true }
}

// ─── CRUD Sub Kriteria (rubrik penilaian per kriteria) ──────────────────────

const subKriteriaSchema = z.object({
  criteriaId: z.string().min(1, "Kriteria induk wajib dipilih."),
  name: z.string().trim().min(1, "Nama sub kriteria wajib diisi."),
  value: z.string().trim().min(1, "Nilai/rentang wajib diisi."),
  score: z.coerce.number().int().min(0, "Skor minimal 0.").max(100, "Skor maksimal 100."),
})

export async function createSubKriteria(
  data: { criteriaId: string; name: string; value: string; score: number }
): Promise<{ success: boolean; error?: string }> {
  const parsed = subKriteriaSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  await prisma.subCriteria.create({ data: parsed.data })
  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/admin/sub-kriteria")
  return { success: true }
}

export async function updateSubKriteria(
  id: string,
  data: { criteriaId: string; name: string; value: string; score: number }
): Promise<{ success: boolean; error?: string }> {
  const parsed = subKriteriaSchema.safeParse(data)
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0].message }
  }

  await prisma.subCriteria.update({ where: { id }, data: parsed.data })
  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/admin/sub-kriteria")
  return { success: true }
}

export async function deleteSubKriteria(id: string): Promise<{ success: boolean }> {
  await prisma.subCriteria.delete({ where: { id } })
  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/admin/sub-kriteria")
  return { success: true }
}

// ─── Bersihkan & pulihkan data perhitungan (tab Kriteria/Sub Kriteria/Bobot) ──

export async function clearKriteria(): Promise<{ success: boolean }> {
  // Cascade menghapus sub kriteria dan rating kecocokan terkait
  await prisma.criteria.deleteMany({})
  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/admin/kriteria")
  revalidatePath("/admin/sub-kriteria")
  return { success: true }
}

export async function clearSubKriteria(): Promise<{ success: boolean }> {
  await prisma.subCriteria.deleteMany({})
  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/admin/sub-kriteria")
  return { success: true }
}

export async function resetBobotDefault(): Promise<{ success: boolean }> {
  for (const c of DEFAULT_CRITERIA) {
    await prisma.criteria.updateMany({ where: { code: c.code }, data: { weight: c.weight } })
  }
  revalidateSpk()
  revalidatePath("/saw")
  return { success: true }
}

export async function restoreDefaultRubric(): Promise<{ success: boolean }> {
  // Wipe lalu bangun ulang rubrik bawaan data_kost.xlsx
  await prisma.criteria.deleteMany({})

  for (const c of DEFAULT_CRITERIA) {
    const created = await prisma.criteria.create({
      data: { code: c.code, name: c.name, weight: c.weight, attribute: c.attribute },
    })
    await prisma.subCriteria.createMany({
      data: c.subKriteria.map((s) => ({ ...s, criteriaId: created.id })),
    })
  }

  // Matriks X semua kos dibangun ulang dari pemetaan 4.1
  await syncAllRatingKecocokan()

  revalidateSpk()
  revalidatePath("/saw")
  revalidatePath("/admin/kriteria")
  revalidatePath("/admin/sub-kriteria")
  return { success: true }
}
