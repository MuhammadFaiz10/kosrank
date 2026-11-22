import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { MapPin, CalendarDays, Clock, CheckCircle2, FileText } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu Persetujuan",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
};

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const bookings = await prisma.booking.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
    include: {
      kos: {
        select: {
          name: true,
          slug: true,
          price: true,
          campus: true,
          images: { take: 1 },
        },
      },
    },
  });

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const approvedCount = bookings.filter((b) => b.status === "APPROVED").length;

  const stats = [
    { label: "Total Pengajuan", value: bookings.length, icon: FileText },
    { label: "Menunggu Persetujuan", value: pendingCount, icon: Clock },
    { label: "Disetujui", value: approvedCount, icon: CheckCircle2 },
  ];

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left text-ink-900">
      <h1 className="font-display text-[26px] md:text-[30px] leading-[1.2] font-bold tracking-[-0.02em]">
        Dashboard Saya
      </h1>
      <p className="text-[12px] text-ink-500 mt-1">
        Pantau pengajuan sewa kos Anda di satu tempat.
      </p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-5">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white border border-line rounded-2xl p-4 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-100 flex items-center justify-center flex-shrink-0">
              <Icon className="w-4.5 h-4.5 text-brand-700" />
            </div>
            <div>
              <div className="font-display text-[20px] font-bold leading-none">{value}</div>
              <div className="text-[11px] text-ink-500 mt-1">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking list */}
      <h2 className="font-display text-[16px] font-bold mt-8 mb-3">Riwayat Pengajuan Sewa</h2>

      {bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 bg-surface-tint rounded-2xl border border-line text-ink-500">
          <CalendarDays className="w-12 h-12 mb-3 opacity-30" />
          <p className="font-display font-semibold text-[14px] text-ink-900">Belum ada pengajuan sewa</p>
          <p className="text-xs mt-0.5">Jelajahi kos terbaik hasil perankingan SAW dan ajukan sewa pertama Anda.</p>
          <Link
            href="/explore"
            className="mt-4 bg-brand-700 hover:bg-brand-600 text-white rounded-lg text-[13px] font-semibold h-9 px-4 flex items-center transition-colors"
          >
            Cari Kos Sekarang
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {bookings.map((b) => (
            <Link
              key={b.id}
              href={`/kos/${b.kos.slug}`}
              className="flex gap-4 items-center bg-white border border-line rounded-2xl p-3.5 hover:border-brand-600 transition-colors group"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden bg-surface-tint flex-shrink-0 flex items-center justify-center">
                {b.kos.images[0] ? (
                  <img src={b.kos.images[0].url} alt={b.kos.name} className="w-full h-full object-cover" />
                ) : (
                  <MapPin className="w-6 h-6 text-ink-500/40" />
                )}
              </div>
              <div className="flex-grow min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <h3 className="font-display font-semibold text-[14px] truncate group-hover:text-brand-600 transition-colors">
                    {b.kos.name}
                  </h3>
                  <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLE[b.status]}`}>
                    {STATUS_LABEL[b.status]}
                  </span>
                </div>
                <p className="text-[12px] text-ink-500 mt-0.5 truncate">
                  {b.kos.campus} · {b.durationMonths} bulan · mulai{" "}
                  {new Date(b.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}
                </p>
                <p className="text-[13px] font-semibold mt-1">
                  Estimasi: Rp {(b.kos.price * b.durationMonths).toLocaleString("id-ID")}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
