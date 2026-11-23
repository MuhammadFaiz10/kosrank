"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Plus, Pencil, Trash2, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createAlternatif, deleteAlternatif, selectAllAlternatif, setAlternatifSelection, updateAlternatif } from "@/features/spk/actions";
import { facilityLevelFromCount, LEVEL_LABEL } from "@/features/spk/mapping";

export interface AlternatifItem {
  id: string;
  kode: string | null;
  name: string;
  address: string;
  genderType: string;
  price: number;
  jarakKm: number | null;
  roomSize: string;
  rating: number | null;
  phone: string | null;
  fasilitasTeks: string | null;
  dipilih: boolean;
}

const TIPE_LABEL: Record<string, string> = {
  PUTRA: "Putra",
  PUTRI: "Putri",
  CAMPUR: "Campur",
};

interface FormState {
  id?: string;
  name: string;
  address: string;
  genderType: string;
  price: string;
  jarakKm: string;
  panjangM: string;
  lebarM: string;
  rating: string;
  phone: string;
  fasilitasTeks: string;
}

const EMPTY_FORM: FormState = {
  name: "",
  address: "",
  genderType: "PUTRI",
  price: "",
  jarakKm: "",
  panjangM: "",
  lebarM: "",
  rating: "",
  phone: "",
  fasilitasTeks: "",
};

