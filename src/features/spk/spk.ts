import { prisma } from "@/lib/prisma";
import {
  calculateDistance,
  facilityLevelFromCount,
  rankFromScoreMatrix,
  UBSI_MARGONDA_COORDS,
} from "@/features/saw/scorers";
import {
  buildDecisionX,
  parseRoomSize,
  validateBobotTotal,
} from "./mapping";

// Re-export API murni modul (untuk pemakaian server-side)
export * from "./mapping";

/**
 * Modul SPK Pemilihan Kos Terbaik (spesifikasi jurnal SAW, data data_kost.xlsx).
 * Fungsi di file ini mengakses database; logika murni ada di mapping.ts
 * dan fungsi SAW murni bersama ada di features/saw/scorers.ts.
 */

// ─── Sinkronisasi rating_kecocokan dari data mentah kos ─────────────────────

function luasOf(roomSize: string, panjangM: number | null, lebarM: number | null): number {
  if (panjangM && lebarM) return panjangM * lebarM;
  const { panjang, lebar } = parseRoomSize(roomSize);
  return panjang * lebar;
}

// Nilai per kriteria: C1-C5 dihitung dari pemetaan 4.1; kriteria tambahan
// (C6+, tanpa sumber nilai mentah) mempertahankan nilai tersimpan atau 20.
function computeRowsForKos(
  kos: {
    id: string; price: number; roomSize: string; latitude: number; longitude: number;
    rating: number | null; jarakKm: number | null; panjangM: number | null; lebarM: number | null;
    fasilitasLevel: number | null; fasilitasTeks: string | null;
    facilities: unknown[]; ratingKecocokan: Array<{ criteriaCode: string; nilai: number }>;
  },
  criteriaList: Array<{ code: string }>
): Array<{ kosId: string; criteriaCode: string; nilai: number }> {
  const teksCount = kos.fasilitasTeks
    ? kos.fasilitasTeks.split(";").filter((s) => s.trim()).length
    : 0;
  const level = kos.fasilitasLevel ?? facilityLevelFromCount(teksCount || kos.facilities.length);
  const jarakKm =
    kos.jarakKm ??
    calculateDistance(kos.latitude, kos.longitude, UBSI_MARGONDA_COORDS.lat, UBSI_MARGONDA_COORDS.lng) / 1000;

  const x = buildDecisionX({
    harga: kos.price,
    fasilitasLevel: level,
    jarakKm,
    luas: luasOf(kos.roomSize, kos.panjangM, kos.lebarM),
    rating: kos.rating,
  });

  return criteriaList.map((c) => ({
    kosId: kos.id,
    criteriaCode: c.code,
    nilai: c.code in x ? x[c.code] : kos.ratingKecocokan.find((r) => r.criteriaCode === c.code)?.nilai ?? 20,
  }));
}

export async function syncRatingKecocokan(kosId: string): Promise<void> {
  const kos = await prisma.kos.findUnique({
    where: { id: kosId },
    include: { facilities: true, ratingKecocokan: true },
  });
  if (!kos) return;

  const criteriaList = await prisma.criteria.findMany({ orderBy: { code: "asc" } });
  const rows = computeRowsForKos(
    { ...kos, facilities: kos.facilities, ratingKecocokan: kos.ratingKecocokan },
    criteriaList
  );

  for (const row of rows) {
    await prisma.ratingKecocokan.upsert({
      where: { kosId_criteriaCode: { kosId: row.kosId, criteriaCode: row.criteriaCode } },
      update: { nilai: row.nilai },
      create: row,
    });
  }
}

export async function syncAllRatingKecocokan(): Promise<number> {
  const criteriaList = await prisma.criteria.findMany({ orderBy: { code: "asc" } });
  const kosList = await prisma.kos.findMany({ include: { facilities: true, ratingKecocokan: true } });

  const rows = kosList.flatMap((kos) => computeRowsForKos(kos, criteriaList));

  await prisma.ratingKecocokan.deleteMany();
  await prisma.ratingKecocokan.createMany({ data: rows });
  return kosList.length;
}

// ─── Kode alternatif (A001, A002, ...) & kode kriteria (C6, C7, ...) ────────

export async function nextKode(): Promise<string> {
  const kos = await prisma.kos.findMany({ where: { kode: { not: null } }, select: { kode: true } });
  const max = kos.reduce((acc, k) => Math.max(acc, parseInt(String(k.kode).replace(/\D/g, ""), 10) || 0), 0);
  return `A${String(max + 1).padStart(3, "0")}`;
}

export async function nextCriteriaCode(): Promise<string> {
  const criteria = await prisma.criteria.findMany({ select: { code: true } });
  const max = criteria.reduce((acc, c) => Math.max(acc, parseInt(c.code.replace(/\D/g, ""), 10) || 0), 0);
  return `C${max + 1}`;
}

// ─── FR-4 & FR-5: perangkingan dari rating_kecocokan tersimpan ──────────────

export interface SpkRankingRow {
  peringkat: number;
  kode: string;
  nama: string;
  alamat: string;
  tipe: string;
  v: number;
}

export async function getSpkRanking(tipeKos?: "PUTRA" | "PUTRI" | "CAMPUR"): Promise<SpkRankingRow[]> {
  const criteria = await prisma.criteria.findMany({ orderBy: { code: "asc" } });
  if (criteria.length === 0) return [];

  const kosList = await prisma.kos.findMany({
    where: { isActive: true, dipilih: true, ...(tipeKos ? { genderType: tipeKos } : {}) },
    include: { ratingKecocokan: true },
    orderBy: { kode: "asc" },
  });

  const codes = criteria.map((c) => c.code);
  const weights: Record<string, number> = {};
  const attributes: Record<string, "COST" | "BENEFIT"> = {};
  for (const c of criteria) {
    weights[c.code] = c.weight;
    attributes[c.code] = c.attribute;
  }

  const ids = kosList.map((k) => k.id);
  const scoreMatrix: Record<string, Record<string, number>> = {};
  for (const k of kosList) {
    scoreMatrix[k.id] = {};
    for (const c of codes) {
      scoreMatrix[k.id][c] = k.ratingKecocokan.find((r) => r.criteriaCode === c)?.nilai ?? 0;
    }
  }

  // rankFromScoreMatrix = fungsi SAW murni bersama (§8); sort JS stabil,
  // input terurut kode sehingga tie V terputus secara stabil by kode.
  const ranked = rankFromScoreMatrix(ids, scoreMatrix, weights, attributes, codes);

  return ranked.map((r, i) => {
    const kos = kosList.find((k) => k.id === r.id)!;
    return {
      peringkat: i + 1,
      kode: kos.kode ?? "-",
      nama: kos.name,
      alamat: kos.address,
      tipe: kos.genderType,
      v: r.score,
    };
  });
}

export async function getCriteriaWeights() {
  return prisma.criteria.findMany({ orderBy: { code: "asc" } });
}

export { validateBobotTotal };
