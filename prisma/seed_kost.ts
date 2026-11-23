/**
 * Seeder katalog REAL dari data_kost.xlsx (sheet "Depok", ~215 listing kos).
 *
 * Bedanya dengan prisma/seed.ts:
 *   - seed.ts      : katalog demo fiktif (nama & lokasi digenerate)
 *   - seed_kost.ts : katalog asli dari dataset data_kost.xlsx
 *
 * Jalankan: npx tsx prisma/seed_kost.ts   (atau: npm run seed:kost)
 *
 * Transformasi data:
 *   - Dedup per (nama + kecamatan), kembaran pertama yang dipakai
 *   - Rating "Not found" -> null (skor C5 = 20 sesuai rubrik)
 *   - Harga digits-only (typo "Rp2.0250.00" tetap terbaca 2.025.000)
 *   - Kecamatan dinormalisasi ("Kecamatan Beji" -> "Beji", "Sukma Jaya" -> "Sukmajaya")
 *   - Baris non-kos (mis. "Rumah Kontrakan") dilewati
 *   - Koordinat = pusat kecamatan + offset deterministik (data asli tidak punya lat/lng)
   *   - Fasilitas dipetakan ke 12 Facility kanonik; nama lain diabaikan
 *   - campus = "UBSI Margonda" (titik acuan rekomendasi aplikasi)
 */
import "dotenv/config";
import * as XLSX from "xlsx";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";
import { calculateAndUpdateSAW } from "../src/features/saw/engine";
import {
  facilityLevelFromCount,
  parseRoomSize,
  syncAllRatingKecocokan,
} from "../src/features/spk/spk";
import { DEFAULT_CRITERIA } from "../src/features/spk/default-rubric";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter: new PrismaPg(pool) });

// ─── Koordinat pusat kecamatan (sama dengan seed.ts) ───────────────────────
const KEC_COORDS: Record<string, { lat: number; lng: number }> = {
  beji: { lat: -6.37, lng: 106.82 },
  "pancoranmas": { lat: -6.39, lng: 106.81 },
  sukmajaya: { lat: -6.395, lng: 106.845 },
  cimanggis: { lat: -6.36, lng: 106.865 },
  limo: { lat: -6.38, lng: 106.775 },
  cinere: { lat: -6.335, lng: 106.78 },
  tapos: { lat: -6.41, lng: 106.885 },
  sawangan: { lat: -6.415, lng: 106.745 },
  bojongsari: { lat: -6.405, lng: 106.715 },
  cipayung: { lat: -6.41, lng: 106.79 },
  cilodong: { lat: -6.425, lng: 106.835 },
};

// Pemetaan nama fasilitas Excel -> 12 Facility kanonik aplikasi
const FACILITY_MAP: Record<string, string> = {
  "AC": "AC",
  "K. Mandi Dalam": "Kamar Mandi Dalam",
  "Kamar Mandi Dalam": "Kamar Mandi Dalam",
  "Kasur": "Kasur",
  "Meja": "Meja Belajar",
  "Meja Belajar": "Meja Belajar",
  "Lemari Baju": "Lemari",
  "Lemari": "Lemari",
  "Kursi": "Kursi",
  "WiFi": "WiFi",
  "Parkir": "Parkir Motor",
  "Parkir Motor": "Parkir Motor",
  "Dapur": "Dapur",
  "Dapur Pribadi": "Dapur",
  "Penjaga Kos": "Penjaga Kos",
  "Pengurus Kos": "Penjaga Kos",
  "Pengurus": "Penjaga Kos",
  "CCTV": "CCTV",
  "Termasuk listrik": "Listrik Gratis",
  "Listrik Gratis": "Listrik Gratis",
};

interface ExcelRow {
  room_name?: string;
  location?: string;
  room_size?: string;
  price_before_discount_bs?: string;
  all_facilities_bs?: string;
  rating?: string;
  tipe_kos?: string;
  jarak_kampus?: string;
  transport?: string;
}

