"use client"

import { useState, useTransition } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { 
  User, Mail, Phone, Shield, Calendar, Lock, 
  CheckCircle, AlertTriangle, Home, ExternalLink, 
  ArrowRight, KeyRound, UserCheck
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { updateProfile, updatePassword } from "./profile-actions"

// Predefined premium avatar gradients for user to pick
const PRESET_AVATARS = [
  "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", // Indigo/Purple
  "linear-gradient(135deg, #ff9a9e 0%, #fecfef 99%, #fecfef 100%)", // Pink/Rose
  "linear-gradient(135deg, #f6d365 0%, #fda085 100%)", // Gold/Orange
  "linear-gradient(135deg, #12c2e9 0%, #c471ed 50%, #f64f59 100%)", // Sunset
  "linear-gradient(135deg, #38f9d7 0%, #43e97b 100%)", // Mint/Green
  "linear-gradient(135deg, #00c6ff 0%, #0072ff 100%)", // Blue/Azure
]

interface ProfileClientPageProps {
  user: {
    id: string
    name: string
    email: string
    phone: string | null
    avatar: string | null
    role: string
    createdAt: Date
    _count?: {
      kos: number
    }
  }
}

export default function ProfileClientPage({ user }: ProfileClientPageProps) {
  const [activeTab, setActiveTab] = useState<"profile" | "password" | "stats">("profile")
  
  // Profile edit states
  const [name, setName] = useState(user.name)
  const [phone, setPhone] = useState(user.phone || "")
  const [avatar, setAvatar] = useState(user.avatar || "")
  
  // Password change states
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  // Pending and result messages
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null)

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)
    
    startTransition(async () => {
      const formData = new FormData()
      formData.append("name", name)
      formData.append("phone", phone)
      formData.append("avatar", avatar)

      const res = await updateProfile(formData)
      if (res.success) {
        setMessage({ type: "success", text: res.message })
      } else {
        setMessage({ type: "error", text: res.message })
      }
    })
  }

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage(null)

    if (newPassword !== confirmPassword) {
      setMessage({ type: "error", text: "Konfirmasi password baru tidak cocok." })
      return
    }

    startTransition(async () => {
      const formData = new FormData()
      formData.append("currentPassword", currentPassword)
      formData.append("newPassword", newPassword)
      formData.append("confirmPassword", confirmPassword)

      const res = await updatePassword(formData)
      if (res.success) {
        setMessage({ type: "success", text: res.message })
        // Clear passwords on success
        setCurrentPassword("")
        setNewPassword("")
        setConfirmPassword("")
      } else {
        setMessage({ type: "error", text: res.message })
      }
    })
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "bg-red-500/10 text-red-500 border-red-500/20"
      case "SELLER":
        return "bg-primary/10 text-primary border-primary/20"
      default:
        return "bg-slate-500/10 text-slate-500 border-slate-500/20"
    }
  }

  const getRoleName = (role: string) => {
    switch (role) {
      case "SUPER_ADMIN":
        return "Super Admin"
      case "SELLER":
        return "Pemilik Kos (Seller)"
      default:
        return "Pencari Kos (User)"
    }
  }

  // Helper to check if avatar is a preset gradient or custom URL
  const renderAvatarPreview = () => {
    const isGradient = avatar && (avatar.startsWith("linear-gradient") || PRESET_AVATARS.includes(avatar))
    
    if (isGradient) {
      return (
        <div 
          className="w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-extrabold"
          style={{ background: avatar }}
        >
          {name?.[0]?.toUpperCase()}
        </div>
      )
    } else if (avatar && avatar.trim() !== "") {
      return (
        <img 
          src={avatar} 
          alt={name} 
          className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover"
          onError={() => {
            // fallback to generic name initials
            setAvatar(PRESET_AVATARS[0])
          }}
        />
      )
    } else {
      // Default initial avatar (first gradient preset)
      return (
        <div 
          className="w-24 h-24 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-white text-3xl font-extrabold bg-primary"
          style={{ background: PRESET_AVATARS[0] }}
        >
          {name?.[0]?.toUpperCase()}
        </div>
      )
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      {/* Title section */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold tracking-tight">Profil Pengguna</h1>
        <p className="text-muted-foreground text-sm mt-1">Kelola data diri, keamanan akun, dan statistik aktivitas Anda.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Profile Card */}
        <div className="lg:col-span-4 space-y-6">
          <Card className="overflow-hidden border border-border shadow-sm rounded-2xl">
            {/* Elegant Gradient Banner */}
            <div className="h-28 bg-gradient-to-r from-primary to-accent opacity-90 relative" />
            
            <div className="px-6 pb-6 relative">
              {/* Avatar position offset */}
              <div className="flex justify-center -mt-12 mb-4">
                {renderAvatarPreview()}
              </div>

              {/* User Bio Details */}
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">{name}</h2>
                <p className="text-sm text-muted-foreground flex items-center justify-center gap-1">
                  <Mail className="w-3.5 h-3.5" /> {user.email}
                </p>
                <div className="flex justify-center pt-2">
                  <Badge variant="outline" className={`rounded-full px-3 py-0.5 text-xs font-semibold ${getRoleBadgeColor(user.role)}`}>
                    {getRoleName(user.role)}
                  </Badge>
                </div>
              </div>

              <div className="mt-6 border-t border-border pt-4 space-y-3">
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5"><Calendar className="w-3.5 h-3.5" /> Bergabung</span>
                  <span className="font-medium text-foreground">
                    {new Date(user.createdAt).toLocaleDateString("id-ID", {
                      day: "numeric",
                      month: "long",
                      year: "numeric"
                    })}
                  </span>
                </div>
                
                {user.role === "SELLER" && (
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5"><Home className="w-3.5 h-3.5" /> Total Kos</span>
                    <span className="font-semibold text-primary">{user._count?.kos || 0} Unit</span>
                  </div>
                )}
              </div>
            </div>
          </Card>

          {/* Tab Navigation Menu */}
          <div className="bg-white rounded-2xl border border-border p-2.5 flex flex-col gap-1 shadow-sm">
            <button
              onClick={() => { setActiveTab("profile"); setMessage(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === "profile" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
              }`}
            >
              <User className="w-4 h-4" />
              <span>Detail Profil</span>
            </button>
            
            <button
              onClick={() => { setActiveTab("password"); setMessage(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === "password" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
              }`}
            >
              <Lock className="w-4 h-4" />
              <span>Ubah Password</span>
            </button>

            <button
              onClick={() => { setActiveTab("stats"); setMessage(null); }}
              className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
                activeTab === "stats" 
                  ? "bg-primary text-primary-foreground shadow-sm" 
                  : "text-muted-foreground hover:bg-slate-50 hover:text-foreground"
              }`}
            >
              <Shield className="w-4 h-4" />
              <span>Akses & Aktivitas</span>
            </button>
          </div>
        </div>

        {/* Right Column: Interactive Details Form */}
        <div className="lg:col-span-8">
          {/* Action Message Banner */}
          <AnimatePresence mode="wait">
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className={`mb-6 p-4 rounded-xl border flex items-start gap-3 text-sm ${
                  message.type === "success" 
                    ? "bg-emerald-50 border-emerald-200 text-emerald-800" 
                    : "bg-rose-50 border-rose-200 text-rose-800"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                )}
                <div>
                  <p className="font-semibold">{message.type === "success" ? "Berhasil" : "Gagal"}</p>
                  <p className="mt-0.5 text-xs opacity-90">{message.text}</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="bg-white border border-border shadow-sm rounded-2xl overflow-hidden min-h-[400px] p-6 sm:p-8">
            <AnimatePresence mode="wait">
              
              {/* TAB 1: Edit Profile details */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  <h3 className="text-lg font-bold mb-1">Informasi Pribadi</h3>
                  <p className="text-muted-foreground text-xs mb-6">Perbarui nama lengkap, nomor telepon, dan tampilan foto profil Anda.</p>
                  
                  <form onSubmit={handleProfileUpdate} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="name" className="text-xs font-semibold text-slate-700">Nama Lengkap</Label>
                        <Input
                          id="name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Masukkan nama lengkap"
                          className="rounded-xl border-border px-3.5 py-2 text-sm focus:ring-2 focus:ring-primary/20"
                          required
                          disabled={isPending}
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-xs font-semibold text-slate-700">Alamat Email (Tidak dapat diubah)</Label>
                        <div className="relative">
                          <Input
                            id="email"
                            value={user.email}
                            disabled
                            className="rounded-xl bg-slate-50 border-border px-3.5 py-2 text-sm text-slate-400 cursor-not-allowed"
                          />
                          <Mail className="absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-xs font-semibold text-slate-700">Nomor Telepon (WhatsApp)</Label>
                        <div className="relative">
                          <Input
                            id="phone"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="Contoh: 081234567890"
                            className="rounded-xl border-border pl-10 pr-3.5 py-2 text-sm"
                            disabled={isPending}
                          />
                          <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avatar-url" className="text-xs font-semibold text-slate-700">Custom Avatar URL (Opsional)</Label>
                        <Input
                          id="avatar-url"
                          value={avatar && !avatar.startsWith("linear-gradient") ? avatar : ""}
                          onChange={(e) => setAvatar(e.target.value)}
                          placeholder="https://example.com/avatar.jpg"
                          className="rounded-xl border-border px-3.5 py-2 text-sm"
                          disabled={isPending}
                        />
                      </div>
                    </div>

                    {/* Predefined Avatars Picker */}
                    <div className="space-y-3 pt-2">
                      <Label className="text-xs font-semibold text-slate-700">Atau Pilih Tema Avatar Warna:</Label>
                      <div className="flex flex-wrap gap-3">
                        {PRESET_AVATARS.map((gradient, index) => (
                          <button
                            key={index}
                            type="button"
                            onClick={() => setAvatar(gradient)}
                            className={`w-10 h-10 rounded-full border-2 transition-all scale-100 active:scale-95 ${
                              avatar === gradient 
                                ? "border-primary ring-2 ring-primary/20 scale-105" 
                                : "border-slate-200 hover:border-slate-400"
                            }`}
                            style={{ background: gradient }}
                            title={`Preset Gradient ${index + 1}`}
                          />
                        ))}
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                      <Button 
                        type="submit" 
                        disabled={isPending} 
                        className="rounded-xl bg-primary hover:bg-primary/95 text-white font-medium px-6 py-2.5 h-auto"
                      >
                        {isPending ? "Menyimpan..." : "Simpan Perubahan"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 2: Change Password */}
              {activeTab === "password" && (
                <motion.div
                  key="password-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                >
                  <h3 className="text-lg font-bold mb-1">Keamanan Akun</h3>
                  <p className="text-muted-foreground text-xs mb-6">Ubah kata sandi secara berkala untuk menjaga keamanan akun Anda.</p>

                  <form onSubmit={handlePasswordUpdate} className="space-y-5">
                    <div className="space-y-2">
                      <Label htmlFor="currentPassword" className="text-xs font-semibold text-slate-700">Password Saat Ini</Label>
                      <div className="relative">
                        <Input
                          id="currentPassword"
                          type="password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                          placeholder="Masukkan password saat ini"
                          className="rounded-xl border-border pl-10 pr-3.5 py-2 text-sm"
                          required
                          disabled={isPending}
                        />
                        <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <div className="space-y-2">
                        <Label htmlFor="newPassword" className="text-xs font-semibold text-slate-700">Password Baru</Label>
                        <div className="relative">
                          <Input
                            id="newPassword"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Minimal 8 karakter"
                            className="rounded-xl border-border pl-10 pr-3.5 py-2 text-sm"
                            required
                            disabled={isPending}
                          />
                          <KeyRound className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="confirmPassword" className="text-xs font-semibold text-slate-700">Konfirmasi Password Baru</Label>
                        <div className="relative">
                          <Input
                            id="confirmPassword"
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Ulangi password baru"
                            className="rounded-xl border-border pl-10 pr-3.5 py-2 text-sm"
                            required
                            disabled={isPending}
                          />
                          <UserCheck className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end pt-4 border-t border-border">
                      <Button 
                        type="submit" 
                        disabled={isPending} 
                        className="rounded-xl bg-primary hover:bg-primary/95 text-white font-medium px-6 py-2.5 h-auto"
                      >
                        {isPending ? "Mengubah..." : "Ubah Password"}
                      </Button>
                    </div>
                  </form>
                </motion.div>
              )}

              {/* TAB 3: Access & Stats details */}
              {activeTab === "stats" && (
                <motion.div
                  key="stats-tab"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6"
                >
                  <div>
                    <h3 className="text-lg font-bold mb-1">Akses & Aktivitas</h3>
                    <p className="text-muted-foreground text-xs">Informasi hak akses peran Anda dan ringkasan aktivitas.</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2.5">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">Peran Akun</span>
                        <Badge variant="outline" className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getRoleBadgeColor(user.role)}`}>
                          {user.role}
                        </Badge>
                      </div>
                      <p className="text-sm font-bold text-slate-800">
                        {user.role === "SUPER_ADMIN" 
                          ? "Akses Penuh Sistem" 
                          : user.role === "SELLER" 
                          ? "Pemasar & Pemilik Kos" 
                          : "Pencari Kos"}
                      </p>
                      <p className="text-xs text-slate-500 leading-relaxed">
                        {user.role === "SUPER_ADMIN" 
                          ? "Anda memiliki otoritas penuh untuk mengelola kriteria, sub-kriteria, seluruh kos terdaftar, dan pengguna." 
                          : user.role === "SELLER" 
                          ? "Anda dapat mempublikasikan kos baru, mengedit info kos, dan melihat visualisasi peringkat rekomendasi SAW." 
                          : "Anda dapat mencari kos terbaik di daerah Condong Catur menggunakan sistem pendukung keputusan metode SAW."}
                      </p>
                    </div>

                    <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 space-y-2.5 flex flex-col justify-between">
                      <div>
                        <span className="text-xs text-muted-foreground font-medium uppercase tracking-wider">ID Anggota</span>
                        <p className="text-xs font-mono font-bold text-slate-700 select-all truncate mt-1 bg-white border border-slate-100 rounded-lg p-2">
                          {user.id}
                        </p>
                      </div>
                      <div className="text-xs text-slate-500 pt-2 border-t border-slate-200/50">
                        Pendaftaran diverifikasi melalui sistem login terenkripsi KosRank.
                      </div>
                    </div>
                  </div>

                  {/* Redirection Links based on role */}
                  <div className="bg-gradient-to-br from-primary/5 to-accent/5 border border-primary/10 rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="text-sm font-bold text-slate-800">
                        {user.role === "SUPER_ADMIN" 
                          ? "Akses Panel Admin" 
                          : user.role === "SELLER" 
                          ? "Kelola Listing Kos Anda" 
                          : "Eksplorasi Kos Sekarang"}
                      </h4>
                      <p className="text-xs text-slate-500">
                        {user.role === "SUPER_ADMIN" 
                          ? "Kelola kriteria bobot SAW, pengguna, dan kos di halaman admin." 
                          : user.role === "SELLER" 
                          ? "Tambahkan kos baru atau edit fasilitas & harga untuk menaikkan nilai SAW." 
                          : "Bandingkan fasilitas, jarak, dan harga kos secara akurat."}
                      </p>
                    </div>
                    
                    <a
                      href={user.role === "SUPER_ADMIN" ? "/admin" : user.role === "SELLER" ? "/seller" : "/explore"}
                      className="inline-flex items-center gap-1.5 bg-primary hover:bg-primary/95 text-white font-medium text-xs px-4.5 py-2.5 rounded-xl shadow-sm hover:shadow transition-all group"
                    >
                      <span>
                        {user.role === "SUPER_ADMIN" 
                          ? "Buka Admin Panel" 
                          : user.role === "SELLER" 
                          ? "Buka Seller Dashboard" 
                          : "Eksplor Kos"}
                      </span>
                      <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}
