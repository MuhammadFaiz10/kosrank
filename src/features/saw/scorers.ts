/**
 * Fungsi SAW murni (tanpa akses database) — aman dipakai di server maupun client.
 * Pemetaan skor mengikuti bagian 4.1 spesifikasi SPK / rubrik data_kost.xlsx.
 */

// UBSI Margonda coordinates in Depok
export const UBSI_MARGONDA_COORDS = { lat: -6.3685, lng: 106.8335 };

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371e3; // metres
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // in metres
}

export function parseRoomArea(roomSize: string): number {
  if (!roomSize) return 0;
  const match = roomSize.toLowerCase().match(/([0-9.]+)\s*x\s*([0-9.]+)/);
  if (match) {
    return parseFloat(match[1]) * parseFloat(match[2]);
  }
  return 0;
}

// Skor kriteria eksak dari data_kost.xlsx untuk 5 kos studi kasus
export const SEEDED_KOS_SCORES: Record<string, Record<string, number>> = {
  "Kost Noeks Cinere Depok": { C1: 80, C2: 60, C3: 60, C4: 40, C5: 40 },
  "Kost Pondok Rindang Tipe C Beji Depok": { C1: 80, C2: 60, C3: 100, C4: 40, C5: 80 },
  "Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok": { C1: 60, C2: 80, C3: 80, C4: 60, C5: 100 },
  "Kost Singgahsini DFlory Tipe B Cinere Depok": { C1: 60, C2: 80, C3: 60, C4: 60, C5: 100 },
  "Kost Rumah Nimas Sawangan Depok": { C1: 80, C2: 80, C3: 40, C4: 60, C5: 20 },
};

// ─── Scorer per kriteria (rubrik data_kost.xlsx, bagian 4.1) ────────────────

export function getC1Score(price: number): number {
  if (price < 1000000) return 100;
  if (price < 2000000) return 80;
  if (price < 3000000) return 60;
  if (price < 4000000) return 40;
  return 20;
}

export function getC2Score(fasilitasLevel: number): number {
  return fasilitasLevel * 20;
}

// ─── Level fasilitas C2 (keputusan Q1: otomatis dari jumlah fasilitas) ─────

export function facilityLevelFromCount(count: number): number {
  if (count <= 5) return 1;
  if (count <= 7) return 2;
  if (count <= 10) return 3;
  if (count <= 13) return 4;
  return 5;
}

export const LEVEL_LABEL: Record<number, string> = {
  1: "Sangat tidak lengkap",
  2: "Kurang lengkap",
  3: "Cukup lengkap",
  4: "Lengkap",
  5: "Sangat lengkap",
};

export const levelScore = (level: number) => level * 20;

export function getC3Score(distanceKm: number): number {
  if (distanceKm <= 1) return 100;
  if (distanceKm <= 5) return 80;
  if (distanceKm <= 10) return 60;
  if (distanceKm <= 15) return 40;
  return 20;
}

export function getC4Score(area: number): number {
  if (area <= 6) return 20;
  if (area <= 9) return 40;
  if (area <= 12) return 60;
  if (area <= 15) return 80;
  return 100;
}

export function getC5Score(rating: number | null | undefined): number {
  if (rating == null) return 20;
  if (rating < 2) return 40;
  if (rating < 3) return 60;
  if (rating < 4) return 80;
  return 100;
}

/**
 * Pembulatan desimal half-up 2 angka (agar 0.845 -> 0.85 seperti Excel,
 * bukan 0.84 akibat representasi biner float).
 */
export function roundHalfUp2(n: number): number {
  return Math.round(n * 100 + 1e-9) / 100;
}

/**
 * Pure SAW math — normalization + weighted sum + descending sort.
 * Cost: r = min(x) / x · Benefit: r = x / max(x).
 * Tie-break stabil mengikuti urutan input (mis. kode alternatif).
 */
export function rankFromScoreMatrix(
  kosIds: string[],
  scoreMatrix: Record<string, Record<string, number>>,
  weights: Record<string, number>,
  attributes: Record<string, "COST" | "BENEFIT">,
  criteriaCodes: string[]
): { id: string; score: number }[] {
  if (kosIds.length === 0) return [];

  const normalMatrix: Record<string, Record<string, number>> = {};

  for (const code of criteriaCodes) {
    const values = kosIds.map((id) => scoreMatrix[id][code] || 0);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values.filter((v) => v > 0));

    for (const id of kosIds) {
      if (!normalMatrix[id]) normalMatrix[id] = {};
      const xij = scoreMatrix[id][code] || 0;
      const attr = attributes[code] || "BENEFIT";

      if (attr === "BENEFIT") {
        // BENEFIT: nilai lebih besar = lebih baik → xij / max
        normalMatrix[id][code] = maxVal > 0 ? xij / maxVal : 0;
      } else {
        // COST: nilai lebih kecil = lebih baik → min / xij
        normalMatrix[id][code] = xij > 0 ? minVal / xij : 0;
      }
    }
  }

  return kosIds
    .map((id) => {
      let score = 0;
      for (const code of criteriaCodes) {
        score += (weights[code] || 0) * (normalMatrix[id][code] || 0);
      }
      return { id, score: parseFloat(score.toFixed(4)) };
    })
    .sort((a, b) => b.score - a.score);
}
