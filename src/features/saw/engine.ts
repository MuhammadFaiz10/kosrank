import { prisma } from "@/lib/prisma";

// UBSI Margonda coordinates in Depok
const UBSI_MARGONDA_COORDS = { lat: -6.3685, lng: 106.8335 };

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

// Exact criteria scores from data_kost.xlsx for the 5 case-study alternatives
export const SEEDED_KOS_SCORES: Record<string, Record<string, number>> = {
  "Kost Noeks Cinere Depok": { C1: 80, C2: 60, C3: 60, C4: 40, C5: 40 },
  "Kost Pondok Rindang Tipe C Beji Depok": { C1: 80, C2: 60, C3: 100, C4: 40, C5: 80 },
  "Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok": { C1: 60, C2: 80, C3: 80, C4: 60, C5: 100 },
  "Kost Singgahsini DFlory Tipe B Cinere Depok": { C1: 60, C2: 80, C3: 60, C4: 60, C5: 100 },
  "Kost Rumah Nimas Sawangan Depok": { C1: 80, C2: 80, C3: 40, C4: 60, C5: 20 },
};

// Scorer helper functions for dynamic calculations (rubrik: data_kost.xlsx)
export function getC1Score(price: number): number {
  if (price < 1000000) return 100;
  if (price < 2000000) return 80;
  if (price < 3000000) return 60;
  if (price < 4000000) return 40;
  return 20;
}

export function getC2Score(facilityCount: number): number {
  if (facilityCount <= 5) return 20;
  if (facilityCount <= 7) return 40;
  if (facilityCount <= 10) return 60;
  if (facilityCount <= 13) return 80;
  return 100;
}

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
 * No DB access, so it is directly testable against the paper's oracle
 * (metode_saw_new.md / TSD §8.6).
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

/**
 * Calculates dynamic SAW ranks based on custom coordinates.
 * Used for dynamic frontend personalization without database mutations.
 */
export async function calculateDynamicSAW(customLat?: number, customLng?: number) {
  const targetLat = customLat ?? UBSI_MARGONDA_COORDS.lat;
  const targetLng = customLng ?? UBSI_MARGONDA_COORDS.lng;

  // 1. Get criteria
  const criteriaList = await prisma.criteria.findMany();

  // 2. Get active kos listings
  const kosList = await prisma.kos.findMany({
    where: { isActive: true },
    include: {
      facilities: {
        include: { facility: true },
      },
      images: true,
    },
  });

  if (kosList.length === 0 || criteriaList.length === 0) return [];

  // Map criteria weight lookup
  const weights: Record<string, number> = {};
  const attributes: Record<string, "COST" | "BENEFIT"> = {};
  for (const c of criteriaList) {
    weights[c.code] = c.weight;
    attributes[c.code] = c.attribute;
  }

  // 3. Score calculation
  const scoreMatrix: Record<string, Record<string, number>> = {};
  const distances: Record<string, number> = {};

  for (const kos of kosList) {
    scoreMatrix[kos.id] = {};

    // Calculate distance
    const distMeters = calculateDistance(kos.latitude, kos.longitude, targetLat, targetLng);
    distances[kos.id] = distMeters;
    const distKm = distMeters / 1000;

    // Ranking global murni dari data — tanpa override nama (override hanya
    // untuk tampilan terisolasi /saw via getSAWCalculationDetails)
    scoreMatrix[kos.id]["C1"] = getC1Score(kos.price);
    scoreMatrix[kos.id]["C2"] = getC2Score(kos.facilities.length);
    scoreMatrix[kos.id]["C3"] = getC3Score(distKm);
    scoreMatrix[kos.id]["C4"] = getC4Score(parseRoomArea(kos.roomSize));
    scoreMatrix[kos.id]["C5"] = getC5Score(kos.rating);
  }

  // 4-5. Normalization + weighted sum (pure, shared math)
  const criteriaCodes = ["C1", "C2", "C3", "C4", "C5"];
  const scores = rankFromScoreMatrix(
    kosList.map((k) => k.id),
    scoreMatrix,
    weights,
    attributes,
    criteriaCodes
  );

  const scoreById = new Map(scores.map((s) => [s.id, s.score]));
  const ranked = kosList.map((kos) => ({
    kos,
    score: scoreById.get(kos.id) ?? 0,
    distanceMeters: Math.round(distances[kos.id]),
  }));

  // Sort by score descending
  ranked.sort((a, b) => b.score - a.score);

  return ranked;
}

