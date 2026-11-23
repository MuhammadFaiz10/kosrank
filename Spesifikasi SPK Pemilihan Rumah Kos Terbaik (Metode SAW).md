# Spesifikasi SPK Pemilihan Rumah Kos Terbaik (Metode SAW)

Sumber: Kusumaningtyas, Nurullatifah, Cahyani, "Sistem Pendukung Keputusan untuk Pemilihan Rumah Kos Terbaik di Kecamatan Mlati, Kabupaten Sleman", Jurnal Dinamika Informatika, Vol. 9 No. 1, Feb 2020.

## 1. Ringkasan

Sistem pendukung keputusan (SPK) yang merekomendasikan rumah kos terbaik berdasarkan 5 kriteria dan bobot kepentingan yang diatur pengguna, memakai metode Simple Additive Weighting (SAW). Alternatif dengan nilai preferensi (V) terbesar adalah alternatif terbaik.

Dokumen ini adalah spesifikasi fitur yang **digabungkan ke codebase yang sudah ada** (lihat bagian 2), bukan proyek terpisah.

**Perhitungan memakai kriteria, bobot, skala skor, dan data dari berkas `data_kost.xlsx` (dataset kos di Depok), bukan angka di makalah.** Makalah hanya jadi acuan metode SAW, desain sistem, dan alur halaman.

## 2. Penggabungan dengan Codebase Saat Ini

Prinsip penggabungan:

1. **Codebase saat ini adalah fondasi.** Stack, struktur folder, gaya kode, komponen UI, sistem auth, dan konvensi database yang sudah ada tetap dipakai. Spesifikasi ini hanya menambahkan modul SPK kos di atasnya.
2. **Stack di makalah (PHP + MySQL) hanya referensi.** Yang diambil dari makalah adalah logika, aturan skor, model data, dan alur halaman. Implementasinya mengikuti teknologi codebase saat ini.
3. **Tidak menduplikasi yang sudah ada.** Auth, layout, navigasi, ORM/koneksi database, dan komponen UI dipakai ulang. Jika ada tabel atau modul serupa, dipetakan ke yang ada, bukan dibuat ganda.
4. **Perubahan bersifat aditif.** Modul SPK ditambahkan sebagai modul/route baru. Fitur lama tidak boleh berubah perilakunya.
5. **Penamaan** tabel, kolom, route, dan file mengikuti konvensi codebase. Nama pada dokumen ini (mis. `alternatif`, `kriteria`, `rating_kecocokan`) adalah nama logis dan boleh disesuaikan.

| Area | Aturan penggabungan |
| --- | --- |
| Auth | Pakai mekanisme auth yang sudah ada. Tidak membuat sistem login baru. |
| Database | Tambah migrasi untuk 3 tabel modul SPK. Tidak mengubah tabel lama. |
| UI | Pakai layout dan komponen yang sudah ada. |
| Routing | Tambah dua kelompok route (bagian 6). |
| Logika SAW | Satu modul/service bersama, dipanggil oleh kedua kelompok halaman. |

> Catatan: path file dan nama modul konkret perlu dicocokkan dengan struktur repo yang sebenarnya.

## 3. Tujuan dan Ruang Lingkup

**Tujuan:** membantu pencari kos menemukan kos yang sesuai kebutuhan sehingga mengurangi kecenderungan berpindah-pindah kos.

**Dalam cakupan:**

- Kelola data alternatif kos.
- Kelola nilai kriteria tiap alternatif.
- Atur bobot kriteria.
- Hitung SAW dan tampilkan perangkingan.
- Dua varian halaman: dengan auth dan tanpa auth, dengan fitur yang identik (bagian 6).

**Di luar cakupan:** kombinasi dengan metode lain. Filter tipe kos (putra, putri, campur) bersifat opsional, lihat bagian 10.

## 4. Kriteria dan Skala Penilaian

Perhitungan memakai **5 kriteria** dan skala skor **20 sampai 100** dari sheet `SAW` pada `data_kost.xlsx`. C1 dan C3 adalah **cost** (lebih kecil lebih baik). C2, C4, dan C5 adalah **benefit** (lebih besar lebih baik).

