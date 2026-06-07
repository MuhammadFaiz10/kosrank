import { getSAWCalculationDetails } from "@/features/saw/engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Link from "next/link";

export default async function PerhitunganPage() {
  const { criteriaList, scoreMatrix, normalMatrix, weights, ranked } = await getSAWCalculationDetails();

  if (ranked.length === 0) {
    return (
      <div className="p-8 max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Data Perhitungan SAW</h1>
          <p className="text-slate-500 text-sm mt-1">
            Proses perhitungan metode Simple Additive Weighting (SAW) untuk menentukan peringkat kos terbaik.
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-md mx-auto shadow-sm mt-10">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Calculator className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Belum Ada Data Kos</h2>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Silakan masukkan data kos terlebih dahulu untuk melihat hasil matriks keputusan, normalisasi, dan perankingan.
          </p>
          <Link href="/admin/kos/new">
            <Button className="rounded-xl h-10 px-5 font-semibold">
              Tambah Kos Baru
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Data Perhitungan SAW</h1>
        <p className="text-slate-500 text-sm mt-1">
          Proses perhitungan metode Simple Additive Weighting (SAW) untuk menentukan peringkat kos terbaik.
        </p>
      </div>

      {/* 1. Bobot Preferensi */}
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-900">1. Bobot Preferensi (W)</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
            {criteriaList.map((c) => (
              <div key={c.id} className="bg-white rounded-xl border border-border p-4 text-center">
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{c.code}</div>
                <div className="text-sm font-bold text-slate-800 mb-1">{c.name}</div>
                <div className="text-lg font-extrabold text-primary">{c.weight}</div>
                <div className="text-[10px] text-muted-foreground uppercase font-semibold mt-1">
                  {c.attribute}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* 2. Matriks Keputusan */}
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-900">2. Matriks Keputusan (X)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Nama Kos</th>
                  {criteriaList.map((c) => (
                    <th key={c.id} className="px-6 py-3.5 font-semibold text-center">{c.code} ({c.name})</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ranked.map(({ kos }) => (
                  <tr key={kos.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">{kos.name}</td>
                    {criteriaList.map((c) => (
                      <td key={c.id} className="px-6 py-4 text-center text-slate-600 font-semibold">
                        {scoreMatrix[kos.id]?.[c.code] ?? 0}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 3. Matriks Ternormalisasi */}
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-900">3. Matriks Ternormalisasi (R)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Nama Kos</th>
                  {criteriaList.map((c) => (
                    <th key={c.id} className="px-6 py-3.5 font-semibold text-center">{c.code}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ranked.map(({ kos }) => (
                  <tr key={kos.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">{kos.name}</td>
                    {criteriaList.map((c) => (
                      <td key={c.id} className="px-6 py-4 text-center text-emerald-600 font-bold">
                        {(normalMatrix[kos.id]?.[c.code] ?? 0).toFixed(4)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 4. Perhitungan Nilai Preferensi */}
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-900">4. Perhitungan Preferensi (V)</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5 font-semibold">Nama Kos</th>
                  <th className="px-6 py-3.5 font-semibold">Formula Penjumlahan Terbobot (W * R)</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Nilai Preferensi (V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ranked.map(({ kos, score, steps }) => (
                  <tr key={kos.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 font-medium text-slate-800">{kos.name}</td>
                    <td className="px-6 py-4 font-mono text-xs text-slate-500 leading-relaxed">
                      {criteriaList.map((c, idx) => (
                        <span key={c.id}>
                          {steps[c.code]}
                          {idx < criteriaList.length - 1 && " + "}
                        </span>
                      ))}
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-primary text-base">
                      {score.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* 5. Perankingan */}
      <Card className="rounded-2xl border border-border shadow-sm">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50">
          <CardTitle className="text-base font-semibold text-slate-900">5. Hasil Perankingan</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-border">
                <tr>
                  <th className="px-6 py-3.5 font-semibold text-center w-20">Rank</th>
                  <th className="px-6 py-3.5 font-semibold">Nama Kos</th>
                  <th className="px-6 py-3.5 font-semibold text-right">Nilai Preferensi (V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {ranked.map(({ kos, score }, index) => (
                  <tr key={kos.id} className="hover:bg-slate-50/50">
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold text-white ${
                        index === 0 ? "bg-amber-500" : index === 1 ? "bg-slate-400" : index === 2 ? "bg-amber-700" : "bg-slate-300"
                      }`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-950">{kos.name}</td>
                    <td className="px-6 py-4 text-right font-extrabold text-primary text-base">
                      {score.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
