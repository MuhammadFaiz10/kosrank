import { prisma } from "@/lib/prisma";
import {
  calculateDistance,
  facilityLevelFromCount,
  getC1Score,
  getC2Score,
  getC3Score,
  getC4Score,
  getC5Score,
  parseRoomArea,
  rankFromScoreMatrix,
  SEEDED_KOS_SCORES,
  UBSI_MARGONDA_COORDS,
} from "./scorers";

// Re-export API murni agar import lama tetap bekerja
export * from "./scorers";

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
    scoreMatrix[kos.id]["C2"] = getC2Score(facilityLevelFromCount(kos.facilities.length));
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
    scoreMatrix[kos.id]["C2"] = useSeeded ? isSeeded.C2 : getC2Score(facilityLevelFromCount(kos.facilities.length));
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