| Kode | Kriteria | Jenis | Bobot | Kolom sumber (sheet Depok) |
| --- | --- | --- | --- | --- |
| C1 | Harga | Cost | 0,3 | price\_before\_discount\_bs |
| C2 | Fasilitas | Benefit | 0,3 | all\_facilities\_bs 2 dan kolom penanda 0/1 |
| C3 | Jarak | Cost | 0,2 | jarak\_kampus (km) |
| C4 | Ukuran Ruangan | Benefit | 0,1 | room\_size (m²) |
| C5 | Rating | Benefit | 0,1 | rating |

Bobot disimpan sebagai desimal dengan total 1,0 (30%, 30%, 20%, 10%, 10%). Nilai ini adalah bawaan dan bisa diubah pengguna.

### 4.1 Pemetaan nilai mentah ke skor

**C1 Harga per bulan (cost)**

| Rentang | Skor |
| --- | --- |
| Rp 500.000 sampai Rp 999.999 | 100 |
| Rp 1.000.000 sampai Rp 1.999.999 | 80 |
| Rp 2.000.000 sampai Rp 2.999.999 | 60 |
| Rp 3.000.000 sampai Rp 3.999.999 | 40 |
| ≥ Rp 4.000.000 | 20 |

**C2 Fasilitas (benefit)**

| Level | Skor |
| --- | --- |
| Sangat tidak lengkap | 20 |
| Kurang lengkap | 40 |
| Cukup lengkap | 60 |
| Lengkap | 80 |
| Sangat lengkap | 100 |

**C3 Jarak ke kampus (cost)**

| Rentang | Skor |
| --- | --- |
| 0 sampai 1 km | 100 |
| > 1 sampai 5 km | 80 |
| > 5 sampai 10 km | 60 |
| > 10 sampai 15 km | 40 |
| > 15 km | 20 |

**C4 Ukuran ruangan (benefit)**, luas = panjang × lebar

| Luas | Skor |
| --- | --- |
| ≤ 6 m² | 20 |
| > 6 sampai 9 m² | 40 |
| > 9 sampai 12 m² | 60 |
| > 12 sampai 15 m² | 80 |
| > 15 m² | 100 |

**C5 Rating (benefit)**

| Rating | Skor |
| --- | --- |
| Not found (tidak ada rating) | 20 |
| 1 sampai 2 | 40 |
| 2 sampai 3 | 60 |
| 3 sampai 4 | 80 |
| 4 sampai 5 | 100 |

Batas rentang yang dipakai: harga memasukkan batas bawah (Rp 1.000.000 masuk skor 80, sesuai A05). Luas dan jarak memasukkan batas atas. Rating memasukkan batas bawah, dan 5,0 masuk kelas 4 sampai 5. Pemetaan disimpan sebagai konfigurasi, bukan di-hardcode di banyak tempat.

## 5. Model Data

Tiga tabel inti. Data mentah disimpan di `alternatif`, dan skor dihitung dari pemetaan bagian 4.1.

**alternatif**

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| kode | varchar, PK | A01, A02, dan seterusnya |
| nama | varchar(150) | room\_name |
| lokasi | varchar(50) | Kecamatan, dinormalkan ("Kecamatan Beji" menjadi "Beji") |
| tipe\_kos | varchar(20) | Putra, Putri, atau Campur |
| harga | integer | Rupiah per bulan |
| jarak\_km | decimal | Jarak ke kampus |
| panjang\_m, lebar\_m | decimal | Dari room\_size, luas = panjang × lebar |
| rating | decimal, nullable | Kosong jika "Not found" |
| fasilitas\_level | smallint (1 sampai 5) | Level C2, lihat bagian 10 |
| fasilitas\_teks | text | Daftar fasilitas |

**kriteria**

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| id\_kriteria | varchar(2), PK | C1 sampai C5 |
| nama\_kriteria | varchar(100) |  |
| jenis\_kriteria | varchar(20) | `benefit` atau `cost` |
| bobot\_kriteria | decimal(3,2) | Total semua kriteria = 1,0 |

