import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Calculator, Award, ArrowLeft } from "lucide-react";
import { getSAWCalculationDetails, roundHalfUp2 } from "@/features/saw/engine";

// Data live: recompute tiap request (kriteria bisa berubah dari panel admin)
export const dynamic = "force-dynamic";

// Urutan alternatif studi kasus sesuai data_kost.xlsx (A01..A05)
const ALTERNATIVES = [
  "Kost Noeks Cinere Depok",
  "Kost Pondok Rindang Tipe C Beji Depok",
  "Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok",
  "Kost Singgahsini DFlory Tipe B Cinere Depok",
  "Kost Rumah Nimas Sawangan Depok",
];

export default async function SawPublicPage() {
  const caseKos = await prisma.kos.findMany({
    where: { name: { in: ALTERNATIVES }, isActive: true },
  });
  const orderedKos = ALTERNATIVES.map(
    (name) => caseKos.find((k) => k.name === name)
  ).filter((k): k is NonNullable<typeof k> => Boolean(k));
  const ids = orderedKos.map((k) => k.id);

  // useSeededScores=true: 5 alternatif pakai skor eksak data_kost.xlsx (matematika persis Excel)
  const details = await getSAWCalculationDetails(ids, true);
  const subCriteria = await prisma.subCriteria.findMany({
    orderBy: { score: "desc" },
    include: { criteria: true },
  });

  const codeByKosId = new Map(orderedKos.map((k, i) => [k.id, `A0${i + 1}`]));
  const kosById = new Map(details.kosList.map((k) => [k.id, k]));
  const scoreById = new Map(details.ranked.map((r) => [r.kos.id, r]));

  // Empty state: 5 alternatif studi kasus belum ada di database
  if (orderedKos.length === 0) {
    return (
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-16 text-left text-ink-900">
        <div className="flex flex-col items-center justify-center py-12 bg-surface-tint rounded-2xl border border-line text-center">
          <Calculator className="w-12 h-12 mb-3 text-ink-500/40" />
          <p className="font-display font-semibold text-[15px] text-ink-900">Data studi kasus belum tersedia</p>
          <p className="text-[13px] text-ink-500 mt-1 max-w-md leading-relaxed">
            Lima alternatif perhitungan SAW (A01-A05) belum ada di database. Jalankan{" "}
            <span className="font-mono text-[12px]">npx tsx prisma/seed.ts</span> untuk mengisi data, atau buka{" "}
            <Link href="/explore" className="text-brand-700 font-semibold hover:underline">Eksplor</Link> untuk melihat ranking global.
          </p>
        </div>
      </div>
    );
  }

  const thClass = "px-3 py-2 text-left text-[11px] font-bold uppercase tracking-wider text-ink-500";
  const tdClass = "px-3 py-2 text-[13px] text-ink-900 border-t border-line";

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 text-left text-ink-900">
      {/* Header */}
      <div className="mb-6 border-b border-line pb-4">
        <div className="flex items-center gap-2 text-[13px] text-ink-500 mb-2">
          <Link href="/" className="hover:text-brand-600 transition-colors">Beranda</Link>
          <span>/</span>
          <span className="font-semibold text-ink-900">Perhitungan SAW</span>
        </div>
        <h1 className="font-display text-[26px] md:text-[30px] leading-[1.2] font-bold tracking-[-0.02em] flex items-center gap-2">
          <Calculator className="w-6 h-6 text-brand-700" />
          Perhitungan SAW
        </h1>
        <p className="text-[13px] text-ink-500 mt-1.5 max-w-3xl leading-relaxed">
          Transparansi penuh metode <span className="font-semibold text-ink-900">Simple Additive Weighting</span>:
          lima kriteria berbobot, matriks keputusan, normalisasi, hingga ranking akhir, dihitung langsung dari 5
          alternatif studi kasus sesuai <span className="font-mono text-[12px]">data_kost.xlsx</span>. Halaman ini terbuka untuk publik.
        </p>
      </div>

      {/* 1. Kriteria & Bobot */}
      <section className="mb-8">
        <h2 className="font-display text-[16px] font-bold mb-3">1. Kriteria &amp; Bobot</h2>
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-surface-muted">
              <tr>
                <th className={thClass}>Kode</th>
                <th className={thClass}>Kriteria</th>
                <th className={thClass}>Bobot</th>
                <th className={thClass}>Atribut</th>
                <th className={thClass}>Rubrik Sub-Kriteria</th>
              </tr>
            </thead>
            <tbody>
              {details.criteriaList.map((c) => {
                const rubric = subCriteria
                  .filter((s) => s.criteriaId === c.id)
                  .sort((a, b) => a.score - b.score)
                  .map((s) => `${s.name} = ${s.score}`)
                  .join(" · ");
                return (
                  <tr key={c.id}>
                    <td className={`${tdClass} font-semibold`}>{c.code}</td>
                    <td className={tdClass}>{c.name}</td>
                    <td className={`${tdClass} font-mono`}>{c.weight.toFixed(2)}</td>
                    <td className={tdClass}>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full ${c.attribute === "COST" ? "bg-[#FDEDF3] text-[#D14D8B]" : "bg-brand-100 text-brand-700"}`}>
                        {c.attribute}
                      </span>
                    </td>
                    <td className={`${tdClass} text-[12px] text-ink-500`}>{rubric}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {/* 2. Alternatif */}
      <section className="mb-8">
        <h2 className="font-display text-[16px] font-bold mb-3">2. Alternatif Kos</h2>
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead className="bg-surface-muted">
              <tr>
                <th className={thClass}>Kode</th>
                <th className={thClass}>Nama Kos</th>
                <th className={thClass}>Harga</th>
                <th className={thClass}>Ukuran</th>
                <th className={thClass}>Rating</th>
              </tr>
            </thead>
            <tbody>
              {orderedKos.map((k, i) => (
                <tr key={k.id}>
                  <td className={`${tdClass} font-semibold`}>A0{i + 1}</td>
                  <td className={tdClass}>
                    <Link href={`/kos/${k.slug}`} className="text-brand-700 font-medium hover:text-brand-600 hover:underline">
                      {k.name}
                    </Link>
                  </td>
                  <td className={tdClass}>Rp {k.price.toLocaleString("id-ID")}</td>
                  <td className={tdClass}>{k.roomSize}</td>
                  <td className={tdClass}>{k.rating ?? <span className="text-ink-500 italic">Not found</span>}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 3. Matriks Keputusan (X) */}
      <section className="mb-8">
        <h2 className="font-display text-[16px] font-bold mb-3">3. Matriks Keputusan (X)</h2>
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-surface-muted">
              <tr>
                <th className={thClass}>Kode</th>
                {details.criteriaList.map((c) => (
                  <th key={c.id} className={`${thClass} text-center`}>{c.code} · {c.name}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderedKos.map((k, i) => (
                <tr key={k.id}>
                  <td className={`${tdClass} font-semibold`}>A0{i + 1}</td>
                  {details.criteriaList.map((c) => (
                    <td key={c.id} className={`${tdClass} text-center font-mono`}>
                      {details.scoreMatrix[k.id]?.[c.code] ?? 0}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 4. Matriks Ternormalisasi (R) */}
      <section className="mb-8">
        <h2 className="font-display text-[16px] font-bold mb-3">4. Matriks Ternormalisasi (R)</h2>
        <p className="text-[12px] text-ink-500 mb-3">
          Benefit: r<sub>ij</sub> = x<sub>ij</sub> / max(x<sub>ij</sub>) · Cost: r<sub>ij</sub> = min(x<sub>ij</sub>) / x<sub>ij</sub>
        </p>
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-surface-muted">
              <tr>
                <th className={thClass}>Kode</th>
                {details.criteriaList.map((c) => (
                  <th key={c.id} className={`${thClass} text-center`}>{c.code}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {orderedKos.map((k, i) => (
                <tr key={k.id}>
                  <td className={`${tdClass} font-semibold`}>A0{i + 1}</td>
                  {details.criteriaList.map((c) => (
                    <td key={c.id} className={`${tdClass} text-center font-mono`}>
                      {(details.normalMatrix[k.id]?.[c.code] ?? 0).toFixed(4)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* 5. Perkalian W*R */}
      <section className="mb-8">
        <h2 className="font-display text-[16px] font-bold mb-3">5. Perkalian W × R (Skor Akhir)</h2>
        <div className="space-y-2.5">
          {orderedKos.map((k, i) => {
            const r = scoreById.get(k.id);
            if (!r) return null;
            return (
              <div key={k.id} className="bg-white border border-line rounded-xl p-3.5">
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <span className="text-[13px] font-semibold">A0{i + 1} · {k.name}</span>
                  <span className="font-display text-[18px] font-bold text-brand-700">
                    {roundHalfUp2(r.score).toFixed(2)}
                  </span>
                </div>
                <p className="text-[11px] font-mono text-ink-500 mt-1 leading-relaxed">
                  {details.criteriaList.map((c) => `(${c.weight} × ${(details.normalMatrix[k.id]?.[c.code] ?? 0).toFixed(4)})`).join(" + ")}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. Ranking */}
      <section className="mb-8">
        <h2 className="font-display text-[16px] font-bold mb-3 flex items-center gap-2">
          <Award className="w-5 h-5 text-brand-700" />
          6. Ranking Akhir
        </h2>
        <div className="bg-white border border-line rounded-2xl overflow-hidden overflow-x-auto">
          <table className="w-full min-w-[560px]">
            <thead className="bg-surface-muted">
              <tr>
                <th className={thClass}>Rangking</th>
                <th className={thClass}>Kode</th>
                <th className={thClass}>Nama Kos</th>
                <th className={thClass}>Nilai</th>
              </tr>
            </thead>
            <tbody>
              {details.ranked.map((r, idx) => {
                const code = codeByKosId.get(r.kos.id);
                return (
                  <tr key={r.kos.id} className={idx === 0 ? "bg-brand-100/40" : ""}>
                    <td className={`${tdClass} font-display font-bold`}>
                      {idx === 0 ? (
                        <span className="bg-badge-blue text-white text-[11px] font-bold px-2 py-0.5 rounded-full">#{idx + 1}</span>
                      ) : (
                        `#${idx + 1}`
                      )}
                    </td>
                    <td className={`${tdClass} font-semibold`}>{code}</td>
                    <td className={tdClass}>
                      <Link href={`/kos/${r.kos.slug}`} className="text-brand-700 font-medium hover:text-brand-600 hover:underline">
                        {r.kos.name}
                      </Link>
                    </td>
                    <td className={`${tdClass} font-display font-bold`}>{roundHalfUp2(r.score).toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      <div className="flex items-start gap-2 text-[11px] text-ink-500 leading-relaxed bg-surface-tint border border-line rounded-xl p-3.5">
        <ArrowLeft className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
        <span>
          Catatan: perhitungan di atas dihitung ulang langsung dari data live (kriteria di database) untuk 5 alternatif
          studi kasus. Ranking global seluruh kos tersedia di halaman <Link href="/explore" className="text-brand-700 font-semibold hover:underline">Eksplor</Link>.
        </span>
      </div>
    </div>
  );
}
