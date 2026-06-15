"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { SlidersHorizontal, RotateCcw } from "lucide-react";

interface FilterSidebarProps {
  currentParams: {
    kampus?: string;
    lokasi?: string;
    gender?: string;
    minHarga?: string;
    maxHarga?: string;
  };
}

const LOCATION_OPTIONS = [
  "Beji",
  "Cimanggis",
  "Cinere",
  "Limo",
  "Pancoran Mas",
  "Sukmajaya",
  "Tapos",
  "Sawangan",
  "Bojongsari",
  "Cilodong",
  "Cipayung"
];

const GENDER_OPTIONS = [
  { value: "PUTRA", label: "Putra" },
  { value: "PUTRI", label: "Putri" },
  { value: "CAMPUR", label: "Campur" },
];

export function FilterSidebar({ currentParams }: FilterSidebarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const [kampus, setKampus] = useState(currentParams.kampus || "");
  const [lokasi, setLokasi] = useState(currentParams.lokasi || "");
  const [gender, setGender] = useState(currentParams.gender || "");
  const [minHarga, setMinHarga] = useState(currentParams.minHarga || "");
  const [maxHarga, setMaxHarga] = useState(currentParams.maxHarga || "");

  useEffect(() => {
    setKampus(currentParams.kampus || "");
    setLokasi(currentParams.lokasi || "");
    setGender(currentParams.gender || "");
    setMinHarga(currentParams.minHarga || "");
    setMaxHarga(currentParams.maxHarga || "");
  }, [currentParams]);

  const applyFilter = () => {
    const params = new URLSearchParams();
    if (kampus) params.set("kampus", kampus);
    if (lokasi) params.set("lokasi", lokasi);
    if (gender) params.set("gender", gender);
    if (minHarga) params.set("minHarga", minHarga);
    if (maxHarga) params.set("maxHarga", maxHarga);

    startTransition(() => {
      router.push(`/explore?${params.toString()}`);
    });
  };

  const resetFilter = () => {
    setKampus("");
    setLokasi("");
    setGender("");
    setMinHarga("");
    setMaxHarga("");
    startTransition(() => {
      router.push("/explore");
    });
  };

  return (
    <div className="bg-white rounded-lg border border-[#D5D9D9] p-4 sticky top-24 text-left font-sans shadow-sm w-full">
      {/* Title Header */}
      <div className="flex items-center gap-1.5 mb-4 border-b border-[#F0F2F2] pb-3">
        <SlidersHorizontal className="w-4 h-4 text-[#007185]" />
        <span className="font-bold text-[14px] text-[#0F1111]">Filter Kos</span>
      </div>

      {/* Lokasi */}
      <div className="mb-4">
        <label className="text-[12px] font-bold text-[#565959] uppercase tracking-wider mb-1.5 block">
          Kecamatan / Lokasi
        </label>
        <select
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="w-full text-[13px] h-[34px] px-2.5 rounded border border-[#D5D9D9] bg-white outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185] text-[#0F1111]"
        >
          <option value="">Semua Kecamatan</option>
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Gender (Styled as custom chips) */}
      <div className="mb-4">
        <label className="text-[12px] font-bold text-[#565959] uppercase tracking-wider mb-1.5 block">
          Tipe Kos
        </label>
        <div className="flex gap-1.5 flex-wrap">
          <button
            onClick={() => setGender("")}
            className={`text-[13px] px-3 py-1 rounded cursor-pointer transition-colors ${
              !gender
                ? "border border-[#007185] bg-[#F3FCFF] text-[#007185] font-semibold"
                : "border border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#F7FAFA] font-normal"
            }`}
          >
            Semua
          </button>
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGender(g.value)}
              className={`text-[13px] px-3 py-1 rounded cursor-pointer transition-colors ${
                gender === g.value
                  ? "border border-[#007185] bg-[#F3FCFF] text-[#007185] font-semibold"
                  : "border border-[#D5D9D9] bg-white text-[#0F1111] hover:bg-[#F7FAFA] font-normal"
              }`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Harga Range */}
      <div className="mb-5">
        <label className="text-[12px] font-bold text-[#565959] uppercase tracking-wider mb-1.5 block">
          Range Harga (Rp/Bulan)
        </label>
        <div className="flex gap-2 items-center">
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">Rp</span>
            <input
              type="number"
              placeholder="Min"
              value={minHarga}
              onChange={(e) => setMinHarga(e.target.value)}
              className="w-full text-[13px] h-[34px] pl-7 pr-2 rounded border border-[#D5D9D9] bg-white outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185] text-[#0F1111]"
            />
          </div>
          <span className="text-slate-400 text-xs">–</span>
          <div className="relative flex-1">
            <span className="absolute left-2.5 top-1.5 text-xs text-slate-400">Rp</span>
            <input
              type="number"
              placeholder="Max"
              value={maxHarga}
              onChange={(e) => setMaxHarga(e.target.value)}
              className="w-full text-[13px] h-[34px] pl-7 pr-2 rounded border border-[#D5D9D9] bg-white outline-none focus:border-[#007185] focus:ring-1 focus:ring-[#007185] text-[#0F1111]"
            />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2 pt-1">
        <button 
          onClick={applyFilter} 
          disabled={isPending} 
          className="bg-[#FFD814] hover:bg-[#F7CA00] text-[#0F1111] border border-[#F7CA00] rounded text-[13px] font-semibold h-[36px] shadow-sm w-full cursor-pointer flex items-center justify-center transition-colors disabled:opacity-50"
        >
          {isPending ? "Memuat..." : "Terapkan Filter"}
        </button>
        <button 
          onClick={resetFilter} 
          disabled={isPending} 
          className="bg-white hover:bg-[#F7FAFA] border border-[#D5D9D9] text-[#0F1111] rounded text-[13px] font-normal h-[36px] shadow-sm w-full cursor-pointer flex items-center justify-center gap-1.5 transition-colors disabled:opacity-50"
        >
          <RotateCcw className="w-3.5 h-3.5 text-slate-500" />
          <span>Reset</span>
        </button>
      </div>
    </div>
  );
}