**rating\_kecocokan**

| Kolom | Tipe | Keterangan |
| --- | --- | --- |
| kode | FK ke alternatif | PK gabungan |
| id\_kriteria | FK ke kriteria | PK gabungan |
| nilai | smallint | Skor 20 sampai 100, hasil pemetaan 4.1 |

Skor boleh dihitung saat alternatif disimpan atau saat perangkingan, asal selalu sama dengan pemetaan 4.1.

### 5.1 Sumber data dan impor

Sumber: sheet `Depok` di `data_kost.xlsx`, 236 baris kos di Depok (bukan Mlati seperti makalah). Tipe kos: 128 putri, 57 putra, 51 campur.

| Kolom di sheet Depok | Field | Pembersihan |
| --- | --- | --- |
| room\_name | nama | Nama ganda perlu ditangani (bagian 10) |
| location | lokasi | Samakan "Kecamatan Beji" dan "Beji" |
| room\_size | panjang\_m, lebar\_m | "2.5 x 3 meter" dipecah menjadi 2,5 dan 3 |
| price\_before\_discount\_bs | harga | "Rp1.700.000" menjadi 1700000 |
| rating | rating | "Not found" (52 baris) menjadi kosong |
| tipe\_kos | tipe\_kos | Apa adanya |
| jarak\_kampus | jarak\_km | Angka sudah dalam km |
| all\_facilities\_bs 2 dan kolom 0/1 | fasilitas\_teks, fasilitas\_level | Aturan level belum ada, lihat bagian 10 |

## 6. Halaman dan Routing: Dua Varian

Modul SPK disediakan dalam **dua kelompok halaman**:

| Varian | Akses | Contoh prefix route |
| --- | --- | --- |
| **Dengan auth** | Wajib login (memakai auth codebase yang ada) | `/app/kos/...` |
| **Tanpa auth** | Terbuka tanpa login | `/kos/...` |

**Aturan utama: tidak ada perbedaan antara kedua varian.** Perbedaannya hanya pada gerbang akses (login atau tidak). Selebihnya identik:

- Daftar halaman, isi, tata letak, dan navigasi sama.
- Fitur, aturan validasi, dan hasil perhitungan SAW sama.
- Sumber data sama. Tidak ada data atau fitur yang hanya muncul di salah satu varian.
- Implementasi: satu set komponen/halaman bersama, dibungkus dua kali dengan route guard berbeda. Tidak boleh ada salinan kode halaman yang terpisah.

### 6.1 Daftar halaman (ada di kedua varian)

| Halaman | Fungsi |
| --- | --- |
| Beranda | Pengantar dan pintu masuk ke fitur |
| Alternatif Pilihan | Daftar kos, tambah, ubah, hapus, dan isi nilai kriteria tiap kos |
| Bobot Tiap Kriteria | Tampilkan dan ubah bobot 6 kriteria |
| Hasil Perangkingan | Tabel peringkat: no, nama alternatif, alamat, nilai preferensi |

### 6.2 Matriks paritas (untuk uji)

| Kemampuan | Dengan auth | Tanpa auth |
| --- | --- | --- |
| Lihat Beranda | Ya | Ya |
| Kelola alternatif dan nilai kriteria | Ya | Ya |
| Ubah bobot | Ya | Ya |
| Lihat hasil perangkingan | Ya | Ya |
| Perlu login | Ya | Tidak |

## 7. Kebutuhan Fungsional

- **FR-1 Kelola alternatif.** Pengguna dapat menambah, mengubah, dan menghapus kos (nama, alamat, kontak).
- **FR-2 Input nilai kriteria.** Untuk tiap alternatif, pengguna mengisi nilai C1 sampai C5. Sistem mengonversi ke skor 20 sampai 100 sesuai bagian 4.1.
- **FR-3 Atur bobot.** Pengguna mengubah bobot tiap kriteria. **Total bobot harus tepat 1 (100%)**; jika tidak, simpan ditolak dengan pesan jelas.
- **FR-4 Hitung SAW.** Sistem menghitung nilai preferensi tiap alternatif (bagian 8).
- **FR-5 Perangkingan.** Hasil diurutkan dari V terbesar ke terkecil. Peringkat 1 adalah alternatif terbaik.
- **FR-6 Paritas auth.** Seluruh FR-1 sampai FR-5 tersedia identik di kedua varian halaman.

