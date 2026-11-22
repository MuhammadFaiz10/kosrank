"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Loader2, MailCheck } from "lucide-react";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal memproses permintaan.");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memproses permintaan.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center space-y-4 py-4">
        <div className="w-14 h-14 rounded-full bg-brand-100 flex items-center justify-center mx-auto">
          <MailCheck className="w-7 h-7 text-brand-700" />
        </div>
        <div>
          <h2 className="font-display font-bold text-[16px] text-ink-900">Cek Email Anda</h2>
          <p className="text-[13px] text-ink-500 mt-1.5 leading-relaxed">
            Jika email tersebut terdaftar, tautan untuk mengatur ulang password telah dikirim.
          </p>
        </div>
        <Link href="/auth/login" className="inline-block text-[13px] font-semibold text-brand-700 hover:text-brand-600 transition-colors">
          Kembali ke Login
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-ink-700 text-[13px] font-semibold">Email</Label>
        <Input
          id="forgot-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@contoh.com"
          className="bg-white border-line text-ink-900 placeholder:text-ink-500 h-11 rounded-xl focus-visible:ring-brand-100 focus-visible:border-brand-600"
        />
      </div>

      {error && (
        <div className="text-red-600 text-xs bg-red-50 border border-red-200 rounded-lg px-3 py-2">{error}</div>
      )}

      <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-brand-700 hover:bg-brand-600 text-white font-semibold">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memproses...</> : "Kirim Tautan Reset"}
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
