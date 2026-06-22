"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Settings, MapPin, LogOut, Sliders, Users, Calculator, Trophy, List } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/kos", label: "Semua Kos", icon: Home },
  { href: "/admin/users", label: "Pengguna", icon: Users },
  { href: "/admin/kriteria", label: "Kriteria SAW", icon: Sliders },
  { href: "/admin/sub-kriteria", label: "Sub Kriteria SAW", icon: List },
  { href: "/admin/perhitungan", label: "Perhitungan SAW", icon: Calculator },
  { href: "/admin/hasil-akhir", label: "Hasil Akhir", icon: Trophy },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 h-screen bg-slate-900 text-white flex flex-col overflow-y-auto print:hidden">
      <div className="px-5 py-4 border-b border-white/10 flex flex-col gap-2.5">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          <span>Kos<span className="text-blue-400">Rank</span></span>
        </Link>
        <div className="flex">
          <span className="text-[10px] uppercase font-black tracking-wider bg-red-500/10 text-red-400 px-2 py-0.5 rounded-md border border-red-500/20">
            Super Admin Panel
          </span>
        </div>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/admin" && pathname.startsWith(href + "/") || pathname === href);
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-white/60 hover:text-white hover:bg-white/10"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-white/10 pt-4">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/60 hover:text-white hover:bg-white/10 transition-all mb-1">
          <Settings className="w-4 h-4" /> Lihat Website
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
