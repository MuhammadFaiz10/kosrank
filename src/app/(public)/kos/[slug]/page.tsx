import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import {
  MapPin, Ruler, Users, Star, Award, ArrowLeft, Check, Compass, Shield, Phone, HelpCircle
} from "lucide-react";
import Link from "next/link";
import { BuyBox } from "@/components/kos/BuyBox";

export default async function KosDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const kos = await prisma.kos.findUnique({
    where: { slug },
    include: { 
      facilities: { include: { facility: true } },
      images: true
    },
  });

  if (!kos) notFound();

  const genderLabel: Record<string, string> = {
    PUTRA: "Putra", PUTRI: "Putri", CAMPUR: "Campur",
  };

  const genderColor: Record<string, string> = {
    PUTRA: "bg-blue-50 text-blue-700 border-blue-200",
    PUTRI: "bg-pink-50 text-pink-700 border-pink-200",
    CAMPUR: "bg-purple-50 text-purple-700 border-purple-200",
  };

  const roomFacilities = kos.facilities.filter((f) => f.facility.type === "ROOM");
  const publicFacilities = kos.facilities.filter((f) => f.facility.type === "PUBLIC");

  // Score mapping to stars
  const scoreVal = kos.finalScore || 0.82;
  const starsCount = Math.round(scoreVal * 5);

  const imageUrl = kos.images && kos.images[0]?.url;

  return (
    <div className="max-w-[1500px] mx-auto px-4 sm:px-6 lg:px-8 py-6 font-sans text-[#0F1111] text-left">
      {/* ─── Breadcrumb ─── */}
      <div className="flex items-center gap-1.5 text-[13px] text-[#565959] mb-4">
        <Link href="/explore" className="hover:underline hover:text-[#007185]">
          Eksplor Kos
        </Link>
        <span>/</span>
        <span className="text-[#565959]">{kos.campus}</span>
        <span>/</span>
        <span className="font-bold text-[#0F1111] truncate max-w-[200px]">{kos.name}</span>
      </div>

      {/* Main 3-column Layout grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT COLUMN: Gallery (lg:col-span-4) */}
        <div className="lg:col-span-4 space-y-4">
          <div className="aspect-square bg-white border border-[#D5D9D9] rounded-lg overflow-hidden flex items-center justify-center p-2 relative">
            {imageUrl ? (
              <img 
                src={imageUrl} 
                alt={kos.name} 
                className="w-full h-full object-cover rounded" 
              />
            ) : (
              <div className="flex flex-col items-center gap-2 text-slate-300">
                <MapPin className="w-16 h-16" />
                <span className="text-xs">Foto Kos Tidak Tersedia</span>
              </div>
            )}
            
            {kos.ranking && (
              <div className="absolute top-3 left-3 bg-[#CC5500] text-white text-[12px] font-bold px-2.5 py-1 rounded shadow-sm">
                RANK #{kos.ranking}
              </div>
            )}
          </div>
          
          {/* Small images preview row */}
          <div className="grid grid-cols-4 gap-2">
            <div className="aspect-square bg-white border-2 border-[#007185] rounded cursor-pointer overflow-hidden p-0.5">
              {imageUrl ? (
                <img src={imageUrl} className="w-full h-full object-cover rounded" />
              ) : (
                <div className="w-full h-full bg-[#F0F2F2] flex items-center justify-center text-[10px] text-slate-400">Utama</div>
              )}
            </div>
            {[1, 2, 3].map((i) => (
              <div key={i} className="aspect-square bg-white border border-[#D5D9D9] rounded opacity-60 hover:opacity-100 cursor-pointer overflow-hidden flex items-center justify-center">
                <MapPin className="w-4 h-4 text-slate-300" />
              </div>
            ))}
          </div>
        </div>

        {/* MIDDLE COLUMN: Details & Description (lg:col-span-5) */}
        <div className="lg:col-span-5 space-y-5">
          <div>
            <h1 className="text-[20px] md:text-[22px] leading-tight font-bold text-[#0F1111] mb-1.5">
              {kos.name}
            </h1>
            
            {/* Campus Link */}
            <div className="text-[13px] text-[#007185] hover:underline font-semibold flex items-center gap-1 mb-2">
              <MapPin className="w-4 h-4 text-slate-500" />
              <span>Area Dekat {kos.campus}</span>
            </div>

            {/* Ratings & Score Info */}
            <div className="flex items-center gap-2 text-[13px] border-b border-[#F0F2F2] pb-3 mb-3">
              <span className="font-bold text-[#FF9900]">{scoreVal ? (scoreVal * 5).toFixed(1) : "4.0"}</span>
              <div className="flex items-center text-[#FF9900]">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-4 h-4 ${i < starsCount ? "fill-[#FF9900] text-[#FF9900]" : "text-slate-200"}`} 
                  />
                ))}
              </div>
              <span className="text-[#007185] hover:underline cursor-pointer">
                {kos.finalScore ? `(${(kos.finalScore * 100).toFixed(0)}% Kecocokan SAW)` : "N/A"}
              </span>
            </div>
          </div>

          {/* Details Overview list */}
          <div className="text-[13px] space-y-2 text-[#0F1111] border-b border-[#F0F2F2] pb-4">
            <div className="grid grid-cols-3">
              <span className="text-[#565959]">Tipe Kos</span>
              <span className="col-span-2 font-bold text-[#0F1111]">
                <span className={`px-2 py-0.5 rounded border text-[11px] font-semibold ${genderColor[kos.genderType]}`}>
                  {genderLabel[kos.genderType]}
                </span>
              </span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-[#565959]">Ukuran Kamar</span>
              <span className="col-span-2 font-semibold">{kos.roomSize}</span>
            </div>
            <div className="grid grid-cols-3">
              <span className="text-[#565959]">Alamat</span>
              <span className="col-span-2 text-slate-700">{kos.address}</span>
            </div>
          </div>

          {/* About this kos (Description) */}
          <div className="space-y-1.5 text-[13px]">
            <h4 className="font-bold text-[14px]">Tentang Kos Ini</h4>
            <p className="text-slate-700 leading-relaxed font-sans">{kos.description}</p>
          </div>

          {/* Facilities (Utilitarian layout) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-[#F0F2F2] pt-4">
            {roomFacilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-[13px] text-[#0F1111]">Fasilitas Kamar</h4>
                <ul className="space-y-1.5 text-[12px] text-slate-700">
                  {roomFacilities.map((f) => (
                    <li key={f.id} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#007185] mt-0.5 stroke-[3]" />
                      <span>{f.facility.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {publicFacilities.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-bold text-[13px] text-[#0F1111]">Fasilitas Bersama</h4>
                <ul className="space-y-1.5 text-[12px] text-slate-700">
                  {publicFacilities.map((f) => (
                    <li key={f.id} className="flex items-start gap-1.5">
                      <Check className="w-3.5 h-3.5 text-[#007185] mt-0.5 stroke-[3]" />
                      <span>{f.facility.name}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT COLUMN: Buy Box Sidebar (lg:col-span-3) */}
        <div className="lg:col-span-3 space-y-4">
          <BuyBox 
            kosId={kos.id}
            kosName={kos.name}
            price={kos.price}
            ownerId={kos.ownerId}
          />

          {/* SAW Score Details Card */}
          {kos.finalScore != null && (
            <div className="bg-[#F3FCFF] border border-[#007185]/30 rounded-lg p-4 font-sans text-left">
              <div className="flex items-center gap-1.5 text-[#007185] font-bold text-[13px] mb-2">
                <Award className="w-4 h-4 text-[#FF9900] fill-[#FF9900]" />
                <span>Analisis SAW Peringkat</span>
              </div>
              <div className="space-y-1">
                <div className="text-[20px] font-extrabold text-[#0F1111]">
                  {(kos.finalScore * 100).toFixed(2)}% Cocok
                </div>
                <div className="text-[12px] text-slate-600">
                  Ranking <span className="font-bold text-[#0F1111]">#{kos.ranking}</span> secara keseluruhan.
                </div>
              </div>
              <div className="mt-3 pt-3 border-t border-slate-200/60 text-[11px] text-slate-500 leading-relaxed">
                Skor kecocokan dihitung dari bobot kriteria Harga (30%), Jarak (20%), Fasilitas Kamar (15%), Fasilitas Umum (10%), dll.
              </div>
            </div>
          )}

          {/* Map placeholder */}
          <div className="bg-white border border-[#D5D9D9] rounded-lg p-4 font-sans text-left shadow-sm">
            <h4 className="font-bold text-[13px] text-[#0F1111] mb-2.5 flex items-center gap-1">
              <Compass className="w-4 h-4 text-[#007185]" />
              Peta Lokasi
            </h4>
            <div className="h-32 bg-[#F0F2F2] rounded border border-slate-200 flex flex-col items-center justify-center gap-1">
              <MapPin className="w-6 h-6 text-slate-400 animate-bounce" />
              <span className="text-[10px] text-slate-500">Latitude: {kos.latitude}</span>
              <span className="text-[10px] text-slate-500">Longitude: {kos.longitude}</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-2 leading-tight">
              {kos.address}
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}
