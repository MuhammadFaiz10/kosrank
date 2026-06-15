"use server"

import { prisma } from "@/lib/prisma"
import { CriteriaAttribute } from "@prisma/client"
import { revalidatePath } from "next/cache"
import { calculateAndUpdateSAW } from "@/features/saw/engine"

export async function createCriteria(formData: FormData) {
  await prisma.criteria.create({
    data: {
      code: formData.get("code") as string,
      name: formData.get("name") as string,
      weight: parseFloat(formData.get("weight") as string),
      attribute: formData.get("attribute") as CriteriaAttribute,
    }
  })
  
  await calculateAndUpdateSAW()
  
  revalidatePath("/admin/kriteria")
}

export async function deleteCriteria(id: string) {
  await prisma.criteria.delete({ where: { id } })
  
  await calculateAndUpdateSAW()
  
  revalidatePath("/admin/kriteria")
}

export async function createSubCriteria(formData: FormData) {
  await prisma.subCriteria.create({
    data: {
      criteriaId: formData.get("criteriaId") as string,
      name: formData.get("name") as string,
      value: formData.get("value") as string,
      score: parseInt(formData.get("score") as string),
    }
  })
  
  await calculateAndUpdateSAW()
  
  revalidatePath("/admin/kriteria")
}

export async function deleteSubCriteria(id: string) {
  await prisma.subCriteria.delete({ where: { id } })
  
  await calculateAndUpdateSAW()
  
  revalidatePath("/admin/kriteria")
}
