import { MapPin } from "lucide-react";
import Link from "next/link";
import { ForgotPasswordForm } from "@/features/auth/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen bg-brand-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md py-10">
        <div className="text-center mb-6">
          <Link href="/" className="inline-flex items-center gap-2 font-display font-bold text-2xl tracking-tight text-white" aria-label="KosRank - Beranda">
            <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
              <MapPin className="w-5 h-5 text-brand-700" />
            </div>
            Kos<span className="text-brand-100">Rank</span>
          </Link>
          <p className="text-white/80 text-sm mt-2">Pemulihan akses akun</p>
        </div>

        <div className="bg-white rounded-2xl border border-line p-8 shadow-[0_4px_16px_rgba(15,15,20,0.08)]">
          <h1 className="font-display text-xl font-bold tracking-[-0.02em] text-ink-900 mb-1">Lupa Password</h1>
          <p className="text-ink-500 text-sm mb-6">Masukkan email akun Anda untuk menerima tautan pengaturan ulang password.</p>
          <ForgotPasswordForm />
        </div>
      </div>
    </div>
  );
}