/**
 * Standard background updater function that runs SAW against default coordinate (UBSI Margonda)
 * and updates the database with rankings.
 */
export async function calculateAndUpdateSAW() {
  const ranked = await calculateDynamicSAW();

  if (ranked.length === 0) return [];

  // Update rankings in database
  await prisma.$transaction(
    ranked.map((item, index) =>
      prisma.kos.update({
        where: { id: item.kos.id },
        data: {
          finalScore: item.score,
          ranking: index + 1,
        },
      })
    )
  );

  return ranked.map((item) => ({ id: item.kos.id, score: item.score }));
}

export async function getSAWCalculationDetails(kosIds?: string[], useSeededScores = false) {
  const criteriaList = await prisma.criteria.findMany({
    orderBy: { code: "asc" },
  });

  const whereClause = kosIds && kosIds.length > 0
    ? { isActive: true, id: { in: kosIds } }
    : { isActive: true };

  const kosList = await prisma.kos.findMany({
    where: whereClause,
    orderBy: { createdAt: "desc" },
    include: {
      facilities: {
        include: { facility: true },
      },
    },
  });

  // map weight lookup
  const weights: Record<string, number> = {};
  const attributes: Record<string, "COST" | "BENEFIT"> = {};
  for (const c of criteriaList) {
    weights[c.code] = c.weight;
    attributes[c.code] = c.attribute;
  }

  const scoreMatrix: Record<string, Record<string, number>> = {};
  const targetLat = UBSI_MARGONDA_COORDS.lat;
  const targetLng = UBSI_MARGONDA_COORDS.lng;

  for (const kos of kosList) {
    scoreMatrix[kos.id] = {};
    const distMeters = calculateDistance(kos.latitude, kos.longitude, targetLat, targetLng);
    const distKm = distMeters / 1000;
    const isSeeded = SEEDED_KOS_SCORES[kos.name];
    // Override skor eksak Excel hanya untuk tampilan terisolasi 5 alternatif (/saw)
    const useSeeded = useSeededScores && isSeeded;

    scoreMatrix[kos.id]["C1"] = useSeeded ? isSeeded.C1 : getC1Score(kos.price);
    scoreMatrix[kos.id]["C2"] = useSeeded ? isSeeded.C2 : getC2Score(kos.facilities.length);
    scoreMatrix[kos.id]["C3"] = useSeeded ? isSeeded.C3 : getC3Score(distKm);
    scoreMatrix[kos.id]["C4"] = useSeeded ? isSeeded.C4 : getC4Score(parseRoomArea(kos.roomSize));
    scoreMatrix[kos.id]["C5"] = useSeeded ? isSeeded.C5 : getC5Score(kos.rating);
  }

  const normalMatrix: Record<string, Record<string, number>> = {};
  const criteriaCodes = ["C1", "C2", "C3", "C4", "C5"];

  for (const code of criteriaCodes) {
    const values = kosList.map((k) => scoreMatrix[k.id][code] || 0);
    const maxVal = Math.max(...values);
    const minVal = Math.min(...values.filter((v) => v > 0));

    for (const kos of kosList) {
      if (!normalMatrix[kos.id]) normalMatrix[kos.id] = {};
      const xij = scoreMatrix[kos.id][code] || 0;
      const attr = attributes[code] || "BENEFIT";

      if (attr === "BENEFIT") {
        // BENEFIT: nilai lebih besar = lebih baik → xij / max
        normalMatrix[kos.id][code] = maxVal > 0 ? xij / maxVal : 0;
      } else {
        // COST: nilai lebih kecil = lebih baik → min / xij
        normalMatrix[kos.id][code] = xij > 0 ? minVal / xij : 0;
      }
    }
  }

  const ranked = kosList.map((kos) => {
    let score = 0;
    const steps: Record<string, string> = {};
    for (const code of criteriaCodes) {
      const rij = normalMatrix[kos.id][code] || 0;
      const wj = weights[code] || 0;
      score += wj * rij;
      steps[code] = `(${wj} × ${rij.toFixed(4)})`;
    }

    return {
      kos,
      score: parseFloat(score.toFixed(4)),
      steps,
    };
  });

  ranked.sort((a, b) => b.score - a.score);

  return {
    criteriaList,
    kosList,
    scoreMatrix,
    normalMatrix,
    weights,
    ranked,
  };
}
