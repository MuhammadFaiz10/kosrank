"use client";

import { MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="w-full bg-[#232F3E] text-white flex flex-col mt-auto border-t border-[#19222d]">
      {/* Back to top bar */}
      <button 
        onClick={scrollToTop}
        className="w-full bg-[#37475A] hover:bg-[#485769] text-center text-xs py-3.5 transition-colors cursor-pointer text-white font-semibold"
      >
        Kembali ke Atas
      </button>

      {/* Main footer content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 w-full">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3 text-white">
              <div className="w-7 h-7 rounded bg-[#FF9900] flex items-center justify-center">
                <MapPin className="w-4 h-4 text-[#232F3E]" />
              </div>
              <span className="font-sans">
                Kos<span className="text-[#FF9900]">Rank</span>
              </span>
            </Link>
            <p className="text-xs text-slate-300 leading-relaxed max-w-sm">
              Sistem pendukung keputusan rekomendasi kos terbaik di Condong Catur Yogyakarta dengan perhitungan Simple Additive Weighting (SAW).
            </p>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 text-[#FF9900]">Navigasi</h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>
                <Link href="/" className="hover:underline transition-colors">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/explore" className="hover:underline transition-colors">
                  Eksplor Kos
                </Link>
              </li>
              <li>
                <Link href="/auth/login" className="hover:underline transition-colors">
                  Masuk Akun
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-sm mb-3 text-[#FF9900]">Rekomendasi Kampus</h4>
            <ul className="space-y-2 text-xs text-slate-200">
              <li>Universitas Amikom Yogyakarta</li>
              <li>UPN Veteran Yogyakarta</li>
              <li>STIMY YKPN Yogyakarta</li>
              <li>Universitas Mercu Buana Yogyakarta</li>
            </ul>
          </div>
        </div>

        {/* Footer bottom line */}
        <div className="border-t border-[#37475A] mt-8 pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © 2026 KosRank. Tugas Akhir Sistem Pendukung Keputusan.
          </div>
          <div className="flex gap-4">
            <span className="text-slate-500">Condong Catur, Sleman, DIY</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
