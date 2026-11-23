import Link from "next/link";

export interface HasilRow {
  peringkat: number;
  kode: string;
  nama: string;
  alamat: string;
  tipe: string;
  v: number;
}

const TIPE_LABEL: Record<string, string> = {
  PUTRA: "Putra",
  PUTRI: "Putri",
  CAMPUR: "Campur",
};

const TIPE_OPTIONS = [
  { value: "", label: "Semua Tipe" },
  { value: "PUTRA", label: "Putra" },
  { value: "PUTRI", label: "Putri" },
  { value: "CAMPUR", label: "Campur" },
];

export function HasilFilter({ base, active }: { base: string; active: string }) {
  return (
    <div className="flex gap-1.5 flex-wrap">
      {TIPE_OPTIONS.map((o) => (
        <Link
          key={o.value}
          href={o.value ? `${base}/hasil?tipe=${o.value}` : `${base}/hasil`}
          className={`text-[12px] px-3 py-1.5 rounded-lg border transition-colors ${
            active === o.value
              ? "border-brand-600 bg-brand-100 text-brand-700 font-semibold"
              : "border-line bg-white text-ink-700 hover:bg-surface-muted"
          }`}
        >
          {o.label}
        </Link>
      ))}
    </div>
  );
}

export function HasilTable({ rows }: { rows: HasilRow[] }) {
  if (rows.length === 0) {
    return (
      <div className="bg-white border border-line rounded-2xl py-12 text-center text-[13px] text-ink-500">
        Tidak ada alternatif untuk tipe ini. Tambahkan alternatif terlebih dahulu di halaman Alternatif Pilihan.
      </div>
    );
  }

  return (
    <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
      <table className="w-full min-w-[640px]">
        <thead className="bg-surface-muted">
          <tr>
            {["No", "Kode", "Nama Alternatif", "Alamat", "Tipe", "Nilai Preferensi (V)"].map((h) => (
              <th key={h} className="px-3.5 py-2.5 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-line">
          {rows.map((r) => (
            <tr key={r.kode} className={r.peringkat === 1 ? "bg-brand-100/40" : "hover:bg-surface-muted/60 transition-colors"}>
              <td className="px-3.5 py-2.5 text-[13px] font-display font-bold">
                {r.peringkat === 1 ? (
                  <span className="bg-badge-blue text-white text-[11px] font-bold px-2 py-0.5 rounded-full">#{r.peringkat}</span>
                ) : (
                  r.peringkat
                )}
              </td>
              <td className="px-3.5 py-2.5 text-[13px] font-semibold">{r.kode}</td>
              <td className="px-3.5 py-2.5 text-[13px]">{r.nama}</td>
              <td className="px-3.5 py-2.5 text-[12px] text-ink-500">{r.alamat}</td>
              <td className="px-3.5 py-2.5 text-[12px]">{TIPE_LABEL[r.tipe] ?? r.tipe}</td>
              <td className="px-3.5 py-2.5 text-[13px] font-mono font-bold text-brand-700">{r.v.toFixed(4)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
