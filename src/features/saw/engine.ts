import { prisma } from "@/lib/prisma";

// UBSI Margonda coordinates in Depok
const UBSI_MARGONDA_COORDS = { lat: -6.3685, lng: 106.8335 };

function calculateDistance(
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

function parseRoomArea(roomSize: string): number {
  if (!roomSize) return 0;
  const match = roomSize.toLowerCase().match(/([0-9.]+)\s*x\s*([0-9.]+)/);
  if (match) {
    return parseFloat(match[1]) * parseFloat(match[2]);
  }
  return 0;
}

// Exact criteria scores from paper for the 5 seeded kos
const SEEDED_KOS_SCORES: Record<string, Record<string, number>> = {
  "Kost Singgahsini Beji": { C1: 40, C2: 80, C3: 100, C4: 40, C5: 40, C6: 100 },
  "Kost Oemahkoe Depok Tipe Vvip 2 Beji Depok": { C1: 40, C2: 100, C3: 100, C4: 60, C5: 60, C6: 80 },
  "Kost Singgahsini Cinere": { C1: 60, C2: 60, C3: 100, C4: 40, C5: 100, C6: 60 },
  "Kost Growing House Jatijajar Tipe Standart A Tapos Depok": { C1: 80, C2: 60, C3: 40, C4: 20, C5: 80, C6: 40 },
  "Kost Bintang Tipe A Sukmajaya Depok": { C1: 80, C2: 60, C3: 20, C4: 20, C5: 60, C6: 40 },
};

// Scorer helper functions for dynamic calculations
function getC1Score(price: number): number {
  if (price <= 500000) return 100;
  if (price <= 1000000) return 80;
  if (price <= 2000000) return 60;
  if (price <= 3000000) return 40;
  return 20;
}

function getC2Score(distanceKm: number): number {
  if (distanceKm <= 5) return 100;
  if (distanceKm <= 8) return 80;
  if (distanceKm <= 12) return 60;
  if (distanceKm <= 15) return 40;
  return 20;
}

function getC3Score(area: number): number {
  if (area <= 4) return 20;
  if (area <= 9) return 40;
  if (area <= 16) return 60;
  if (area <= 25) return 80;
  return 100;
}

function getC4Score(facilities: string[]): number {
  const hasKamarMandiDalam = facilities.includes("Kamar Mandi Dalam");
  const hasAC = facilities.includes("AC");
  const hasKursi = facilities.includes("Kursi");

  if (hasKamarMandiDalam && hasAC) return 100;
  if (hasAC) return 80;
  if (hasKamarMandiDalam) return 60;
  if (hasKursi) return 40;
  return 20;
}

function getC5Score(facilities: string[]): number {
  const hasWiFi = facilities.includes("WiFi");
  const hasDapur = facilities.includes("Dapur");
  const hasParkir = facilities.includes("Parkir Motor");
  const hasPenjaga = facilities.includes("Penjaga Kos");
  const hasCCTV = facilities.includes("CCTV");
  const hasListrik = facilities.includes("Listrik Gratis");

  if (hasListrik && hasParkir && hasDapur && hasWiFi && hasPenjaga && hasCCTV) return 100;
  if (hasListrik && hasParkir && hasDapur && hasWiFi && hasPenjaga) return 80;
  if (hasParkir && hasDapur && hasWiFi && hasPenjaga && hasCCTV) return 60;
  if (hasParkir && hasDapur && hasWiFi && hasPenjaga) return 40;
  return 20;
}

function getC6Score(transit: string): number {
  if (!transit) return 40;
  const t = transit.toLowerCase();
  if (t.includes("kereta")) return 100;
  if (t.includes("bus")) return 80;
  if (t.includes("angkot")) return 60;
  if (t.includes("ojek") || t.includes("pribadi")) return 40;
  return 20;
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

    // Use seeded values if no custom coordinates are supplied
    const isSeeded = SEEDED_KOS_SCORES[kos.name];
    const useSeeded = !customLat && !customLng && isSeeded;

    // C1: Harga (Cost)
    scoreMatrix[kos.id]["C1"] = useSeeded ? isSeeded.C1 : getC1Score(kos.price);

    // C2: Jarak (Cost)
    // If coordinates are custom, we recalculate distance. Otherwise, use seeded if available.
    scoreMatrix[kos.id]["C2"] = (customLat || customLng || !isSeeded) ? getC2Score(distKm) : isSeeded.C2;

    // C3: Ukuran Ruangan (Benefit)
    scoreMatrix[kos.id]["C3"] = useSeeded ? isSeeded.C3 : getC3Score(parseRoomArea(kos.roomSize));

    // C4: Fasilitas Kamar (Benefit)
    const facNames = kos.facilities.map((f) => f.facility.name);
    scoreMatrix[kos.id]["C4"] = useSeeded ? isSeeded.C4 : getC4Score(facNames);

    // C5: Fasilitas Kos (Benefit)
    scoreMatrix[kos.id]["C5"] = useSeeded ? isSeeded.C5 : getC5Score(facNames);

    // C6: Akses Transportasi (Benefit)
    scoreMatrix[kos.id]["C6"] = useSeeded ? isSeeded.C6 : getC6Score(kos.transit);
  }

  // 4. Normalization
  const normalMatrix: Record<string, Record<string, number>> = {};
  const criteriaCodes = ["C1", "C2", "C3", "C4", "C5", "C6"];

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

  // 5. Weighted sum calculation
  const ranked = kosList.map((kos) => {
    let score = 0;
    for (const code of criteriaCodes) {
      const rij = normalMatrix[kos.id][code] || 0;
      const wj = weights[code] || 0;
      score += wj * rij;
    }

    return {
      kos,
      score: parseFloat(score.toFixed(4)),
      distanceMeters: Math.round(distances[kos.id]),
    };
  });

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

export async function getSAWCalculationDetails(kosIds?: string[]) {
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
    const useSeeded = isSeeded; // use seeded for default base comparison if available

    scoreMatrix[kos.id]["C1"] = useSeeded ? isSeeded.C1 : getC1Score(kos.price);
    scoreMatrix[kos.id]["C2"] = useSeeded ? isSeeded.C2 : getC2Score(distKm);
    scoreMatrix[kos.id]["C3"] = useSeeded ? isSeeded.C3 : getC3Score(parseRoomArea(kos.roomSize));
    const facNames = kos.facilities.map((f) => f.facility.name);
    scoreMatrix[kos.id]["C4"] = useSeeded ? isSeeded.C4 : getC4Score(facNames);
    scoreMatrix[kos.id]["C5"] = useSeeded ? isSeeded.C5 : getC5Score(facNames);
    scoreMatrix[kos.id]["C6"] = useSeeded ? isSeeded.C6 : getC6Score(kos.transit);
  }

  const normalMatrix: Record<string, Record<string, number>> = {};
  const criteriaCodes = ["C1", "C2", "C3", "C4", "C5", "C6"];

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
