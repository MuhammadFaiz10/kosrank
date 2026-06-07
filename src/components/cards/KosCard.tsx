import Link from "next/link";
import { MapPin, Ruler, Star, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
    PUTRA: "bg-blue-100 text-blue-700",
    PUTRI: "bg-pink-100 text-pink-700",
    CAMPUR: "bg-purple-100 text-purple-700",
  };

  const imageUrl = kos.image || (kos.images && kos.images[0]?.url);
  const displayRank = dynamicRank || kos.ranking;
  const displayScore = dynamicScore || kos.finalScore;

  return (
    <Link href={`/kos/${kos.slug}`}>
      <div className="group bg-white rounded-2xl border border-border hover:border-primary/40 hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer h-full flex flex-col justify-between">
        {/* Image */}
        <div className="h-44 bg-gradient-to-br from-primary/10 to-accent/10 relative flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img 
              src={imageUrl} 
              alt={kos.name} 
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
            />
          ) : (
            <MapPin className="w-10 h-10 text-primary/30" />
          )}
          
          {displayRank && (
            <div className="absolute top-3 left-3 bg-primary text-white text-xs font-bold px-2.5 py-1 rounded-full shadow-md">
              #{displayRank}
            </div>
          )}
          {displayScore && (
            <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-sm text-xs font-semibold px-2.5 py-1 rounded-full text-primary flex items-center gap-1 shadow-md border border-primary/10">
              <Star className="w-3 h-3 fill-primary" />
              {(displayScore * 100).toFixed(0)}%
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-2 mb-2">
            <h3 className="font-semibold text-sm leading-tight group-hover:text-primary transition-colors line-clamp-2">
              {kos.name}
            </h3>
            <span className={`text-xs px-2 py-0.5 rounded-full font-medium whitespace-nowrap ${genderColor[kos.genderType]}`}>
              {genderLabel[kos.genderType]}
            </span>
          </div>

          <div className="flex items-center gap-1 text-xs text-muted-foreground mb-3 justify-between">
            <div className="flex items-center gap-1 min-w-0">
              <MapPin className="w-3 h-3 flex-shrink-0" />
              <span className="truncate">{kos.campus}</span>
            </div>
            {distanceMeters !== undefined && (
              <span className="text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                {distanceMeters >= 1000 
                  ? `${(distanceMeters / 1000).toFixed(1)} km` 
                  : `${distanceMeters} m`}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
            <span className="flex items-center gap-1">
              <Ruler className="w-3 h-3" />
              {kos.roomSize}
            </span>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-border">
            <div>
              <span className="font-bold text-foreground">
                Rp {kos.price.toLocaleString("id-ID")}
              </span>
              <span className="text-xs text-muted-foreground">/bulan</span>
            </div>
            <span className="text-xs text-primary font-medium">Lihat Detail →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
