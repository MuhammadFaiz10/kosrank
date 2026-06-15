import "dotenv/config";
import { calculateAndUpdateSAW } from "../src/features/saw/engine";
import { prisma } from "../src/lib/prisma";

async function main() {
  console.log("⚙️ Updating SAW scores & rankings in database for all 66 alternatives...");
  const results = await calculateAndUpdateSAW();
  console.log(`✅ Success! Updated ${results.length} listings in database.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
