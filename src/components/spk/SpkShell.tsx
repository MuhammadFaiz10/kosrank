"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { MapPin, ListOrdered, SlidersHorizontal, ListTree, Scale, Trophy, Home, Globe } from "lucide-react";
import type { ReactNode } from "react";

const BASE_LABELS = [
  { path: "", label: "Beranda", icon: Home },
  { path: "/alternatif", label: "Alternatif Pilihan", icon: ListOrdered },
  { path: "/kriteria", label: "Kriteria", icon: SlidersHorizontal },
  { path: "/sub-kriteria", label: "Sub Kriteria", icon: ListTree },
  { path: "/bobot", label: "Bobot Kriteria", icon: Scale },
  { path: "/hasil", label: "Hasil Perangkingan", icon: Trophy },
];

interface SpkShellProps {
  base: "/kos" | "/app/kos";
  variant: "publik" | "auth";
  children: ReactNode;
}

export function SpkShell({ base, variant, children }: SpkShellProps) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen bg-surface-tint text-ink-900 text-left">
      <header className="bg-brand-900 text-white">
        <div className="max-w-[1100px] mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4 flex-wrap">
          <Link href="/" className="flex items-center gap-2 font-display font-bold text-lg tracking-tight" aria-label="KosRank - Beranda">
            <span className="w-8 h-8 rounded-lg bg-white flex items-center justify-center">
              <MapPin className="w-4 h-4 text-brand-700" />
            </span>
            Modul KosRank
          </Link>
          <span className="text-[10px] uppercase font-bold tracking-wider bg-white/15 border border-white/25 px-2.5 py-1 rounded-full">
            {variant === "publik" ? "Varian Publik, Tanpa Login" : "Varian Dengan Login"}
          </span>
        </div>
        <nav className="bg-brand-700">
          <div className="max-w-[1100px] mx-auto px-4 sm:px-6 flex gap-1 overflow-x-auto">
            {BASE_LABELS.map(({ path, label, icon: Icon }) => {
              const href = `${base}${path}`;
              const isActive = pathname === href;
              return (
                <Link
                  key={label}
                  href={href}
                  aria-current={isActive ? "page" : undefined}
                  className={`flex items-center gap-1.5 px-3.5 py-2.5 text-[12px] font-semibold whitespace-nowrap border-b-2 transition-colors ${
                    isActive
                      ? "border-white text-white"
                      : "border-transparent text-white/75 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {label}
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      <main className="max-w-[1100px] mx-auto px-4 sm:px-6 py-8">{children}</main>

      <footer className="max-w-[1100px] mx-auto px-4 sm:px-6 pb-8 pt-2">
        <Link href="/" className="inline-flex items-center gap-1.5 text-[12px] text-ink-500 hover:text-brand-700 transition-colors">
          <Globe className="w-3.5 h-3.5" />
          Kembali ke Marketplace KosRank
        </Link>
      </footer>
    </div>
  );
}
