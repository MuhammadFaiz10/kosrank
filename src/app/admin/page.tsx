import { prisma } from "@/lib/prisma";
import { Home, Sliders, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboardPage() {
  const totalKos = await prisma.kos.count();
  const totalKriteria = await prisma.criteria.count();
  const topKos = await prisma.kos.findMany({
    where: { ranking: { not: null } },
    orderBy: { ranking: "asc" },
    take: 5,
  });

  const stats = [
    { label: "Total Kos", value: totalKos, icon: Home, color: "bg-blue-500" },
    { label: "Kriteria SAW", value: totalKriteria, icon: Sliders, color: "bg-teal-500" },
    { label: "Sudah Diranking", value: topKos.length, icon: Trophy, color: "bg-amber-500" },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Dashboard</h1>
        <p className="text-slate-500 text-sm mt-1">Selamat datang di panel admin KosRank</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className={`w-11 h-11 ${color} rounded-xl flex items-center justify-center`}>
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-sm text-slate-500">{label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Ranking */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <div className="flex items-center gap-2 mb-5">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h2 className="font-semibold">Ranking Teratas SAW</h2>
          </div>
          {topKos.length > 0 ? (
            <div className="space-y-3">
              {topKos.map((kos, i) => (
                <div key={kos.id} className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors">
                  <span className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${i === 0 ? "bg-amber-500" : i === 1 ? "bg-slate-400" : i === 2 ? "bg-amber-700" : "bg-slate-300"}`}>
                    {i + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-sm truncate">{kos.name}</div>
                    <div className="text-xs text-slate-500">Rp {kos.price.toLocaleString("id-ID")}/bulan</div>
                  </div>
                  {kos.finalScore && (
                    <span className="text-xs font-semibold text-primary bg-primary/10 px-2 py-1 rounded-lg">
                      {kos.finalScore.toFixed(4)}
                    </span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-slate-400 text-sm">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30" />
              <p>Belum ada data ranking. Tambah kos & jalankan SAW.</p>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-2xl border border-border p-5">
          <h2 className="font-semibold mb-5">Aksi Cepat</h2>
          <div className="space-y-3">
            <Link href="/admin/kos/new" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-primary/40 hover:bg-primary/5 transition-all group">
              <div className="w-9 h-9 bg-primary/10 rounded-lg flex items-center justify-center">
                <Home className="w-4 h-4 text-primary" />
              </div>
              <div>
                <div className="text-sm font-medium group-hover:text-primary transition-colors">Tambah Kos Baru</div>
                <div className="text-xs text-slate-500">Input data kos ke sistem</div>
              </div>
            </Link>
            <Link href="/admin/kriteria" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-teal-500/40 hover:bg-teal-50 transition-all group">
              <div className="w-9 h-9 bg-teal-100 rounded-lg flex items-center justify-center">
                <Sliders className="w-4 h-4 text-teal-600" />
              </div>
              <div>
                <div className="text-sm font-medium group-hover:text-teal-600 transition-colors">Kelola Kriteria</div>
                <div className="text-xs text-slate-500">Atur bobot & sub kriteria SAW</div>
              </div>
            </Link>
            <Link href="/explore" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-slate-400/40 hover:bg-slate-50 transition-all group">
              <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-4 h-4 text-slate-600" />
              </div>
              <div>
                <div className="text-sm font-medium group-hover:text-slate-700 transition-colors">Lihat Rekomendasi</div>
                <div className="text-xs text-slate-500">Tampilan publik website</div>
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
