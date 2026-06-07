import { prisma } from "@/lib/prisma";
import { calculateDynamicSAW } from "@/features/saw/engine";
import LandingPageInteractive from "@/components/layout/LandingPageInteractive";

export default async function HomePage() {
  const recommendations = await calculateDynamicSAW();
  const totalKos = await prisma.kos.count();

  // Format recommendations to the expected structure
  const formattedKos = recommendations.map((item) => ({
    id: item.kos.id,
    name: item.kos.name,
    slug: item.kos.slug,
    price: item.kos.price,
    roomSize: item.kos.roomSize,
    address: item.kos.address,
    campus: item.kos.campus,
    genderType: item.kos.genderType,
    transit: item.kos.transit,
    latitude: item.kos.latitude,
    longitude: item.kos.longitude,
    score: item.score,
    distanceMeters: item.distanceMeters,
    image: item.kos.images[0]?.url || null,
  }));

  return <LandingPageInteractive initialKos={formattedKos} totalKos={totalKos} />;
}

