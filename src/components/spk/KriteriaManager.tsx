"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Plus, Save, Trash2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createKriteria, deleteKriteria, updateKriteria } from "@/features/spk/actions";

export interface KriteriaItem {
  id: string;
  code: string;
  name: string;
  attribute: string;
  weight: number;
}

interface EditState {
  name: string;
  attribute: "COST" | "BENEFIT";
  weight: string;
}

interface CreateState {
  name: string;
  attribute: "COST" | "BENEFIT";
  weight: string;
}

export function KriteriaManager({ criteria }: { criteria: KriteriaItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [edits, setEdits] = useState<Record<string, EditState | undefined>>({});
  const [create, setCreate] = useState<CreateState | null>(null);
  const [error, setError] = useState("");
  const [warning, setWarning] = useState("");
  const [savedId, setSavedId] = useState<string | null>(null);

  const editOf = (item: KriteriaItem): EditState =>
    edits[item.id] ?? { name: item.name, attribute: item.attribute as "COST" | "BENEFIT", weight: String(item.weight) };

  const setEdit = (id: string, patch: Partial<EditState>) => {
    setEdits((prev) => ({ ...prev, [id]: { ...(editOf(criteria.find((c) => c.id === id)!)), ...patch } }));
  };

  const save = (item: KriteriaItem) => {
    const edit = editOf(item);
    setError("");
    setWarning("");
    startTransition(async () => {
      const res = await updateKriteria(item.id, {
        name: edit.name,
        attribute: edit.attribute,
        weight: parseFloat(edit.weight) || 0,
      });
      if (!res.success) {
        setError(res.error ?? "Gagal menyimpan kriteria.");
        return;
      }
      setSavedId(item.id);
      if (res.warning) setWarning(res.warning);
      router.refresh();
    });
  };

  const remove = (item: KriteriaItem) => {
    if (!confirm(`Hapus kriteria ${item.code} (${item.name})? Sub kriteria dan nilai kriteria terkait juga ikut terhapus.`)) return;
    setError("");
    setWarning("");
    startTransition(async () => {
      const res = await deleteKriteria(item.id);
      if (!res.success) {
        setError(res.error ?? "Gagal menghapus kriteria.");
        return;
      }
      router.refresh();
    });
  };

  const submitCreate = () => {
    if (!create) return;
    setError("");
    setWarning("");
    startTransition(async () => {
      const res = await createKriteria({
        name: create.name,
        attribute: create.attribute,
        weight: parseFloat(create.weight) || 0,
      });
      if (!res.success) {
        setError(res.error ?? "Gagal menambah kriteria.");
        return;
      }
      setCreate(null);
      if (res.warning) setWarning(res.warning);
      router.refresh();
    });
  };

  const totalBobot = criteria.reduce((acc, c) => acc + (edits[c.id] ? parseFloat(editOf(c).weight) || 0 : c.weight), 0);

  return (
    <div className="space-y-4">
      {criteria.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl py-12 text-center">
          <p className="text-[14px] font-semibold text-ink-900">Belum ada kriteria</p>
          <p className="text-[13px] text-ink-500 mt-1">
            Klik "Tambah Kriteria" atau gunakan "Pulihkan Default" di Beranda Modul untuk mengembalikan rubrik data_kost.xlsx.
          </p>
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between gap-3 flex-wrap">
            <p className="text-[12px] text-ink-500 max-w-2xl">
              Kriteria C1-C5 terhubung ke nilai mentah (skor otomatis). Kriteria tambahan (C6 dan seterusnya)
              mulai dengan skor 20 untuk semua alternatif. Sub kriteria dikelola di halaman terpisah.
            </p>
            <Button onClick={() => { setError(""); setWarning(""); setCreate({ name: "", attribute: "BENEFIT", weight: "0.1" }); }} className="rounded-xl h-9">
              <Plus className="w-4 h-4 mr-1.5" /> Tambah Kriteria
            </Button>
          </div>

          {create && (
            <div className="bg-white border border-brand-600/40 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-display font-bold text-[15px]">Tambah Kriteria Baru</h3>
                <button onClick={() => setCreate(null)} aria-label="Tutup form" className="p-1 rounded-lg hover:bg-surface-muted cursor-pointer">
                  <X className="w-4 h-4 text-ink-500" />
                </button>
              </div>
              <p className="text-[11px] text-ink-500 -mt-2">
                Kode ditentukan otomatis sebagai lanjutan urutan (C6, C7, dan seterusnya).
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-ink-500">Nama Kriteria</Label>
                  <Input value={create.name} onChange={(e) => setCreate({ ...create, name: e.target.value })} required placeholder="Contoh: Keamanan" className="rounded-lg" />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-ink-500">Jenis</Label>
                  <select value={create.attribute} onChange={(e) => setCreate({ ...create, attribute: e.target.value as "COST" | "BENEFIT" })} className="w-full border border-line rounded-lg px-3 py-2 text-[13px] bg-white h-10 cursor-pointer">
                    <option value="BENEFIT">Benefit</option>
                    <option value="COST">Cost</option>
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs font-semibold text-ink-500">Bobot</Label>
                  <Input type="number" min={0} max={1} step={0.05} value={create.weight} onChange={(e) => setCreate({ ...create, weight: e.target.value })} required className="rounded-lg" />
                </div>
              </div>
              <Button onClick={submitCreate} disabled={isPending} className="rounded-xl">
                {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Kriteria"}
              </Button>
            </div>
          )}

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}
          {warning && (
            <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{warning}</div>
          )}
          {savedId && !error && !warning && (
            <div className="text-xs text-eco bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">Kriteria tersimpan.</div>
          )}

      {error && (
        <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}
      {warning && (
        <div className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2">{warning}</div>
      )}
      {savedId && !error && !warning && (
        <div className="text-xs text-eco bg-emerald-50 border border-emerald-200 rounded-lg px-3 py-2">Kriteria tersimpan.</div>
      )}

      <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[720px]">
          <thead className="bg-surface-muted">
            <tr>
              {["Kode", "Nama Kriteria", "Jenis", "Bobot", "Aksi"].map((h) => (
                <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {criteria.map((c) => {
              const edit = editOf(c);
              const dirty = edits[c.id] !== undefined;
              return (
                <tr key={c.id} className="hover:bg-surface-muted/60 transition-colors">
                  <td className="px-3.5 py-2.5 text-[13px] font-semibold">{c.code}</td>
                  <td className="px-3.5 py-2.5">
                    <input
                      value={edit.name}
                      onChange={(e) => setEdit(c.id, { name: e.target.value })}
                      aria-label={`Nama kriteria ${c.code}`}
                      className="w-full border border-line rounded-lg px-2.5 py-1.5 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-brand-600"
                    />
                  </td>
                  <td className="px-3.5 py-2.5">
                    <select
                      value={edit.attribute}
                      onChange={(e) => setEdit(c.id, { attribute: e.target.value as "COST" | "BENEFIT" })}
                      aria-label={`Jenis kriteria ${c.code}`}
                      className="border border-line rounded-lg px-2 py-1.5 text-[12px] bg-white cursor-pointer"
                    >
                      <option value="COST">Cost</option>
                      <option value="BENEFIT">Benefit</option>
                    </select>
                  </td>
                  <td className="px-3.5 py-2.5">
                    <input
                      type="number"
                      min={0}
                      max={1}
                      step={0.05}
                      value={edit.weight}
                      onChange={(e) => setEdit(c.id, { weight: e.target.value })}
                      aria-label={`Bobot kriteria ${c.code}`}
                      className="w-20 border border-line rounded-lg px-2.5 py-1.5 text-[13px] font-mono bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-brand-600"
                    />
                  </td>
                  <td className="px-3.5 py-2.5">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => save(c)}
                        disabled={isPending || !dirty}
                        aria-label={`Simpan ${c.code}`}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer disabled:opacity-30"
                      >
                        {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                      </button>
                      <button
                        onClick={() => remove(c)}
                        disabled={isPending}
                        aria-label={`Hapus ${c.code}`}
                        className="p-1.5 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
            <tr className="bg-surface-tint">
              <td colSpan={3} className="px-3.5 py-2.5 text-[13px] font-bold">Total Bobot</td>
              <td colSpan={2} className={`px-3.5 py-2.5 text-[13px] font-mono font-bold ${Math.abs(totalBobot - 1) <= 1e-9 ? "text-eco" : "text-red-600"}`}>
                {totalBobot.toFixed(2)}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
        </>
      )}
    </div>
  );
}
