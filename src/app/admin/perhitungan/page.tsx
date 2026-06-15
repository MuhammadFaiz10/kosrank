import { getSAWCalculationDetails } from "@/features/saw/engine";
import { Button } from "@/components/ui/button";
import { Calculator } from "lucide-react";
import Link from "next/link";
import { PerhitunganAccordion } from "./PerhitunganAccordion";

export default async function PerhitunganPage() {
  const { criteriaList, scoreMatrix, normalMatrix, ranked } = await getSAWCalculationDetails();

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

      <PerhitunganAccordion 
        criteriaList={criteriaList}
        scoreMatrix={scoreMatrix}
        normalMatrix={normalMatrix}
        ranked={ranked}
      />
    </div>
  );
}
