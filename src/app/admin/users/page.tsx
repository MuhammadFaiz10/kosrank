import { prisma } from "@/lib/prisma";
import { AdminUsersTable } from "./AdminUsersTable";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { kos: true } } },
  });

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Manajemen Pengguna</h1>
        <p className="text-slate-500 text-sm mt-1">
          Pantau hak akses, kelola peran (role), dan tinjau data keanggotaan pengguna ({users.length} akun terdaftar).
        </p>
      </div>

      <AdminUsersTable initialUsers={users} />
    </div>
  );
}