## 8. Algoritma SAW

Input: matriks keputusan X (m alternatif × 5 kriteria, berisi skor 20 sampai 100) dan vektor bobot W = \[w1 ... w5\] dengan total 1,0.

1. Susun matriks X dari tabel `rating_kecocokan`.
2. Normalisasi tiap elemen menjadi R:
   - Benefit (C2, C4, C5): `R_ij = X_ij / max_i(X_ij)`
   - Cost (C1, C3): `R_ij = min_i(X_ij) / X_ij`
3. Hitung nilai preferensi: `V_i = Σ_j w_j × R_ij`.
4. Urutkan alternatif berdasarkan V menurun.

Pseudocode:

```
for each kriteria j:
  col = [X[i][j] for all i]
  for each alternatif i:
    R[i][j] = (jenis[j] == 'benefit') ? X[i][j] / max(col) : min(col) / X[i][j]
for each alternatif i:
  V[i] = sum_j(W[j] * R[i][j])
ranking = sort(alternatif, by V desc)
```

Aturan tambahan:

- Fungsi SAW harus murni (input X dan W, output V) dan dipakai bersama oleh kedua varian halaman.
- Nilai min dan max dihitung atas himpunan alternatif yang sedang dirangking. Hasil 5 sampel di bagian 9 karena itu berbeda dari hasil bila dihitung atas 236 kos.
- Simpan V tanpa pembulatan. Tampilkan 4 desimal. Jika V sama, urutan ditentukan stabil (mis. berdasarkan kode).

## 9. Kriteria Penerimaan (Data Uji dari data\_kost.xlsx)

Data uji adalah 5 alternatif di sheet `SAW`, dengan bobot W = \[0,3; 0,3; 0,2; 0,1; 0,1\].

| Kode | Nama kos | Harga | Fasilitas | Jarak | Ukuran | Rating |
| --- | --- | --- | --- | --- | --- | --- |
| A01 | Kost Noeks Cinere Depok | Rp 1.700.000 | Cukup lengkap | 9 km | 2,5 × 3 m (7,5 m²) | 1,9 |
| A02 | Kost Pondok Rindang Tipe C Beji Depok | Rp 1.500.000 | Cukup lengkap | 0,6 km | 3 × 3 m (9 m²) | 3,4 |
| A03 | Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok | Rp 2.000.000 | Lengkap | 1,9 km | 3,5 × 3 m (10,5 m²) | 4,5 |
| A04 | Kost Singgahsini DFlory Tipe B Cinere Depok | Rp 2.025.000 | Lengkap | 7,7 km | 3,7 × 2,7 m (9,99 m²) | 5,0 |
| A05 | Kost Rumah Nimas Sawangan Depok | Rp 1.000.000 | Lengkap | 12,9 km | 3 × 4 m (12 m²) | Not found |

Matriks keputusan X (skor), lalu matriks ternormalisasi R:

| Kode | X: C1 | C2 | C3 | C4 | C5 | R: C1 | C2 | C3 | C4 | C5 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| A01 | 80 | 60 | 60 | 40 | 40 | 0,75 | 0,75 | 0,6667 | 0,6667 | 0,4 |
| A02 | 80 | 60 | 100 | 40 | 80 | 0,75 | 0,75 | 0,4 | 0,6667 | 0,8 |
| A03 | 60 | 80 | 80 | 60 | 100 | 1 | 1 | 0,5 | 1 | 1 |
| A04 | 60 | 80 | 60 | 60 | 100 | 1 | 1 | 0,6667 | 1 | 1 |
| A05 | 80 | 80 | 40 | 60 | 20 | 0,75 | 1 | 1 | 1 | 0,2 |

Pembagi normalisasi: min C1 = 60, max C2 = 80, min C3 = 40, max C4 = 60, max C5 = 100.

Hasil yang diharapkan:

