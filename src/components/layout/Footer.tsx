import { MapPin } from "lucide-react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 font-bold text-lg mb-3">
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <MapPin className="w-3.5 h-3.5 text-white" />
              </div>
              <span>Kos<span className="text-primary">Rank</span></span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Sistem rekomendasi tempat kos di Condong Catur Yogyakarta menggunakan metode Simple Additive Weighting (SAW).
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Navigasi</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/" className="hover:text-foreground transition-colors">Beranda</Link></li>
              <li><Link href="/explore" className="hover:text-foreground transition-colors">Eksplor Kos</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-sm mb-3">Kampus Terdekat</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li>Universitas Amikom Yogyakarta</li>
              <li>UPN Veteran Yogyakarta</li>
              <li>Mercu Buana Yogyakarta</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-border mt-8 pt-6 text-center text-xs text-muted-foreground">
          © 2025 KosRank. Tugas Akhir Universitas Amikom Yogyakarta.
        </div>
      </div>
    </footer>
  );
}
