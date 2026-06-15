import Link from "next/link";
import { MapPin, Ruler, Star, Check } from "lucide-react";

interface KosCardProps {
  kos: {
    id: string;
    name: string;
    slug: string;
    price: number;
    roomSize: string;
    address: string;
    genderType: string;
    campus: string;
    finalScore?: number | null;
    ranking?: number | null;
    image?: string | null;
    images?: { url: string }[];
  };
  distanceMeters?: number;
  dynamicScore?: number;
  dynamicRank?: number;
}

export function KosCard({ kos, distanceMeters, dynamicScore, dynamicRank }: KosCardProps) {
  const genderLabel: Record<string, string> = {
    PUTRA: "Putra",
    PUTRI: "Putri",
    CAMPUR: "Campur",
  };

  const genderColor: Record<string, string> = {
    PUTRA: "bg-blue-50 text-blue-700 border-blue-200",
    PUTRI: "bg-pink-50 text-pink-700 border-pink-200",
    CAMPUR: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const imageUrl = kos.image || (kos.images && kos.images[0]?.url);
  const displayRank = dynamicRank || kos.ranking;
  const displayScore = dynamicScore || kos.finalScore;

  // Map score to stars (5 stars max)
  const scoreVal = displayScore || 0.8; // default fallback
  const starsCount = Math.round(scoreVal * 5);

  return (
    <Link href={`/kos/${kos.slug}`} className="block h-full">
      <div className="group bg-white rounded-lg border border-[#D5D9D9] hover:shadow-[0_2px_5px_rgba(15,17,17,0.08)] transition-all duration-200 p-3 h-full flex flex-col justify-between text-left">
        {/* Image Container (centered, white background, square aspect ratio) */}
        <div className="aspect-square w-full bg-white flex items-center justify-center overflow-hidden border border-[#F0F2F2] rounded-md relative mb-3">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={kos.name} 
              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.02]" 
            />
          ) : (
            <div className="flex flex-col items-center gap-2 text-slate-300">
              <MapPin className="w-12 h-12" />
              <span className="text-xs">Foto Kos</span>
            </div>
          )}
          
          {displayRank && (
            <div className="absolute top-2 left-2 bg-[#CC5500] text-white text-[11px] font-bold px-2 py-0.5 rounded shadow-sm">
              RANK #{displayRank}
            </div>
          )}

          {/* Gender Badge */}
          <span className={`absolute bottom-2 right-2 text-[11px] px-2 py-0.5 rounded border font-semibold ${genderColor[kos.genderType]}`}>
            {genderLabel[kos.genderType]}
          </span>
        </div>

        {/* Content Area */}
        <div className="flex-grow flex flex-col justify-between">
          <div className="space-y-1">
            {/* Title (max 3 lines, normal weight, 18px font-sans) */}
            <h3 className="font-sans text-[15px] md:text-[16px] leading-[20px] text-[#0F1111] hover:text-[#007185] line-clamp-3 mb-1 font-normal">
              {kos.name}
            </h3>

            {/* Stars Rating and Score info */}
            <div className="flex items-center gap-1.5 text-xs">
              <div className="flex items-center text-[#FF9900]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-3.5 h-3.5 ${i < starsCount ? "fill-[#FF9900] text-[#FF9900]" : "text-slate-200"}`} 
                  />
                ))}
              </div>
              <span className="text-[#007185] font-semibold hover:underline cursor-pointer">
                {scoreVal ? `${(scoreVal * 100).toFixed(0)}% Cocok` : "N/A"}
              </span>
            </div>

            {/* Campus / Location Details */}
            <div className="text-[13px] text-[#565959] space-y-0.5 pt-1">
              <div className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <span className="truncate">{kos.campus}</span>
              </div>
              {distanceMeters !== undefined && (
                <div className="text-[12px] font-semibold text-[#067D62]">
                  Jarak: {distanceMeters >= 1000 
                    ? `${(distanceMeters / 1000).toFixed(1)} km` 
                    : `${distanceMeters} m`} dari kampus
                </div>
              )}
              <div className="text-[12px] text-[#565959]">
                Ukuran Kamar: {kos.roomSize}
              </div>
            </div>
          </div>

          <div className="pt-3 mt-2 border-t border-[#F0F2F2]">
            {/* Price (21px font-bold, text-primary/near-black) */}
            <div className="flex items-baseline gap-0.5 text-[#0F1111] mb-1">
              <span className="text-[13px] font-normal align-super">Rp</span>
              <span className="text-[21px] font-bold leading-none">
                {kos.price.toLocaleString("id-ID")}
              </span>
              <span className="text-[12px] text-[#565959] font-normal ml-0.5">/bulan</span>
            </div>

            {/* Verified "Prime-style" badge */}
            <div className="flex items-center gap-1 mb-2">
              <div className="bg-[#007185] text-white p-0.5 rounded-full flex items-center justify-center w-3.5 h-3.5">
                <Check className="w-2.5 h-2.5 stroke-[3]" />
              </div>
              <span className="text-[12px] font-bold text-[#007185]">SAW Teratas</span>
            </div>

            {/* Delivery/Survey availability in Text Primary */}
            <div className="text-[13px] text-[#0F1111]">
              Survei: <span className="font-semibold text-[#067D62]">Bisa Hari Ini</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
