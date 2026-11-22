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
    facilities: string[]; lat: number; lng: number;
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
      lat: parseFloat(lat.toFixed(5)),
      lng: parseFloat(lng.toFixed(5)),
    });
  });

  console.log(`🧹 Bersih: ${cleaned.length} kos (duplikat dilewati: ${dupCount}, non-kos dilewati: ${skipCount})`);

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

  // 5. Kriteria & sub-kriteria (rubrik data_kost.xlsx, sama dengan seed.ts)
  const criteriaData = [
    { code: "C1", name: "Harga", weight: 0.3, attribute: "COST" as const },
    { code: "C2", name: "Fasilitas", weight: 0.3, attribute: "BENEFIT" as const },
    { code: "C3", name: "Jarak", weight: 0.2, attribute: "COST" as const },
    { code: "C4", name: "Ukuran Ruangan", weight: 0.1, attribute: "BENEFIT" as const },
    { code: "C5", name: "Rating", weight: 0.1, attribute: "BENEFIT" as const },
  ];
  const subCriteriaData: Record<string, Array<{ name: string; value: string; score: number }>> = {
    C1: [
      { name: "500.000 - 999.999", value: "<1000000", score: 100 },
      { name: "1.000.000 - 1.999.999", value: "<2000000", score: 80 },
      { name: "2.000.000 - 2.999.999", value: "<3000000", score: 60 },
      { name: "3.000.000 - 3.999.999", value: "<4000000", score: 40 },
      { name: "> 4.000.000", value: ">=4000000", score: 20 },
    ],
    C2: [
      { name: "Sangat tidak lengkap (<= 5 fasilitas)", value: "<=5", score: 20 },
      { name: "Kurang lengkap (6 - 7 fasilitas)", value: "6-7", score: 40 },
      { name: "Cukup lengkap (8 - 10 fasilitas)", value: "8-10", score: 60 },
      { name: "Lengkap (11 - 13 fasilitas)", value: "11-13", score: 80 },
      { name: "Sangat lengkap (>= 14 fasilitas)", value: ">=14", score: 100 },
    ],
    C3: [
      { name: "0 - 1 km", value: "0-1", score: 100 },
      { name: "1 - 5 km", value: "1-5", score: 80 },
      { name: "5 - 10 km", value: "5-10", score: 60 },
      { name: "10 - 15 km", value: "10-15", score: 40 },
      { name: "> 15 km", value: ">15", score: 20 },
    ],
    C4: [
      { name: "Luas <= 6 m2", value: "<=6", score: 20 },
      { name: "Luas > 6-9 m2", value: "6-9", score: 40 },
      { name: "Luas > 9-12 m2", value: "9-12", score: 60 },
      { name: "Luas > 12-15 m2", value: "12-15", score: 80 },
      { name: "Luas > 15 m2", value: ">15", score: 100 },
    ],
    C5: [
      { name: "Not found", value: "null", score: 20 },
      { name: "1 - 2", value: "1-2", score: 40 },
      { name: "2 - 3", value: "2-3", score: 60 },
      { name: "3 - 4", value: "3-4", score: 80 },
      { name: "4 - 5", value: "4-5", score: 100 },
    ],
  };
  for (const c of criteriaData) {
    const created = await prisma.criteria.create({ data: c });
    await prisma.subCriteria.createMany({
      data: subCriteriaData[c.code].map((s) => ({ ...s, criteriaId: created.id })),
    });
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
