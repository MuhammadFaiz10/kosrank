"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function RegisterForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Pendaftaran gagal.");
      }

      // Auto sign-in after successful registration
      const loginRes = await signIn("credentials", { email, password, redirect: false });
      if (loginRes?.error) {
        throw new Error("Akun berhasil dibuat, namun gagal masuk otomatis. Silakan login manual.");
      }

      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      router.push(role === "ADMIN" ? "/admin" : "/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Pendaftaran gagal.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-ink-700 text-[13px] font-semibold">Nama Lengkap</Label>
        <Input
          id="register-name"
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Nama Anda"
          className="bg-white border-line text-ink-900 placeholder:text-ink-500 h-11 rounded-xl focus-visible:ring-brand-100 focus-visible:border-brand-600"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-ink-700 text-[13px] font-semibold">Email</Label>
        <Input
          id="register-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@contoh.com"
          className="bg-white border-line text-ink-900 placeholder:text-ink-500 h-11 rounded-xl focus-visible:ring-brand-100 focus-visible:border-brand-600"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-ink-700 text-[13px] font-semibold">Password</Label>
        <div className="relative">
          <Input
            id="register-password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            minLength={6}
            placeholder="Minimal 6 karakter"
            className="bg-white border-line text-ink-900 placeholder:text-ink-500 h-11 rounded-xl pr-10 focus-visible:ring-brand-100 focus-visible:border-brand-600"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} aria-label={showPass ? "Sembunyikan password" : "Tampilkan password"} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500 hover:text-ink-900 cursor-pointer">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}

      <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-semibold">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Mendaftarkan...</> : "Daftar"}
      </Button>

      <p className="text-center text-[13px] text-ink-500">
        Sudah punya akun?{" "}
        <Link href="/auth/login" className="text-brand-700 font-semibold hover:text-brand-600 transition-colors">
          Masuk
        </Link>
      </p>
    </form>
  );
}
