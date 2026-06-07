"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, MapPin, Search, Shield, Zap, Compass, Crosshair, HelpCircle, CheckCircle } from "lucide-react";
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
  { name: "BSI Margonda", lat: -6.3685, lng: 106.8335 },
];

export default function LandingPageInteractive({ initialKos, totalKos }: LandingPageInteractiveProps) {
  const [locationName, setLocationName] = useState("BSI Margonda");
  const [coordinates, setCoordinates] = useState<{ lat?: number; lng?: number }>({});
  const [recommendations, setRecommendations] = useState<KosItem[]>(initialKos);
  const [isLoading, setIsLoading] = useState(false);
  const [gpsActive, setGpsActive] = useState(false);
  const [showInfoModal, setShowInfoModal] = useState(false);

  // Fetch recommendations whenever coordinates change
  useEffect(() => {
    if (coordinates.lat === undefined || coordinates.lng === undefined) {
      // Default to initial seeded data (Margonda)
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

        // Get location name via Nominatim reverse-geocoding
        try {
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=16`
          );
          const data = await res.json();
          if (data && data.display_name) {
            // Simplify address name to neighborhood/city
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
    <div className="flex flex-col">
      {/* ─── Hero Section ─── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 text-white border-b border-white/5 py-24 sm:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(59,130,246,0.15),transparent_70%)] pointer-events-none" />
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
          
          {/* SAW Tag */}
          <div 
            onClick={() => setShowInfoModal(true)}
            className="inline-flex items-center gap-2 text-xs font-semibold bg-white/5 hover:bg-white/10 transition-colors cursor-pointer backdrop-blur-md px-4 py-2 rounded-full mb-8 border border-white/10"
          >
            <Zap className="w-3.5 h-3.5 text-yellow-400 animate-pulse" />
            <span>Rekomendasi Cerdas SAW</span>
            <HelpCircle className="w-3.5 h-3.5 text-white/50 ml-1" />
          </div>

          {/* Dynamic Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight mb-6 leading-tight max-w-4xl">
            Temukan Kos Terbaik di Dekat <br className="hidden sm:inline" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-300 to-emerald-400">
              {locationName}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed">
            Sistem kami membandingkan kos secara real-time berdasarkan harga, fasilitas, ukuran kamar, dan jarak dari posisi Anda secara objektif.
          </p>

          {/* Location Interactive Controls */}
          <div className="w-full max-w-2xl bg-slate-900/60 backdrop-blur-xl border border-white/10 p-5 sm:p-6 rounded-2xl sm:rounded-3xl shadow-2xl space-y-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-left">
              Pilih Lokasi Acuan Rekomendasi:
            </p>
            
            <div className="flex flex-col sm:flex-row gap-3">
              {/* BSI Margonda (Default) */}
              <button
                onClick={() => handleSelectPreset({ name: "BSI Margonda", lat: -6.3685, lng: 106.8335 })}
                className={`px-5 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border flex-1 cursor-pointer ${
                  !gpsActive
                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/25"
                    : "bg-slate-800/40 border-white/5 hover:bg-slate-800/80 text-slate-300"
                }`}
              >
                <MapPin className="w-4 h-4 text-white" />
                <span>BSI Margonda (Default)</span>
              </button>

              {/* GPS Button */}
              <button
                onClick={handleUseGPS}
                className={`px-5 py-3.5 rounded-xl text-sm font-semibold transition-all flex items-center justify-center gap-2 border flex-1 cursor-pointer ${
                  gpsActive
                    ? "bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-600/20"
                    : "bg-slate-800/40 border-white/5 hover:bg-slate-800/80 text-slate-300"
                }`}
              >
                <Compass className={`w-4 h-4 ${isLoading && gpsActive ? "animate-spin" : ""}`} />
                {gpsActive ? "📍 GPS Terdeteksi" : "Gunakan Lokasi GPS Saya"}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ─── Top Recommendations Section ─── */}
      <section id="recommendations" className="py-16 bg-slate-50 border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
            <div>
              <p className="text-xs font-bold text-primary mb-1.5 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="w-3.5 h-3.5 fill-primary" />
                Rekomendasi Teratas
              </p>
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
                Pilihan Kos untuk Anda di {locationName}
              </h2>
              <p className="text-slate-500 mt-1 text-sm">
                Diurutkan secara cerdas berdasarkan kecocokan atribut terbaik.
              </p>
            </div>
            
            <Link href="/explore">
              <Button variant="outline" className="rounded-xl border-slate-200 hover:border-slate-300 text-slate-700 bg-white">
                Lihat Semua Kos <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
          </div>

          {/* Loading States & Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm animate-pulse h-[360px]" />
              ))}
            </div>
          ) : recommendations.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
                    ranking: idx + 1
                  }}
                  distanceMeters={item.distanceMeters}
                  dynamicScore={item.score}
                  dynamicRank={idx + 1}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white rounded-2xl border border-slate-200 shadow-sm text-slate-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 opacity-30 text-slate-400" />
              <p className="font-medium">Belum ada kos terdaftar di dekat lokasi ini.</p>
              <p className="text-xs text-slate-400 mt-1">Coba gunakan preset lokasi lain atau hubungi admin.</p>
            </div>
          )}
        </div>
      </section>

      {/* ─── Core Features ─── */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Mengapa Menggunakan Rekomendasi Lokasi?</h2>
            <p className="text-slate-500 mt-2 max-w-xl mx-auto text-sm">Sistem pendukung keputusan kami menghitung jarak presisi secara real-time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Crosshair, title: "Deteksi GPS Akurat", desc: "Jarak kos dihitung tepat dari posisi GPS Anda saat ini." },
              { icon: Zap, title: "Simple Additive Weighting", desc: "Mengkombinasikan seluruh atribut penting untuk menyaring kos terbaik." },
              { icon: Shield, title: "Keputusan Objektif", desc: "Menghindari bias iklan berbayar dengan memprioritaskan kos yang benar-benar pas." },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-slate-200 hover:border-slate-300 hover:shadow-md transition-all">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── SAW Criteria Info Modal ─── */}
      {showInfoModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-slate-100 relative">
            <h3 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500 fill-yellow-500" />
              Sistem Rekomendasi Cerdas SAW
            </h3>
            <p className="text-sm text-slate-600 mb-6 leading-relaxed">
              Website ini menentukan rekomendasi kos menggunakan metode **Simple Additive Weighting (SAW)**. Rekomendasi dihitung secara objektif berdasarkan bobot kriteria berikut:
            </p>

            {/* Criteria Progress */}
            <div className="space-y-4 mb-6">
              {[
                { name: "C1 Harga (Cost)", weight: 30, desc: "Harga sewa per bulan" },
                { name: "C2 Jarak (Cost)", weight: 20, desc: "Jarak terdekat ke lokasi acuan" },
                { name: "C3 Ukuran Ruangan (Benefit)", weight: 15, desc: "Lebar ruangan kamar tidur" },
                { name: "C4 Fasilitas Kamar (Benefit)", weight: 15, desc: "AC, meja, lemari, kasur, kursi" },
                { name: "C5 Fasilitas Kos (Benefit)", weight: 10, desc: "WiFi, dapur, parkir, CCTV, penjaga" },
                { name: "C6 Akses Transportasi (Benefit)", weight: 10, desc: "Kemudahan angkutan umum/ojek" },
              ].map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs font-semibold text-slate-700">
                    <span>{c.name}</span>
                    <span>{c.weight}%</span>
                  </div>
                  <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                    <div className="h-full bg-primary rounded-full" style={{ width: `${c.weight}%` }} />
                  </div>
                  <p className="text-[11px] text-slate-400">{c.desc}</p>
                </div>
              ))}
            </div>

            <div className="flex justify-end pt-2 border-t border-slate-100">
              <Button onClick={() => setShowInfoModal(false)} className="rounded-xl">
                Saya Mengerti
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
