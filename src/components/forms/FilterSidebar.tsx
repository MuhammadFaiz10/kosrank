"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
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
    <div className="bg-white rounded-2xl border border-border p-5 sticky top-24">
      <div className="flex items-center gap-2 mb-5">
        <SlidersHorizontal className="w-4 h-4 text-primary" />
        <span className="font-semibold text-sm">Filter Kos</span>
      </div>

      {/* Lokasi */}
      <div className="mb-5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Kecamatan / Lokasi</Label>
        <select
          value={lokasi}
          onChange={(e) => setLokasi(e.target.value)}
          className="w-full text-sm p-2 rounded-lg border border-border bg-white outline-none focus:ring-1 focus:ring-primary focus:border-primary"
        >
          <option value="">Semua Kecamatan</option>
          {LOCATION_OPTIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div className="mb-5">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Tipe Kos</Label>
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setGender("")}
            className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${!gender ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
          >
            Semua
          </button>
          {GENDER_OPTIONS.map((g) => (
            <button
              key={g.value}
              onClick={() => setGender(g.value)}
              className={`text-xs px-3 py-1.5 rounded-lg border transition-colors ${gender === g.value ? "bg-primary text-white border-primary" : "border-border hover:bg-muted"}`}
            >
              {g.label}
            </button>
          ))}
        </div>
      </div>

      {/* Harga */}
      <div className="mb-6">
        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2 block">Range Harga/Bulan</Label>
        <div className="flex gap-2 items-center">
          <Input
            type="number"
            placeholder="Min"
            value={minHarga}
            onChange={(e) => setMinHarga(e.target.value)}
            className="text-xs h-9 rounded-lg"
          />
          <span className="text-muted-foreground text-xs">–</span>
          <Input
            type="number"
            placeholder="Max"
            value={maxHarga}
            onChange={(e) => setMaxHarga(e.target.value)}
            className="text-xs h-9 rounded-lg"
          />
        </div>
      </div>

      <div className="flex flex-col gap-2">
        <Button onClick={applyFilter} disabled={isPending} className="w-full rounded-xl h-9 text-sm">
          {isPending ? "Memuat..." : "Terapkan Filter"}
        </Button>
        <Button variant="ghost" onClick={resetFilter} disabled={isPending} className="w-full rounded-xl h-9 text-sm">
          <RotateCcw className="w-3 h-3 mr-1" /> Reset
        </Button>
      </div>
    </div>
  );
}
