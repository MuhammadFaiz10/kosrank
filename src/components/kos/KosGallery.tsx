"use client";

import { useState } from "react";
import { MapPin } from "lucide-react";

interface KosGalleryProps {
  images: string[];
  name: string;
  rank?: number | null;
}

export function KosGallery({ images, name, rank }: KosGalleryProps) {
  const [active, setActive] = useState(0);
  const main = images[active];

  return (
    <div className="space-y-4">
      <div className="aspect-square bg-white border border-line rounded-2xl overflow-hidden flex items-center justify-center p-2 relative">
        {main ? (
          <img src={main} alt={name} className="w-full h-full object-cover rounded-xl" />
        ) : (
          <div className="flex flex-col items-center gap-2 text-ink-500/40">
            <MapPin className="w-16 h-16" />
            <span className="text-xs">Foto Kos Tidak Tersedia</span>
          </div>
        )}

        {rank && (
          <div className="absolute top-3 left-3 bg-badge-blue text-white text-[12px] font-bold px-2.5 py-1 rounded-full">
            RANK #{rank}
          </div>
        )}
      </div>

      {images.length > 1 && (
        <div className="grid grid-cols-4 gap-2">
          {images.slice(0, 4).map((url, i) => (
            <button
              key={url}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`Lihat foto ${i + 1} dari ${name}`}
              className={`aspect-square bg-white rounded-lg cursor-pointer overflow-hidden p-0.5 transition-all ${
                i === active ? "border-2 border-brand-600" : "border border-line opacity-60 hover:opacity-100"
              }`}
            >
              <img src={url} alt={`${name} foto ${i + 1}`} className="w-full h-full object-cover rounded-md" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
