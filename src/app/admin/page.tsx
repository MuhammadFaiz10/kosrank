import { prisma } from "@/lib/prisma";
import {
  Home,
  Sliders,
  Trophy,
  TrendingUp,
  Users,
  FileText,
  MessageSquare,
  Plus,
  ArrowRight,
  UserCheck,
  Building,
  Target
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import RevenueChart from "@/components/admin/RevenueChart";

export default async function AdminDashboardPage() {
  // Database queries for stats
  const totalKos = await prisma.kos.count();
  const totalUsers = await prisma.user.count();
  const totalBookings = await prisma.booking.count();
  const totalChats = await prisma.chatRoom.count();

  // Gender distribution count
  const putraKos = await prisma.kos.count({ where: { genderType: "PUTRA" } });
  const putriKos = await prisma.kos.count({ where: { genderType: "PUTRI" } });
  const campurKos = await prisma.kos.count({ where: { genderType: "CAMPUR" } });

  // Top 5 Ranked Kos with their first image
  const topKos = await prisma.kos.findMany({
    where: { ranking: { not: null } },
    orderBy: { ranking: "asc" },
    take: 5,
    include: {
      images: {
        take: 1
      }
    }
  });

  // Recent 5 Bookings
  const recentBookings = await prisma.booking.findMany({
    include: {
      user: true,
      kos: true,
    },
    orderBy: { createdAt: "desc" },
    take: 5,
  });

  // Get real booking stats by month for the last 6 months
  const now = new Date();
  const sixMonthsAgo = new Date();
  sixMonthsAgo.setDate(1);
  sixMonthsAgo.setMonth(now.getMonth() - 5);
  sixMonthsAgo.setHours(0, 0, 0, 0);

  const bookingsTrend = await prisma.booking.findMany({
    where: {
      createdAt: {
        gte: sixMonthsAgo
      }
    },
    include: {
      kos: true
    }
  });

  // Group by month and calculate Target, Terbayar (Approved) and Tunggakan (Pending)
  const monthlyTarget = Array(6).fill(0);
  const monthlyTerbayar = Array(6).fill(0);
  const monthlyTunggakan = Array(6).fill(0);
  const monthLabels = Array(6).fill("");

  for (let i = 0; i < 6; i++) {
    const d = new Date();
    d.setDate(1); // Prevent date overflow bug
    d.setMonth(now.getMonth() - 5 + i);
    monthLabels[i] = d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });

    const targetMonth = d.getMonth();
    const targetYear = d.getFullYear();

    const monthBookings = bookingsTrend.filter(b => {
      const bDate = new Date(b.createdAt);
      return bDate.getMonth() === targetMonth && bDate.getFullYear() === targetYear;
    });

    monthBookings.forEach(b => {
      const val = b.kos ? b.kos.price * b.durationMonths : 0;
      if (b.status === "APPROVED") {
        monthlyTerbayar[i] += val;
      } else if (b.status === "PENDING") {
        monthlyTunggakan[i] += val;
      }
    });
    monthlyTarget[i] = monthlyTerbayar[i] + monthlyTunggakan[i];
  }

  // Bezier curve interpolation helper
  const getBezierPath = (pts: { x: number; y: number }[]) => {
    if (pts.length === 0) return "";
    let path = `M ${pts[0].x} ${pts[0].y}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const cpX1 = p0.x + (p1.x - p0.x) / 3;
      const cpY1 = p0.y;
      const cpX2 = p0.x + (2 * (p1.x - p0.x)) / 3;
      const cpY2 = p1.y;
      path += ` C ${cpX1} ${cpY1}, ${cpX2} ${cpY2}, ${p1.x} ${p1.y}`;
    }
    return path;
  };

  // Calculate dynamic coordinates
  const maxVal = Math.max(...monthlyTarget, ...monthlyTerbayar, ...monthlyTunggakan, 1000000);
  const svgWidth = 560;
  const svgHeight = 200;

  const getPoints = (arr: number[]) => {
    return arr.map((val, i) => {
      const x = 90 + i * 86;
      // scale y between 30 (top) and 160 (bottom)
      const y = 160 - (val / maxVal) * 120;
      return { x, y, val };
    });
  };

  const targetPoints = getPoints(monthlyTarget);
  const terbayarPoints = getPoints(monthlyTerbayar);
  const tunggakanPoints = getPoints(monthlyTunggakan);

  const targetPath = getBezierPath(targetPoints);
  const terbayarPath = getBezierPath(terbayarPoints);
  const tunggakanPath = getBezierPath(tunggakanPoints);

  const targetAreaPath = `${targetPath} L ${targetPoints[5].x} 160 L ${targetPoints[0].x} 160 Z`;
  const terbayarAreaPath = `${terbayarPath} L ${terbayarPoints[5].x} 160 L ${terbayarPoints[0].x} 160 Z`;
  const tunggakanAreaPath = `${tunggakanPath} L ${tunggakanPoints[5].x} 160 L ${tunggakanPoints[0].x} 160 Z`;

  // Find peak month for tooltip indicator
  let peakIndex = 0;
  let maxTargetVal = -1;
  targetPoints.forEach((p, idx) => {
    if (p.val > maxTargetVal) {
      maxTargetVal = p.val;
      peakIndex = idx;
    }
  });
  const peakPoint = targetPoints[peakIndex];
  const tooltipX = peakPoint ? Math.max(90, Math.min(svgWidth - 90, peakPoint.x)) : 0;

  // Real conversion rate calculation
  const approvedBookingsCount = await prisma.booking.count({ where: { status: "APPROVED" } });
  const conversionRate = totalBookings > 0
    ? ((approvedBookingsCount / totalBookings) * 100).toFixed(1)
    : "0.0";



  const stats = [
    {
      label: "Total Kos Terdaftar",
      value: totalKos,
      icon: Home,
      gradient: "from-amber-500/10 via-white to-white border-amber-100",
      color: "text-amber-600 bg-amber-50 border-amber-200",
      hoverColor: "group-hover:border-amber-400 group-hover:shadow-amber-100/50"
    },
    {
      label: "Total Pengguna",
      value: totalUsers,
      icon: Users,
      gradient: "from-blue-500/10 via-white to-white border-blue-100",
      color: "text-blue-600 bg-blue-50 border-blue-200",
      hoverColor: "group-hover:border-blue-400 group-hover:shadow-blue-100/50"
    },
    {
      label: "Pengajuan Sewa",
      value: totalBookings,
      icon: FileText,
      gradient: "from-emerald-500/10 via-white to-white border-emerald-100",
      color: "text-emerald-600 bg-emerald-50 border-emerald-200",
      hoverColor: "group-hover:border-emerald-400 group-hover:shadow-emerald-100/50"
    },
    {
      label: "Obrolan Aktif",
      value: totalChats,
      icon: MessageSquare,
      gradient: "from-purple-500/10 via-white to-white border-purple-100",
      color: "text-purple-600 bg-purple-50 border-purple-200",
      hoverColor: "group-hover:border-purple-400 group-hover:shadow-purple-100/50"
    },
  ];

  // Helper percentage calculator
  const getPercentage = (value: number) => {
    if (totalKos === 0) return 0;
    return Math.round((value / totalKos) * 100);
  };

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      {/* Page Title & Status */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Dashboard Admin</h1>
          <p className="text-slate-500 text-sm mt-1 font-medium">
            Pantau statistik peninjauan kos secara real-time, kelola bobot kriteria SAW, audit perhitungan alternatif, dan kelola alur transaksi sewa.
          </p>
        </div>
        <div className="flex items-center gap-2 self-start md:self-center bg-emerald-50 text-emerald-700 border border-emerald-150 px-3.5 py-1.5 rounded-xl text-xs font-bold shadow-sm">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Sistem SPK Aktif
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map(({ label, value, icon: Icon, gradient, color, hoverColor }) => (
          <div
            key={label}
            className={`group bg-gradient-to-br ${gradient} rounded-2xl border p-6 flex items-center justify-between shadow-sm hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300`}
          >
            <div className="space-y-1">
              <div className="text-3xl font-black text-slate-900 tracking-tight leading-none">{value}</div>
              <div className="text-[13px] font-bold text-slate-500">{label}</div>
            </div>
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center border transition-all duration-300 ${color} ${hoverColor}`}>
              <Icon className="w-6 h-6" />
            </div>
          </div>
        ))}
      </div>

      {/* Analytics & Graph Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Booking Trend Visual Area Chart */}
        <RevenueChart
          monthlyTarget={monthlyTarget}
          monthlyTerbayar={monthlyTerbayar}
          monthlyTunggakan={monthlyTunggakan}
          monthLabels={monthLabels}
          totalBookings={totalBookings}
          conversionRate={conversionRate}
          maxVal={maxVal}
        />

        {/* Gender Segmentation Breakdown */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Building className="w-5 h-5 text-indigo-600" />
              <h2 className="font-bold text-slate-900 text-[16px]">Segmentasi Gender Kos</h2>
            </div>
            <p className="text-xs text-slate-500 mb-6 font-normal">Persentase sebaran jenis kos terdaftar berdasarkan segmentasi penghuni.</p>

            <div className="space-y-4">
              {/* Putra */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block animate-pulse"></span>
                    Kost Putra
                  </span>
                  <span>{putraKos} Kos ({getPercentage(putraKos)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-400 to-blue-600 rounded-full" style={{ width: `${getPercentage(putraKos)}%` }}></div>
                </div>
              </div>

              {/* Putri */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-pink-500 inline-block animate-pulse"></span>
                    Kost Putri
                  </span>
                  <span>{putriKos} Kos ({getPercentage(putriKos)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-pink-400 to-pink-600 rounded-full" style={{ width: `${getPercentage(putriKos)}%` }}></div>
                </div>
              </div>

              {/* Campur */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-500 inline-block animate-pulse"></span>
                    Kost Campur
                  </span>
                  <span>{campurKos} Kos ({getPercentage(campurKos)}%)</span>
                </div>
                <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-purple-400 to-purple-600 rounded-full" style={{ width: `${getPercentage(campurKos)}%` }}></div>
                </div>
              </div>
            </div>
          </div>
          <div className="border-t border-slate-100 pt-4 mt-6 text-center">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Database Kos: {totalKos} Alternatif</span>
          </div>
        </div>
      </div>

      {/* Rankings, Bookings & Quick Actions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Top 5 SAW Rankings with Image Thumbnails */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              <h2 className="font-bold text-slate-900 text-[16px]">Rekomendasi Utama Metode SAW</h2>
            </div>
            <Link href="/admin/perhitungan" className="text-xs font-semibold text-[#007185] hover:underline">
              Buka Matriks Detail
            </Link>
          </div>
          <p className="text-xs text-slate-500 mb-5 font-normal">Analisis 5 alternatif kos teratas berdasarkan kecocokan bobot kriteria SAW.</p>

          {topKos.length > 0 ? (
            <div className="space-y-3">
              {topKos.map((kos, i) => {
                const imageUrl = kos.images[0]?.url || "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=150&q=80";
                return (
                  <div key={kos.id} className="flex items-center gap-4 p-3 rounded-2xl border border-slate-100 hover:border-amber-300 hover:bg-amber-50/10 transition-all duration-300">
                    <span className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-md shrink-0 ${i === 0
                      ? "bg-gradient-to-r from-amber-500 to-[#FF9900]"
                      : i === 1
                        ? "bg-slate-400"
                        : i === 2
                          ? "bg-amber-700"
                          : "bg-slate-350"
                      }`}>
                      {i + 1}
                    </span>

                    {/* Thumbnail Image */}


                    <div className="flex-1 min-w-0">
                      <div className="font-bold text-slate-800 text-[13.5px] truncate">{kos.name}</div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] font-semibold text-slate-500">Rp {kos.price.toLocaleString("id-ID")}/bulan</span>
                        <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 bg-slate-100 text-slate-500 rounded border border-slate-200">
                          {kos.genderType}
                        </span>
                      </div>
                    </div>
                    {kos.finalScore && (
                      <span className="text-xs font-extrabold text-[#CC5500] bg-orange-50 border border-orange-100 px-3 py-1 rounded-full shrink-0 shadow-sm">
                        V = {kos.finalScore.toFixed(4)}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-12 text-slate-400 text-sm">
              <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-30 text-slate-300" />
              <p className="text-xs text-slate-400">Belum ada data peringkat. Silakan jalankan perhitungan SAW.</p>
            </div>
          )}
        </div>

        {/* Quick Action Hub with Donut Indicator */}
        <div className="bg-white rounded-2xl border border-border p-6 shadow-sm flex flex-col justify-between">
          <div className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Target className="w-5 h-5 text-primary" />
                <h2 className="font-bold text-slate-900 text-[16px]">Kontrol Cepat</h2>
              </div>
              <p className="text-xs text-slate-500 font-normal">Pintasan menu untuk konfigurasi model dan data.</p>
            </div>

            <div className="space-y-3">
              <Link href="/admin/kos/new" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-amber-300 hover:bg-amber-50/20 transition-all group">
                <div className="w-9 h-9 bg-amber-50 border border-amber-100 rounded-lg flex items-center justify-center shrink-0">
                  <Plus className="w-4 h-4 text-amber-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-amber-700 transition-colors">Tambah Kos Baru</div>
                  <div className="text-[11px] text-slate-400 truncate">Input data properti alternatif baru</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-amber-500 transition-colors shrink-0" />
              </Link>

              <Link href="/admin/kriteria" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-teal-300 hover:bg-teal-50/20 transition-all group">
                <div className="w-9 h-9 bg-teal-50 border border-teal-100 rounded-lg flex items-center justify-center shrink-0">
                  <Sliders className="w-4 h-4 text-teal-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-teal-700 transition-colors">Kelola Kriteria</div>
                  <div className="text-[11px] text-slate-400 truncate">Atur bobot pembobotan & sub kriteria</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-teal-500 transition-colors shrink-0" />
              </Link>

              <Link href="/admin/perhitungan" className="flex items-center gap-3 p-3 rounded-xl border border-border hover:border-blue-300 hover:bg-blue-50/20 transition-all group">
                <div className="w-9 h-9 bg-blue-50 border border-blue-100 rounded-lg flex items-center justify-center shrink-0">
                  <Trophy className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700 transition-colors">Kalkulator SAW</div>
                  <div className="text-[11px] text-slate-400 truncate">Audit rincian matriks keputusan</div>
                </div>
                <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-blue-500 transition-colors shrink-0" />
              </Link>
            </div>
          </div>

          <div className="border-t border-slate-100 pt-4 mt-6">
            <Link href="/" className="text-center block text-xs font-semibold text-[#007185] hover:text-[#005a6a] hover:underline transition-all">
              Buka Halaman Utama Publik &rarr;
            </Link>
          </div>
        </div>
      </div>

      {/* Recent Activity: Bookings Applications Feed */}
      <div className="bg-white rounded-2xl border border-border shadow-sm overflow-hidden">
        <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="font-bold text-slate-900 text-[16px]">Reservasi Pengajuan Sewa Terbaru</h2>
            <p className="text-xs text-slate-500 mt-0.5 font-normal">Daftar reservasi pengajuan sewa dari pelamar aktif.</p>
          </div>
          <Link href="/admin/kos" className="text-xs font-semibold text-[#007185] hover:underline">
            Kelola Semua Kos
          </Link>
        </div>

        {recentBookings.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse">
              <thead className="text-[11px] font-bold uppercase bg-slate-50 text-slate-500 border-b border-border">
                <tr>
                  <th className="px-6 py-3">Pemohon</th>
                  <th className="px-6 py-3">Nama Kos</th>
                  <th className="px-6 py-3">Durasi</th>
                  <th className="px-6 py-3">Tanggal Pengajuan</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentBookings.map((b) => (
                  <tr key={b.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800 text-[13px]">{b.user.name}</div>
                      <div className="text-[11px] text-slate-400 font-medium">{b.user.email}</div>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-700 text-[13px]">
                      {b.kos.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 text-xs font-medium">
                      {b.durationMonths} Bulan
                    </td>
                    <td className="px-6 py-4 text-slate-500 text-xs font-medium">
                      {new Date(b.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${b.status === "APPROVED"
                        ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                        : b.status === "PENDING"
                          ? "bg-amber-50 text-amber-700 border-amber-200"
                          : "bg-rose-50 text-rose-700 border-rose-200"
                        }`}>
                        {b.status === "APPROVED" ? "Disetujui" : b.status === "PENDING" ? "Menunggu" : "Ditolak"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12 text-slate-400">
            <FileText className="w-8 h-8 mx-auto mb-2 opacity-35 text-slate-300" />
            <p className="text-xs">Belum ada pengajuan sewa masuk.</p>
          </div>
        )}
      </div>
    </div>
  );
}
