import Link from "next/link";
import { Home, ListOrdered, SlidersHorizontal, Trophy, Calculator, ListTree, Scale } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { getSpkRanking } from "@/features/spk/spk";
import { DataActions } from "./DataActions";
import { AlternatifManager, type AlternatifItem } from "./AlternatifManager";
import { BobotEditor } from "./BobotEditor";
import { KriteriaManager } from "./KriteriaManager";
import { SubKriteriaManager } from "./SubKriteriaManager";
import { HasilFilter, HasilTable } from "./HasilTable";

export function SpkBerandaContent({ base }: { base: string }) {
  const pages = [
    { href: `${base}/alternatif`, icon: ListOrdered, title: "Alternatif Pilihan", desc: "Kelola daftar kos, cari dan filter, pilih yang ikut perangkingan, dan isi nilai kriteria." },
    { href: `${base}/kriteria`, icon: SlidersHorizontal, title: "Kriteria", desc: "Ubah nama, jenis (cost/benefit), bobot, atau hapus kriteria." },
    { href: `${base}/sub-kriteria`, icon: ListTree, title: "Sub Kriteria", desc: "Kelola rubrik penilaian tiap kriteria (rentang nilai dan skor 20-100)." },
    { href: `${base}/bobot`, icon: Scale, title: "Bobot Tiap Kriteria", desc: "Atur bobot cepat. Total bobot wajib 1,0." },
    { href: `${base}/hasil`, icon: Trophy, title: "Hasil Perangkingan", desc: "Tabel peringkat alternatif berdasarkan nilai preferensi SAW (V)." },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white border border-line rounded-2xl p-6">
        <h1 className="font-display text-[24px] font-bold tracking-[-0.02em] flex items-center gap-2">
          <Calculator className="w-6 h-6 text-brand-700" />
          KosRank Pemilihan Kos Terbaik
        </h1>
        <p className="text-[13px] text-ink-700 leading-relaxed mt-2 max-w-2xl">
          Sistem Pendukung Keputusan memilih kos terbaik menggunakan metode{" "}
          <span className="font-semibold">Simple Additive Weighting (SAW)</span> dengan 5 kriteria
          berbobot: Harga (30%), Fasilitas (30%), Jarak (20%), Ukuran Ruangan (10%), dan Rating (10%).
          Bobot dapat diubah, dan alternatif dengan nilai preferensi (V) terbesar adalah yang terbaik.
        </p>
      </div>

      <div className="bg-white border border-line rounded-2xl p-6 space-y-3">
        <h2 className="font-display font-bold text-[15px]">Data Perhitungan</h2>
        <p className="text-[12px] text-ink-500 leading-relaxed max-w-2xl">
          Bersihkan seluruh data perhitungan (kriteria, sub kriteria, bobot) atau pulihkan rubrik bawaan
          dari <span className="font-mono">data_kost.xlsx</span> jika perhitungan ingin dimulai dari awal.
        </p>
        <DataActions semua pulihkan />
      </div>

      <div className="grid sm:grid-cols-3 gap-3">
        {pages.map((p) => (
          <Link
            key={p.href}
            href={p.href}
            className="group bg-white border border-line rounded-2xl p-5 hover:border-brand-600 transition-colors"
          >
            <p.icon className="w-5 h-5 text-brand-700" />
            <h2 className="font-display font-bold text-[14px] mt-2.5 group-hover:text-brand-700 transition-colors">{p.title}</h2>
            <p className="text-[12px] text-ink-500 leading-relaxed mt-1">{p.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

export async function SpkAlternatifSection() {
  const kosList = await prisma.kos.findMany({
    where: { isActive: true },
    orderBy: { kode: "asc" },
    select: {
      id: true, kode: true, name: true, address: true, genderType: true,
      price: true, jarakKm: true, roomSize: true, rating: true, phone: true,
      fasilitasTeks: true, dipilih: true,
    },
  });

  const items: AlternatifItem[] = kosList.map((k) => ({ ...k }));

  return <AlternatifManager items={items} />;
}

export async function SpkKriteriaSection() {
  const criteria = await prisma.criteria.findMany({ orderBy: { code: "asc" } });
  return (
    <KriteriaManager
      criteria={criteria.map((c) => ({ id: c.id, code: c.code, name: c.name, attribute: c.attribute as string, weight: c.weight }))}
    />
  );
}

export async function SpkSubKriteriaSection() {
  const [subKriteria, kriteria] = await Promise.all([
    prisma.subCriteria.findMany({ orderBy: [{ criteriaId: "asc" }, { score: "asc" }] }),
    prisma.criteria.findMany({ orderBy: { code: "asc" } }),
  ]);

  const items = subKriteria.map((s) => {
    const parent = kriteria.find((k) => k.id === s.criteriaId);
    return {
      id: s.id,
      criteriaId: s.criteriaId,
      criteriaCode: parent?.code ?? "-",
      criteriaName: parent?.name ?? "-",
      name: s.name,
      value: s.value,
      score: s.score,
    };
  });

  const options = kriteria.map((k) => ({ id: k.id, code: k.code, name: k.name }));

  return <SubKriteriaManager subKriteria={items} kriteriaOptions={options} />;
}

export async function SpkBobotSection() {
  const criteria = await getCriteriaWeightsForEditor();
  return <BobotEditor criteria={criteria} />;
}

async function getCriteriaWeightsForEditor() {
  const criteria = await prisma.criteria.findMany({ orderBy: { code: "asc" } });
  return criteria.map((c) => ({ code: c.code, name: c.name, weight: c.weight, attribute: c.attribute as string }));
}

export async function SpkHasilSection({ base, tipe }: { base: string; tipe?: string }) {
  const criteriaCount = await prisma.criteria.count();
  const rows = await getSpkRanking(
    tipe === "PUTRA" || tipe === "PUTRI" || tipe === "CAMPUR" ? tipe : undefined
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3 flex-wrap">
        <p className="text-[12px] text-ink-500">
          {rows.length} alternatif dipilih dan dirangking. Nilai V = jumlah bobot × matriks ternormalisasi, dihitung atas himpunan yang dipilih.
        </p>
        <HasilFilter base={base} active={tipe ?? ""} />
      </div>
      {criteriaCount === 0 ? (
        <div className="bg-white border border-line rounded-2xl py-12 text-center">
          <p className="text-[14px] font-semibold text-ink-900">Kriteria belum diatur</p>
          <p className="text-[13px] text-ink-500 mt-1">
            Perhitungan butuh kriteria. Gunakan "Pulihkan Default" di Beranda Modul.
          </p>
        </div>
      ) : rows.length === 0 ? (
        <div className="bg-white border border-line rounded-2xl py-12 text-center">
          <p className="text-[14px] font-semibold text-ink-900">Belum ada alternatif yang dipilih</p>
          <p className="text-[13px] text-ink-500 mt-1">
            Pilih alternatif di halaman{" "}
            <Link href={`${base}/alternatif`} className="text-brand-700 font-semibold hover:underline">
              Alternatif Pilihan
            </Link>{" "}
            untuk melihat perangkingan.
          </p>
        </div>
      ) : (
        <HasilTable rows={rows} />
      )}
    </div>
  );
}

export function SpkBackLink({ base }: { base: string }) {
  return (
    <Link href={base} className="text-[12px] text-ink-500 hover:text-brand-700 transition-colors">
      Kembali ke Beranda Modul
    </Link>
  );
}
