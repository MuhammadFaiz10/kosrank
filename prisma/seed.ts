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
    create: { name: 'Super Admin', email: 'superadmin@kosrank.com', password: await hash('admin123'), role: 'SUPER_ADMIN' },
  })

  const seller1 = await prisma.user.upsert({
    where: { email: 'seller1@kosrank.com' },
    update: {},
    create: { name: 'Budi Santoso', email: 'seller1@kosrank.com', password: await hash('seller123'), role: 'SELLER', phone: '08123456789' },
  })

  const seller2 = await prisma.user.upsert({
    where: { email: 'seller2@kosrank.com' },
    update: {},
    create: { name: 'Siti Rahayu', email: 'seller2@kosrank.com', password: await hash('seller123'), role: 'SELLER', phone: '08987654321' },
  })

  await prisma.user.upsert({
    where: { email: 'user@kosrank.com' },
    update: {},
    create: { name: 'Ahmad Fauzi', email: 'user@kosrank.com', password: await hash('user123'), role: 'USER' },
  })

  console.log('✅ Users seeded')

  // ─── Criteria & Sub-Criteria ─────────────────────────────────────────────
  const criteriaData = [
    { code: 'C1', name: 'Harga', weight: 0.3, attribute: 'COST' as const },
    { code: 'C2', name: 'Jarak', weight: 0.2, attribute: 'COST' as const },
    { code: 'C3', name: 'Ukuran Ruangan', weight: 0.15, attribute: 'BENEFIT' as const },
    { code: 'C4', name: 'Fasilitas Kamar', weight: 0.15, attribute: 'BENEFIT' as const },
    { code: 'C5', name: 'Fasilitas Kos', weight: 0.1, attribute: 'BENEFIT' as const },
    { code: 'C6', name: 'Akses Transportasi', weight: 0.1, attribute: 'BENEFIT' as const },
  ]

  for (const c of criteriaData) {
    const created = await prisma.criteria.create({ data: c })

    if (c.code === 'C1') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: 'Sangat Murah (<= 500rb)', value: '<=500000', score: 100 },
        { criteriaId: created.id, name: 'Murah (<= 1jt)', value: '<=1000000', score: 80 },
        { criteriaId: created.id, name: 'Sedang (<= 2jt)', value: '<=2000000', score: 60 },
        { criteriaId: created.id, name: 'Mahal (<= 3jt)', value: '<=3000000', score: 40 },
        { criteriaId: created.id, name: 'Sangat Mahal (> 3jt)', value: '>3000000', score: 20 },
      ]})
    }
    if (c.code === 'C2') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: '1 - 5 km', value: '1-5', score: 100 },
        { criteriaId: created.id, name: '5 - 8 km', value: '5-8', score: 80 },
        { criteriaId: created.id, name: '8 - 12 km', value: '8-12', score: 60 },
        { criteriaId: created.id, name: '13 - 15 km', value: '13-15', score: 40 },
        { criteriaId: created.id, name: '> 18 km', value: '>18', score: 20 },
      ]})
    }
    if (c.code === 'C3') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: '<= 2x2 m', value: '<=4', score: 20 },
        { criteriaId: created.id, name: '<= 3x3 m', value: '<=9', score: 40 },
        { criteriaId: created.id, name: '<= 4x4 m', value: '<=16', score: 60 },
        { criteriaId: created.id, name: '<= 5x5 m', value: '<=25', score: 80 },
        { criteriaId: created.id, name: '> 5x5 m', value: '>25', score: 100 },
      ]})
    }
    if (c.code === 'C4') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: 'Luar, Kasur, Meja, Lemari', value: '20', score: 20 },
        { criteriaId: created.id, name: 'Luar, Kasur, Meja, Lemari, Kursi', value: '40', score: 40 },
        { criteriaId: created.id, name: 'Dalam, Kasur, Meja, Lemari, Kursi', value: '60', score: 60 },
        { criteriaId: created.id, name: 'Luar, AC, Kasur, Meja, Lemari, Kursi', value: '80', score: 80 },
        { criteriaId: created.id, name: 'Dalam, AC, Kasur, Meja, Lemari, Kursi', value: '100', score: 100 },
      ]})
    }
    if (c.code === 'C5') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: 'Parkir, Dapur', value: '20', score: 20 },
        { criteriaId: created.id, name: 'Parkir, Dapur, WiFi, Penjaga', value: '40', score: 40 },
        { criteriaId: created.id, name: 'Parkir, Dapur, WiFi, Penjaga, CCTV', value: '60', score: 60 },
        { criteriaId: created.id, name: 'Listrik, Parkir, Dapur, WiFi, Penjaga', value: '80', score: 80 },
        { criteriaId: created.id, name: 'Listrik, Parkir, Dapur, WiFi, Penjaga, CCTV', value: '100', score: 100 },
      ]})
    }
    if (c.code === 'C6') {
      await prisma.subCriteria.createMany({ data: [
        { criteriaId: created.id, name: 'Sulit dijangkau', value: '20', score: 20 },
        { criteriaId: created.id, name: 'Ojek online/kendaraan pribadi', value: '40', score: 40 },
        { criteriaId: created.id, name: 'Angkot, ojek online/kendaraan pribadi', value: '60', score: 60 },
        { criteriaId: created.id, name: 'Bus, angkot, ojek online/kendaraan pribadi', value: '80', score: 80 },
        { criteriaId: created.id, name: 'Kereta, bus, angkot, ojek online/kendaraan pribadi', value: '100', score: 100 },
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

  // ─── Sample Kos (Alternatives from metode_saw_new.md) ────────────────────
  // Coordinate of UBSI Margonda: lat: -6.3685, lng: 106.8335
  const kosData = [
    {
      name: 'Kost Singgahsini Beji',
      price: 2770000,
      roomSize: '6.2x4 m',
      address: 'Jl. Beji No.1, Beji, Depok',
      campus: 'UBSI Margonda',
      genderType: 'CAMPUR' as const,
      description: 'Kost Singgahsini Beji menawarkan hunian strategis yang sangat nyaman untuk mahasiswa UBSI Margonda.',
      owner: seller1,
      phone: '08123456789',
      transit: 'Ojek online/kendaraan pribadi',
      latitude: -6.4225, // approx 6km from UBSI Margonda
      longitude: 106.8335,
      facilities: ['Kamar Mandi Dalam', 'AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Parkir Motor', 'Dapur', 'WiFi', 'Penjaga Kos'],
      images: ['https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=600&q=80']
    },
    {
      name: 'Kost Oemahkoe Depok Tipe Vvip 2 Beji Depok',
      price: 2499000,
      roomSize: '4.5x3 m',
      address: 'Jl. Margonda Raya No. 15, Beji, Depok',
      campus: 'UBSI Margonda',
      genderType: 'CAMPUR' as const,
      description: 'Kost premium dengan fasilitas VVIP bintang lima. Lokasi sangat dekat dengan kampus UBSI Margonda.',
      owner: seller1,
      phone: '08123456789',
      transit: 'Angkot, ojek online/kendaraan pribadi',
      latitude: -6.3835, // approx 1.7km from UBSI Margonda
      longitude: 106.8335,
      facilities: ['Kamar Mandi Dalam', 'AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Parkir Motor', 'Dapur', 'WiFi', 'Penjaga Kos', 'CCTV'],
      images: ['https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=600&q=80']
    },
    {
      name: 'Kost Singgahsini Cinere',
      price: 1825000,
      roomSize: '3.7x2.7 m',
      address: 'Jl. Cinere No. 10, Cinere, Depok',
      campus: 'UBSI Margonda',
      genderType: 'CAMPUR' as const,
      description: 'Kost tenang, bersih, and aman di kawasan elit Cinere. Cocok untuk mahasiswa yang menyukai ketenangan.',
      owner: seller2,
      phone: '08987654321',
      transit: 'Kereta, bus, angkot, ojek online/kendaraan pribadi',
      latitude: -6.4765, // approx 12km from UBSI Margonda
      longitude: 106.8335,
      facilities: ['Kamar Mandi Dalam', 'AC', 'Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Parkir Motor', 'Dapur', 'Penjaga Kos'],
      images: ['https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=600&q=80']
    },
    {
      name: 'Kost Growing House Jatijajar Tipe Standart A Tapos Depok',
      price: 900000,
      roomSize: '2.5x2 m',
      address: 'Jl. Jatijajar No. 5, Tapos, Depok',
      campus: 'UBSI Margonda',
      genderType: 'PUTRA' as const,
      description: 'Kost hemat untuk putra dengan tipe kamar standar, lingkungan bersih dan bersahabat.',
      owner: seller2,
      phone: '08987654321',
      transit: 'Bus, angkot, ojek online/kendaraan pribadi',
      latitude: -6.4715, // approx 11.5km from UBSI Margonda
      longitude: 106.8335,
      facilities: ['Kasur', 'Meja Belajar', 'Lemari', 'Kursi', 'Parkir Motor', 'Dapur'],
      images: ['https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=600&q=80']
    },
    {
      name: 'Kost Bintang Tipe A Sukmajaya Depok',
      price: 1000000,
      roomSize: '3x3 m',
      address: 'Jl. Sukmajaya No. 12, Sukmajaya, Depok',
      campus: 'UBSI Margonda',
      genderType: 'PUTRI' as const,
      description: 'Kost khusus putri di kawasan Sukmajaya. Lingkungan aman dan asri.',
      owner: seller1,
      phone: '08123456789',
      transit: 'Angkot, ojek online/kendaraan pribadi',
      latitude: -6.4445, // approx 8.5km from UBSI Margonda
      longitude: 106.8335,
      facilities: ['Kasur', 'Meja Belajar', 'Lemari', 'Parkir Motor', 'WiFi'],
      images: ['https://images.unsplash.com/photo-1554995207-c18c203602cb?auto=format&fit=crop&w=600&q=80']
    }
  ]

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

  console.log('✅ Sample kos alternatives seeded')
  console.log('')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
  console.log('📋 Akun tersedia:')
  console.log('  Super Admin: superadmin@kosrank.com / admin123')
  console.log('  Seller 1:    seller1@kosrank.com   / seller123')
  console.log('  Seller 2:    seller2@kosrank.com   / seller123')
  console.log('  User:        user@kosrank.com       / user123')
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1) })