function parsePrice(raw: string | undefined): number {
  const digits = String(raw || "").replace(/\D/g, "");
  return digits ? parseInt(digits, 10) : 0;
}

function parseRating(raw: string | undefined): number | null {
  const s = String(raw || "").trim();
  if (!s || /not found/i.test(s)) return null;
  const n = parseFloat(s);
  return isNaN(n) ? null : n;
}

function normalizeKec(raw: string | undefined): string {
  const s = String(raw || "").replace(/^Kecamatan\s+/i, "").trim();
  return s.replace(/\s+/g, " ");
}

function kecKey(kec: string): string {
  return kec.toLowerCase().replace(/\s+/g, "");
}

function mapGender(raw: string | undefined): "PUTRA" | "PUTRI" | "CAMPUR" {
  const s = String(raw || "").toLowerCase();
  if (s.includes("putra")) return "PUTRA";
  if (s.includes("putri")) return "PUTRI";
  return "CAMPUR";
}

function mapFacilities(raw: string | undefined): string[] {
  const s = String(raw || "")
    .replace(/Penjaga;\s*Kos/gi, "Penjaga Kos")
    .replace(/K\. Mandi Dalam\s+WiFi/gi, "K. Mandi Dalam; WiFi");
  const out: string[] = [];
  for (const part of s.split(";")) {
    const name = FACILITY_MAP[part.trim()];
    if (name && !out.includes(name)) out.push(name);
  }
  return out;
}

