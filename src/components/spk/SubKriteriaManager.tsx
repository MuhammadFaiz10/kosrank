"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Pencil, Plus, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createSubKriteria, deleteSubKriteria, updateSubKriteria } from "@/features/spk/actions";

export interface SubKriteriaItem {
  id: string;
  criteriaId: string;
  criteriaCode: string;
  criteriaName: string;
  name: string;
  value: string;
  score: number;
}

interface KriteriaOption {
  id: string;
  code: string;
  name: string;
}

interface FormState {
  id?: string;
  criteriaId: string;
  name: string;
  value: string;
  score: string;
}

export function SubKriteriaManager({
  subKriteria,
  kriteriaOptions,
}: {
  subKriteria: SubKriteriaItem[];
  kriteriaOptions: KriteriaOption[];
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState | null>(null);
  const [filterKriteria, setFilterKriteria] = useState("");
  const [error, setError] = useState("");

  const filtered = filterKriteria
    ? subKriteria.filter((s) => s.criteriaId === filterKriteria)
    : subKriteria;

  const openCreate = () => {
    setError("");
    setForm({
      criteriaId: kriteriaOptions[0]?.id ?? "",
      name: "",
      value: "",
      score: "",
    });
  };

  const openEdit = (item: SubKriteriaItem) => {
    setError("");
    setForm({
      id: item.id,
      criteriaId: item.criteriaId,
      name: item.name,
      value: item.value,
      score: String(item.score),
    });
  };

  const submit = () => {
    if (!form) return;
    setError("");
    startTransition(async () => {
      const data = {
        criteriaId: form.criteriaId,
        name: form.name,
        value: form.value,
        score: parseFloat(form.score) || 0,
      };
      const res = form.id ? await updateSubKriteria(form.id, data) : await createSubKriteria(data);
      if (!res.success) {
        setError(res.error ?? "Gagal menyimpan sub kriteria.");
        return;
      }
      setForm(null);
      router.refresh();
    });
  };

  const remove = (item: SubKriteriaItem) => {
    if (!confirm(`Hapus sub kriteria "${item.name}" (${item.criteriaCode})?`)) return;
    startTransition(async () => {
      await deleteSubKriteria(item.id);
      router.refresh();
    });
  };

  const inputClass =
    "w-full border border-line rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-brand-600";

  return (
    <div className="space-y-4">
      {kriteriaOptions.length === 0 && (
        <div className="bg-white border border-line rounded-2xl py-10 text-center">
          <p className="text-[13px] text-ink-500">
            Sub kriteria butuh kriteria induk. Gunakan "Pulihkan Default" di Beranda Modul terlebih dahulu.
          </p>
        </div>
      )}

      <div className="flex items-center justify-between gap-3 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <select
            value={filterKriteria}
            onChange={(e) => setFilterKriteria(e.target.value)}
            aria-label="Filter sub kriteria per kriteria"
            className="border border-line rounded-lg px-3 py-2 text-[13px] bg-white cursor-pointer"
          >
            <option value="">Semua Kriteria</option>
            {kriteriaOptions.map((k) => (
              <option key={k.id} value={k.id}>
                {k.code} - {k.name}
              </option>
            ))}
          </select>
          <span className="text-[12px] text-ink-500">{filtered.length} rubrik penilaian</span>
        </div>
        <Button onClick={openCreate} className="rounded-xl h-9">
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Sub Kriteria
        </Button>
      </div>

      {form && (
        <div className="bg-white border border-brand-600/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-[15px]">
              {form.id ? "Ubah Sub Kriteria" : "Tambah Sub Kriteria"}
            </h3>
            <button onClick={() => setForm(null)} aria-label="Tutup form" className="p-1 rounded-lg hover:bg-surface-muted cursor-pointer">
              <X className="w-4 h-4 text-ink-500" />
            </button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Kriteria Induk</Label>
              <select
                value={form.criteriaId}
                onChange={(e) => setForm({ ...form, criteriaId: e.target.value })}
                className="w-full border border-line rounded-lg px-3 py-2 text-[13px] bg-white h-10 cursor-pointer"
              >
                {kriteriaOptions.map((k) => (
                  <option key={k.id} value={k.id}>
                    {k.code} - {k.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Skor (0-100)</Label>
              <Input
                name="score"
                type="number"
                min={0}
                max={100}
                value={form.score}
                onChange={(e) => setForm({ ...form, score: e.target.value })}
                required
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Nama Sub Kriteria</Label>
              <Input
                name="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
                placeholder="Contoh: 0 - 1 km"
                className="rounded-lg"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Nilai / Rentang</Label>
              <Input
                name="value"
                value={form.value}
                onChange={(e) => setForm({ ...form, value: e.target.value })}
                required
                placeholder="0-1"
                className="rounded-lg"
              />
            </div>
          </div>
          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}
          <div className="flex gap-2">
            <Button onClick={submit} disabled={isPending} className="rounded-xl flex-1">
              {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Sub Kriteria"}
            </Button>
            <Button variant="outline" onClick={() => setForm(null)} className="rounded-xl">Batal</Button>
          </div>
        </div>
      )}

      <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-surface-muted">
            <tr>
              {["Kriteria", "Nama Sub Kriteria", "Nilai / Rentang", "Skor", "Aksi"].map((h) => (
                <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((s) => (
              <tr key={s.id} className="hover:bg-surface-muted/60 transition-colors">
                <td className="px-3.5 py-2.5 text-[13px] font-semibold">{s.criteriaCode}</td>
                <td className="px-3.5 py-2.5 text-[13px]">{s.name}</td>
                <td className="px-3.5 py-2.5 text-[12px] text-ink-500 font-mono">{s.value}</td>
                <td className="px-3.5 py-2.5 text-[13px] font-mono font-bold text-brand-700">{s.score}</td>
                <td className="px-3.5 py-2.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(s)} aria-label={`Ubah ${s.name}`} className="p-1.5 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(s)} aria-label={`Hapus ${s.name}`} disabled={isPending} className="p-1.5 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={5} className="py-12 text-center text-[13px] text-ink-500">
                  Belum ada sub kriteria untuk kriteria ini.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
