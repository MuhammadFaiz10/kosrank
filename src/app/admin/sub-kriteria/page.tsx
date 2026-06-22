import { prisma } from "@/lib/prisma";
import { CriteriaAccordion } from "../kriteria/CriteriaAccordion";
import { Sliders } from "lucide-react";

export const metadata = {
  title: "Sub Kriteria SAW | KosRank Admin",
  description: "Kelola detail sub kriteria untuk setiap kriteria penilaian SAW",
};

export default async function SubKriteriaPage() {
  const criteria = await prisma.criteria.findMany({
    include: { subCriteria: { orderBy: { score: "asc" } } },
    orderBy: { code: "asc" },
  });

  return (
    <div className="p-8 max-w-5xl mx-auto space-y-8">
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-1">
          <Sliders className="w-6 h-6 text-teal-600" />
          <h1 className="text-2xl font-bold text-slate-900">Sub Kriteria SAW</h1>
        </div>
        <p className="text-slate-500 text-sm mt-1">
          Kelola himpunan sub-kriteria untuk setiap kriteria penilaian. Sub kriteria menentukan skor yang
          digunakan dalam proses normalisasi matriks SAW.
        </p>
      </div>

      {criteria.length === 0 ? (
        <div className="bg-white rounded-2xl border border-border p-12 text-center shadow-sm">
          <Sliders className="w-10 h-10 text-slate-300 mx-auto mb-3" />
          <h2 className="font-semibold text-slate-700 text-base">Belum ada Kriteria</h2>
          <p className="text-slate-400 text-sm mt-1">
            Tambahkan kriteria terlebih dahulu di halaman{" "}
            <a href="/admin/kriteria" className="text-[#007185] underline font-semibold">
              Kriteria SAW
            </a>{" "}
            sebelum mengelola sub kriteria.
          </p>
        </div>
      ) : (
        <CriteriaAccordion criteria={criteria} />
      )}
    </div>
  );
}
