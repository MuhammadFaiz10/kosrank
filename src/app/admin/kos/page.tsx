import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { deleteKos } from "@/features/kos/actions";
import { Plus, Pencil, Trash2, Star, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminKosPage() {
  const kosList = await prisma.kos.findMany({
    orderBy: [{ ranking: { sort: "asc", nulls: "last" } }, { createdAt: "desc" }],
  });

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Kos</h1>
          <p className="text-slate-500 text-sm mt-1">{kosList.length} kos terdaftar</p>
        </div>
        <Link href="/admin/kos/new">
          <Button className="rounded-xl">
            <Plus className="w-4 h-4 mr-2" />
            Tambah Kos
          </Button>
        </Link>
      </div>

      <div className="bg-white rounded-2xl border border-border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-slate-50">
                <th className="text-left py-3.5 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Ranking</th>
                <th className="text-left py-3.5 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Nama Kos</th>
                <th className="text-left py-3.5 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Harga</th>
                <th className="text-left py-3.5 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Kampus</th>
                <th className="text-left py-3.5 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Gender</th>
                <th className="text-left py-3.5 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Skor SAW</th>
                <th className="text-right py-3.5 px-4 font-semibold text-slate-600 text-xs uppercase tracking-wider">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {kosList.map((kos) => (
                <tr key={kos.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4">
                    {kos.ranking ? (
                      <span className="w-7 h-7 rounded-full bg-primary/10 text-primary text-xs font-bold flex items-center justify-center">
                        {kos.ranking}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">—</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="font-medium text-slate-800">{kos.name}</div>
                    <div className="text-xs text-slate-400">{kos.address}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    Rp {kos.price.toLocaleString("id-ID")}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{kos.campus}</td>
                  <td className="py-3.5 px-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      kos.genderType === "PUTRA" ? "bg-blue-100 text-blue-700" :
                      kos.genderType === "PUTRI" ? "bg-pink-100 text-pink-700" :
                      "bg-purple-100 text-purple-700"
                    }`}>
                      {kos.genderType === "PUTRA" ? "Putra" : kos.genderType === "PUTRI" ? "Putri" : "Campur"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    {kos.finalScore != null ? (
                      <span className="flex items-center gap-1 text-primary font-semibold text-xs">
                        <Star className="w-3 h-3 fill-primary" />
                        {kos.finalScore.toFixed(4)}
                      </span>
                    ) : (
                      <span className="text-slate-300 text-xs">Belum dihitung</span>
                    )}
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center justify-end gap-2">
                      <Link href={`/admin/kos/${kos.id}/edit`}>
                        <button className="p-1.5 rounded-lg text-slate-400 hover:text-primary hover:bg-primary/10 transition-colors">
                          <Pencil className="w-4 h-4" />
                        </button>
                      </Link>
                      <form action={async () => {
                        "use server";
                        await deleteKos(kos.id);
                      }}>
                        <button type="submit" className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
              {kosList.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center">
                    <Home className="w-10 h-10 mx-auto mb-3 text-slate-200" />
                    <p className="text-slate-400 text-sm">Belum ada data kos.</p>
                    <Link href="/admin/kos/new" className="text-primary text-sm font-medium hover:underline mt-1 block">
                      + Tambah kos pertama
                    </Link>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
