import Link from "next/link";
import { MapPin } from "lucide-react";
import { RegisterForm } from "@/features/auth/RegisterForm";
import { Suspense } from "react";

export default function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ role?: string }>;
}) {
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
          <p className="text-white/60 text-sm mt-2">Bergabung sekarang, gratis!</p>
        </div>

        <div className="bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 p-8 shadow-2xl">
          <Suspense fallback={<div className="text-white/60 text-sm text-center">Memuat...</div>}>
            <RegisterForm />
          </Suspense>
          <p className="text-center text-white/50 text-xs mt-5">
            Sudah punya akun?{" "}
            <Link href="/auth/login" className="text-white font-medium hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
