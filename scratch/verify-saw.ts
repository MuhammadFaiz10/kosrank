import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Implementasi INDEPENDEN (bukan import engine) untuk memverifikasi hasil di DB
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

const UBSI = { lat: -6.3685, lng: 106.8335 };
function haversine(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const p1 = (lat1 * Math.PI) / 180, p2 = (lat2 * Math.PI) / 180;
  const dp = ((lat2 - lat1) * Math.PI) / 180, dl = ((lon2 - lon1) * Math.PI) / 180;
  const a = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}
function area(roomSize: string): number {
  const m = roomSize.toLowerCase().match(/([0-9.]+)\s*x\s*([0-9.]+)/);
  return m ? parseFloat(m[1]) * parseFloat(m[2]) : 0;
}
// Rubrik data_kost.xlsx
const s1 = (p: number) => (p < 1e6 ? 100 : p < 2e6 ? 80 : p < 3e6 ? 60 : p < 4e6 ? 40 : 20);
const s2 = (n: number) => (n <= 5 ? 20 : n <= 7 ? 40 : n <= 10 ? 60 : n <= 13 ? 80 : 100);
const s3 = (km: number) => (km <= 1 ? 100 : km <= 5 ? 80 : km <= 10 ? 60 : km <= 15 ? 40 : 20);
const s4 = (a: number) => (a <= 6 ? 20 : a <= 9 ? 40 : a <= 12 ? 60 : a <= 15 ? 80 : 100);
const s5 = (r: number | null) => (r == null ? 20 : r < 2 ? 40 : r < 3 ? 60 : r < 4 ? 80 : 100);
const W = { C1: 0.3, C2: 0.3, C3: 0.2, C4: 0.1, C5: 0.1 };
const ATTR = { C1: "COST", C2: "BENEFIT", C3: "COST", C4: "BENEFIT", C5: "BENEFIT" };

async function main() {
  const kos = await prisma.kos.findMany({
    where: { isActive: true },
    select: { id: true, name: true, price: true, roomSize: true, latitude: true, longitude: true, rating: true, finalScore: true, ranking: true, _count: { select: { facilities: true } } },
  });

  const scored = kos.map((k) => {
    const distKm = haversine(k.latitude, k.longitude, UBSI.lat, UBSI.lng) / 1000;
    return {
      name: k.name, price: k.price, facCount: k._count.facilities, distKm,
      areaM2: area(k.roomSize), rating: k.rating,
      x: {
        C1: s1(k.price), C2: s2(k._count.facilities), C3: s3(distKm),
        C4: s4(area(k.roomSize)), C5: s5(k.rating),
      },
      dbScore: k.finalScore, dbRank: k.ranking,
    };
  });

  // Normalisasi (cost: min/x, benefit: x/max) + weighted sum
  const codes = ["C1", "C2", "C3", "C4", "C5"] as const;
  const norm = scored.map((k) => {
    let total = 0;
    const detail: Record<string, string> = {};
    for (const c of codes) {
      const vals = scored.map((o) => o.x[c]);
      const max = Math.max(...vals);
      const min = Math.min(...vals.filter((v) => v > 0));
      const r = ATTR[c] === "BENEFIT" ? (max ? k.x[c] / max : 0) : k.x[c] ? min / k.x[c] : 0;
      total += W[c] * r;
      detail[c] = `x=${k.x[c]} r=${r.toFixed(4)}`;
    }
    return { ...k, myScore: parseFloat(total.toFixed(4)), detail };
  }).sort((a, b) => b.myScore - a.myScore);

  console.log("=== TOP 3 hasil hitung ulang independen vs DB ===");
  for (const [i, k] of norm.slice(0, 3).entries()) {
    console.log(`\n#${i + 1} ${k.name}`);
    console.log(`  hitung ulang: ${k.myScore} | DB finalScore: ${k.dbScore} | DB ranking: ${k.dbRank}`);
    console.log(`  harga: Rp${k.price.toLocaleString("id-ID")} | fasilitas: ${k.facCount} | jarak: ${k.distKm.toFixed(2)} km | luas: ${k.areaM2} m2 | rating: ${k.rating ?? "null"}`);
    console.log(`  detail: ${JSON.stringify(k.detail)}`);
  }

  const match = norm.every((k) => Math.abs(k.myScore - (k.dbScore ?? 0)) < 0.0005);
  console.log(`\n=== Semua ${norm.length} kos: hitung ulang == DB finalScore? ${match ? "YA" : "TIDAK"}`);
}
main().finally(async () => { await prisma.$disconnect(); await pool.end(); });
