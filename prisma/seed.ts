import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from "@prisma/adapter-pg"
import { Pool } from "pg"
import bcrypt from 'bcryptjs'

const connectionString = process.env.DATABASE_URL
const pool = new Pool({ connectionString })
const adapter = new PrismaPg(pool)
const prisma = new PrismaClient({ adapter })

async function main() {
  console.log('🌱 Seeding database from metode_saw_new.md...')

  const hash = (p: string) => bcrypt.hash(p, 10)

  // ─── Delete Existing Data to Ensure Clean Slate ─────────────────────────
  await prisma.kosFacility.deleteMany()
  await prisma.kosImage.deleteMany()
  await prisma.kos.deleteMany()
  await prisma.subCriteria.deleteMany()
  await prisma.criteria.deleteMany()
  await prisma.facility.deleteMany()

  // ─── Users ───────────────────────────────────────────────────────────────
  const superAdmin = await prisma.user.upsert({
    where: { email: 'superadmin@kosrank.com' },
    update: {},
    create: { name: 'Super Admin', email: 'superadmin@kosrank.com', password: await hash('admin123'), role: 'ADMIN' },
  })

  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@kosrank.com' },
    update: {},
    create: { name: 'Budi Santoso', email: 'seller1@kosrank.com', password: await hash('seller123'), role: 'ADMIN', phone: '08123456789' },
  })

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@kosrank.com' },
    update: {},
    create: { name: 'Siti Rahayu', email: 'seller2@kosrank.com', password: await hash('seller123'), role: 'ADMIN', phone: '08987654321' },
  })

  await prisma.user.upsert({
    where: { email: 'user@kosrank.com' },
    update: {},
    create: { name: 'Ahmad Fauzi', email: 'user@kosrank.com', password: await hash('user123'), role: 'USER' },
  })

  console.log('✅ Users seeded')

  // ─── Criteria & Sub-Criteria (rubrik: data_kost.xlsx) ────────────────────
  const criteriaData = [
    { code: 'C1', name: 'Harga', weight: 0.3, attribute: 'COST' as const },
    { code: 'C2', name: 'Fasilitas', weight: 0.3, attribute: 'BENEFIT' as const },
    { code: 'C3', name: 'Jarak', weight: 0.2, attribute: 'COST' as const },
    { code: 'C4', name: 'Ukuran Ruangan', weight: 0.1, attribute: 'BENEFIT' as const },
    { code: 'C5', name: 'Rating', weight: 0.1, attribute: 'BENEFIT' as const },
  ]

  for (const c of criteriaData) {
    const created = await prisma.criteria.create({ data: c })

    if (c.code === 'C1') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: '500.000 - 999.999', value: '<1000000', score: 100 },
        { criteriaId: created.id, name: '1.000.000 - 1.999.999', value: '<2000000', score: 80 },
        { criteriaId: created.id, name: '2.000.000 - 2.999.999', value: '<3000000', score: 60 },
        { criteriaId: created.id, name: '3.000.000 - 3.999.999', value: '<4000000', score: 40 },
        { criteriaId: created.id, name: '> 4.000.000', value: '>=4000000', score: 20 },
      ]})
    }
    if (c.code === 'C2') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: 'Sangat tidak lengkap (<= 5 fasilitas)', value: '<=5', score: 20 },
        { criteriaId: created.id, name: 'Kurang lengkap (6 - 7 fasilitas)', value: '6-7', score: 40 },
        { criteriaId: created.id, name: 'Cukup lengkap (8 - 10 fasilitas)', value: '8-10', score: 60 },
        { criteriaId: created.id, name: 'Lengkap (11 - 13 fasilitas)', value: '11-13', score: 80 },
        { criteriaId: created.id, name: 'Sangat lengkap (>= 14 fasilitas)', value: '>=14', score: 100 },
      ]})
    }
    if (c.code === 'C3') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: '0 - 1 km', value: '0-1', score: 100 },
        { criteriaId: created.id, name: '1 - 5 km', value: '1-5', score: 80 },
        { criteriaId: created.id, name: '5 - 10 km', value: '5-10', score: 60 },
        { criteriaId: created.id, name: '10 - 15 km', value: '10-15', score: 40 },
        { criteriaId: created.id, name: '> 15 km', value: '>15', score: 20 },
      ]})
    }
    if (c.code === 'C4') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: 'Luas <= 6 m2', value: '<=6', score: 20 },
        { criteriaId: created.id, name: 'Luas > 6-9 m2', value: '6-9', score: 40 },
        { criteriaId: created.id, name: 'Luas > 9-12 m2', value: '9-12', score: 60 },
        { criteriaId: created.id, name: 'Luas > 12-15 m2', value: '12-15', score: 80 },
        { criteriaId: created.id, name: 'Luas > 15 m2', value: '>15', score: 100 },
      ]})
    }
    if (c.code === 'C5') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: 'Not found', value: 'null', score: 20 },
        { criteriaId: created.id, name: '1 - 2', value: '1-2', score: 40 },
        { criteriaId: created.id, name: '2 - 3', value: '2-3', score: 60 },
        { criteriaId: created.id, name: '3 - 4', value: '3-4', score: 80 },
        { criteriaId: created.id, name: '4 - 5', value: '4-5', score: 100 },
      ]})
    }
  }
  console.log('✅ Criteria & Sub-Criteria seeded')

  // ─── Facilities ──────────────────────────────────────────────────────────
  const facilityData = [
    // Room Facilities
    { name: 'Kasur', type: 'ROOM' as const },
    { name: 'Meja Belajar', type: 'ROOM' as const },
    { name: 'Lemari', type: 'ROOM' as const },
    { name: 'Kursi', type: 'ROOM' as const },
    { name: 'Kamar Mandi Dalam', type: 'ROOM' as const },
    { name: 'AC', type: 'ROOM' as const },
    // Public Facilities
    { name: 'Parkir Motor', type: 'PUBLIC' as const },
    { name: 'Dapur', type: 'PUBLIC' as const },
    { name: 'WiFi', type: 'PUBLIC' as const },
    { name: 'Penjaga Kos', type: 'PUBLIC' as const },
    { name: 'CCTV', type: 'PUBLIC' as const },
    { name: 'Listrik Gratis', type: 'PUBLIC' as const },
  ]

  const createdFacilities: Record<string, any> = {}
  for (const f of facilityData) {
    const created = await prisma.facility.create({ data: f })
    createdFacilities[f.name] = created
  }
  console.log('✅ Facilities seeded')

  // ─── Sample Kos (Generated 6 listings per Kecamatan in Depok) ─────────────
  const kecamatans = [
    { name: "Beji", lat: -6.3700, lng: 106.8200 },
    { name: "Pancoran Mas", lat: -6.3900, lng: 106.8100 },
    { name: "Sukmajaya", lat: -6.3950, lng: 106.8450 },
    { name: "Cimanggis", lat: -6.3600, lng: 106.8650 },
    { name: "Limo", lat: -6.3800, lng: 106.7750 },
    { name: "Cinere", lat: -6.3350, lng: 106.7800 },
    { name: "Tapos", lat: -6.4100, lng: 106.8850 },
    { name: "Sawangan", lat: -6.4150, lng: 106.7450 },
    { name: "Bojongsari", lat: -6.4050, lng: 106.7150 },
    { name: "Cipayung", lat: -6.4100, lng: 106.7900 },
    { name: "Cilodong", lat: -6.4250, lng: 106.8350 },
  ];

  const names = ["Griya", "Kost", "Wisma", "Pondok", "Oase", "Rumah"];
  const adjectives = ["Asri", "Indah", "Nyaman", "Bahagia", "Kencana", "Mulia", "Harmoni", "Mentari", "Pesona", "Lestari", "Sejahtera", "Damai"];
  const genders = ["PUTRA", "PUTRI", "CAMPUR"];
  const sizes = ["2.5x2 m", "3x3 m", "3x4 m", "4x4 m", "5x4 m"];
  
  const imagesPool = [
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1617331140180-e8262094733a?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1505693395321-883724634266?auto=format&fit=crop&w=600&q=80"
  ];

  const facilitiesPool = [
    ["Kasur", "Meja Belajar", "Lemari"],
    ["Kamar Mandi Dalam", "Kasur", "Meja Belajar", "Lemari", "WiFi", "Parkir Motor"],
    ["Kamar Mandi Dalam", "AC", "Kasur", "Meja Belajar", "Lemari", "Kursi", "Parkir Motor", "Dapur", "WiFi", "Penjaga Kos"],
    ["Kamar Mandi Dalam", "AC", "Kasur", "Meja Belajar", "Lemari", "Kursi", "Parkir Motor", "Dapur", "WiFi", "Penjaga Kos", "CCTV"],
    ["Kasur", "Meja Belajar", "Lemari", "Parkir Motor", "WiFi"],
    ["Kamar Mandi Dalam", "Kasur", "Meja Belajar", "Lemari", "Parkir Motor", "Dapur", "WiFi"]
  ];

  const transitsPool = [
    "Ojek online/kendaraan pribadi",
    "Angkot, ojek online/kendaraan pribadi",
    "Bus, angkot, ojek online/kendaraan pribadi",
    "Kereta, bus, angkot, ojek online/kendaraan pribadi"
  ];

  const kosData = [];
  let nameCounter = 0;

  for (const kec of kecamatans) {
    for (let i = 0; i < 6; i++) {
      const namePrefix = names[i % names.length];
      const nameAdj = adjectives[(nameCounter + i) % adjectives.length];
      const gender = genders[(i + nameCounter) % genders.length] as "PUTRA" | "PUTRI" | "CAMPUR";
      const size = sizes[i % sizes.length];
      const image = imagesPool[(nameCounter + i) % imagesPool.length];
      const facilities = facilitiesPool[i % facilitiesPool.length];
      const transit = transitsPool[i % transitsPool.length];
      const owner = (i % 2 === 0) ? seller1 : seller2;
      const phone = owner.phone || "08123456789";

      // Price distribution
      let price = 500000;
      if (i === 0) price = 450000;
      else if (i === 1) price = 900000;
      else if (i === 2) price = 1200000;
      else if (i === 3) price = 1750000;
      else if (i === 4) price = 2200000;
      else price = 3100000;

      // Small lat/lng offsets so coordinates are dispersed
      const latOffset = (i - 2.5) * 0.003;
      const lngOffset = (i - 2.5) * 0.003;

      const kosName = `${namePrefix} ${nameAdj} ${kec.name} Tipe ${i + 1}`;

      // Deterministic demo ratings 3.2 - 5.0 (1 desimal)
      const rating = Math.round((3.2 + ((nameCounter + i) % 19) * 0.1) * 10) / 10;

      // Distribusi kampus agar filter kampus menghasilkan data nyata
      const campus = ["UBSI Margonda", "UI", "PNJ", "Gunadarma"][(nameCounter + i) % 4];

      kosData.push({
        name: kosName,
        price,
        roomSize: size,
        address: `Jl. Melati Raya No. ${12 + i * 7}, ${kec.name}, Depok`,
        campus,
        genderType: gender,
        description: `Hunian ${kosName} yang nyaman dan strategis di kawasan ${kec.name}, dekat dengan fasilitas umum dan kampus.`,
        owner,
        phone,
        transit,
        rating,
        latitude: parseFloat((kec.lat + latOffset).toFixed(5)),
        longitude: parseFloat((kec.lng + lngOffset).toFixed(5)),
        facilities,
        images: [image]
      });
    }
    nameCounter += 6;
  }

  for (const k of kosData) {
    const slug = k.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-5)
    
    const createdKos = await prisma.kos.create({
      data: {
        name: k.name,
        slug,
        description: k.description,
        price: k.price,
        roomSize: k.roomSize,
        address: k.address,
        campus: k.campus,
        genderType: k.genderType,
        phone: k.phone,
        owner: { connect: { id: k.owner.id } },
        transit: k.transit,
        rating: k.rating,
        latitude: k.latitude,
        longitude: k.longitude,
      }
    })

    // Connect facilities
    for (const fName of k.facilities) {
      const fac = createdFacilities[fName]
      if (fac) {
        await prisma.kosFacility.create({
          data: {
            kosId: createdKos.id,
            facilityId: fac.id
          }
        })
      }
    }

    // Connect images
    for (const imgUrl of k.images) {
      await prisma.kosImage.create({
        data: {
          kosId: createdKos.id,
          url: imgUrl
        }
      })
    }
  }

  // ─── 5 Alternatif Studi Kasus (data_kost.xlsx, skor eksak di engine) ─────
  const kecCoords: Record<string, { lat: number; lng: number }> = {
    Cinere: { lat: -6.335, lng: 106.78 },
    Beji: { lat: -6.37, lng: 106.82 },
    Cimanggis: { lat: -6.36, lng: 106.865 },
    Sawangan: { lat: -6.415, lng: 106.745 },
  }

  const caseStudyKos = [
    { name: 'Kost Noeks Cinere Depok', price: 1700000, roomSize: '2.5 x 3 meter', kec: 'Cinere', genderType: 'PUTRI', transit: 'Ojol/Motor / Angkot', rating: 1.9, facilities: ['AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Kamar Mandi Dalam', 'Parkir Motor', 'Listrik Gratis'] },
    { name: 'Kost Pondok Rindang Tipe C Beji Depok', price: 1500000, roomSize: '3 x 3 meter', kec: 'Beji', genderType: 'PUTRA', transit: 'Jalan kaki', rating: 3.4, facilities: ['AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Kamar Mandi Dalam', 'Parkir Motor', 'Listrik Gratis'] },
    { name: 'Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok', price: 2000000, roomSize: '3.5 x 3 meter', kec: 'Cimanggis', genderType: 'PUTRI', transit: 'Jalan kaki, ojol/motor, angkot', rating: 4.5, facilities: ['AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Kamar Mandi Dalam', 'Parkir Motor', 'WiFi', 'Dapur', 'Penjaga Kos', 'CCTV', 'Listrik Gratis', 'Kursi'] },
    { name: 'Kost Singgahsini DFlory Tipe B Cinere Depok', price: 2025000, roomSize: '3.7 x 2.7 meter', kec: 'Cinere', genderType: 'PUTRI', transit: 'Ojol/Motor / Angkot', rating: 5.0, facilities: ['AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Kamar Mandi Dalam', 'Parkir Motor', 'WiFi', 'Dapur', 'Penjaga Kos', 'CCTV', 'Listrik Gratis'] },
    { name: 'Kost Rumah Nimas Sawangan Depok', price: 1000000, roomSize: '3 x 4 meter', kec: 'Sawangan', genderType: 'PUTRI', transit: 'Ojol/Motor / Angkot', rating: null as number | null, facilities: ['AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kamar Mandi Dalam', 'Parkir Motor', 'WiFi', 'Dapur', 'Penjaga Kos', 'CCTV', 'Listrik Gratis'] },
  ]

  for (const k of caseStudyKos) {
    const coord = kecCoords[k.kec]
    const slug = k.name.toLowerCase().replace(/[^a-z0-9]+/g, '-') + '-' + Date.now().toString().slice(-5)

    const created = await prisma.kos.create({
      data: {
        name: k.name,
        slug,
        description: `${k.name} — salah satu alternatif studi kasus perhitungan SAW (data_kost.xlsx).`,
        price: k.price,
        roomSize: k.roomSize,
        address: `${k.kec}, Depok`,
        campus: 'UBSI Margonda',
        genderType: k.genderType as 'PUTRA' | 'PUTRI' | 'CAMPUR',
        transit: k.transit,
        rating: k.rating,
        latitude: coord.lat,
        longitude: coord.lng,
        owner: { connect: { id: seller1.id } },
      }
    })

    const uniqueFacilities = [...new Set(k.facilities)]
    for (const fName of uniqueFacilities) {
      const fac = createdFacilities[fName]
      if (fac) {
        await prisma.kosFacility.create({
          data: { kosId: created.id, facilityId: fac.id }
        })
      }
    }

    await prisma.kosImage.create({
      data: { kosId: created.id, url: imagesPool[0] }
    })
  }

  console.log('✅ Sample kos alternatives seeded')

  // ─── Bookings Seeding ────────────────────────────────────────────────────
  console.log('🌱 Seeding sample booking transactions...')
  const dbUsers = await prisma.user.findMany({ where: { role: 'USER' } })
  const dbKos = await prisma.kos.findMany()

  if (dbUsers.length > 0 && dbKos.length > 0) {
    const statuses: ('APPROVED' | 'PENDING' | 'REJECTED')[] = ['APPROVED', 'PENDING', 'APPROVED', 'APPROVED', 'REJECTED', 'APPROVED'];
    const monthlyPattern = [4, 12, 7, 15, 9, 18];
    
    for (let monthIdx = 0; monthIdx < 6; monthIdx++) {
      const count = monthlyPattern[monthIdx];
      const monthOffset = 5 - monthIdx; // e.g. 5, 4, 3, 2, 1, 0 months ago
      
      for (let j = 0; j < count; j++) {
        const user = dbUsers[j % dbUsers.length]
        const kos = dbKos[(monthIdx * 3 + j) % dbKos.length]
        const status = statuses[j % statuses.length]
        const duration = (j % 3) + 1
        
        const bookingDate = new Date()
        bookingDate.setDate(1) // prevent date overflow bug
        bookingDate.setMonth(bookingDate.getMonth() - monthOffset)
        bookingDate.setDate(1 + (j * 5) % 28)
        bookingDate.setHours(9 + (j % 8), 0, 0, 0)

        await prisma.booking.create({
          data: {
            userId: user.id,
            kosId: kos.id,
            status,
            durationMonths: duration,
            startDate: bookingDate,
            createdAt: bookingDate
          }
        })
      }
    }
    console.log('✅ Booking transactions seeded')
  }

  // Recalculate SAW and update rank and finalScore in database before finishing
  await calculateAndUpdateSAWInSeed(prisma);

  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 Akun tersedia:')
  console.log('  Super Admin: superadmin@kosrank.com / admin123')
  console.log('  Seller 1:    seller1@kosrank.com   / seller123')
  console.log('  Seller 2:    seller2@kosrank.com   / seller123')
  console.log('  User:        user@kosrank.com       / user123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

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

async function calculateAndUpdateSAWInSeed(prisma: PrismaClient) {
  const UBSI_MARGONDA_COORDS = { lat: -6.3685, lng: 106.8335 };

  // 1. Get criteria
  const criteriaList = await prisma.criteria.findMany();

  // 2. Get active kos listings
  const kosList = await prisma.kos.findMany({
    where: { isActive: true },
    include: {
      facilities: {
        include: { facility: true },
      },
    },
  });

  if (kosList.length === 0 || criteriaList.length === 0) return;

  // Map criteria weight lookup
  const weights: Record<string, number> = {};
  const attributes: Record<string, "COST" | "BENEFIT"> = {};
  for (const c of criteriaList) {
    weights[c.code] = c.weight;
    attributes[c.code] = c.attribute;
  }

  // 3. Score calculation
  const scoreMatrix: Record<string, Record<string, number>> = {};

  for (const kos of kosList) {
    scoreMatrix[kos.id] = {};
    
    // Calculate distance
    const distMeters = calculateDistance(kos.latitude, kos.longitude, UBSI_MARGONDA_COORDS.lat, UBSI_MARGONDA_COORDS.lng);
    const distKm = distMeters / 1000;

    const isSeeded = SEEDED_KOS_SCORES[kos.name];
    const useSeeded = isSeeded;

    // C1: Harga (Cost)
    scoreMatrix[kos.id]["C1"] = useSeeded ? isSeeded.C1 : getC1Score(kos.price);

    // C2: Jarak (Cost)
    scoreMatrix[kos.id]["C2"] = useSeeded ? isSeeded.C2 : getC2Score(distKm);

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
      id: kos.id,
      score: parseFloat(score.toFixed(4)),
    };
  });

  // Sort by score descending
  ranked.sort((a, b) => b.score - a.score);

  // Update rankings in database
  console.log("⚡ Calculating and saving initial SAW ranks in database...");
  await prisma.$transaction(
    ranked.map((item, index) =>
      prisma.kos.update({
        where: { id: item.id },
        data: {
          finalScore: item.score,
          ranking: index + 1,
        },
      })
    )
  );
  console.log("✅ Initial SAW ranks and scores saved!");
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
