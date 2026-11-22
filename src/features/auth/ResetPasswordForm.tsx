"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") || "";

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      setError("Konfirmasi password tidak cocok.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengatur ulang password.");
      }

      // Sukses: arahkan ke login agar user masuk dengan password baru
      router.push("/auth/login");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengatur ulang password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-ink-700 text-[13px] font-semibold">Password Baru</Label>
        <div className="relative">
          <Input
            id="reset-password"
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
      <div className="space-y-1.5">
        <Label className="text-ink-700 text-[13px] font-semibold">Konfirmasi Password Baru</Label>
        <Input
          id="reset-confirm"
          type={showPass ? "text" : "password"}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          minLength={6}
          placeholder="Ulangi password baru"
          className="bg-white border-line text-ink-900 placeholder:text-ink-500 h-11 rounded-xl focus-visible:ring-brand-100 focus-visible:border-brand-600"
        />
      </div>

      {error && (
        <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}

      <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-semibold">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Menyimpan...</> : "Atur Ulang Password"}
      </Button>

      <p className="text-center text-[13px] text-ink-500">
        <Link href="/auth/login" className="text-brand-700 font-semibold hover:text-brand-600 transition-colors">
          Kembali ke Login
        </Link>
      </p>
    </form>
  );
}
