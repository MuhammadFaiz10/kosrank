"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Home, Plus, MapPin, LogOut, Globe } from "lucide-react";
import { signOut } from "next-auth/react";

const NAV_ITEMS = [
  { href: "/seller", label: "Dashboard", icon: LayoutDashboard },
  { href: "/seller/kos", label: "Kos Saya", icon: Home },
  { href: "/seller/kos/new", label: "Tambah Kos", icon: Plus },
];

export function SellerSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-60 flex-shrink-0 min-h-screen bg-white border-r border-border flex flex-col">
      <div className="px-5 py-5 border-b border-border">
        <Link href="/" className="flex items-center gap-2 font-bold text-lg">
          <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
            <MapPin className="w-3.5 h-3.5 text-white" />
          </div>
          Kos<span className="text-primary">Rank</span>
          <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto font-medium">Seller</span>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
          const isActive = pathname === href || (href !== "/seller" && pathname.startsWith(href));
          return (
            <Link key={href} href={href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${isActive ? "bg-primary text-white" : "text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
              <Icon className="w-4 h-4 flex-shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-5 border-t border-border pt-4">
        <Link href="/" className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-muted-foreground hover:text-foreground hover:bg-muted transition-all mb-1">
          <Globe className="w-4 h-4" /> Lihat Website
        </Link>
        <button onClick={() => signOut({ callbackUrl: "/" })} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-all">
          <LogOut className="w-4 h-4" /> Keluar
        </button>
      </div>
    </aside>
  );
}