async function main() {
  // 1. Baca workbook
  const filePath = path.join(__dirname, "..", "data_kost.xlsx");
  const workbook = XLSX.readFile(filePath);
  const sheetName = workbook.SheetNames.includes("Depok") ? "Depok" : workbook.SheetNames[0];
  const rows = XLSX.utils.sheet_to_json<ExcelRow>(workbook.Sheets[sheetName], { defval: "" });
  console.log(`📥 Membaca ${rows.length} baris dari sheet "${sheetName}"`);

  // 2. Transformasi + dedup
  const seen = new Set<string>();
  const cleaned: Array<{
    name: string; kec: string; price: number; roomSize: string; rating: number | null;
    jarakKm: number; gender: "PUTRA" | "PUTRI" | "CAMPUR"; transit: string;
    facilities: string[]; facCount: number; fasilitasTeks: string;
    panjang: number; lebar: number; lat: number; lng: number;
  }> = [];
  let dupCount = 0;
  let skipCount = 0;

  rows.forEach((row, i) => {
    const name = String(row.room_name || "").trim();
    if (!name) return;
    if (/rumah kontrakan/i.test(name)) {
      skipCount++;
      console.log(`  ⏭  dilewati (bukan kos): ${name}`);
      return;
    }

    const kec = normalizeKec(row.location);
    const key = `${name.toLowerCase()}|${kec.toLowerCase()}`;
    if (seen.has(key)) {
      dupCount++;
      return;
    }
    seen.add(key);

    const coord = KEC_COORDS[kecKey(kec)] || KEC_COORDS.beji;
    // Offset deterministik agar titik tidak menumpuk di satu koordinat
    const lat = coord.lat + (((i % 7) - 3) * 0.002);
    const lng = coord.lng + (((i % 5) - 2) * 0.002);
    const { panjang, lebar } = parseRoomSize(String(row.room_size || ""));
    const fasilitasTeks = String(row.all_facilities_bs || "").trim();
    const facCount = fasilitasTeks.split(";").filter((s) => s.trim()).length;

    cleaned.push({
      name,
      kec,
      price: parsePrice(row.price_before_discount_bs),
      roomSize: String(row.room_size || "").trim() || "3 x 3 meter",
      rating: parseRating(row.rating),
      jarakKm: parseFloat(String(row.jarak_kampus || "0")) || 0,
      gender: mapGender(row.tipe_kos),
      transit: String(row.transport || "").trim() || "Ojek online/kendaraan pribadi",
      facilities: mapFacilities(row.all_facilities_bs),
      facCount,
      fasilitasTeks,
      panjang,
      lebar,
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5)),
    });
  });

  console.log(`🧹 Bersih: ${cleaned.length} kos (duplikat dilewati: ${dupCount}, non-kos dilewati: ${skipCount})`);

  // Kode alternatif: A01-A05 untuk 5 kos studi kasus (sheet SAW), sisanya A06+ urut sheet Depok
  const CASE_STUDY = [
    "Kost Noeks Cinere Depok",
    "Kost Pondok Rindang Tipe C Beji Depok",
    "Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok",
    "Kost Singgahsini DFlory Tipe B Cinere Depok",
    "Kost Rumah Nimas Sawangan Depok",
  ];
  let seq = CASE_STUDY.length;
  const kodeOf = new Map<string, string>();
  for (const k of cleaned) {
    const csIdx = CASE_STUDY.indexOf(k.name);
    if (csIdx >= 0) kodeOf.set(k.name, `A0${csIdx + 1}`);
    else kodeOf.set(k.name, `A${String(++seq).padStart(3, "0")}`);
  }

  // 3. Wipe data lama (kos cascade ke fasilitas/gambar/booking/chat)
  await prisma.kos.deleteMany();
  await prisma.subCriteria.deleteMany();
  await prisma.criteria.deleteMany();
  await prisma.facility.deleteMany();

  // 4. Akun (sama dengan seed.ts, email & password tidak berubah)
  const superAdmin = await prisma.user.upsert({
    where: { email: "superadmin@kosrank.com" },
    update: {},
    create: { name: "Super Admin", email: "superadmin@kosrank.com", password: await bcrypt.hash("admin123", 10), role: "ADMIN" },
  });
  const seller1 = await prisma.user.upsert({
    where: { email: "seller1@kosrank.com" },
    update: {},
    create: { name: "Budi Santoso", email: "seller1@kosrank.com", password: await bcrypt.hash("seller123", 10), role: "ADMIN", phone: "08123456789" },
  });
  await prisma.user.upsert({
    where: { email: "seller2@kosrank.com" },
    update: {},
    create: { name: "Siti Rahayu", email: "seller2@kosrank.com", password: await bcrypt.hash("seller123", 10), role: "ADMIN", phone: "08987654321" },
  });
  await prisma.user.upsert({
    where: { email: "user@kosrank.com" },
    update: {},
    create: { name: "Ahmad Fauzi", email: "user@kosrank.com", password: await bcrypt.hash("user123", 10), role: "USER" },
  });
  console.log("✅ Users seeded");

  // 5. Kriteria & sub-kriteria (rubrik data_kost.xlsx dari config bersama)
  for (const c of DEFAULT_CRITERIA) {
    const created = await prisma.criteria.create({
      data: { code: c.code, name: c.name, weight: c.weight, attribute: c.attribute },
    })
    await prisma.subCriteria.createMany({
      data: c.subKriteria.map((s) => ({ ...s, criteriaId: created.id })),
    })
  }
  console.log("✅ Criteria & Sub-Criteria seeded");

  // 6. Fasilitas kanonik
  const facilityData = [
    { name: "Kasur", type: "ROOM" as const },
    { name: "Meja Belajar", type: "ROOM" as const },
    { name: "Lemari", type: "ROOM" as const },
    { name: "Kursi", type: "ROOM" as const },
    { name: "Kamar Mandi Dalam", type: "ROOM" as const },
    { name: "AC", type: "ROOM" as const },
    { name: "Parkir Motor", type: "PUBLIC" as const },
    { name: "Dapur", type: "PUBLIC" as const },
    { name: "WiFi", type: "PUBLIC" as const },
    { name: "Penjaga Kos", type: "PUBLIC" as const },
    { name: "CCTV", type: "PUBLIC" as const },
    { name: "Listrik Gratis", type: "PUBLIC" as const },
  ];
  const createdFacilities: Record<string, string> = {};
  for (const f of facilityData) {
    const created = await prisma.facility.create({ data: f });
    createdFacilities[f.name] = created.id;
  }
  console.log("✅ Facilities seeded");

  // 7. Insert katalog real
  const stamp = Date.now().toString(36);
  let inserted = 0;
  for (const [i, k] of cleaned.entries()) {
    const slug = `${k.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "")}-${stamp}${i}`;
    const created = await prisma.kos.create({
      data: {
        name: k.name,
        slug,
        description: `Kos ${k.gender === "PUTRA" ? "putra" : k.gender === "PUTRI" ? "putri" : "campur"} di kawasan ${k.kec}, Depok. Harga, fasilitas, jarak, dan rating diambil dari dataset data_kost.xlsx.`,
        price: k.price,
        roomSize: k.roomSize,
        address: `${k.kec}, Depok`,
        campus: "UBSI Margonda",
        genderType: k.gender,
        transit: k.transit,
        rating: k.rating,
        latitude: k.lat,
        longitude: k.lng,
        kode: kodeOf.get(k.name),
        jarakKm: k.jarakKm,
        panjangM: k.panjang || null,
        lebarM: k.lebar || null,
        fasilitasLevel: facilityLevelFromCount(k.facCount),
        fasilitasTeks: k.fasilitasTeks,
        owner: { connect: { id: seller1.id } },
      },
    });

    for (const fName of k.facilities) {
      const facId = createdFacilities[fName];
      if (facId) {
        await prisma.kosFacility.create({ data: { kosId: created.id, facilityId: facId } });
      }
    }
    inserted++;
  }
  console.log(`✅ ${inserted} kos asli dari data_kost.xlsx tersimpan`);

  // 8. Sample booking (pola sama dengan seed.ts, agar dashboard & notifikasi berisi)
  const dbUsers = await prisma.user.findMany({ where: { role: "USER" } });
  const dbKos = await prisma.kos.findMany();
  if (dbUsers.length > 0 && dbKos.length > 0) {
    const statuses: ("APPROVED" | "PENDING" | "REJECTED")[] = ["APPROVED", "PENDING", "APPROVED", "APPROVED", "REJECTED", "APPROVED"];
    const monthlyPattern = [4, 12, 7, 15, 9, 18];
    for (let monthIdx = 0; monthIdx < 6; monthIdx++) {
      const count = monthlyPattern[monthIdx];
      const monthOffset = 5 - monthIdx;
      for (let j = 0; j < count; j++) {
        const user = dbUsers[j % dbUsers.length];
        const kos = dbKos[(monthIdx * 3 + j) % dbKos.length];
        const status = statuses[j % statuses.length];
        const duration = (j % 3) + 1;
        const bookingDate = new Date();
        bookingDate.setDate(1);
        bookingDate.setMonth(bookingDate.getMonth() - monthOffset);
        bookingDate.setDate(1 + (j * 5) % 28);
        bookingDate.setHours(9 + (j % 8), 0, 0, 0);
        await prisma.booking.create({
          data: { userId: user.id, kosId: kos.id, status, durationMonths: duration, startDate: bookingDate, createdAt: bookingDate },
        });
      }
    }
    console.log("✅ Booking transactions seeded");
  }

  // 9. Hitung ulang SAW (bobot dari tabel Criteria, skor C2 dari jumlah fasilitas)
  await calculateAndUpdateSAW();
  console.log("✅ Initial SAW ranks and scores saved!");

  // 10. Sinkronkan rating_kecocokan (matriks X modul SPK) untuk semua kos
  const synced = await syncAllRatingKecocokan();
  console.log(`✅ Rating kecocokan tersinkron untuk ${synced} kos`);

  console.log(`\n🏁 Selesai. Katalog: ${inserted} kos real. Login admin: superadmin@kosrank.com / admin123`);
}

main()
  .catch((e) => {
    console.error("❌ Seed gagal:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
    await pool.end();
  });
