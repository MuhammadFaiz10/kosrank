"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateBobot } from "@/features/spk/actions";
import { validateBobotTotal } from "@/features/spk/mapping";

interface BobotItem {
  code: string;
  name: string;
  weight: number;
  attribute: string;
}

export function BobotEditor({ criteria }: { criteria: BobotItem[] }) {
  const router = useRouter();
  const [values, setValues] = useState<Record<string, string>>(
    Object.fromEntries(criteria.map((c) => [c.code, String(c.weight)]))
  );
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const total = Object.values(values).reduce((acc, v) => acc + (parseFloat(v) || 0), 0);
  const totalValid = validateBobotTotal(
    Object.fromEntries(Object.entries(values).map(([k, v]) => [k, parseFloat(v) || 0]))
  ).ok;

  const submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    const fd = new FormData(e.currentTarget);
    startTransition(async () => {
      const res = await updateBobot(fd);
      if (!res.success) {
        setError(res.error ?? "Gagal menyimpan bobot.");
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  };

  if (criteria.length === 0) {
    return (
      <div className="bg-white border border-line rounded-2xl py-12 text-center max-w-xl">
        <p className="text-[14px] font-semibold text-ink-900">Belum ada kriteria</p>
        <p className="text-[13px] text-ink-500 mt-1">
          Bobot kosong karena kriteria belum diatur. Gunakan tombol "Pulihkan Default" di Beranda Modul.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      <div className="bg-white border border-line rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-surface-muted">
            <tr>
              {["Kode", "Kriteria", "Jenis", "Bobot"].map((h) => (
                <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {criteria.map((c) => (
              <tr key={c.code}>
                <td className="px-3.5 py-2.5 text-[13px] font-semibold">{c.code}</td>
                <td className="px-3.5 py-2.5 text-[13px]">{c.name}</td>
                <td className="px-3.5 py-2.5">
                  <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.attribute === "COST" ? "bg-[#FDEDF3] text-[#D14D8B]" : "bg-brand-100 text-brand-700"}`}>
                    {c.attribute}
                  </span>
                </td>
                <td className="px-3.5 py-2.5">
                  <input
                    type="number"
                    name={`bobot_${c.code}`}
                    min={0}
                    max={1}
                    step={0.05}
                    value={values[c.code]}
                    onChange={(e) => setValues({ ...values, [c.code]: e.target.value })}
                    required
                    aria-label={`Bobot ${c.name}`}
                    className="w-24 border border-line rounded-lg px-2.5 py-1.5 text-[13px] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-brand-600"
                  />
                </td>
              </tr>
            ))}
            <tr className="bg-surface-tint">
              <td colSpan={3} className="px-3.5 py-2.5 text-[13px] font-bold">Total</td>
              <td className={`px-3.5 py-2.5 text-[13px] font-mono font-bold ${totalValid ? "text-eco" : "text-red-600"}`}>
                {total.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {!totalValid && (
        <p className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-xl">
          Total bobot {total.toFixed(2)} — harus tepat 1,0 (100%) sebelum bisa disimpan.
        </p>
      )}
      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2 max-w-xl">{error}</div>
      )}
      {success && (
        <p className="text-xs text-eco bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2 max-w-xl">
          Bobot tersimpan. Hasil perangkingan diperbarui.
        </p>
      )}

      <Button type="submit" disabled={isPending || !totalValid} className="rounded-xl h-10 px-6">
        {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Bobot"}
      </Button>
    </form>
  );
}