export function AlternatifManager({ items }: { items: AlternatifItem[] }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormState | null>(null);
  const [error, setError] = useState("");

  const fasilitasCount = form
    ? form.fasilitasTeks.split(";").filter((s) => s.trim()).length
    : 0;
  const level = form ? facilityLevelFromCount(fasilitasCount) : 0;

  const openCreate = () => {
    setError("");
    setForm({ ...EMPTY_FORM });
  };

  const openEdit = (item: AlternatifItem) => {
    setError("");
    setForm({
      id: item.id,
      name: item.name,
      address: item.address,
      genderType: item.genderType,
      price: String(item.price),
      jarakKm: item.jarakKm != null ? String(item.jarakKm) : "",
      panjangM: "",
      lebarM: "",
      rating: item.rating != null ? String(item.rating) : "",
      phone: item.phone ?? "",
      fasilitasTeks: item.fasilitasTeks ?? "",
    });
  };

  const submit = () => {
    if (!form) return;
    setError("");
    startTransition(async () => {
      const fd = new FormData();
      fd.set("name", form.name);
      fd.set("address", form.address);
      fd.set("genderType", form.genderType);
      fd.set("price", form.price);
      fd.set("jarakKm", form.jarakKm);
      fd.set("panjangM", form.panjangM || "0");
      fd.set("lebarM", form.lebarM || "0");
      fd.set("rating", form.rating);
      fd.set("phone", form.phone);
      fd.set("fasilitasTeks", form.fasilitasTeks);

      const res = form.id
        ? await updateAlternatif(form.id, fd)
        : await createAlternatif(fd);

      if (!res.success) {
        setError(res.error ?? "Gagal menyimpan alternatif.");
        return;
      }
      setForm(null);
      router.refresh();
    });
  };

  const remove = (id: string, name: string) => {
    if (!confirm(`Hapus alternatif "${name}"?`)) return;
    startTransition(async () => {
      await deleteAlternatif(id);
      router.refresh();
    });
  };

  const inputClass =
    "w-full border border-line rounded-lg px-3 py-2 text-[13px] bg-white focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-brand-600";

  const allSelected = items.length > 0 && items.every((i) => i.dipilih);
  const someSelected = items.some((i) => i.dipilih);
  const selectedCount = items.filter((i) => i.dipilih).length;

  const headerCheckboxRef = (el: HTMLInputElement | null) => {
    if (el) el.indeterminate = !allSelected && someSelected;
  };

  const toggleAll = () => {
    startTransition(async () => {
      await selectAllAlternatif(!allSelected);
      router.refresh();
    });
  };

  const toggleOne = (id: string, dipilih: boolean) => {
    startTransition(async () => {
      await setAlternatifSelection([id], !dipilih);
      router.refresh();
    });
  };

  // Filter pencarian: lokasi, tipe, harga, jarak, rating
  const [fLokasi, setFLokasi] = useState("");
  const [fTipe, setFTipe] = useState("");
  const [fHargaMin, setFHargaMin] = useState("");
  const [fHargaMax, setFHargaMax] = useState("");
  const [fJarakMax, setFJarakMax] = useState("");
  const [fRatingMin, setFRatingMin] = useState("");

  const filtered = items.filter((i) =>
    (!fLokasi || i.address.toLowerCase().includes(fLokasi.toLowerCase())) &&
    (!fTipe || i.genderType === fTipe) &&
    (!fHargaMin || i.price >= Number(fHargaMin)) &&
    (!fHargaMax || i.price <= Number(fHargaMax)) &&
    (!fJarakMax || (i.jarakKm ?? Infinity) <= Number(fJarakMax)) &&
    (!fRatingMin || (i.rating ?? -1) >= Number(fRatingMin))
  );

  const resetFilter = () => {
    setFLokasi("");
    setFTipe("");
    setFHargaMin("");
    setFHargaMax("");
    setFJarakMax("");
    setFRatingMin("");
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[12px] text-ink-500">
          <span className="font-semibold text-ink-900">{selectedCount}</span> dari {items.length} alternatif dipilih untuk
          perangkingan. Skor kriteria dihitung otomatis dari nilai mentah saat disimpan.
        </p>
        <Button onClick={openCreate} className="rounded-xl h-9">
          <Plus className="w-4 h-4 mr-1.5" /> Tambah Alternatif
        </Button>
      </div>

      {/* Filter pencarian */}
      <div className="bg-white border border-line rounded-2xl p-4">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Lokasi</label>
            <input type="text" value={fLokasi} onChange={(e) => setFLokasi(e.target.value)} placeholder="Cari lokasi..." aria-label="Cari lokasi" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Tipe</label>
            <select value={fTipe} onChange={(e) => setFTipe(e.target.value)} aria-label="Filter tipe" className={inputClass + " cursor-pointer"}>
              <option value="">Semua</option>
              <option value="PUTRA">Putra</option>
              <option value="PUTRI">Putri</option>
              <option value="CAMPUR">Campur</option>
            </select>
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Harga Min (Rp)</label>
            <input type="number" min={0} value={fHargaMin} onChange={(e) => setFHargaMin(e.target.value)} placeholder="0" aria-label="Harga minimum" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Harga Maks (Rp)</label>
            <input type="number" min={0} value={fHargaMax} onChange={(e) => setFHargaMax(e.target.value)} placeholder="5.000.000" aria-label="Harga maksimum" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Jarak Maks (km)</label>
            <input type="number" min={0} step="0.5" value={fJarakMax} onChange={(e) => setFJarakMax(e.target.value)} placeholder="15" aria-label="Jarak maksimum" className={inputClass} />
          </div>
          <div className="space-y-1">
            <label className="text-[10px] font-bold uppercase tracking-wider text-ink-500">Rating Min</label>
            <input type="number" min={0} max={5} step="0.1" value={fRatingMin} onChange={(e) => setFRatingMin(e.target.value)} placeholder="0" aria-label="Rating minimum" className={inputClass} />
          </div>
        </div>
        <div className="flex items-center justify-between gap-2 mt-2.5 flex-wrap">
          <p className="text-[11px] text-ink-500">
            Menampilkan <span className="font-semibold text-ink-900">{filtered.length}</span> dari {items.length} alternatif
          </p>
          <button onClick={resetFilter} className="text-[11px] font-semibold text-brand-700 hover:text-brand-600 transition-colors cursor-pointer">
            Reset Filter
          </button>
        </div>
      </div>

      {/* Form tambah/ubah */}
      {form && (
        <div className="bg-white border border-brand-600/40 rounded-2xl p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-display font-bold text-[15px]">
              {form.id ? "Ubah Alternatif" : "Tambah Alternatif Baru"}
            </h3>
            <button onClick={() => setForm(null)} aria-label="Tutup form" className="p-1 rounded-lg hover:bg-surface-muted cursor-pointer">
              <X className="w-4 h-4 text-ink-500" />
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Nama Kos</Label>
              <Input name="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required className="rounded-lg" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Lokasi / Alamat</Label>
              <Input name="address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} required placeholder="Cinere, Depok" className="rounded-lg" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Tipe Kos</Label>
              <select name="genderType" value={form.genderType} onChange={(e) => setForm({ ...form, genderType: e.target.value })} className="w-full border border-line rounded-lg px-3 py-2 text-[13px] bg-white h-10 cursor-pointer">
                <option value="PUTRA">Putra</option>
                <option value="PUTRI">Putri</option>
                <option value="CAMPUR">Campur</option>
              </select>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Harga per Bulan (Rp)</Label>
              <Input name="price" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required className="rounded-lg" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Jarak ke Kampus (km)</Label>
              <Input name="jarakKm" type="number" step="0.1" min="0" value={form.jarakKm} onChange={(e) => setForm({ ...form, jarakKm: e.target.value })} required className="rounded-lg" />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-ink-500">Panjang (m)</Label>
                <Input name="panjangM" type="number" step="0.1" min="0" value={form.panjangM} onChange={(e) => setForm({ ...form, panjangM: e.target.value })} placeholder={form.id ? "(tidak diubah)" : "3"} className="rounded-lg" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs font-semibold text-ink-500">Lebar (m)</Label>
                <Input name="lebarM" type="number" step="0.1" min="0" value={form.lebarM} onChange={(e) => setForm({ ...form, lebarM: e.target.value })} placeholder={form.id ? "(tidak diubah)" : "4"} className="rounded-lg" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Rating (0-5, kosong = Not found)</Label>
              <Input name="rating" type="number" step="0.1" min="0" max="5" value={form.rating} onChange={(e) => setForm({ ...form, rating: e.target.value })} className="rounded-lg" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs font-semibold text-ink-500">Kontak (opsional)</Label>
              <Input name="phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="08xxxxxxxxxx" className="rounded-lg" />
            </div>
          </div>

          <div className="space-y-1">
            <Label className="text-xs font-semibold text-ink-500">Daftar Fasilitas (pisahkan dengan titik koma)</Label>
            <textarea
              name="fasilitasTeks"
              rows={2}
              value={form.fasilitasTeks}
              onChange={(e) => setForm({ ...form, fasilitasTeks: e.target.value })}
              placeholder="AC; Kasur; Meja; Lemari Baju; K. Mandi Dalam; WiFi; Parkir"
              className="w-full border border-line rounded-lg px-3 py-2 text-[13px] focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-brand-600 resize-none"
            />
            {form && (
              <p className="text-[11px] text-ink-500">
                Jumlah fasilitas: <span className="font-semibold">{fasilitasCount}</span>
                {fasilitasCount > 0 && (
                  <>
                    {" "}· Level C2: <span className="font-semibold text-brand-700">{LEVEL_LABEL[level]}</span> (skor {level * 20})
                  </>
                )}
              </p>
            )}
          </div>

          {error && (
            <div className="text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
          )}

          <div className="flex gap-2 pt-1">
            <Button onClick={submit} disabled={isPending} className="rounded-xl flex-1">
              {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Menyimpan...</> : "Simpan Alternatif"}
            </Button>
            <Button variant="outline" onClick={() => setForm(null)} className="rounded-xl">Batal</Button>
          </div>
        </div>
      )}

      {/* Tabel alternatif */}
      <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[820px]">
          <thead className="bg-surface-muted">
            <tr>
              <th className="px-3 py-2.5 w-10">
                <input
                  ref={headerCheckboxRef}
                  type="checkbox"
                  checked={allSelected}
                  onChange={toggleAll}
                  aria-label="Pilih semua alternatif"
                  className="rounded accent-brand-700 cursor-pointer"
                />
              </th>
              {["Kode", "Nama Kos", "Lokasi", "Tipe", "Harga", "Jarak", "Rating", "Aksi"].map((h) => (
                <th key={h} className="px-3 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {filtered.map((item) => (
              <tr key={item.id} className={`transition-colors ${item.dipilih ? "hover:bg-surface-muted/60" : "opacity-50 hover:bg-surface-muted/60"}`}>
                <td className="px-3 py-2.5">
                  <input
                    type="checkbox"
                    checked={item.dipilih}
                    onChange={() => toggleOne(item.id, item.dipilih)}
                    aria-label={`Pilih ${item.name}`}
                    className="rounded accent-brand-700 cursor-pointer"
                  />
                </td>
                <td className="px-3 py-2.5 text-[13px] font-semibold">{item.kode ?? "-"}</td>
                <td className="px-3 py-2.5 text-[13px]">{item.name}</td>
                <td className="px-3 py-2.5 text-[12px] text-ink-500">{item.address}</td>
                <td className="px-3 py-2.5 text-[12px]">{TIPE_LABEL[item.genderType] ?? item.genderType}</td>
                <td className="px-3 py-2.5 text-[13px] font-semibold">Rp {item.price.toLocaleString("id-ID")}</td>
                <td className="px-3 py-2.5 text-[12px] font-mono">{item.jarakKm != null ? `${item.jarakKm} km` : "-"}</td>
                <td className="px-3 py-2.5 text-[12px] font-mono">{item.rating ?? "-"}</td>
                <td className="px-3 py-2.5">
                  <div className="flex gap-1.5">
                    <button onClick={() => openEdit(item)} aria-label={`Ubah ${item.name}`} className="p-1.5 rounded-lg text-ink-500 hover:text-brand-700 hover:bg-brand-100 transition-colors cursor-pointer">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => remove(item.id, item.name)} aria-label={`Hapus ${item.name}`} disabled={isPending} className="p-1.5 rounded-lg text-ink-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer disabled:opacity-50">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={9} className="py-12 text-center text-[13px] text-ink-500">
                  {items.length === 0
                    ? "Belum ada alternatif. Klik \"Tambah Alternatif\" untuk memulai."
                    : "Tidak ada alternatif yang cocok dengan filter pencarian."}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
