"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, Menu, X, Search, ChevronDown, User, LayoutDashboard, LogOut, Store, Compass } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;

  const dashboardLink = role === "SUPER_ADMIN" ? "/admin" : role === "SELLER" ? "/seller" : "/dashboard";

  return (
    <header className="w-full flex flex-col z-50 sticky top-0">
      {/* ─── Top Main Navigation Bar ─── */}
      <div className="bg-[#232F3E] text-white h-[60px] flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-[#19222d]">
        <div className="flex items-center gap-4 md:gap-6 flex-1 max-w-4xl">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl flex-shrink-0 px-2 py-1 rounded border border-transparent hover:border-white/40">
            <div className="w-7 h-7 rounded bg-[#FF9900] flex items-center justify-center">
              <MapPin className="w-4 h-4 text-[#232F3E]" />
            </div>
            <span className="font-sans tracking-tight">
              Kos<span className="text-[#FF9900]">Rank</span>
            </span>
          </Link>

          {/* Delivery Location Indicator */}
          <div className="hidden lg:flex flex-col text-left leading-tight text-xs pl-2 pr-3 py-1 rounded border border-transparent hover:border-white/40 cursor-pointer">
            <span className="text-[11px] text-slate-300 font-normal">Kirim ke</span>
            <div className="flex items-center gap-0.5 font-bold text-[13px] text-white">
              <MapPin className="w-3.5 h-3.5 text-[#FF9900] flex-shrink-0" />
              <span>Condong Catur</span>
            </div>
          </div>

          {/* Amazon-style Search Bar (Desktop) */}
          <form 
            action="/explore" 
            method="GET" 
            className="hidden md:flex flex-1 h-[40px] bg-white rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-[#FF9900] border-0"
          >
            <select 
              name="kampus" 
              className="bg-[#F3F3F3] text-[12px] text-slate-700 px-3 border-r border-[#D5D9D9] outline-none hover:bg-[#E3E3E3] cursor-pointer rounded-l-md font-sans font-medium h-full"
            >
              <option value="">Semua Kampus</option>
              <option value="Universitas Amikom Yogyakarta">Amikom</option>
              <option value="UPN Veteran Yogyakarta">UPN</option>
              <option value="STIMY YKPN">STIMY YKPN</option>
            </select>
            <input 
              type="text" 
              name="lokasi" 
              placeholder="Cari kos di Condong Catur (contoh: Beji, Depok)..." 
              className="flex-grow px-3 text-sm text-[#0F1111] bg-white outline-none font-sans"
            />
            <button 
              type="submit" 
              className="bg-[#FEBD69] hover:bg-[#F3A847] px-6 flex items-center justify-center text-[#0F1111] transition-colors cursor-pointer rounded-r-md"
            >
              <Search className="w-5 h-5 text-slate-800" />
            </button>
          </form>
        </div>

        {/* Right Nav Options */}
        <div className="flex items-center gap-3 sm:gap-5 md:gap-6 ml-4">
          {/* Account Menu */}
          {!session ? (
            <Link 
              href="/auth/login" 
              className="flex flex-col text-left px-3.5 py-1.5 rounded-sm border border-transparent hover:border-white/30 hover:bg-white/5 transition-all"
            >
              <span className="text-[11px] text-slate-300 font-normal leading-none mb-1">Halo, Masuk</span>
              <span className="text-[13px] font-bold text-white leading-none">Akun & Daftar</span>
            </Link>
          ) : (
            <div className="relative">
              <button
                onClick={() => setDropOpen(!dropOpen)}
                className="flex flex-col text-left px-3.5 py-1.5 rounded-sm border border-transparent hover:border-white/30 hover:bg-white/5 transition-all text-white cursor-pointer"
              >
                <span className="text-[11px] text-slate-300 font-normal leading-none mb-1">Halo, {session.user?.name?.split(" ")[0]}</span>
                <span className="text-[13px] font-bold text-white leading-none flex items-center gap-0.5">
                  Akun & Daftar <ChevronDown className="w-3.5 h-3.5 text-slate-300" />
                </span>
              </button>

              <AnimatePresence>
                {dropOpen && (
                  <>
                    <div className="fixed inset-0 z-30" onClick={() => setDropOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 5 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 5 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 top-full mt-1.5 w-52 bg-white rounded-lg border border-[#D5D9D9] shadow-[0_0_6px_rgba(15,17,17,0.15)] py-2.5 z-40 text-[#0F1111]"
                    >
                      <div className="px-4 py-1.5 border-b border-slate-100 mb-2">
                        <p className="text-xs font-bold text-[#0F1111] truncate">{session.user?.name}</p>
                        <p className="text-[10px] text-slate-500 font-semibold uppercase mt-0.5 tracking-wider">
                          {role === "SUPER_ADMIN" ? "Super Admin" : role === "SELLER" ? "Penjual Kos" : "Pencari Kos"}
                        </p>
                      </div>
                      
                      <div className="px-1 space-y-0.5">
                        <Link 
                          href={dashboardLink} 
                          onClick={() => setDropOpen(false)} 
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-sans text-[#0F1111] hover:text-[#007185] hover:bg-[#F0F2F2] rounded transition-all"
                        >
                          <LayoutDashboard className="w-4 h-4 text-slate-400" /> 
                          <span>Dashboard</span>
                        </Link>
                        
                        <Link 
                          href="/profile" 
                          onClick={() => setDropOpen(false)} 
                          className="flex items-center gap-2 px-3 py-1.5 text-sm font-sans text-[#0F1111] hover:text-[#007185] hover:bg-[#F0F2F2] rounded transition-all"
                        >
                          <User className="w-4 h-4 text-slate-400" /> 
                          <span>Profil Saya</span>
                        </Link>
                        
                        <div className="h-px bg-slate-100 my-1.5" />
                        
                        <button 
                          onClick={() => { setDropOpen(false); signOut({ callbackUrl: "/" }); }} 
                          className="w-full flex items-center gap-2 px-3 py-1.5 text-sm font-sans text-[#B12704] hover:bg-red-50 rounded transition-all text-left"
                        >
                          <LogOut className="w-4 h-4 text-[#B12704]" /> 
                          <span>Keluar</span>
                        </button>
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          )}

          {/* Pasang Kos */}
          <Link 
            href={session ? dashboardLink : "/auth/register?role=seller"} 
            className="hidden sm:flex flex-col text-left px-3.5 py-1.5 rounded-sm border border-transparent hover:border-white/30 hover:bg-white/5 transition-all text-white"
          >
            <span className="text-[11px] text-slate-300 font-normal leading-none mb-1">Pemilik Kos</span>
            <span className="text-[13px] font-bold text-white leading-none">Pasang Kos</span>
          </Link>

          {/* Mobile Menu Toggle */}
          <button 
            onClick={() => setOpen(!open)} 
            className="md:hidden p-1.5 rounded hover:bg-[#37475A] text-white flex items-center justify-center"
          >
            {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* ─── Bottom Sub-Navigation (Department Bar) ─── */}
      <nav className="bg-[#37475A] text-white text-[14px] font-medium h-[39px] flex items-center px-4 sm:px-6 lg:px-8 overflow-x-auto gap-4 scrollbar-none border-b border-[#232F3E]/20">
        <Link href="/explore" className="hover:outline hover:outline-1 hover:outline-white/60 px-2.5 py-1 rounded flex items-center gap-1.5 flex-shrink-0 font-bold text-[13px]">
          <Menu className="w-4 h-4" /> Semua Kos
        </Link>
        <Link href="/explore?gender=PUTRA" className="hover:outline hover:outline-1 hover:outline-white/60 px-2.5 py-1 rounded flex-shrink-0 text-[13px]">
          Kos Putra
        </Link>
        <Link href="/explore?gender=PUTRI" className="hover:outline hover:outline-1 hover:outline-white/60 px-2.5 py-1 rounded flex-shrink-0 text-[13px]">
          Kos Putri
        </Link>
        <Link href="/explore?gender=CAMPUR" className="hover:outline hover:outline-1 hover:outline-white/60 px-2.5 py-1 rounded flex-shrink-0 text-[13px]">
          Kos Campur
        </Link>
        <div className="h-4 w-px bg-slate-500/50 flex-shrink-0" />
        <Link href="/explore?kampus=Universitas Amikom Yogyakarta" className="hover:outline hover:outline-1 hover:outline-white/60 px-2.5 py-1 rounded flex-shrink-0 text-[13px]">
          Dekat Amikom
        </Link>
        <Link href="/explore?kampus=UPN Veteran Yogyakarta" className="hover:outline hover:outline-1 hover:outline-white/60 px-2.5 py-1 rounded flex-shrink-0 text-[13px]">
          Dekat UPN
        </Link>
        <Link href="/explore?kampus=STIMY YKPN" className="hover:outline hover:outline-1 hover:outline-white/60 px-2.5 py-1 rounded flex-shrink-0 text-[13px]">
          Dekat STIMY YKPN
        </Link>
      </nav>

      {/* ─── Mobile Search Bar (Only shown on small screens) ─── */}
      <div className="md:hidden bg-[#232F3E] px-4 py-2 border-t border-[#37475A]">
        <form action="/explore" method="GET" className="flex h-[36px] bg-white rounded overflow-hidden">
          <input 
            type="text" 
            name="lokasi" 
            placeholder="Cari kos di Condong Catur..." 
            className="flex-grow px-3 text-xs text-[#0F1111] bg-white outline-none font-sans"
          />
          <button 
            type="submit" 
            className="bg-[#FEBD69] hover:bg-[#F3A847] px-4 flex items-center justify-center text-[#0F1111]"
          >
            <Search className="w-4 h-4 text-slate-800" />
          </button>
        </form>
      </div>

      {/* Mobile Menu Dropdown */}
      {open && (
        <div className="md:hidden border-t border-[#37475A] bg-[#232F3E] text-white px-4 py-4 flex flex-col gap-2.5">
          <Link href="/explore" className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded" onClick={() => setOpen(false)}>
            Eksplor Kos
          </Link>
          <Link href="/explore?gender=PUTRA" className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded" onClick={() => setOpen(false)}>
            Kos Putra
          </Link>
          <Link href="/explore?gender=PUTRI" className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded" onClick={() => setOpen(false)}>
            Kos Putri
          </Link>
          <Link href="/explore?gender=CAMPUR" className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded" onClick={() => setOpen(false)}>
            Kos Campur
          </Link>
          
          <div className="h-px bg-slate-700/50 my-1" />

          {!session ? (
            <>
              <Link href="/auth/register?role=seller" className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded text-[#FF9900]" onClick={() => setOpen(false)}>
                Pasang Kos
              </Link>
              <Link href="/auth/login" className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded" onClick={() => setOpen(false)}>
                Masuk
              </Link>
            </>
          ) : (
            <>
              <Link href={dashboardLink} className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded" onClick={() => setOpen(false)}>
                Dashboard
              </Link>
              <Link href="/profile" className="text-sm font-semibold py-1.5 px-2 hover:bg-[#37475A] rounded" onClick={() => setOpen(false)}>
                Profil Saya
              </Link>
              <button 
                onClick={() => { setOpen(false); signOut({ callbackUrl: "/" }); }} 
                className="text-left text-sm font-semibold py-1.5 px-2 text-[#B12704] hover:bg-[#37475A] rounded"
              >
                Keluar
              </button>
            </>
          )}
        </div>
      )}
    </header>
  );
}