| Peringkat | Kode | Nama kos | V |
| --- | --- | --- | --- |
| 1 | A04 | Kost Singgahsini DFlory Tipe B Cinere Depok | 0,9333 |
| 2 | A03 | Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok | 0,9 |
| 3 | A05 | Kost Rumah Nimas Sawangan Depok | 0,845 |
| 4 | A01 | Kost Noeks Cinere Depok | 0,69 |
| 5 | A02 | Kost Pondok Rindang Tipe C Beji Depok | 0,6767 |

Sheet menampilkan 0,68 untuk A02 dan 0,85 untuk A05 karena dibulatkan dua desimal. Nilai V yang dipakai untuk uji adalah nilai di atas.

Ceklis penerimaan:

- [ ] Skor, R, V, dan urutan peringkat sama dengan tabel di atas (toleransi ±0,001).
- [ ] Hasil identik di halaman dengan auth dan tanpa auth.
- [ ] Halaman dengan auth menolak akses tanpa login. Halaman tanpa auth bisa dibuka tanpa login.
- [ ] Bobot dengan total ≠ 1 ditolak.
- [ ] Fitur lama codebase tetap berfungsi (tidak ada regresi).

## 10. Perbedaan dengan Makalah dan Pertanyaan Terbuka

**Berkas `data_kost.xlsx` yang berlaku** untuk perhitungan:

| Hal | Makalah (tidak dipakai) | data\_kost.xlsx (dipakai) |
| --- | --- | --- |
| Kriteria | 6: jarak kampus, jarak warung, harga, luas, fasilitas, keamanan | 5: harga, fasilitas, jarak, ukuran, rating |
| Bobot | 20, 10, 20, 15, 20, 15 | 0,3; 0,3; 0,2; 0,1; 0,1 |
| Skala skor | 1 sampai 5 | 20 sampai 100 |
| Wilayah | Kecamatan Mlati, Sleman | Depok |

Pertanyaan terbuka:

1. **Level fasilitas (C2).** Sheet `SAW` memberi label manual, dan berkas tidak memuat aturan dari kolom penanda 0/1 ke level. Pada 5 sampel, jumlah penanda 4 dan 6 berlabel Cukup lengkap, sedangkan 8 dan 9 berlabel Lengkap. Perlu aturan konversi, atau level diisi manual.
2. **Batas rentang.** Sheet menulis "1 - 2", "2 - 3" dan "0 - 1 km", "1 - 5 km" tanpa menyebut batas masuk atau tidak. Bagian 4.1 memakai asumsi yang cocok dengan sampel (mis. luas 9 m² dan harga Rp 1.000.000). Rating tepat 2,0, 3,0, dan 4,0 serta jarak tepat 5,0 km masih asumsi.
3. **Nilai di luar tabel.** Harga di bawah Rp 500.000 dan rating di bawah 1 tidak didefinisikan. Data terendah adalah Rp 600.000 dan rating 1,9, jadi belum berpengaruh.
4. **Rating "Not found".** Sheet memberi skor 20, sehingga 52 dari 236 kos terkena nilai terendah di C5. Perlu konfirmasi bahwa ini disengaja.
5. **Salah ketik di sheet `SAW`.** Harga A04 tertulis `2.0250.00`. Di sheet `Depok` nilainya Rp 2.025.000. Impor memakai sheet `Depok`.
6. **Nama kos ganda.** "Kost Abun Tipe A Beji Depok" dan "Kost Fadilah 1 Beji Depok" masing-masing muncul dua kali dengan isi fasilitas berbeda. Perlu aturan: gabung, ambil satu, atau beri kode terpisah.
7. **Filter tipe kos.** Data punya kolom putra, putri, campur. Perlu keputusan apakah pengguna bisa memfilter sebelum perangkingan (ini mengubah himpunan alternatif, lihat bagian 8).
8. **Data per pengguna.** Karena kedua varian halaman harus identik, spesifikasi mengasumsikan data alternatif dan bobot dipakai bersama. Jika varian auth harus punya data sendiri, itu menjadi perbedaan dan perlu keputusan eksplisit.
