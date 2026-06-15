"use server";

import { prisma } from "@/lib/prisma";
import { Role } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function updateUser(id: string, name: string, email: string, role: Role) {
  if (!id || !name || !email || !role) {
    throw new Error("Missing parameters");
  }

  await prisma.user.update({
    where: { id },
    data: {
      name,
      email,
      role,
    },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}

export async function deleteUser(id: string) {
  if (!id) {
    throw new Error("Missing user ID");
  }

  await prisma.user.delete({
    where: { id },
  });

  revalidatePath("/admin/users");
  revalidatePath("/admin");
}
