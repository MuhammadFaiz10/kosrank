"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Eye, EyeOff, Loader2 } from "lucide-react";

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (res?.error) {
      setError("Email atau password salah.");
    } else {
      // Fetch session to get role then redirect accordingly
      const sessionRes = await fetch("/api/auth/session");
      const session = await sessionRes.json();
      const role = session?.user?.role;

      if (role === "SUPER_ADMIN") router.push("/admin");
      else if (role === "SELLER") router.push("/seller");
      else router.push("/");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label className="text-white/80 text-sm">Email</Label>
        <Input
          id="login-email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          placeholder="email@contoh.com"
          className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-11 rounded-xl focus-visible:ring-white/30"
        />
      </div>
      <div className="space-y-1.5">
        <Label className="text-white/80 text-sm">Password</Label>
        <div className="relative">
          <Input
            id="login-password"
            type={showPass ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            placeholder="••••••••"
            className="bg-white/10 border-white/20 text-white placeholder:text-white/30 h-11 rounded-xl pr-10 focus-visible:ring-white/30"
          />
          <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70">
            {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {error && (
        <div className="text-red-300 text-xs bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</div>
      )}

      <Button type="submit" disabled={loading} className="w-full h-11 rounded-xl bg-white text-primary hover:bg-white/90 font-semibold">
        {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" />Memuat...</> : "Masuk"}
      </Button>
    </form>
  );
}
