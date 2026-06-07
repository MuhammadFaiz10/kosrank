import { NextRequest, NextResponse } from "next/server";
import { calculateDynamicSAW } from "@/features/saw/engine";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get("lat");
    const lngStr = searchParams.get("lng");

    let lat: number | undefined = undefined;
    let lng: number | undefined = undefined;

    if (latStr && lngStr) {
      lat = parseFloat(latStr);
      lng = parseFloat(lngStr);
    }

    if (lat !== undefined && isNaN(lat)) lat = undefined;
    if (lng !== undefined && isNaN(lng)) lng = undefined;

    // Run SAW calculations dynamically based on coordinates
    const recommendations = await calculateDynamicSAW(lat, lng);

    // Map output to simplify structure
    const data = recommendations.map((item) => ({
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

    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    console.error("Error in dynamic recommendations API:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
