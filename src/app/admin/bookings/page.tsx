import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { BookingActions } from "./BookingActions";
import { CalendarDays, Clock, CheckCircle2, User, MapPin } from "lucide-react";

const STATUS_LABEL: Record<string, string> = {
  PENDING: "Menunggu",
  APPROVED: "Disetujui",
  REJECTED: "Ditolak",
};

const STATUS_STYLE: Record<string, string> = {
  PENDING: "bg-amber-50 text-amber-700 border-amber-200",
  APPROVED: "bg-emerald-50 text-emerald-700 border-emerald-200",
  REJECTED: "bg-red-50 text-red-600 border-red-200",
};

export default async function AdminBookingsPage() {
  const bookings = await prisma.booking.findMany({
    orderBy: [{ status: "asc" }, { createdAt: "desc" }],
    include: {
      user: { select: { name: true, email: true, phone: true } },
      kos: { select: { name: true, slug: true, price: true, campus: true } },
    },
  });

  const pendingCount = bookings.filter((b) => b.status === "PENDING").length;
  const approvedCount = bookings.filter((b) => b.status === "APPROVED").length;

  const stats = [
    { label: "Menunggu Persetujuan", value: pendingCount, icon: Clock },
    { label: "Disetujui", value: approvedCount, icon: CheckCircle2 },
    { label: "Total Pengajuan", value: bookings.length, icon: CalendarDays },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="font-display text-[26px] md:text-[30px] font-bold tracking-[-0.02em]">
          Kelola Booking
        </h1>
        <p className="text-muted-foreground text-sm mt-1">
          Setujui atau tolak seluruh pengajuan sewa kos.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {stats.map(({ label, value, icon: Icon }) => (
          <div key={label} className="bg-white rounded-2xl border border-border p-5 flex items-center gap-4">
            <div className="w-11 h-11 bg-brand-600 rounded-xl flex items-center justify-center">
              <Icon className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold">{value}</div>
              <div className="text-sm text-muted-foreground">{label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Booking list */}
      {bookings.length > 0 ? (
        <div className="bg-white rounded-2xl border border-border overflow-hidden">
          <div className="divide-y divide-border">
            {bookings.map((b) => (
              <div key={b.id} className="flex flex-col sm:flex-row sm:items-center gap-3 px-5 py-4 hover:bg-surface-muted transition-colors">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-medium text-sm truncate">{b.kos.name}</span>
                    <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border flex-shrink-0 ${STATUS_STYLE[b.status]}`}>
                      {STATUS_LABEL[b.status]}
                    </span>
                  </div>
                  <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">
                        {b.user.name} ({b.user.email}){b.user.phone ? ` · ${b.user.phone}` : ""}
                      </span>
                    </div>
                    <div>
                      {b.durationMonths} bulan · mulai{" "}
                      {new Date(b.startDate).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })}{" "}
                      · Estimasi Rp {(b.kos.price * b.durationMonths).toLocaleString("id-ID")}
                    </div>
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3 h-3 flex-shrink-0" />
                      {b.kos.campus}
                    </div>
                  </div>
                </div>
                {b.status === "PENDING" && <BookingActions bookingId={b.id} />}
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="py-16 text-center text-muted-foreground bg-white rounded-2xl border border-border">
          <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-20" />
          <p className="text-sm">Belum ada pengajuan sewa masuk.</p>
        </div>
      )}
    </div>
  );
}
