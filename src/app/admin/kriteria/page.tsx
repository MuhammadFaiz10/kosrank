import { prisma } from "@/lib/prisma";
import {
  createCriteria,
  deleteCriteria,
  createSubCriteria,
  deleteSubCriteria,
} from "@/features/saw/actions";
import { Trash2, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default async function KriteriaPage() {
  const criteria = await prisma.criteria.findMany({
    include: { subCriteria: { orderBy: { score: "asc" } } },
    orderBy: { code: "asc" },
  });

  const totalWeight = criteria.reduce((s, c) => s + c.weight, 0);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Kriteria & Bobot SAW</h1>
        <p className="text-slate-500 text-sm mt-1">
          Kelola bobot kriteria. Total bobot saat ini:{" "}
          <span className={totalWeight.toFixed(2) === "1.00" ? "text-green-600 font-bold" : "text-red-500 font-bold"}>
            {totalWeight.toFixed(2)}
          </span>
          {totalWeight.toFixed(2) !== "1.00" && (
            <span className="text-red-500 ml-2">(harus = 1.00)</span>
          )}
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Criteria List */}
        <div>
          <div className="bg-white rounded-2xl border border-border overflow-hidden mb-4">
            <div className="px-5 py-3.5 border-b border-border bg-slate-50">
              <h2 className="font-semibold text-sm">Daftar Kriteria</h2>
            </div>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border text-xs text-slate-500 uppercase tracking-wider">
                  <th className="text-left py-3 px-4">Kode</th>
                  <th className="text-left py-3 px-4">Nama</th>
                  <th className="text-left py-3 px-4">Bobot</th>
                  <th className="text-left py-3 px-4">Atribut</th>
                  <th className="py-3 px-4"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {criteria.map((c) => (
                  <tr key={c.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 font-mono font-bold text-primary">{c.code}</td>
                    <td className="py-3 px-4">{c.name}</td>
                    <td className="py-3 px-4 font-medium">{c.weight}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                        c.attribute === "BENEFIT" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"
                      }`}>
                        {c.attribute}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <form action={async () => {
                        "use server";
                        await deleteCriteria(c.id);
                      }}>
                        <button type="submit" className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </form>
                    </td>
                  </tr>
                ))}
                {criteria.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-slate-400 text-sm">Belum ada kriteria</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Add Criteria Form */}
          <form action={createCriteria} className="bg-white rounded-2xl border border-border p-5 space-y-3">
            <h3 className="font-semibold text-sm mb-1">Tambah Kriteria</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1">
                <Label className="text-xs">Kode</Label>
                <Input name="code" placeholder="C6" required className="h-9 rounded-xl text-sm" />
              </div>
              <div className="space-y-1">
                <Label className="text-xs">Bobot (0-1)</Label>
                <Input name="weight" type="number" step="0.01" min="0" max="1" placeholder="0.20" required className="h-9 rounded-xl text-sm" />
              </div>
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Nama Kriteria</Label>
              <Input name="name" placeholder="Nama Kriteria" required className="h-9 rounded-xl text-sm" />
            </div>
            <div className="space-y-1">
              <Label className="text-xs">Atribut</Label>
              <select name="attribute" className="w-full border border-input rounded-xl px-3 py-2 text-sm h-9">
                <option value="BENEFIT">BENEFIT (lebih besar lebih baik)</option>
                <option value="COST">COST (lebih kecil lebih baik)</option>
              </select>
            </div>
            <Button type="submit" size="sm" className="w-full rounded-xl">
              <Plus className="w-4 h-4 mr-1" /> Tambah Kriteria
            </Button>
          </form>
        </div>

        {/* Sub Criteria */}
        <div className="space-y-4">
          {criteria.map((c) => (
            <div key={c.id} className="bg-white rounded-2xl border border-border overflow-hidden">
              <div className="px-5 py-3.5 border-b border-border bg-slate-50 flex items-center gap-2">
                <span className="font-mono font-bold text-primary text-sm">{c.code}</span>
                <span className="text-sm font-medium">{c.name}</span>
                <span className={`ml-auto text-xs px-2 py-0.5 rounded-full ${c.attribute === "BENEFIT" ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}`}>
                  {c.attribute}
                </span>
              </div>
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-border text-slate-500">
                    <th className="text-left py-2 px-4">Keterangan</th>
                    <th className="text-left py-2 px-4">Nilai/Range</th>
                    <th className="text-left py-2 px-4">Skor</th>
                    <th className="py-2 px-4"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {c.subCriteria.map((sub) => (
                    <tr key={sub.id} className="hover:bg-slate-50/60">
                      <td className="py-2 px-4">{sub.name}</td>
                      <td className="py-2 px-4 text-muted-foreground">{sub.value}</td>
                      <td className="py-2 px-4 font-bold text-primary">{sub.score}</td>
                      <td className="py-2 px-4 text-right">
                        <form action={async () => {
                          "use server";
                          await deleteSubCriteria(sub.id);
                        }}>
                          <button type="submit" className="p-1 rounded text-slate-400 hover:text-red-500 transition-colors">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </form>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <form action={createSubCriteria} className="p-4 border-t border-border bg-slate-50/50">
                <input type="hidden" name="criteriaId" value={c.id} />
                <div className="grid grid-cols-3 gap-2">
                  <Input name="name" placeholder="Label" required className="h-8 rounded-lg text-xs" />
                  <Input name="value" placeholder="Range (mis: <=750000)" required className="h-8 rounded-lg text-xs" />
                  <Input name="score" type="number" placeholder="Skor (20-100)" required min="0" max="100" className="h-8 rounded-lg text-xs" />
                </div>
                <Button type="submit" size="sm" variant="outline" className="mt-2 h-7 text-xs rounded-lg w-full">
                  <Plus className="w-3 h-3 mr-1" /> Tambah Sub Kriteria
                </Button>
              </form>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
