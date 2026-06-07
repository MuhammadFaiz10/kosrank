"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Menu, X, Search, ChevronDown, User, LayoutDashboard, LogOut, Store } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const dashboardLink = role === "SUPER_ADMIN" ? "/admin" : role === "SELLER" ? "/seller" : "/dashboard";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/50 bg-white/90 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl flex-shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <MapPin className="w-4 h-4 text-white" />
            </div>
            <span>Kos<span className="text-primary">Rank</span></span>
          </Link>

          {/* Search Bar (Desktop) */}
          <div className="hidden md:flex flex-1 max-w-md">
            <Link href="/explore" className="flex-1 flex items-center gap-2 bg-muted rounded-xl px-4 py-2 text-sm text-muted-foreground hover:bg-muted/80 transition-colors border border-border">
              <Search className="w-4 h-4" />
              <span>Cari kos di Condong Catur...</span>
            </Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-2">
            <Link href="/explore">
              <Button variant="ghost" size="sm" className="rounded-xl">Eksplor Kos</Button>
            </Link>

            {!session ? (
              <>
                <Link href="/auth/register?role=seller">
                  <Button variant="outline" size="sm" className="rounded-xl">
                    <Store className="w-4 h-4 mr-1.5" />
                    Pasang Kos
                  </Button>
                </Link>
                <Link href="/auth/login">
                  <Button size="sm" className="rounded-xl">Masuk</Button>
                </Link>
              </>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 bg-muted rounded-xl px-3 py-2 text-sm font-medium hover:bg-muted/80 transition-colors border border-border"
                >
                  <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold">
                    {session.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <span className="max-w-[100px] truncate">{session.user?.name}</span>
                  <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-2xl border border-border shadow-lg py-1.5 z-50">
                    <div className="px-3 py-2 text-xs text-muted-foreground border-b border-border mb-1">
                      {role === "SUPER_ADMIN" ? "Super Admin" : role === "SELLER" ? "Penjual Kos" : "Pencari Kos"}
                    </div>
                    <Link href={dashboardLink} onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
                      <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </Link>
                    <Link href="/profile" onClick={() => setDropOpen(false)} className="flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors">
                      <User className="w-4 h-4" /> Profil
                    </Link>
                    <button onClick={() => { setDropOpen(false); signOut({ callbackUrl: "/" }); }} className="w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 text-red-500 transition-colors">
                      <LogOut className="w-4 h-4" /> Keluar
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Mobile button */}
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-muted">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border bg-white px-4 py-4 flex flex-col gap-2">
          <Link href="/explore" className="text-sm font-medium py-2" onClick={() => setOpen(false)}>Eksplor Kos</Link>
          {!session ? (
            <>
              <Link href="/auth/register?role=seller" className="text-sm font-medium py-2" onClick={() => setOpen(false)}>Pasang Kos</Link>
              <Link href="/auth/login" className="text-sm font-medium py-2" onClick={() => setOpen(false)}>Masuk</Link>
            </>
          ) : (
            <>
              <Link href={dashboardLink} className="text-sm font-medium py-2" onClick={() => setOpen(false)}>Dashboard</Link>
              <button onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} className="text-left text-sm font-medium py-2 text-red-500">Keluar</button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
