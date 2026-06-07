import { prisma } from "@/lib/prisma";
import { Users, Store, User, Shield } from "lucide-react";

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { kos: true } } },
  });

  const roleIcon: Record<string, React.ReactNode> = {
    SUPER_ADMIN: <Shield className="w-4 h-4 text-red-500" />,
    SELLER: <Store className="w-4 h-4 text-primary" />,
    USER: <User className="w-4 h-4 text-teal-500" />,
  };

  const roleLabel: Record<string, string> = {
    SUPER_ADMIN: "Super Admin",
    SELLER: "Penjual",
    USER: "Pengguna",
  };

  const roleBg: Record<string, string> = {
    SUPER_ADMIN: "bg-red-100 text-red-700",
    SELLER: "bg-blue-100 text-blue-700",
    USER: "bg-teal-100 text-teal-700",
  };

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Manajemen Pengguna</h1>
        <p className="text-slate-500 text-sm mt-1">{users.length} pengguna terdaftar</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(["SUPER_ADMIN", "SELLER", "USER"] as const).map((r) => {
          const count = users.filter((u) => u.role === r).length;
          return (
            <div key={r} className="bg-white rounded-2xl border border-border p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${r === "SUPER_ADMIN" ? "bg-red-100" : r === "SELLER" ? "bg-blue-100" : "bg-teal-100"}`}>
                {roleIcon[r]}
              </div>
              <div>
                <div className="font-bold text-lg">{count}</div>
                <div className="text-xs text-muted-foreground">{roleLabel[r]}</div>
              </div>
            </div>
          );
        })}
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-slate-50 text-xs text-muted-foreground uppercase tracking-wider">
              <th className="text-left py-3.5 px-4">Nama</th>
              <th className="text-left py-3.5 px-4">Email</th>
              <th className="text-left py-3.5 px-4">Role</th>
              <th className="text-left py-3.5 px-4">Listing Kos</th>
              <th className="text-left py-3.5 px-4">Bergabung</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-slate-50/60 transition-colors">
                <td className="py-3.5 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                      {user.name[0].toUpperCase()}
                    </div>
                    <span className="font-medium">{user.name}</span>
                  </div>
                </td>
                <td className="py-3.5 px-4 text-muted-foreground">{user.email}</td>
                <td className="py-3.5 px-4">
                  <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1.5 w-fit ${roleBg[user.role]}`}>
                    {roleIcon[user.role]} {roleLabel[user.role]}
                  </span>
                </td>
                <td className="py-3.5 px-4">{user._count.kos > 0 ? `${user._count.kos} kos` : <span className="text-muted-foreground">—</span>}</td>
                <td className="py-3.5 px-4 text-muted-foreground text-xs">{user.createdAt.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
