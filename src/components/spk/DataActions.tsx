"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Eraser, RotateCcw, Loader2 } from "lucide-react";
import {
  clearKriteria,
  clearSubKriteria,
  resetBobotDefault,
  restoreDefaultRubric,
} from "@/features/spk/actions";

interface DataActionsProps {
  kriteria?: boolean;
  subKriteria?: boolean;
  bobot?: boolean;
  semua?: boolean;
  pulihkan?: boolean;
}

export function DataActions({ kriteria, subKriteria, bobot, semua, pulihkan }: DataActionsProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState("");

  const run = (fn: () => Promise<{ success: boolean }>, done: string) => {
    startTransition(async () => {
      await fn();
      setMessage(done);
      router.refresh();
    });
  };

  const btn =
    "inline-flex items-center gap-1.5 text-[12px] font-semibold px-3 py-2 rounded-lg border transition-colors cursor-pointer disabled:opacity-50";

  return (
    <div className="space-y-2">
      <div className="flex gap-2 flex-wrap">
        {kriteria && (
          <button
            onClick={() => {
              if (!confirm("Bersihkan SEMUA kriteria? Sub kriteria dan nilai kriteria terkait juga ikut terhapus.")) return;
              run(clearKriteria, "Semua kriteria telah dibersihkan.");
            }}
            disabled={isPending}
            className={`${btn} border-red-200 text-red-600 hover:bg-red-50`}
          >
            <Eraser className="w-3.5 h-3.5" /> Bersihkan Kriteria
          </button>
        )}
        {subKriteria && (
          <button
            onClick={() => {
              if (!confirm("Bersihkan SEMUA sub kriteria?")) return;
              run(clearSubKriteria, "Semua sub kriteria telah dibersihkan.");
            }}
            disabled={isPending}
            className={`${btn} border-red-200 text-red-600 hover:bg-red-50`}
          >
            <Eraser className="w-3.5 h-3.5" /> Bersihkan Sub Kriteria
          </button>
        )}
        {bobot && (
          <button
            onClick={() => {
              if (!confirm("Kembalikan semua bobot ke nilai bawaan (30/30/20/10/10)?")) return;
              run(resetBobotDefault, "Bobot dikembalikan ke bawaan.");
            }}
            disabled={isPending}
            className={`${btn} border-line text-ink-700 hover:bg-surface-muted`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Bobot ke Bawaan
          </button>
        )}
        {semua && (
          <button
            onClick={() => {
              if (!confirm("Bersihkan kriteria + sub kriteria + bobot? Perhitungan tidak bisa jalan sampai dipulihkan.")) return;
              run(clearKriteria, "Semua data perhitungan telah dibersihkan.");
            }}
            disabled={isPending}
            className={`${btn} border-red-200 text-red-600 hover:bg-red-50`}
          >
            <Eraser className="w-3.5 h-3.5" /> Bersihkan Semua
          </button>
        )}
        {pulihkan && (
          <button
            onClick={() => {
              if (!confirm("Pulihkan rubrik bawaan data_kost.xlsx? Data kriteria/sub kriteria saat ini akan diganti.")) return;
              run(restoreDefaultRubric, "Rubrik bawaan dipulihkan (5 kriteria, 25 sub kriteria, bobot bawaan).");
            }}
            disabled={isPending}
            className={`${btn} border-brand-600/40 text-brand-700 hover:bg-brand-100`}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Pulihkan Default
          </button>
        )}
      </div>
      {(isPending || message) && (
        <p className="text-[11px] text-ink-500 flex items-center gap-1.5">
          {isPending && <Loader2 className="w-3 h-3 animate-spin" />}
          {isPending ? "Memproses..." : message}
        </p>
      )}
    </div>
  );
}
