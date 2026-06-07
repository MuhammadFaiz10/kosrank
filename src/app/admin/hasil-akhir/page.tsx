import { getSAWCalculationDetails } from "@/features/saw/engine";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PrintButton } from "@/components/ui/PrintButton";
import { Button } from "@/components/ui/button";
import { Trophy } from "lucide-react";
import Link from "next/link";

export default async function HasilAkhirPage() {
  const { ranked } = await getSAWCalculationDetails();

  if (ranked.length === 0) {
    return (
      <div className="p-8 max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hasil Akhir Perankingan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Laporan final peringkat kos terbaik berdasarkan perhitungan algoritma Simple Additive Weighting (SAW).
          </p>
        </div>
        <div className="bg-white rounded-2xl border border-border p-12 text-center max-w-md mx-auto shadow-sm mt-10">
          <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-slate-100">
            <Trophy className="w-8 h-8 text-slate-400" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800">Belum Ada Hasil Peringkat</h2>
          <p className="text-slate-500 text-sm mt-1 mb-6">
            Silakan masukkan data kos terlebih dahulu untuk melihat hasil akhir perankingan dan mencetak laporan rekomendasi.
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
  const currentDate = new Date().toLocaleDateString("id-ID", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8 print:p-0 print:max-w-full print:bg-white">
      {/* Page Header (Hidden when printing) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5 print:hidden">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Hasil Akhir Perankingan</h1>
          <p className="text-slate-500 text-sm mt-1">
            Laporan final peringkat kos terbaik berdasarkan perhitungan algoritma Simple Additive Weighting (SAW).
          </p>
        </div>
        <div className="flex-shrink-0">
          <PrintButton />
        </div>
      </div>

      {/* Print Document Header (Visible ONLY when printing) */}
      <div className="hidden print:block text-center space-y-2 border-b-2 border-slate-900 pb-6 mb-8">
        <h1 className="text-2xl font-extrabold uppercase tracking-wide text-slate-950">
          Laporan Rekomendasi Pemilihan Kos
        </h1>
        <p className="text-sm font-medium text-slate-700">
          Sistem Pendukung Keputusan (SPK) Metode Simple Additive Weighting (SAW)
        </p>
        <p className="text-xs text-slate-500 mt-1">Tanggal Cetak: {currentDate}</p>
      </div>

      {/* Final Ranking Card */}
      <Card className="rounded-2xl border border-border shadow-sm print:border-none print:shadow-none print:bg-white">
        <CardHeader className="border-b border-slate-100 bg-slate-50/50 print:hidden">
          <CardTitle className="text-base font-semibold text-slate-900">
            Daftar Peringkat Rekomendasi Kos
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0 print:p-0">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left border-collapse print:text-xs">
              <thead className="text-xs uppercase bg-slate-50 text-slate-500 border-b border-border print:bg-slate-100 print:text-slate-700 print:border-b-2 print:border-slate-350">
                <tr>
                  <th className="px-6 py-4 font-bold text-center w-24 border border-border print:border-slate-300">Peringkat</th>
                  <th className="px-6 py-4 font-bold border border-border print:border-slate-300">Nama Kos</th>
                  <th className="px-6 py-4 font-bold border border-border print:border-slate-300">Alamat</th>
                  <th className="px-6 py-4 font-bold border border-border print:border-slate-300">Tipe</th>
                  <th className="px-6 py-4 font-bold text-right w-36 border border-border print:border-slate-300">Nilai Preferensi (V)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border print:divide-slate-300">
                {ranked.map(({ kos, score }, index) => (
                  <tr key={kos.id} className="hover:bg-slate-50/50 print:hover:bg-transparent">
                    <td className="px-6 py-4 text-center border border-border print:border-slate-300">
                      <span className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-bold ${
                        index === 0 
                          ? "bg-amber-500 text-white" 
                          : index === 1 
                          ? "bg-slate-400 text-white" 
                          : index === 2 
                          ? "bg-amber-700 text-white" 
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      } print:bg-transparent print:text-slate-900 print:font-extrabold print:border-none`}>
                        {index + 1}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900 border border-border print:border-slate-300">
                      {kos.name}
                    </td>
                    <td className="px-6 py-4 text-slate-600 border border-border print:border-slate-300">
                      {kos.address}
                    </td>
                    <td className="px-6 py-4 border border-border print:border-slate-300">
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold ${
                        kos.genderType === "PUTRA" 
                          ? "bg-blue-50 text-blue-700 border border-blue-200" 
                          : kos.genderType === "PUTRI"
                          ? "bg-pink-50 text-pink-700 border border-pink-200"
                          : "bg-purple-50 text-purple-700 border border-purple-200"
                      } print:bg-transparent print:border-none print:p-0 print:text-slate-800`}>
                        {kos.genderType === "PUTRA" ? "Putra" : kos.genderType === "PUTRI" ? "Putri" : "Campur"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right font-extrabold text-primary text-base border border-border print:border-slate-300 print:text-slate-900">
                      {score.toFixed(4)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Signatures for printed document */}
      <div className="hidden print:grid grid-cols-2 gap-8 pt-16 text-center text-xs">
        <div>
          <p className="text-slate-500 mb-16">Petugas Administrasi</p>
          <p className="font-bold border-t border-slate-400 pt-1.5 w-44 mx-auto text-slate-800">
            (..................................)
          </p>
        </div>
        <div>
          <p className="text-slate-500 mb-16">Pimpinan / Pemilik</p>
          <p className="font-bold border-t border-slate-400 pt-1.5 w-44 mx-auto text-slate-800">
            (..................................)
          </p>
        </div>
      </div>
    </div>
  );
}
