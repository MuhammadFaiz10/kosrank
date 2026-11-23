import {
  getC1Score,
  getC2Score,
  getC3Score,
  getC4Score,
  getC5Score,
} from "@/features/saw/scorers";

// Re-export aturan level fasilitas (bagian dari pemetaan C2)
export { facilityLevelFromCount, LEVEL_LABEL, levelScore } from "@/features/saw/scorers";

/**
 * Fungsi murni modul SPK (tanpa akses database) — aman untuk client.
 * Pemetaan nilai mentah -> skor mengikuti bagian 4.1 spesifikasi.
 */

export function parseRoomSize(roomSize: string): { panjang: number; lebar: number } {
  const m = roomSize.toLowerCase().match(/([0-9.]+)\s*x\s*([0-9.]+)/);
  return m ? { panjang: parseFloat(m[1]), lebar: parseFloat(m[2]) } : { panjang: 0, lebar: 0 };
}

export interface AlternatifRaw {
  harga: number;
  fasilitasLevel: number;
  jarakKm: number;
  luas: number;
  rating: number | null;
}

// Pemetaan §4.1: nilai mentah -> matriks keputusan X (C1..C5)
export function buildDecisionX(raw: AlternatifRaw): Record<string, number> {
  return {
    C1: getC1Score(raw.harga),
    C2: getC2Score(raw.fasilitasLevel),
    C3: getC3Score(raw.jarakKm),
    C4: getC4Score(raw.luas),
    C5: getC5Score(raw.rating),
  };
}

// FR-3: total bobot wajib tepat 1,0 (100%)
export function validateBobotTotal(weights: Record<string, number>): { ok: boolean; total: number; error?: string } {
  const total = Object.values(weights).reduce((a, b) => a + b, 0);
  if (Math.abs(total - 1) > 1e-9) {
    return {
      ok: false,
      total,
      error: `Total bobot harus tepat 1,0 (100%). Total sekarang: ${total.toFixed(4)}`,
    };
  }
  return { ok: true, total };
}
