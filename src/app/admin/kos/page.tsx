import { prisma } from "@/lib/prisma";
import { AdminKosTable } from "./AdminKosTable";
import { calculateAndUpdateSAW } from "@/features/saw/engine";

export default async function AdminKosPage() {
  // Always trigger recalculation on page load to ensure data accuracy
  await calculateAndUpdateSAW();

  const [kosList, allFacilities] = await Promise.all([
    prisma.kos.findMany({
      orderBy: [
        { ranking: { sort: "asc", nulls: "last" } },
        { createdAt: "desc" }
      ],
      include: {
        facilities: true,
      },
    }),
    prisma.facility.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  return (
    <div className="p-8 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Data Properti Kos</h1>
        <p className="text-slate-500 text-sm mt-1 font-medium">
          Kelola data properti alternatif ({kosList.length} kos terdaftar) untuk dihitung dalam perangkingan SAW.
        </p>
      </div>

      <AdminKosTable kosList={kosList} allFacilities={allFacilities} />
    </div>
  );
}
