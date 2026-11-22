# Changelog

Semua perubahan penting pada proyek KosRank didokumentasikan di file ini.

Format mengikuti [Keep a Changelog](https://keepachangelog.com/id/1.1.0/)
dan versioning mengikuti [Semantic Versioning](https://semver.org/lang/id/).

## [0.2.0] - Unreleased

> Seluruh perubahan di bawah ini masih **belum di-commit** (basis: commit `f684ce9`).

### Added

- **Registrasi pengguna**: halaman `/auth/register` + `POST /api/auth/register` (bcrypt, validasi, auto-login setelah daftar, link silang dengan login).
- **Lupa & reset password**: `POST /api/auth/forgot-password` (token acak, disimpan sebagai hash SHA-256, kedaluwarsa 1 jam), `POST /api/auth/reset-password` (token sekali pakai), halaman `/auth/forgot-password` dan `/auth/reset-password`, kolom `resetToken`/`resetTokenExpiry` di model `User`.
- **Dashboard USER** `/dashboard`: riwayat pengajuan sewa (kos, durasi, tanggal mulai, estimasi biaya), badge status, kartu statistik, empty state dengan CTA.
- **Halaman publik `/saw`**: transparansi penuh perhitungan SAW tanpa login (kriteria & rubrik, alternatif A01–A05, matriks keputusan X, matriks ternormalisasi R, perkalian W×R per langkah, ranking akhir), `force-dynamic`, plus `loading.tsx` dan empty state.
- **Kelola booking untuk admin** `/admin/bookings`: daftar seluruh pengajuan sewa dengan tombol Setujui/Tolak (server action berguard role ADMIN), menu baru di AdminSidebar.
- **Seeder katalog real** `prisma/seed_kost.ts` + script `npm run seed:kost`: membaca `data_kost.xlsx` langsung (dependency `xlsx`) dan mengisi **233 kos asli**; dedup per nama+kecamatan, rating "Not found" → null, harga digits-only, kecamatan dinormalisasi, koordinat level kecamatan dengan offset deterministik, fasilitas dipetakan ke 12 fasilitas kanonik, 55 booking sampel, recompute SAW.
- **Input gambar & rating pada form kos admin**: textarea URL gambar multi-baris (sinkronisasi tabel `KosImage` di create/update, termasuk modal AdminKosTable) dan input rating 0–5 (kolom baru `Kos.rating`).
- **Filter Eksplor**: checkbox fasilitas (query `fasilitas`) dan dropdown kampus/lokasi yang diambil dari data DB.
- **Notifikasi**: `GET /api/notifikasi/unread` menghitung data nyata (admin: booking PENDING; user: booking yang sudah diputuskan) + bell badge di Navbar.
- **Testing**: Vitest + `npm test`, 8 test termasuk oracle `data_kost.xlsx` (A04 = 0.9333 rank 1; urutan A04 → A03 → A05 → A01 → A02).
- **Validasi zod** di seluruh boundary API (register, bookings, chat rooms & messages, forgot/reset password) serta `parseKosInput` dan `updateBookingStatus` di server actions.
- `POST /api/bookings` kini menerima `startDate` dan BuyBox mengirimkannya (input tanggal di modal sewa).

### Changed

- **Role disederhanakan menjadi `ADMIN` dan `USER`** (sebelumnya `SUPER_ADMIN`, `SELLER`, `USER`); seluruh fitur panel seller dilebur ke panel admin; akses `/seller/*` dialihkan ke `/admin`; data existing dimigrasi non-destruktif; seed diperbarui (email & password akun tidak berubah).
- **Kriteria SAW: 6 → 5 kriteria** sesuai `data_kost.xlsx` — C1 Harga 0.30 (Cost), C2 Fasilitas 0.30 (Benefit), C3 Jarak 0.20 (Cost), C4 Ukuran Ruangan 0.10 (Benefit), C5 Rating 0.10 (Benefit) — beserta scorer baru (fasilitas berbasis jumlah fasilitas, rating baru) dan matriks skor eksak untuk 5 alternatif studi kasus.
- **Konsistensi ranking global**: override skor hardcoded 5 kos studi kasus tidak lagi bocor ke perhitungan global; ranking `finalScore`/`ranking` di DB sekarang murni dihitung dari data (terverifikasi: hitung ulang independen = DB untuk 233/233 kos). Override eksak Excel hanya berlaku pada tampilan terisolasi `/saw`.
- **Copy & fakta diperbarui**: "Condong Catur" → Depok (metadata, footer, eksplor, placeholder form), "6 kriteria" → 5 kriteria dengan bobot baru di halaman detail kos, subtitle login tidak lagi "khusus administrator".
- **Halaman auth didesain ulang**: latar solid `brand-900` menggantikan gradient biru generik, `min-h-screen` (memperbaiki strip putih di bawah halaman), logo & teks adaptif latar gelap.
- **Pass anti-slop (skill antislop + antislop-ui)**: 0 em dash pada copy UI, klaim tanpa bukti dihapus ("Pemilik Kos Terverifikasi", "diverifikasi", "Support 24/7"), dot `animate-pulse` dekoratif dihapus, CTA generik "Eksplor" → "Cari Kos Sekarang", ikon `Zap` → `Calculator`, link bento landing & footer mengarah ke filter lokasi yang benar-benar berisi data (Beji/Cinere/Cimanggis/Limo).
- Navbar: link "Perhitungan SAW" di navigasi utama dan util bar; kartu "Titik Acuan Rekomendasi" tetap berfungsi (terverifikasi: titik jauh mengubah skor & jarak).

### Fixed

- `/dashboard` sebelumnya 404 untuk role USER (route tidak pernah dibuat padahal Navbar mengarah ke sana).
- Funnel booking macet: booking hanya bisa dibuat, tidak pernah bisa disetujui/ditolak oleh siapa pun — kini lengkap di sisi admin.
- Link `/seller/kos/[id]/edit` 404 (alur edit kos kini melalui `/admin/kos`).
- Tanggal mulai sewa (`startDate`) tidak pernah diterima API meski ada di skema dan form.
- Notifikasi API sebelumnya hardcoded `{ unread: 0 }` tanpa query database.
- Ranking global tidak konsisten dengan tampilan landing (akibat bocornya override skor nama) — kini identik dan terverifikasi independen.

### Removed

- Panel seller (`/seller/*`, `SellerSidebar`, action `createSellerKos`/`updateSellerKos`/`assertKosOwner`) — fungsionalitasnya dilebur ke panel admin.
- Kriteria lama C1–C6 beserta scorer-nya (digantikan 5 kriteria baru).
- Komponen `KosForm` yang tidak lagi terpakai.

### Security

- Token reset password disimpan sebagai hash SHA-256 (bukan plain), kedaluwarsa 1 jam, sekali pakai.
- bcrypt dengan rounds eksplisit (10) di seeder baru.
- Validasi zod di seluruh body API mencegah input malformed; guard role ADMIN pada aksi perubahan status booking.
- Guard ownership dihapus bersama panel seller; akses admin dilindungi `proxy.ts` (role ADMIN).

## [0.1.0] - 2026-06-15

### Added

- Versi awal aplikasi: landing rekomendasi SAW, eksplor + filter, detail kos, panel admin (kos, kriteria, sub-kriteria, perhitungan, hasil akhir, pengguna), login, profil, chat user-pemilik, booking, seeding demo, engine SAW 6 kriteria.
