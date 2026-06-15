"use client";

import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Phone, Shield, Send, X, MessageSquare, CheckCircle, Calendar, Clock, Loader2, Check, UserCheck, AlertTriangle, ArrowRight } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";

interface BuyBoxProps {
  kosId: string;
  kosName: string;
  price: number;
  ownerId: string | null;
}

interface Message {
  id: string;
  senderId: string;
  text: string;
  createdAt: string;
  sender: {
    name: string;
  };
}

export function BuyBox({ kosId, kosName, price, ownerId }: BuyBoxProps) {
  const { data: session } = useSession();
  const router = useRouter();

  // Dialog/Modal States
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isSewaOpen, setIsSewaOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authActionName, setAuthActionName] = useState("");
  
  const [bookingSuccess, setBookingSuccess] = useState(false);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [bookingError, setBookingError] = useState("");

  // Chat States
  const [roomId, setRoomId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const [sendingLoading, setSendingLoading] = useState(false);

  // Rental states
  const [duration, setDuration] = useState(1);
  const [agreeTerms, setAgreeTerms] = useState(true);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  const isOwner = session?.user && ownerId && session.user.id === ownerId;

  // Auto-scroll to bottom of chat
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isChatOpen) {
      scrollToBottom();
    }
  }, [messages, isChatOpen]);

  // Clean up polling on chat close
  useEffect(() => {
    if (!isChatOpen && pollIntervalRef.current) {
      clearInterval(pollIntervalRef.current);
    }
    return () => {
      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
    };
  }, [isChatOpen]);

  // Handle Login Check
  const checkAuth = (actionName: string) => {
    if (!session) {
      setAuthActionName(actionName);
      setIsAuthModalOpen(true);
      return false;
    }
    return true;
  };

  // ─── Sewa / Booking Logic ────────────────────────────────────────────────
  const handleAjukanSewa = async () => {
    if (!checkAuth("mengajukan sewa")) return;
    if (!agreeTerms) {
      setBookingError("Anda harus menyetujui syarat dan ketentuan.");
      return;
    }
    setBookingLoading(true);
    setBookingError("");

    try {
      const res = await fetch("/api/bookings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kosId, durationMonths: duration }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Gagal mengajukan sewa.");
      }

      setBookingSuccess(true);
      setTimeout(() => {
        setIsSewaOpen(false);
        setBookingSuccess(false);
      }, 3500);
    } catch (err: any) {
      setBookingError(err.message);
    } finally {
      setBookingLoading(false);
    }
  };

  // ─── Chat Logic ──────────────────────────────────────────────────────────
  const handleOpenChat = async () => {
    if (!checkAuth("bertanya ke pemilik")) return;
    if (!ownerId) {
      setBookingError("Pemilik kos tidak teridentifikasi.");
      return;
    }

    setIsChatOpen(true);
    setChatLoading(true);

    try {
      const roomRes = await fetch("/api/chats/rooms", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kosId, sellerId: ownerId }),
      });
      const roomData = await roomRes.json();

      if (!roomRes.ok) {
        throw new Error(roomData.error || "Gagal memuat ruang obrolan.");
      }

      setRoomId(roomData.id);

      await fetchMessages(roomData.id);

      if (pollIntervalRef.current) clearInterval(pollIntervalRef.current);
      pollIntervalRef.current = setInterval(() => {
        fetchMessages(roomData.id);
      }, 3000);

    } catch (err: any) {
      alert(err.message);
      setIsChatOpen(false);
    } finally {
      setChatLoading(false);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      const res = await fetch(`/api/chats/rooms/${id}/messages`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (err) {
      console.error("Gagal memuat pesan:", err);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !roomId || sendingLoading) return;

    setSendingLoading(true);
    const textToSend = newMessage;
    setNewMessage("");

    try {
      const res = await fetch(`/api/chats/rooms/${roomId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: textToSend }),
      });

      if (!res.ok) {
        throw new Error("Gagal mengirim pesan");
      }

      const data = await res.json();
      setMessages((prev) => [...prev, data]);
    } catch (err: any) {
      alert(err.message);
    } finally {
      setSendingLoading(false);
    }
  };

  // Helper for names initials
  const getInitials = (name: string) => {
    return name ? name.substring(0, 2).toUpperCase() : "PM";
  };

  return (
    <>
      {/* ─── Buy Box Sidebar Box ─── */}
      <div className="bg-white border border-[#D5D9D9] rounded-lg p-5 font-sans text-left shadow-md relative overflow-hidden">
        {/* Subtle accent border top */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#FF9900] to-[#FEBD69]" />
        
        {/* Price section */}
        <div className="flex items-baseline gap-0.5 text-[#0F1111] mb-1">
          <span className="text-[13px] font-normal align-super">Rp</span>
          <span className="text-[26px] font-extrabold leading-none tracking-tight">
            {price.toLocaleString("id-ID")}
          </span>
          <span className="text-[12px] text-[#565959] font-normal ml-0.5">/bulan</span>
        </div>

        {/* Delivery/Survey details */}
        <div className="text-[13px] text-[#0F1111] mt-3 space-y-2 border-b border-[#F0F2F2] pb-3.5">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#067D62]" />
            <span>Survei Lokasi: <span className="font-bold text-[#067D62]">Bisa Hari Ini</span></span>
          </div>
          <p className="text-slate-500 text-[12px] leading-relaxed pl-3.5">
            Kunjungi kos secara langsung bersama pemilik untuk mencocokkan kelayakan fasilitas kamar.
          </p>
        </div>

        {/* Owner View vs Seeker View */}
        {isOwner ? (
          <div className="mt-4 bg-[#FFF8F2] border border-[#FF9900]/30 rounded p-3 text-left">
            <div className="flex items-start gap-2">
              <AlertTriangle className="w-4.5 h-4.5 text-[#FF9900] flex-shrink-0 mt-0.5" />
              <div className="space-y-1">
                <span className="font-bold text-[12px] text-[#804000]">Iklan Kos Anda</span>
                <p className="text-slate-600 text-[11px] leading-relaxed">
                  Ini adalah properti kos yang Anda daftarkan. Anda dapat memantau pengajuan sewa dan pesan masuk dari Dashboard Penjual Anda.
                </p>
                <Link 
                  href="/seller" 
                  className="inline-flex items-center gap-1 text-[11px] font-bold text-[#007185] hover:underline pt-1"
                >
                  Buka Dashboard Penjual <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Availability Status Indicator Banner */}
            <div className="mt-3.5 bg-[#E7F4F5] border border-[#007185]/20 rounded p-2.5 flex items-center gap-2">
              <CheckCircle className="w-4.5 h-4.5 text-[#007185]" />
              <div className="text-[12px]">
                <span className="font-bold text-[#007185]">Status Kamar: </span>
                <span className="text-slate-700">Tersedia untuk disewa</span>
              </div>
            </div>

            {/* Action Buttons with 3D Amazon Bevel Feel */}
            <div className="mt-4.5 space-y-3">
              {/* Primary Gold: Ajukan Sewa */}
              <button 
                onClick={() => setIsSewaOpen(true)}
                className="w-full bg-gradient-to-b from-[#FFF0A5] to-[#FFD814] hover:from-[#FFE775] hover:to-[#F7CA00] active:border-[#B59100] text-[#0F1111] border border-[#F2C200] rounded text-[13px] font-semibold h-[38px] shadow-[0_1px_2px_rgba(15,17,17,0.15)] flex items-center justify-center gap-2 transition-all cursor-pointer transform active:translate-y-px"
              >
                <Calendar className="w-4 h-4 text-slate-800" />
                Ajukan Sewa Sekarang
              </button>

              {/* Secondary Orange: Tanya Pemilik */}
              <button 
                onClick={handleOpenChat}
                className="w-full bg-gradient-to-b from-[#FFC48C] to-[#FFA41C] hover:from-[#FFB066] hover:to-[#F3A847] active:border-[#A86B00] text-[#0F1111] border border-[#E59200] rounded text-[13px] font-semibold h-[38px] shadow-[0_1px_2px_rgba(15,17,17,0.15)] flex items-center justify-center gap-2 transition-all cursor-pointer transform active:translate-y-px"
              >
                <MessageSquare className="w-4 h-4 text-slate-800" />
                Tanya Pemilik (Chat App)
              </button>
            </div>
          </>
        )}

        {/* Trust Signal */}
        <div className="mt-5 pt-3.5 border-t border-[#F0F2F2] flex items-start gap-2.5 text-[11px] text-[#565959] leading-relaxed">
          <Shield className="w-4 h-4 text-[#007185] flex-shrink-0 mt-0.5" />
          <span>
            <strong>Keamanan KosRank.</strong> Data kamar, harga, dan koordinat diverifikasi objektif via metode SPK SAW.
          </span>
        </div>
      </div>


      {/* ─── MODAL 1: AJUKAN SEWA (Direct Lease Slip Style) ──────────────── */}
      <AnimatePresence>
        {isSewaOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#D5D9D9] rounded-lg max-w-md w-full overflow-hidden shadow-2xl"
            >
              {/* Header */}
              <div className="bg-[#232F3E] text-white px-4 py-3.5 flex items-center justify-between">
                <h3 className="font-bold text-[14px] tracking-wide flex items-center gap-2">
                  <Calendar className="w-4.5 h-4.5 text-[#FF9900]" />
                  Pengajuan Sewa Resmi
                </h3>
                <button 
                  onClick={() => setIsSewaOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4">
                {bookingSuccess ? (
                  <div className="flex flex-col items-center justify-center py-8 text-center space-y-3">
                    <div className="w-14 h-14 rounded-full bg-[#E7F4F5] flex items-center justify-center">
                      <CheckCircle className="w-8 h-8 text-[#067D62]" />
                    </div>
                    <div>
                      <h4 className="font-bold text-[#0F1111] text-[16px]">Pengajuan Sewa Terkirim!</h4>
                      <p className="text-xs text-slate-500 mt-1.5 max-w-[300px] leading-relaxed">
                        Data pemesanan sewa Anda telah dicatat di database. Pemilik kos akan segera memberi persetujuan atau menolak via dashboard.
                      </p>
                    </div>
                  </div>
                ) : (
                  <>
                    <div>
                      <div className="text-[11px] text-[#565959] uppercase tracking-wider font-semibold">Nama Kos</div>
                      <div className="text-[14px] font-bold text-[#0F1111] mt-0.5">{kosName}</div>
                    </div>

                    {/* Receipt Price slip */}
                    <div className="bg-[#F7FAFA] border border-[#D5D9D9] p-3 rounded-md space-y-2">
                      <div className="flex justify-between items-center text-[12px]">
                        <span className="text-slate-500">Tarif Kamar</span>
                        <span className="font-semibold text-[#0F1111]">Rp {price.toLocaleString("id-ID")} /bulan</span>
                      </div>
                      
                      {/* Select Duration */}
                      <div className="space-y-1 pt-1.5 border-t border-[#D5D9D9]/60">
                        <label className="block text-[12px] font-bold text-[#0F1111]">
                          Pilih Jangka Waktu Sewa:
                        </label>
                        <select 
                          value={duration} 
                          onChange={(e) => setDuration(parseInt(e.target.value))}
                          className="w-full border border-[#D5D9D9] bg-white rounded px-2.5 py-1.5 text-[13px] text-[#0F1111] outline-none focus:border-[#FF9900] cursor-pointer font-sans"
                        >
                          <option value={1}>1 Bulan</option>
                          <option value={3}>3 Bulan</option>
                          <option value={6}>6 Bulan</option>
                          <option value={12}>12 Bulan (1 Tahun)</option>
                        </select>
                      </div>
                    </div>

                    {/* Total Price Statement */}
                    <div className="flex justify-between items-baseline pt-3 border-t border-[#F0F2F2]">
                      <span className="text-[13px] text-[#0f1111] font-semibold">Estimasi Tagihan:</span>
                      <span className="text-[20px] font-extrabold text-[#B12704] tracking-tight">
                        Rp {(price * duration).toLocaleString("id-ID")}
                      </span>
                    </div>

                    {/* Checkbox agreement */}
                    <label className="flex items-start gap-2.5 cursor-pointer select-none py-1">
                      <input 
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 accent-[#007185] rounded cursor-pointer"
                      />
                      <span className="text-[11px] text-slate-500 leading-normal">
                        Saya menyetujui survei lokasi awal dan berkomitmen mengikuti syarat pengisian sewa di KosRank.
                      </span>
                    </label>

                    {bookingError && (
                      <div className="text-xs text-[#B12704] bg-red-50 border border-red-200 p-2.5 rounded">
                        {bookingError}
                      </div>
                    )}

                    {/* Submit Button */}
                    <button
                      onClick={handleAjukanSewa}
                      disabled={bookingLoading || !agreeTerms}
                      className="w-full bg-gradient-to-b from-[#FFF0A5] to-[#FFD814] hover:from-[#FFE775] hover:to-[#F7CA00] disabled:opacity-50 disabled:cursor-not-allowed text-[#0F1111] border border-[#F2C200] rounded text-[13px] font-bold h-[40px] shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      {bookingLoading ? (
                        <>
                          <Loader2 className="w-4.5 h-4.5 animate-spin text-slate-600" />
                          Memproses Pengajuan...
                        </>
                      ) : (
                        "Kirim Form Sewa Ke Pemilik"
                      )}
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ─── MODAL 2: AUTH REQUIRED PROMPT (Gorgeous themed login request) ─── */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-[1px]">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-[#D5D9D9] rounded-lg max-w-sm w-full overflow-hidden shadow-2xl font-sans"
            >
              {/* Header */}
              <div className="bg-[#232F3E] text-white px-4 py-3.5 flex items-center justify-between">
                <h3 className="font-bold text-[14px] tracking-wide flex items-center gap-2">
                  <Shield className="w-4.5 h-4.5 text-[#FF9900]" />
                  Akses Masuk Diperlukan
                </h3>
                <button 
                  onClick={() => setIsAuthModalOpen(false)}
                  className="text-slate-400 hover:text-white p-1 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Body */}
              <div className="p-5 space-y-4 text-left">
                <p className="text-[13px] text-slate-600 leading-relaxed">
                  Untuk dapat <span className="font-bold text-[#0F1111]">{authActionName}</span>, Anda wajib masuk (login) terlebih dahulu menggunakan akun pencari kos Anda.
                </p>

                <div className="flex gap-3 pt-2">
                  {/* Cancel */}
                  <button
                    onClick={() => setIsAuthModalOpen(false)}
                    className="flex-1 bg-white hover:bg-[#F7FAFA] text-[#0F1111] border border-[#D5D9D9] rounded text-[13px] font-semibold h-[36px] transition-colors cursor-pointer"
                  >
                    Batal
                  </button>

                  {/* Login */}
                  <button
                    onClick={() => {
                      setIsAuthModalOpen(false);
                      router.push("/auth/login");
                    }}
                    className="flex-1 bg-gradient-to-b from-[#FFF0A5] to-[#FFD814] hover:from-[#FFE775] hover:to-[#F7CA00] active:border-[#B59100] text-[#0F1111] border border-[#F2C200] rounded text-[13px] font-bold h-[36px] shadow-sm flex items-center justify-center transition-all cursor-pointer"
                  >
                    Masuk Sekarang
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>


      {/* ─── DRAWER: FLOATING CHAT DRAWER (Slides in from Right with custom dot canvas) ─── */}
      <AnimatePresence>
        {isChatOpen && (
          <>
            {/* Backdrop */}
            <div 
              className="fixed inset-0 bg-black/50 z-40 backdrop-blur-[0.5px]" 
              onClick={() => setIsChatOpen(false)}
            />

            {/* Sidebar drawer content */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 26, stiffness: 220 }}
              className="fixed top-0 right-0 h-full w-full max-w-[420px] bg-[#F0F2F2] shadow-2xl z-50 flex flex-col border-l border-[#D5D9D9]"
            >
              {/* Drawer Header */}
              <div className="bg-[#232F3E] text-white px-4 h-[64px] flex items-center justify-between border-b border-[#19222d] flex-shrink-0">
                <div className="flex items-center gap-3">
                  {/* Initials Avatar */}
                  <div className="w-9 h-9 rounded-full bg-[#FF9900] text-[#232F3E] font-extrabold text-[13px] flex items-center justify-center shadow-sm">
                    {getInitials(kosName)}
                  </div>
                  <div className="flex flex-col text-left">
                    <span className="text-[13px] font-bold text-white truncate max-w-[220px]">
                      {kosName}
                    </span>
                    <span className="text-[10px] text-slate-300 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#067D62] animate-pulse" />
                      Pemilik Kos Terverifikasi
                    </span>
                  </div>
                </div>
                
                <button 
                  onClick={() => setIsChatOpen(false)}
                  className="text-slate-400 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Chat Messages Body with Radial Dot Grid Background Pattern */}
              <div 
                className="flex-1 overflow-y-auto p-4 space-y-4"
                style={{
                  backgroundImage: "radial-gradient(#007185 0.6px, transparent 0.6px), radial-gradient(#007185 0.6px, #F0F2F2 0.6px)",
                  backgroundSize: "24px 24px",
                  backgroundPosition: "0 0, 12px 12px",
                  opacity: 0.95
                }}
              >
                {chatLoading ? (
                  <div className="flex flex-col items-center justify-center h-full gap-2 text-slate-400">
                    <Loader2 className="w-7 h-7 animate-spin text-[#007185]" />
                    <span className="text-xs font-semibold">Menghubungkan obrolan...</span>
                  </div>
                ) : messages.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-full text-center px-6 space-y-2 bg-white/70 backdrop-blur-[2px] rounded-lg m-4 p-6 border border-[#D5D9D9]">
                    <MessageSquare className="w-10 h-10 text-[#007185] opacity-80" />
                    <h5 className="font-bold text-[14px] text-[#0F1111]">Mulai Diskusi Kos</h5>
                    <p className="text-[11px] text-slate-500 leading-relaxed">
                      Tanyakan langsung kepada pemilik mengenai negosiasi harga, ketersediaan kamar, aturan parkir, atau atur janji temu.
                    </p>
                  </div>
                ) : (
                  messages.map((msg) => {
                    const isMe = msg.senderId === session?.user?.id;
                    return (
                      <div 
                        key={msg.id}
                        className={`flex gap-2 items-end max-w-[85%] ${
                          isMe ? "ml-auto flex-row-reverse" : "mr-auto"
                        }`}
                      >
                        {/* Chat bubble avatar */}
                        {!isMe && (
                          <div className="w-6 h-6 rounded-full bg-[#FF9900] text-[#232F3E] text-[10px] font-bold flex items-center justify-center flex-shrink-0 shadow-sm">
                            {getInitials(msg.sender.name)}
                          </div>
                        )}
                        
                        <div className="flex flex-col items-end">
                          <div 
                            className={`rounded-2xl px-3 py-2 text-[13px] shadow-sm leading-relaxed border ${
                              isMe 
                                ? "bg-[#E7F4F5] border-[#007185]/20 text-[#0F1111] rounded-tr-none"
                                : "bg-white border-[#D5D9D9] text-[#0F1111] rounded-tl-none"
                            }`}
                          >
                            <p className="whitespace-pre-wrap break-words">{msg.text}</p>
                          </div>
                          
                          {/* Timestamp and verify checks */}
                          <div className="flex items-center gap-1 text-[9px] text-slate-400 mt-1 px-1">
                            <span>
                              {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                            {isMe && <span className="text-[#007185] font-bold">✓✓</span>}
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Form Input Area */}
              <form 
                onSubmit={handleSendMessage}
                className="bg-white border-t border-[#D5D9D9] p-3 flex gap-2 items-center flex-shrink-0 shadow-[0_-1px_3px_rgba(0,0,0,0.05)]"
              >
                <input 
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Ketik pertanyaan Anda..."
                  disabled={chatLoading || sendingLoading}
                  className="flex-1 border border-[#D5D9D9] rounded-md px-3 h-[36px] text-[13px] text-[#0F1111] outline-none focus:border-[#FF9900] focus:ring-1 focus:ring-[#FF9900]"
                />
                
                <button
                  type="submit"
                  disabled={chatLoading || sendingLoading || !newMessage.trim()}
                  className="bg-gradient-to-b from-[#FFF0A5] to-[#FFD814] hover:from-[#FFE775] hover:to-[#F7CA00] disabled:from-slate-100 disabled:to-slate-100 disabled:border-slate-200 disabled:text-slate-400 text-[#0F1111] border border-[#F2C200] h-[36px] px-3.5 flex items-center justify-center rounded-md cursor-pointer transition-colors shadow-sm active:translate-y-px"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </form>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
