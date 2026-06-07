"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2, Search, Store } from "lucide-react";
import { signIn } from "next-auth/react";

type RoleOption = "USER" | "SELLER";

export function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaultRole = (searchParams.get("role")?.toUpperCase() as RoleOption) === "SELLER" ? "SELLER" : "USER";

  const [role, setRole] = useState<RoleOption>(defaultRole);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, phone, role }),
    });

    const data = await res.json();

    if (!res.ok) {
      setError(data.message || "Terjadi kesalahan.");
      setLoading(false);
      return;
    }

    // Auto login after register
    const loginRes = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);

    if (loginRes?.ok) {
      router.push(role === "SELLER" ? "/seller" : "/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Role Selector */}
      <div className="grid grid-cols-2 gap-2 p-1 bg-white/10 rounded-xl mb-2">
        <button
          type="button"
          onClick={() => setRole("USER")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${role === "USER" ? "bg-white text-primary shadow" : "text-white/60 hover:text-white"}`}
        >
          <Search className="w-4 h-4" /> Cari Kos
        </button>
        <button
          type="button"
          onClick={() => setRole("SELLER")}
          className={`flex items-center justify-center gap-2 py-2.5 px-3 rounded-lg text-sm font-medium transition-all ${role === "SELLER" ? "bg-white text-primary shadow" : "text-white/60 hover:text-white"}`}
        >
          <Store className="w-4 h-4" /> Pasang Kos
        </button>
      </div>

      <p className="text-white/60 text-xs text-center pb-1">
        {role === "USER" ? "Daftar sebagai pencari kos" : "Daftar sebagai pemilik / penjual kos"}
      </p>

      <div className="space-y-1.5">
        <Label className="text-white/80 text-sm">Nama Lengkap</Label>
        <Input id="reg-name" value={name} onChange={(e) => setName(e.target.value)} required placeholder="Nama Anda" className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-11 rounded-xl" />
      </div>

      <div className="space-y-1.5">
        <Label className="text-white/80 text-sm">Email</Label>
        <Input id="reg-email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="email@contoh.com" className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-11 rounded-xl" />
      </div>

      {role === "SELLER" && (
        <div className="space-y-1.5">
          <Label className="text-white/80 text-sm">Nomor HP / WhatsApp</Label>
          <Input id="reg-phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="08xxxxxxxxxx" className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-11 rounded-xl" />
        </div>
      )}

      <div className="space-y-1.5">
        <Label className="text-white/80 text-sm">Password</Label>
        <div className="relative">
          <Input id="reg-password" type={showPass ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required placeholder="Min. 8 karakter" minLength={8} className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-11 rounded-xl pr-10" />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && <div className="text-red-300 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>}

      <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-white text-primary hover:bg-white/90 font-semibold">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memuat...</> : role === "SELLER" ? "Daftar sebagai Penjual" : "Daftar Sekarang"}
      </Button>
    </form>
  );
}
