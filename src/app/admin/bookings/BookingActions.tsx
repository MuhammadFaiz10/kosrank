"use client";

import { useState, useTransition } from "react";
import { updateBookingStatus } from "@/features/bookings/actions";
import { Check, X, Loader2 } from "lucide-react";

export function BookingActions({ bookingId }: { bookingId: string }) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const update = (status: "APPROVED" | "REJECTED") => {
    setError("");
    startTransition(async () => {
      const res = await updateBookingStatus(bookingId, status);
      if (!res.success) {
        setError(res.error ?? "Gagal memperbarui status.");
      }
    });
  };

  if (error) {
    return <span className="text-[11px] text-red-600 max-w-[140px]">{error}</span>;
  }

  return (
    <div className="flex gap-2 flex-shrink-0">
      <button
        onClick={() => update("APPROVED")}
        disabled={isPending}
        className="flex items-center gap-1 text-[12px] font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
      >
        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Check className="w-3.5 h-3.5" />}
        Setujui
      </button>
      <button
        onClick={() => update("REJECTED")}
        disabled={isPending}
        className="flex items-center gap-1 text-[12px] font-semibold text-red-600 border border-red-200 bg-red-50 hover:bg-red-100 rounded-lg px-2.5 py-1.5 transition-colors disabled:opacity-50 cursor-pointer"
      >
        <X className="w-3.5 h-3.5" />
        Tolak
      </button>
    </div>
  );
}
