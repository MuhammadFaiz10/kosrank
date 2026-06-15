"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Search, Shield, Zap, Compass, Crosshair, HelpCircle, CheckCircle, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { KosCard } from "@/components/cards/KosCard";

interface KosItem {
  id: string;
  name: string;
  slug: string;
  price: number;
  roomSize: string;
  address: string;
  genderType: string;
  campus: string;
  transit: string;
  latitude: number;
  longitude: number;
  score: number;
  distanceMeters: number;
  image?: string | null;
}

interface LandingPageInteractiveProps {
  initialKos: KosItem[];
  totalKos: number;
}

const PRESET_LOCATIONS = [
  { name: "UBSI Margonda", lat: -6.3685, lng: 106.8335 },
];

export default function LandingPageInteractive({ initialKos, totalKos }: LandingPageInteractiveProps) {
  const [locationName, setLocationName] = useState("UBSI Margonda");
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({});
  const [recommendations, setRecommendations] = useState<KosItem[]>(initialKos);
  const [isLoading, setIsLoading] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Automatically trigger location detection on mount
  useEffect(() => {
    if (typeof window !== "undefined" && navigator.geolocation) {
      setIsLoading(true);
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          setCoordinates({ lat: latitude, lng: longitude });
          setGpsActive(true);

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`
            );
            const data = await res.json();
            if (data && data.display_name) {
              const address = data.address;
              const sub = address.suburb || address.village || address.neighborhood || address.city_district || "Lokasi Anda";
              setLocationName(sub);
            } else {
              setLocationName("Lokasi Anda (GPS)");
            }
          } catch (e) {
            setLocationName("Lokasi Anda (GPS)");
          } finally {
            setIsLoading(false);
          }
        },
        (error) => {
          console.warn("Geolocation automatically declined or failed:", error);
          setIsLoading(false);
          // Graceful fallback to initialKos (UBSI Margonda)
        }
      );
    }
  }, [initialKos]);

  // Fetch recommendations whenever coordinates change
  useEffect(() => {
    if (coordinates.lat === undefined || coordinates.lng === undefined) {
      setRecommendations(initialKos);
      return;
    }

    const fetchRecommendations = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`/api/kos/recommendations?lat=${coordinates.lat}&lng=${coordinates.lng}`);
        const result = await res.json();
        if (result.success && result.data) {
          setRecommendations(result.data);
        }
      } catch (err) {
        console.error("Failed to load recommendations", err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRecommendations();
  }, [coordinates, initialKos]);

  // Geolocation trigger
  const handleUseGPS = () => {
    if (!navigator.geolocation) {
      alert("Browser Anda tidak mendukung layanan lokasi GPS.");
      return;
    }

    setIsLoading(true);
    setGpsActive(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        setCoordinates({ lat: latitude, lng: longitude });

        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`
          );
          const data = await res.json();
          if (data && data.display_name) {
            const address = data.address;
            const sub = address.suburb || address.village || address.neighborhood || address.city_district || "Lokasi Anda";
            setLocationName(sub);
          } else {
            setLocationName("Lokasi Anda (GPS)");
          }
        } catch (e) {
          setLocationName("Lokasi Anda (GPS)");
        }
      },
      (error) => {
        console.error("Geolocation error:", error);
        alert("Gagal mendeteksi lokasi GPS Anda. Silakan pilih lokasi manual.");
        setGpsActive(false);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  // Preset location select
  const handleSelectPreset = (preset: typeof PRESET_LOCATIONS[0]) => {
    setGpsActive(false);
    setLocationName(preset.name);
    setCoordinates({ lat: preset.lat, lng: preset.lng });
  };

  return (
    <div className="flex flex-col font-sans text-[#0F1111] bg-white">
      {/* ─── Hero Section (High-Density, Utilitarian Surface Background) ─── */}
      <section className="bg-[#F0F2F2] border-b border-[#D5D9D9] py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-[1500px] mx-auto flex flex-col md:flex-row items-start justify-between gap-6">
          
          {/* Hero text & headline */}
          <div className="flex-1 text-left space-y-3">
            <div 
              onClick={() => setShowInfoModal(true)}
              className="inline-flex items-center gap-1.5 text-[12px] font-bold text-[#007185] hover:text-[#004B57] hover:underline cursor-pointer bg-white px-2.5 py-1 rounded border border-[#D5D9D9] shadow-sm"
            >
              <Zap className="w-3.5 h-3.5 text-[#FF9900] fill-[#FF9900]" />
              <span>Sistem Pendukung Keputusan SAW (Bobot Kriteria)</span>
              <HelpCircle className="w-3.5 h-3.5 text-slate-400" />
            </div>

            {/* Page Title: Source Sans 3 28px/36px, weight 700 */}
            <h1 className="text-[28px] leading-[36px] font-bold text-[#0F1111] tracking-tight">
              Temukan Kos Terbaik di Dekat <span className="text-[#007185] underline">{locationName}</span>
            </h1>

            {/* Body Small: Source Sans 3 13px/18px */}
            <p className="text-[13px] leading-[18px] text-[#565959] max-w-xl">
              Sistem rekomendasi KosRank membandingkan alternatif kos secara real-time berdasarkan kriteria harga, fasilitas, ukuran kamar, dan jarak kampus menggunakan metode Simple Additive Weighting (SAW).
            </p>
          </div>

          {/* Location Interactive Selector (styled as Amazon filter chips) */}
          <div className="w-full md:w-auto bg-white border border-[#D5D9D9] p-4 rounded-lg shadow-sm flex flex-col gap-2.5 flex-shrink-0 md:min-w-[340px]">
            <span className="text-[12px] font-bold text-[#565959] uppercase tracking-wider block">
              Pilih Titik Acuan Rekomendasi:
            </span>
            
            <div className="flex flex-col gap-2">
              {/* Preset Chip */}
              <button
                onClick={() => handleSelectPreset({ name: "UBSI Margonda", lat: -6.3685, lng: 106.8335 })}
                className={`w-full flex items-center justify-between text-left p-2.5 rounded border text-[13px] transition-all cursor-pointer ${
                  !gpsActive
                    ? "border-[#007185] bg-[#F3FCFF] text-[#007185] font-semibold"
                    : "border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#F7FAFA]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-[#FF9900]" />
                  <span>UBSI Margonda (Default)</span>
                </div>
                {!gpsActive && <span className="text-[10px] text-[#007185] font-bold">Aktif</span>}
              </button>

              {/* GPS Chip */}
              <button
                onClick={handleUseGPS}
                className={`w-full flex items-center justify-between text-left p-2.5 rounded border text-[13px] transition-all cursor-pointer ${
                  gpsActive
                    ? "border-[#007185] bg-[#F3FCFF] text-[#007185] font-semibold"
                    : "border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#F7FAFA]"
                }`}
              >
                <div className="flex items-center gap-2">
                  <Compass className={`w-4 h-4 text-[#FF9900] ${isLoading && gpsActive ? "animate-spin" : ""}`} />
                  <span>Gunakan Lokasi GPS Saya</span>
                </div>
                {gpsActive && <span className="text-[10px] text-[#007185] font-bold">Aktif</span>}
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* ─── Top Recommendations Section (Utilitarian Grid) ─── */}
      <section id="recommendations" className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1500px] mx-auto w-full">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 gap-4 border-b border-[#D5D9D9] pb-4">
          <div>
            <div className="flex items-center gap-1.5 text-[12px] font-bold text-[#CC5500] uppercase tracking-wider">
              <Zap className="w-4 h-4 fill-[#FF9900] text-[#FF9900]" />
              Rekomendasi Teratas
            </div>
            {/* Section Title: Source Sans 3 21px/28px, weight 700 */}
            <h2 className="text-[21px] leading-[28px] font-bold text-[#0F1111] tracking-tight mt-1">
              Hasil Rekomendasi SAW di {locationName}
            </h2>
            <p className="text-[13px] text-[#565959] mt-0.5">
              Diurutkan secara objektif berdasarkan skor kecocokan tertinggi.
            </p>
          </div>
          
          <Link href="/explore">
            {/* Outlined Amazon Button */}
            <button className="bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] text-[#0F1111] rounded text-[13px] h-9 px-4 shadow-sm inline-flex items-center gap-1 cursor-pointer font-sans">
              Lihat Semua Kos ({totalKos}) <ArrowRight className="w-4 h-4 text-[#565959]" />
            </button>
          </Link>
        </div>

        {/* Loading States & Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-lg border border-[#D5D9D9] p-4 animate-pulse h-[360px]" />
            ))}
          </div>
        ) : recommendations.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4">
            {recommendations.slice(0, 3).map((item, idx) => (
              <KosCard 
                key={item.id} 
                kos={{
                  id: item.id,
                  name: item.name,
                  slug: item.slug,
                  price: item.price,
                  roomSize: item.roomSize,
                  address: item.address,
                  genderType: item.genderType,
                  campus: item.campus,
                  finalScore: item.score,
                  ranking: idx + 1,
                  image: item.image
                }}
                distanceMeters={item.distanceMeters}
                dynamicScore={item.score}
                dynamicRank={idx + 1}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-[#F0F2F2] rounded-lg border border-[#D5D9D9] text-slate-500">
            <MapPin className="w-12 h-12 mx-auto mb-3 opacity-30 text-slate-400" />
            <p className="font-bold text-[14px]">Belum ada kos terdaftar di dekat lokasi ini.</p>
            <p className="text-xs text-[#565959] mt-1">Coba gunakan preset lokasi lain atau hubungi admin.</p>
          </div>
        )}
      </section>

      {/* ─── Informative Features Section ─── */}
      <section className="py-8 px-4 sm:px-6 lg:px-8 max-w-[1500px] mx-auto w-full border-t border-[#D5D9D9] mt-4 mb-8">
        <div className="text-left mb-6">
          <h2 className="text-[21px] font-bold text-[#0F1111]">Metodologi Pendukung Keputusan</h2>
          <p className="text-[13px] text-[#565959] mt-0.5">Bagaimana KosRank menghitung rekomendasi tempat tinggal Anda secara adil</p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            { icon: Crosshair, title: "Jarak GPS Real-time", desc: "Sistem mengukur koordinat lintang/bujur Anda ke kos secara presisi (Cost)." },
            { icon: Zap, title: "Simple Additive Weighting", desc: "Membagi bobot kriteria benefit dan cost untuk mendapatkan nilai alternatif total." },
            { icon: Shield, title: "Skor Objektif Transparan", desc: "Rekomendasi murni berdasarkan kecocokan data fasilitas dan harga, bebas sponsor bias." },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="p-4 rounded-lg border border-[#D5D9D9] bg-white hover:shadow-sm transition-all text-left">
              <div className="w-10 h-10 bg-[#F0F2F2] rounded flex items-center justify-center mb-3">
                <Icon className="w-5 h-5 text-[#007185]" />
              </div>
              <h3 className="font-bold text-[14px] text-[#0F1111] mb-1">{title}</h3>
              <p className="text-[13px] text-[#565959] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── SAW Criteria Info Modal (Level 2 Elevation Shadow) ─── */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-[#0F1111]/50 flex items-center justify-center p-4 backdrop-blur-[1px]">
          <div className="bg-white rounded-lg max-w-md w-full p-5 shadow-[0_0_6px_rgba(15,17,17,0.15)] border border-[#D5D9D9] relative text-left">
            <button 
              onClick={() => setShowInfoModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <h3 className="text-[18px] font-bold text-[#0F1111] mb-3.5 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#FF9900] fill-[#FF9900]" />
              Pembobotan Kriteria SAW
            </h3>
            <p className="text-[13px] text-[#565959] mb-4">
              Website ini menyusun peringkat kos menggunakan metode **Simple Additive Weighting (SAW)**. Perhitungan didasarkan pada bobot kriteria resmi berikut:
            </p>

            {/* Criteria Progress */}
            <div className="space-y-3 mb-5">
              {[
                { name: "C1 Harga Sewa (Cost)", weight: 30, desc: "Harga sewa bulanan kos" },
                { name: "C2 Jarak ke Kampus (Cost)", weight: 20, desc: "Jarak terdekat ke titik acuan" },
                { name: "C3 Ukuran Kamar (Benefit)", weight: 15, desc: "Dimensi luas kamar tidur" },
                { name: "C4 Fasilitas Kamar (Benefit)", weight: 15, desc: "Jumlah fasilitas kamar tidur" },
                { name: "C5 Fasilitas Umum (Benefit)", weight: 10, desc: "Fasilitas penunjang bersama" },
                { name: "C6 Akses Transportasi (Benefit)", weight: 10, desc: "Kemudahan angkutan & transit" },
              ].map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-[12px] font-bold text-[#0F1111]">
                    <span>{c.name}</span>
                    <span>{c.weight}%</span>
                  </div>
                  <div className="h-2 bg-[#F0F2F2] rounded overflow-hidden">
                    <div className="h-full bg-[#FF9900] rounded" style={{ width: `${c.weight}%` }} />
                  </div>
                  <p className="text-[11px] text-[#565959]">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-3 border-t border-[#D5D9D9]">
              {/* Gold Add to Cart style button */}
              <button 
                onClick={() => setShowInfoModal(false)}
                className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#F7CA00] rounded text-[13px] font-normal h-8 px-4 shadow-sm cursor-pointer"
              >
                Saya Mengerti
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
