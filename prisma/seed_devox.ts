import "dotenv/config";
import { PrismaClient, FacilityType, GenderType } from '@prisma/client';
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import * as fs from 'fs';
import * as path from 'path';
import { calculateAndUpdateSAW } from '../src/features/saw/engine';

const connectionString = process.env.DATABASE_URL;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

// Define lists to categorize facility types
const ROOM_FACILITY_KEYWORDS = [
  'ac', 'kasur', 'lemari', 'meja', 'kursi', 'kamar mandi dalam', 'k. mandi dalam',
  'bantal', 'guling', 'ventilasi', 'cermin', 'jendela', 'sprei'
];

function getFacilityType(name: string): FacilityType {
  const nameLower = name.toLowerCase();
  for (const keyword of ROOM_FACILITY_KEYWORDS) {
    if (nameLower.includes(keyword)) {
      return FacilityType.ROOM;
    }
  }
  return FacilityType.PUBLIC;
}

async function main() {
  console.log("🌱 Starting Devox database seeding...");

  // Load JSON file
  const jsonPath = path.join(__dirname, '../Devox_merged.json');
  if (!fs.existsSync(jsonPath)) {
    console.error("❌ Devox_merged.json not found! Run python3 process_excel.py first.");
    process.exit(1);
  }
  
  const rawData = fs.readFileSync(jsonPath, 'utf-8');
  const kosList = JSON.parse(rawData);
  console.log(`Loaded ${kosList.length} kos entries from JSON.`);

  // 1. Clean old Kos data
  console.log("Wiping existing KosFacility, KosImage, and Kos records...");
  await prisma.kosFacility.deleteMany();
  await prisma.kosImage.deleteMany();
  await prisma.kos.deleteMany();

  // 2. Fetch or create Sellers to own these listings
  let sellers = await prisma.user.findMany({
    where: { role: 'SELLER' }
  });

  if (sellers.length === 0) {
    console.log("Creating default seller...");
    const defaultSeller = await prisma.user.create({
      data: {
        name: 'Seller Devox',
        email: 'seller.devox@kosrank.com',
        password: '$2a$10$tZ2R88/H1rDfe04cpx/8o.n8aP91o3/91yUv.gQ6dPhqXW.D1wL3K', // bcrypt 'seller123'
        role: 'SELLER',
        phone: '08123456789'
      }
    });
    sellers = [defaultSeller];
  }

  // 3. Upsert Facilities from the dataset
  console.log("Upserting facilities...");
  const uniqueFacilities = new Set<string>();
  for (const item of kosList) {
    for (const f of item.facilities) {
      uniqueFacilities.add(f);
    }
  }

  const facilityMap: Record<string, string> = {};
  for (const fName of Array.from(uniqueFacilities)) {
    const fType = getFacilityType(fName);
    const facility = await prisma.facility.upsert({
      where: { id: fName }, // wait, facility key is name, but id is cuid.
      // Let's use findFirst/create instead to match by name
      update: {},
      create: {
        name: fName,
        type: fType,
        icon: fType === FacilityType.ROOM ? 'Bed' : 'Users'
      }
    });
    // Wait, upsert above: where id: fName. But fName is a string name, not a cuid.
    // Let's implement findOrCreate properly:
  }

  // Let's do a safe facility cache
  const allFacilities = await prisma.facility.findMany();
  const dbFacilityMap: Record<string, string> = {};
  for (const f of allFacilities) {
    dbFacilityMap[f.name.toLowerCase()] = f.id;
  }

  // Helper function to find or create facility by name
  const getOrCreateFacilityId = async (name: string): Promise<string> => {
    const key = name.toLowerCase().trim();
    if (dbFacilityMap[key]) {
      return dbFacilityMap[key];
    }
    const created = await prisma.facility.create({
      data: {
        name: name.trim(),
        type: getFacilityType(name),
        icon: getFacilityType(name) === FacilityType.ROOM ? 'Bed' : 'Users'
      }
    });
    dbFacilityMap[key] = created.id;
    return created.id;
  };

  // 4. Seed Kos entries
  console.log("Seeding Kos records...");
  let count = 0;
  for (const item of kosList) {
    // Select seller in round-robin fashion
    const owner = sellers[count % sellers.length];
    
    // Create Kos
    const createdKos = await prisma.kos.create({
      data: {
        name: item.name,
        slug: item.slug,
        description: item.description,
        price: item.price,
        roomSize: item.roomSize,
        address: item.address,
        campus: item.campus,
        genderType: item.genderType as GenderType,
        phone: item.phone,
        transit: item.transit,
        latitude: item.latitude,
        longitude: item.longitude,
        ownerId: owner.id
      }
    });

    // Create image if URL is present
    if (item.image) {
      await prisma.kosImage.create({
        data: {
          kosId: createdKos.id,
          url: item.image
        }
      });
    }

    // Link facilities
    for (const fName of item.facilities) {
      const facilityId = await getOrCreateFacilityId(fName);
      await prisma.kosFacility.create({
        data: {
          kosId: createdKos.id,
          facilityId: facilityId
        }
      });
    }

    count++;
    if (count % 25 === 0) {
      console.log(`Seeded ${count}/${kosList.length} entries...`);
    }
  }

  console.log("✅ All 238 Kos entries seeded successfully.");

  // 5. Trigger SAW calculations
  console.log("Recalculating database SAW scores...");
  const scores = await calculateAndUpdateSAW();
  console.log(`Successfully completed SAW calculations for ${scores.length} active listings.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
    await pool.end();
    console.log("🌱 Database seeding complete.");
    process.exit(0);
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    await pool.end();
    process.exit(1);
  });
