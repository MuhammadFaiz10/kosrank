import { MapPin } from "lucide-react";
import Link from "next/link";
import { LoginForm } from "@/features/auth/LoginForm";
import { Suspense } from "react";

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-primary/80 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white font-bold text-2xl">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
              <MapPin className="w-5 h-5 text-white" />
            </div>
            Kos<span className="text-blue-300">Rank</span>
          </Link>
          <p className="text-white/60 text-sm mt-2">Masuk ke akun Anda</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <h1 className="text-xl font-bold text-white mb-1">Selamat Datang</h1>
          <p className="text-white/60 text-sm mb-6">Masuk untuk melanjutkan</p>
          <Suspense fallback={<div className="text-white/60 text-sm text-center">Memuat...</div>}>
            <LoginForm />
          </Suspense>
          <p className="text-center text-white/50 text-xs mt-5">
            Belum punya akun?{" "}
            <Link href="/auth/register" className="text-white font-medium hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
