# SISTEM PENUNJANG KEPUTUSAN PEMILIHAN KOS

# UNTUK MAHASISWA UBSI MARGONDA

# MENGGUNAKAN METODE SAW

# Disusun oleh

# Shinta Febriyani

# Nanda Tri Septiani

# Muhammad Faiz

# Program Studi Sistem Informasi (S1)

# Fakultas Teknik dan Informatika

# Universitas Bina Sarana Informatika

# Tahun Akademik 2025/

## KATA PENGANTAR

### Puji syukur kami panjatkan ke hadirat Tuhan Yang Maha Esa yang telah melimpahkan rahmat

### dan karunia-Nya, sehingga kami dari Kelompok 1 dapat menyelesaikan penyusunan laporan

### proyek mata kuliah Proyek Sistem Informasi yang berjudul “SISTEM PENUNJANG

### KEPUTUSAN PEMILIHAN KOS UNTUK MAHASISWA UBSI MARGONDA

### MENGGUNAKAN METODE SAW” dengan baik dan tepat waktu

### Kami menyadari bahwa selama proses penyusunan laporan proyek ini, kami menghadapi

### berbagai kendala dan tantangan, terutama karena keterbatasan pemahaman dan pengalaman

### yang kami miliki. Namun, berkat bimbingan serta dukungan dari berbagai pihak, laporan

### proyek ini akhirnya dapat diselesaikan dengan baik

### Oleh karena itu, kami ingin menyampaikan ucapan terima kasih kepada Bapak Rame Santoso

### selaku Dosen Pengampu mata kuliah Sistem Penunjang Keputusan dan seluruh pihak yang

### telah memberikan bantuan, motivasi, dan kontribusi dalam penyelesaian laporan kelompok ini

### Kami telah berupaya menyusun laporan ini dengan sebaik-baiknya. Namun demikian, kami

### menyadari bahwa laporan proyek ini masih memiliki kekurangan. Oleh karena itu, kami sangat

### mengharapkan kritik dan saran yang konstruktif demi penyempurnaan laporan ini di masa

### mendatang

### Kami berharap laporan proyek sistem informasi ini dapat memberikan manfaat, menjadi

### referensi yang berguna, serta memberikan kontribusi positif bagi pengembangan ilmu

### pengetahuan, khususnya di bidang sistem informasi

### Depok, 14 April 2026

## DAFTAR ISI

## DAFTAR ISI

- KATA PENGANTAR
- DAFTAR ISI
- BAB I PENDAHULUAN
  - 1.1. Latar Belakang
  - 1.2. Tujuan
  - 1.3. Ruang Lingkup...........................................................................................................
  - 1.4. Manfaat
- BAB II METODE PENELITIAN
      - 2.1. Metode Penelitian
      - 2.2. Tahapan Penelitian
- BAB III HASIL DAN PEMBAHASAN
      - 3.1. Penentuan Kriteria, Bobot Kriteria, Sub Kriteria
      - 3.2. Penentuan Alternatif
      - 3.3. Perhitungan Menggunakan Metode SAW
      - 3.4. Implementasi Sistem
      - 3.5. Pembahasan
- BAB IV KESIMPULAN DAN SARAN
- DAFTAR PUSTAKA

## BAB I PENDAHULUAN

### 1.1. Latar Belakang

### Indekos atau biasa disebut dengan Kos ialah salah satu bentuk jasa penginapan sementara

### berupa tempat tinggal pekerja maupun mahasiswa perantau yang membutuhkan hunian sesuai

### dengan lokasi tempat kerja atau kampus mereka (Khayati & Arsal, 2024). Rumah kos saat ini

### bukan hanya sebagai tempat tinggal sementara saja, namun sudah berkembang menjadi

### peluang bisnis yang cukup pesat seiring meningkatnya kebutuhan hunian praktis dan

### terjangkau bagi mahasiswa di sekitar lingkungan perguruan tinggi (Nurcahyanie & Prihono

### 2024)

### Akan tetapi dalam praktiknya mahasiswa masih sering menghadapi kendala dalam memilih

### rumah kos yang sesuai dengan kebutuhan dan preferensi mereka, terutama terkait faktor

### keamanan, lingkungan, harga, dan fasilitas (Nurcahyanie & Prihono, 2024). Banyaknya pilihan

### rumah kos dengan variasi harga, lokasi, dan fasilitas yang berbeda sering kali membuat calon

### penyewa mengalami kesulitan dalam menentukan keputusan tempat tinggal yang tepat (Ilmi et

### al., 2024). Umumnya mahasiswa harus melakukan survei secara langsung dari satu rumah kos

### ke rumah kos lainnya sehingga proses tersebut memerlukan waktu dan tenaga yang cukup besar

### dalam proses pencarian tempat tinggal sementara (Aziz et al., 2020)

### Universitas Bina Sarana Informatika (UBSI) Margonda merupakan salah satu perguruan

### tinggi yang memiliki jumlah mahasiswa cukup banyak dan berasal bukan hanya dari Depok

### saja, namun dari berbagai daerah di Jabodetabek sehingga memunculkan kebutuhan hunian

### sementara di sekitar kampus (Amran et al., 2024). Dalam kondisi tersebut, rumah kos menjadi

### pilihan yang paling diminati karena harganya relatif terjangkau serta menawarkan berbagai

### fasilitas yang mendukung kebutuhan mahasiswa selama menempuh pendidikan (Gusti &

### Risandi, 2021)

### Dalam pemilihan rumah kos terdapat beberapa kriteria pendukung keputusan yang menjadi

### acuan penting, antara lain biaya sewa, lokasi, keamanan, fasilitas, dan ukuran kamar yang

### mempengaruhi kenyamanan mahasiswa dalam menentukan tempat tinggal sementara

### (Marthanugraha, 2024). Untuk membantu mahasiswa dalam menyeleksi alternatif terbaik

### secara objektif dan akurat diperlukan suatu Sistem Pendukung Keputusan (SPK) yang mampu

### mengolah berbagai kriteria menjadi rekomendasi yang sistematis dan terstruktur (Reza et al

### 2023). SPK merupakan sistem berbasis komputer yang dirancang untuk membantu proses

### pengambilan keputusan pada permasalahan semi-terstruktur dengan menghasilkan informasi

### yang relevan sebagai bahan pertimbangan pengguna dalam menentukan pilihan terbaik

### (Nurelasari & Purwaningsih, 2021)

### Berdasarkan permasalahan pada proses pemilihan rumah kos, salah satu pendekatan yang

### efektif dalam penerapan SPK adalah metode (SAW) karena mampu melakukan proses

### perankingan alternatif berdasarkan nilai bobot dari setiap kriteria yang telah ditentukan (Reza

### et al., 2023). Metode SAW dikenal sebagai metode penjumlahan terbobot yang digunakan

### untuk menghitung nilai preferensi setiap alternatif sehingga mempermudah pengguna dalam

### menentukan pilihan terbaik secara lebih cepat dan akurat (Adidtyawan & Mazia, 2024). Oleh

### karena itu, penelitian ini bertujuan merancang sistem pendukung keputusan dengan

### menerapkan metode Simple Additive Weighting (SAW) guna membantu mahasiswa maupun

### pekerja perantau dalam memilih rumah kos yang sesuai dengan kebutuhan secara efektif dan

### objektif (Sumarto et al., 2024)

### 1.2. Tujuan

### Beberapa tujuan dari dilakukannya penelitian ini antara lain

### 1. Mengidentifikasi kriteria yang digunakan dalam pemilihan rumah kos di sekitar

### Universitas Bina Sarana Informatika (UBSI) Margonda

### 2. Merancang sistem pendukung keputusan pemilihan rumah kos menggunakan metode

### Simple Additive Weighting (SAW)

### 3. Menghasilkan rekomendasi alternatif rumah kos terbaik berdasarkan kriteria yang telah

### ditentukan

### 4. Membantu mahasiswa perantau dalam menentukan pilihan rumah kos secara objektif

### efektif, dan efisien

### 1.3. Ruang Lingkup

### Ruang lingkup dalam penelitian ini dibatasi pada beberapa aspek saja agar pembahasan

### lebih terfokus dan sesuai dengan tujuan yang sudah ditentukan. Batasan tersebut mencakup

### hal-hal sebagai berikut

### 1. Penelitian dilakukan pada rumah kos yang berada di sekitar Kota Depok

### 2. Kriteria yang digunakan dalam penelitian meliputi lokasi/jarak kos, ukuran ruangan, harga

### fasilitas, keamanan, kenyamanan, dan akses transportasi

### 3. Metode yang digunakan dalam sistem pendukung keputusan adalah metode Simple

### Additive Weighting (SAW)

### 4. Sistem yang dirancang bertujuan memberikan rekomendasi alternatif rumah kos terbaik

### berdasarkan perhitungan metode SAW

### 5. Pengguna sistem difokuskan pada mahasiswa atau pekerja perantau yang mencari tempat

### tinggal sementara di sekitar kampus

### 1.4. Manfaat

### Penelitian ini diharapkan dapat memberikan manfaat sebagai berikut

### 1. Membantu mahasiswa dalam menentukan pilihan rumah kos yang sesuai dengan

### kebutuhan berdasarkan kriteria yang telah ditentukan secara sistematis dan objektif

### 2. Menambah wawasan serta pengalaman dalam merancang sistem pendukung keputusan

### menggunakan metode Simple Additive Weighting (SAW)

### 3. Sebagai referensi tambahan bagi penelitian selanjutnya yang berkaitan dengan sistem

### pendukung keputusan khususnya dalam pemilihan tempat tinggal sementara bagi

### mahasiswa

### 4. Membantu pemilik rumah kos memahami faktor yang menjadi pertimbangan utama

### mahasiswa dalam memilih tempat tinggal sehingga dapat meningkatkan kualitas layanan

### yang diberikan

## BAB II METODE PENELITIAN

#### 2.1. Metode Penelitian

### Metode penelitian yang digunakan dalam penelitian ini adalah metode kuantitatif dengan

### pendekatan Sistem Pendukung Keputusan (SPK) karena memuat proses perhitungan berbasis

### numerik untuk menarik sebuah kesimpulan yang objektif (Nurelasari & Purwaningsih, 2021)

### Pendekatan kuantitatif dipilih karena penelitian ini mengolah data berdasarkan nilai dan bobot

### setiap kriteria untuk menetapkan alternatif terbaik secara sistematis dan objektif (Adidtyawan

### & Mazia, 2024). Penelitian ini menggunakan metode Simple Additive Weighting (SAW) karena

### kemampuannya dalam melakukan proses pemeringkatan alternatif secara efektif berdasarkan

### nilai preferensi tertinggi (Reza et al., 2023)

#### 2.2. Tahapan Penelitian

### Beberapa tahapan dalam proses pengambilan keputusan analisis yang dilakukan, yaitu

### identifikasi masalah, studi literatur, pengumpulan data, analisis data, desain sistem

### implementasi metode SAW dan pengujian sistem (Ramadhan et al., 2025)

```
Gambar 1 .Metode Simple Additive Weighting (SAW)
```

### Sumber : Ramadhan, 2025

### 1. Identifikasi Masalah

### Proses ini mengacu pada rumusan masalah yang telah disusun berdasarkan latar belakang

### penelitian. Pada tahap ini juga dilakukan analisis kebutuhan sistem yang meliputi kebutuhan

### data, perangkat keras, serta perangkat lunak yang digunakan dalam penelitian

### 2. Studi Literatur

### Studi literatur dilakukan dengan mengumpulkan berbagai sumber pustaka yang relevan

### seperti artikel, buku, jurnal ilmiah, jurnal nasional, sumber internet, serta hasil penelitian

### terdahulu yang berkaitan dengan metode Simple Additive Weighting (SAW). Metode SAW atau

### metode penjumlahan terbobot merupakan salah satu metode pengambilan keputusan yang

### digunakan dengan cara menghitung total nilai terbobot dari setiap alternatif berdasarkan

### seluruh kriteria yang digunakan. Alternatif dengan nilai tertinggi akan dipilih sebagai solusi

### terbaik. Hasil perhitungan metode SAW akan lebih optimal apabila setiap alternatif memiliki

### nilai yang sesuai dengan kriteria dan subkriteria yang telah ditentukan sebelumnya. Penelitian

### ini menggunakan metode SAW karena proses perhitungannya lebih sederhana, efisien, dan

### membutuhkan waktu yang relatif cepat. Dalam penerapannya, metode SAW menggunakan

### proses normalisasi matriks keputusan (X) agar seluruh nilai alternatif dapat dibandingkan

### dalam skala yang sama. Berikut merupakan langkah-langkah perhitungan metode Simple

### Additive Weighting (SAW)

### a. Rating Kecocokan Nilai

### Tahap ini dilakukan dengan mengubah nilai setiap alternatif, seperti spesifikasi tempat kos

### ke dalam bentuk bobot berdasarkan subkriteria yang telah ditentukan sebelumnya

### b. Normalisasi Matriks

### Proses normalisasi matriks dilakukan untuk menyamakan skala seluruh nilai agar dapat

### dibandingkan antar kriteria secara konsisten. Tahap ini bertujuan menghasilkan nilai yang

### seragam dalam bentuk angka sehingga memudahkan proses perhitungan. Dalam metode

### SAW, normalisasi dilakukan berdasarkan jenis atribut, yaitu atribut keuntungan (benefit)

### dan atribut biaya (cost)

### Untuk atribut benefit digunakan rumus

### Sedangkan untuk atribut cost digunakan rumus

### Keterangan

### rij : Nilai rating kinerja yang telah ternormalisasi

### xij : Nilai atribut pada setiap kriteria

### max(xij) : Nilai terbesar pada setiap kriteria

### min(xij) : Nilai terkecil pada setiap kriteria

### c. Perangkingan

### Tahap terakhir dalam metode SAW adalah proses perangkingan. Pada tahap ini, nilai hasil

### normalisasi dikalikan dengan bobot masing-masing kriteria, kemudian seluruh hasilnya

### dijumlahkan untuk memperoleh nilai akhir setiap alternatif. Alternatif dengan nilai

### tertinggi akan dipilih sebagai alternatif terbaik

### Rumus perangkingan yang digunakan adalah

### Keterangan

### Vi : Nilai akhir atau nilai preferensi setiap alternatif

### wj : Bobot pada setiap kriteria

### rij : Nilai rating kinerja yang telah ternormalisasi

### Semakin besar nilai akhir yang diperoleh suatu alternatif, maka alternatif tersebut dianggap

### semakin baik

### 3. Pengumpulan Data

### Data yang digunakan dalam penelitian ini didapatkan dari platform Kaggle yaitu

### “Mamikos Jabodetabek Boarding Room Listings” yang memuat data kos di Jabodetabek

### Dataset berisi 17 atribut meliputi, nama kos, nama pemilik kos, daerah, lokasi kos, ukuran

### ruangan, listrik, harga sebelum diskon, fasilitas, ketersediaan kamar, deposito, harga, rating

### transaksi, tipe kos, diskon dan link Mamikos

### 4. Analisis Data

### Langkah selanjutnya adalah analisa data berdasarkan studi literatur yang telah dipelajari

### proses ini digunakan untuk menentukan tempat kos terbaik dengan menerapkan metode SAW

### Berdasarkan data yang didapatkan dari platform Kaggle , diperoleh kriteria-kriteria yang

### digunakan sebagai parameter penilaian untuk memilih tempat kos yaitu ukuran ruangan

### lokasi, fasilitas listrik, harga, tipe kos (kos campur dan kos khusus putri), dan diskon. Kriteria

### yang akan menjadi prioritas pertama akan diberikan nilai tinggi daripada kriteria yang

### dianggap memiliki prioritas lebih rendah

### 5. Desain Sistem

### Tahap desain sistem dilakukan untuk merancang sistem rekomendasi yang akan

### dikembangkan dalam penelitian ini. Proses perancangan dilakukan berdasarkan hasil analisis

### kebutuhan yang telah diperoleh pada tahap sebelumnya. Sistem yang dirancang berupa

### website rekomendasi tempat kos yang menampilkan daftar kos terbaik berdasarkan hasil

### perhitungan metode SAW

### Pada saat website dijalankan, sistem akan secara otomatis menampilkan rekomendasi

### tempat kos terbaik sesuai hasil perhitungan. Selain itu, pengguna juga dapat melakukan

### pencarian dan penyaringan data kos berdasarkan beberapa kriteria, seperti harga, fasilitas

### kamar, fasilitas kos, ukuran ruangan, jarak ke kampus UBSI dan akses transportasi. Dengan

### adanya fitur tersebut, pengguna dapat lebih mudah menemukan tempat kos yang sesuai dengan

### kebutuhan dan preferensi mereka

### 6. Implementasi Metode SAW

### Pada tahap ini dilakukan penerapan metode Simple Additive Weighting (SAW) yang

### digunakan untuk proses perhitungan dalam menentukan rekomendasi tempat kos terbaik

### Metode SAW bekerja dengan cara menjumlahkan nilai rating kinerja yang telah diberi bobot

### pada setiap alternatif berdasarkan seluruh kriteria yang digunakan

### Sistem dibangun dalam bentuk website menggunakan bahasa pemrograman HTML, CSS

### JavaScript, dan PHP Native. Setelah proses implementasi selesai, dilakukan tahap pengujian

### sistem untuk memastikan bahwa proses perhitungan metode SAW berjalan dengan baik

### seluruh fitur sistem dapat berfungsi sesuai perancangan, serta website siap digunakan sebagai

### sistem pendukung keputusan dalam menentukan tempat kos terbaik

### 7. Pengujian Sistem

### Setelah proses pengembangan sistem selesai dilakukan, tahap berikutnya adalah pengujian

### website. Pengujian dilakukan untuk memastikan bahwa sistem dapat berjalan dengan baik

### sesuai dengan tujuan penelitian. Pada tahap ini dilakukan pengujian terhadap metode Simple

### Additive Weighting (SAW) menggunakan data penilaian yang terdiri dari nilai kriteria dan

### subkriteria

### Pengujian fungsionalitas dilakukan untuk memastikan seluruh fitur yang dikembangkan

### seperti filter radius jarak, rentang harga, fasilitas, serta tampilan rekomendasi tempat kos dapat

### berjalan sesuai dengan rancangan sistem. Selain itu, dilakukan pengujian akurasi metode untuk

### memastikan bahwa hasil perhitungan perangkingan menggunakan metode SAW sesuai dengan

### hasil perhitungan manual

### Tahap selanjutnya adalah pengujian keberhasilan sistem yang bertujuan untuk mengetahui

### sejauh mana sistem mampu memberikan solusi yang efektif dan praktis bagi mahasiswa dalam

### memilih tempat kos. Keberhasilan penelitian ditandai dengan kemampuan sistem dalam

### menampilkan rekomendasi tempat kos secara otomatis, menghasilkan nilai perangkingan yang

### sesuai dengan perhitungan manual metode SAW, serta memperoleh tanggapan positif dari

### pengguna karena sistem dinilai dapat mempermudah proses pengambilan keputusan

### dibandingkan metode konvensional

## BAB III HASIL DAN PEMBAHASAN

### Hasil implementasi sistem pendukung keputusan menggunakan metode Simple Additive

### Weighting (SAW) diterapkan pada proses pemilihan tempat kos di wilayah Depok untuk

### mahasiswa UBSI Margonda. Tahap awal dalam analisis sistem dilakukan dengan menentukan

### bobot preferensi pada beberapa kriteria utama, seperti harga, lokasi, fasilitas, kebersihan, dan

### keamanan yang digunakan sebagai dasar dalam proses pengambilan keputusan

### Selanjutnya, setiap kriteria diklasifikasikan ke dalam atribut cost dan benefit sesuai dengan

### karakteristik metode SAW. Setelah proses penentuan kriteria selesai, tahap berikutnya adalah

### menentukan alternatif tempat kos yang akan dibandingkan berdasarkan masing-masing kriteria

### yang telah ditentukan

### Tahap selanjutnya dilakukan proses perhitungan nilai total setiap alternatif dengan

### menjumlahkan nilai dari seluruh kriteria yang telah diberikan bobot. Berdasarkan tahapan

### metode SAW tersebut, sistem diimplementasikan pada studi kasus pemilihan tempat kos

### terbaik di wilayah Depok untuk mahasiswa UBSI Margonda dengan langkah-langkah sebagai

### berikut

#### 3.1. Penentuan Kriteria, Bobot Kriteria, Sub Kriteria

### Dalam sistem pemilihan kos terbaik, setiap kriteria diberikan bobot sesuai dengan tingkat

### pengaruh dan kepentingannya terhadap hasil rekomendasi. Rincian kriteria dan bobot yang

### digunakan dapat dilihat pada tabel berikut

```
Tabel 1. Kriteria
```

```
Kode Nama Kriteria Bobot Atribut
C1 Harga 0.3 Cost
C2 Jarak 0.2 Cost
C3 Ukuran Ruangan 0.15 Benefit
C4 Fasilitas Kamar 0.15 Benefit
C5 Fasilitas Kos 0.1 Benefit
C6 Akses Transportasi 0.1 Benefit
```

### Sub kriteria yang digunakan dalam pemilihan kos antara lain harga, jarak, ukuran ruangan

### fasilitas kamar, fasilitas kos dan akses transportasi

```
Tabel 2. Sub Kriteria
```

```
Kode Kriteria Nama Kriteria Harga Nilai
```

```
C1 Harga
```

##### ≤ 500

##### ≤ 1.000

##### ≤ 2.000

##### ≤ 3.000

##### ˃ 3.000

##### 100

##### 80

##### 60

##### 40

##### 20

```
C2 Jarak
```

```
1 - 5 km
5 - 8 km
8 - 12 km
13 - 15 km
˃ 18 km
```

##### 100

##### 80

##### 60

##### 40

##### 20

```
C3 Ukuran Ruangan
```

```
≤ 2x2 m
≤ 3x3 m
≤ 4x4 m
≤ 5x5 m
˃ 5x5 m
```

##### 20

##### 40

##### 60

##### 80

##### 100

```
C4 Fasilitas Kamar
```

```
Kamar mandi luar, kasur, meja, lemari
Kamar mandi luar, kasur, meja, lemari, kursi
Kamar mandi dalam, kasur, meja, lemari, kursi
Kamar mandi luar, AC, kasur, meja, lemari, kursi
Kamar mandi dalam, AC, kasur, meja, lemari, kursi
```

##### 20

##### 40

##### 60

##### 80

##### 100

```
C5 Fasilitas Kos
```

```
Parkir, dapur
Parkir, dapur, wifi, penjaga kos
Parkir, dapur, wifi, penjaga kos, CCTV
Listrik, parkir, dapur, wifi, penjaga kos
Listrik, parkir, dapur, wifi, penjaga kos, CCTV
```

##### 20

##### 40

##### 60

##### 80

##### 100

```
C6 Akses Transportasi
```

```
Sulit dijangkau
Ojek online/kendaraan pribadi
Angkot, ojek online/kendaraan pribadi
Bus, angkot, ojek online/kendaraan pribadi
Kereta, bus, angkot, ojek online/kendaraan pribadi
```

##### 20

##### 40

##### 60

##### 80

##### 100

#### 3.2. Penentuan Alternatif

Kode Nama Kos Harga/bulan (^) RuanganUkuran Fasilitas Kamar Fasilitas Kos TransportasiAkses Jarak ke UBSI
A01 Kost Singgahsini Beji 2.770.000 6.2x4 m
Kamar mandi
dalam, AC,
kasur, meja,
lemari, kursi
Parkir,
dapur, wifi,
penjaga kos
Ojek
online/kendaraan
pribadi
6km

##### A

```
Kost Oemahkoe
Depok Tipe Vvip
2 Beji Depok
```

```
2.499.000 4.5x3 m
```

```
Kamar mandi
dalam, AC,
kasur, meja,
lemari, kursi
```

```
Parkir,
dapur, wifi,
penjaga
kos, CCTV
```

```
Angkot, ojek
online/kendaraan
pribadi
```

```
1.7km
```

```
A03 Kost Singgahsini Cinere 1.825.000 3.7x2.7 m
```

```
Kamar mandi
dalam, AC,
kasur, meja,
lemari, kursi
```

```
Parkir,
dapur,
penjaga kos
```

```
Kereta, bus,
angkot, ojek
online/kendaraan
pribadi
```

```
12km
```

##### A

```
Kost Growing
House Jatijajar
Tipe Standart A
Tapos Depok
```

```
900.000 2.5x2 m
```

```
Kamar mandi
luar, kasur,
meja, lemari,
kursi
```

```
Parkir,
dapur
```

```
Bus, angkot, ojek
online/kendaraan
pribadi
```

```
11.5km
```

##### A

```
Kost Bintang
Tipe A
Sukmajaya
Depok
```

```
1.000.000 3x3 m
```

```
Kamar mandi
luar, kasur,
meja, lemari
```

```
Wifi, parkir
```

```
Angkot, ojek
online/kendaraan
pribadi
```

```
8.5km
```

#### 3.3. Perhitungan Menggunakan Metode SAW

```
Kode C1 C2 C3 C4 C5 C
A01 40 80 100 40 40 100
A02 40 100 100 60 60 80
A03 60 60 100 40 100 60
A04 80 60 40 20 80 40
A05 80 60 20 20 60 40
```

X =

```
[
```

```
40 80 100 40 40 100
40 100 100 60 60 80
60 60 100 40 100 60
80 60 40 20 80 40
80 60 20 20 60 40 ]
```

### Normalisasi Matriks

```
Kos 1 (A01)
```

##### 𝑅 1 − 1 =

##### 𝑀𝑖𝑛 ( 40 , 40 , 60 , 80 , 80 )

##### 40 =

##### 40

##### 40 =^1

##### 𝑅 1 − 2 =

##### 𝑀𝑖𝑛 ( 80 , 100 , 60 , 60 , 60 )

##### 80 =

##### 60

##### 80 =

##### 3

##### 4 =^0.^75

##### 𝑅 1 − 3 =

##### 100

##### 𝑀𝑎𝑥 ( 100 , 100 , 100 , 40 , 20 )=

##### 100

##### 100 =^1

##### 𝑅 1 − 4 =𝑀𝑎𝑥 ( 40 , 6040 , 40 , 20 , 20 )=^4060 =^23 = 0. 6667

##### 𝑅 1 − 5 =

##### 40

##### 𝑀𝑎𝑥 ( 40 , 60 , 100 , 80 , 60 )=

##### 40

##### 100 =

##### 2

##### 5 =^0.^4

##### 𝑅 1 − 6 =𝑀𝑎𝑥 ( 100 ,^10080 , 60 , 40 , 40 )=^100100 = 1

```
Kos 2 (A0 2 )
```

##### 𝑅 2 − 1 =

##### 𝑀𝑖𝑛 ( 40 , 40 , 60 , 80 , 80 )

##### 40 =

##### 40

##### 40 =^1

##### 𝑅 2 − 2 =

##### 𝑀𝑖𝑛 ( 80 , 100 , 60 , 60 , 60 )

##### 100 =

##### 60

##### 100 =

##### 3

##### 5 =^0.^6

##### 𝑅 2 − 3 =

##### 100

##### 𝑀𝑎𝑥 ( 100 , 100 , 100 , 40 , 20 )=

##### 100

##### 100 =^1

##### 𝑅 2 − 4 =𝑀𝑎𝑥 ( 40 , 6060 , 40 , 20 , 20 )=^6060 = 1

##### 𝑅 2 − 5 =

##### 60

##### 𝑀𝑎𝑥 ( 40 , 60 , 100 , 80 , 60 )=

##### 60

##### 100 =

##### 3

##### 5 =^0.^6

### 𝑅 2 − 6 =𝑀𝑎𝑥 ( 100 , 8080 , 60 , 40 , 40 )= 10080 = 45 = 0. 8

```
Kos 3 (A0 3 )
```

##### 𝑅 3 − 1 =

##### 𝑀𝑖𝑛 ( 40 , 40 , 60 , 80 , 80 )

##### 60 =

##### 40

##### 60 =

##### 2

##### 3 =^0.^6667

##### 𝑅 3 − 2 =

##### 𝑀𝑖𝑛 ( 80 , 100 , 60 , 60 , 60 )

##### 60 =

##### 60

##### 60 =^1

##### 𝑅 3 − 3 =

##### 100

##### 𝑀𝑎𝑥 ( 100 , 100 , 100 , 40 , 20 )=

##### 100

##### 100 =^1

##### 𝑅 3 − 4 =

##### 40

##### 𝑀𝑎𝑥 ( 40 , 60 , 40 , 20 , 20 )=

##### 40

##### 60 =

##### 2

##### 3 =^0.^6667

##### 𝑅 3 − 5 =

##### 100

##### 𝑀𝑎𝑥 ( 40 , 60 , 100 , 80 , 60 )=

##### 100

##### 100 =^1

##### 𝑅 3 − 6 =

##### 60

##### 𝑀𝑎𝑥 ( 100 , 80 , 60 , 40 , 40 )=

##### 60

##### 100 =^

##### 3

##### 5 =^0.^6

```
Kos 4 (A0 4 )
```

##### 𝑅 4 − 1 =

##### 𝑀𝑖𝑛 ( 40 , 40 , 60 , 80 , 80 )

##### 80 =

##### 40

##### 80 =

##### 1

##### 2 =^0.^5

##### 𝑅 4 − 2 =

##### 𝑀𝑖𝑛 ( 80 , 100 , 60 , 60 , 60 )

##### 60 =

##### 60

##### 60 =^1

##### 𝑅 4 − 3 =

##### 40

##### 𝑀𝑎𝑥 ( 100 , 100 , 100 , 40 , 20 )=

##### 40

##### 100 =

##### 2

##### 5 =^0.^4

##### 𝑅 4 − 4 =

##### 20

##### 𝑀𝑎𝑥 ( 40 , 60 , 40 , 20 , 20 )=

##### 20

##### 60 =

##### 1

##### 3 =^0.^3333

##### 𝑅 4 − 5 =

##### 80

##### 𝑀𝑎𝑥 ( 40 , 60 , 100 , 80 , 60 )=

##### 80

##### 100 =

##### 4

##### 5 =^0.^8

##### 𝑅 4 − 6 =

##### 40

##### 𝑀𝑎𝑥 ( 100 , 80 , 60 , 40 , 40 )=

##### 40

##### 100 =^

##### 2

### 5 =^0.^4

```
Kos 5 (A0 5 )
```

##### 𝑅 5 − 1 =𝑀𝑖𝑛^ (^40 ,^408 , 060 ,^80 ,^80 )=^4080 =^12 = 0. 5

##### 𝑅 5 − 2 =

##### 𝑀𝑖𝑛 ( 80 , 100 , 60 , 60 , 60 )

##### 60 =

##### 60

##### 60 =^1

##### 𝑅 5 − 3 =

##### 20

##### 𝑀𝑎𝑥 ( 100 , 100 , 100 , 40 , 20 )=

##### 20

##### 100 =

##### 1

##### 5 =^0.^2

##### 𝑅 5 − 4 =

##### 20

##### 𝑀𝑎𝑥 ( 40 , 60 , 40 , 20 , 20 )=

##### 20

##### 60 =

##### 1

##### 3 =^0.^3333

##### 𝑅 5 − 5 =

##### 60

##### 𝑀𝑎𝑥 ( 40 , 60 , 100 , 80 , 60 )=

##### 60

##### 100 =

##### 3

##### 5 =^0.^6

##### 𝑅 5 − 6 =

##### 40

##### 𝑀𝑎𝑥 ( 100 , 80 , 60 , 40 , 40 )=

##### 40

##### 100 =^

##### 2

##### 5 =^0.^4

### Normalisasi matriks R yang didapatkan dari hasil normalisasi matriks X adalah sebagai berikut

R =

```
[
```

```
1 0. 75 1 0. 6667 0. 4 1
1 0. 6 1 1 0. 6 0. 8
0. 6667 1 1 0. 6667 1 0. 6
0. 5 1 0. 4 0. 3333 0. 8 0. 4
0. 5 1 0. 2 0. 3333 0. 6 0. 4 ]
```

### Berikutnya adalah proses perkalian W*R dan penjumlahan hasil perkalian untuk mendapatkan

### alternatif terbaik dengan melakukan perangkingan nilai tertinggi

```
Kode Nama Kos Perkalian W*R Hasil
A01 Kost Singgahsini Beji (0.3×1)+(0.2×0.75)+(0.15×1)+(0.15×0.6667)+(0.1×0.4)+(0.1×1) 0.8 4
```

```
A
```

```
Kost Oemahkoe
Depok Tipe Vvip 2
Beji Depok
```

```
(0.3×1)+(0.2×0.6)+(0.15×1)+(0.15×1)+(0.1×0.6)+(0.1×0.8) 0. 86
```

```
A03 Kost Singgahsini Cinere (0.3×0.6667)+(0.2×1)+(0.15×1)+(0.15×0.6667)+(0.1×1)+(0.1×0.6) 0.8 1
```

```
A
```

```
Kost Growing House
Jatijajar Tipe Standart
A Tapos Depok
```

```
(0.3×0.5)+(0.2×1)+(0.15×0.4)+(0.15×0.3333)+(0.1×0.8)+(0.1×0.4) 0.
```

```
A05 Kost Bintang Tipe A Sukmajaya Depok (0.3×0.5)+(0.2×1)+(0.15×0.2)+(0.15×0.3333)+(0.1×0.6)+(0.1×0.4) 0.5 3
```

### Proses perhitungan nilai preferensi menghasilkan variasi angka pada setiap alternatif

### Keakuratan perhitungan dijamin oleh bobot kriteria yang telah ditentukan sebelumnya. Tabel

### berikut menyajikan hasil perhitungan nilai akhir

```
Rangking Kode Nama Kos Nilai
1 A0 2 Kost Oemahkoe Depok Tipe Vvip 2 Beji Depok^ 0.8 6
2 A01 Kost Singgahsini Beji 0. 84
3 A0 3 Kost Singgahsini Cinere 0. 81
4 A0 4 Kost Growing House Jatijajar Tipe Standart A Tapos Depok 0. 58
5 A0 5 Kost Bintang Tipe A Sukmajaya Depok^ 0. 53
```

#### 3.4. Implementasi Sistem

### Implementasi sistem rekomendasi kos didaerah Depok berbasis website

### 1. Halaman Login

### 2. Halaman Dashboard/Home

### 3. Halaman Data Kos

### 4. Halaman Input Kriteria

### 5. Halaman Perhitungan SAW

### 6. Halaman Hasil Rekomendasi

#### 3.5. Pembahasan

### 1. Hasil Implementasi Metode SAW

### Menjelaskan (Data alternatif yang digunakan, kriteria, bobot, hasil normalisasi, hasil

### perhitungan SAW)

### 2. Perangkingan

### 3. Kriteria Keberhasilan

### 4. Solusi Masalah

## BAB IV KESIMPULAN DAN SARAN

## DAFTAR PUSTAKA

### Adidtyawan, & Mazia, L. (2024). PENERAPAN METODE SIMPLE ADDITIVE

### WEIGHTING (SAW) DALAM PEMILIHAN VENDOR PENGADAAN

### PERANGKAT IT PADA KANTOR PUSAT PT. BANK RAKYAT INDONESIA TBK

### JAKARTA. IJIS (Indonesian Journal on Information System) , 9 (September), 231–241

### Amran, A. M., Zainuddin, K., & Ridfah, A. (2024). Hubungan Antara Penyesuaian Diri dan

### Kesepian Pada Mahasiswa Perantau di Kota Makassar. EKOMA : Jurnal Ekonomi

### Manajemen, Akuntansi , 3 (2), 731–739

### Aziz, M. A., Nurrahim, F., Susanto, P. E., & Windiatmoko, Y. (2020). Boarding House

### Renting Price Prediction Using Deep Neural Network Regression on Mobile Apps

### Gusti, A., & Risandi, R. (2021). Sanitasi Lingkungan dan Perilaku Sehat pada Rumah Kos

### Mahasiswa di Lingkungan Kampus Universitas Andalas. Jurnal Kesehatan Lingkungan

### Indonesia , 20 (2), 74–81

### Ilmi, N., Mahmud, M., Sudirman, Bumulo, F., Ardiansyah, & Damiti, F. (2024). Analisis

### Faktor-Faktor Yang Mempengaruhi Pengambilan Keputusan Mahasiswa Dalam

### Memilih Jasa Rumah Kos Cokroaminoto. JOURNAL OF ECONOMIC AND BUSINESS

### EDUCATION , 2

### Khayati, N., & Arsal, T. (2024). Analisis Fenomena Kenaikan Harga Sewa Kos Mahasiswa

### di Universitas Negeri Semarang pada Akun Instagram On_Kos Perspektif Richard

### Emerson. Jurnal DinamikA , 5 (1), 63–80

### Marthanugraha, R. (2024). DECISION SUPPORT SYSTEM FOR SELECTING

### BOARDING HOUSES FOR STUDENTS IN GRESIK USING THE SAW ( SIMPLE

### ADDITIVE WEIGHTING ) METHOD. JURNAL RISET TEKNIK KOMPUTER , 1 (4)

### 80 – 85. <https://doi.org/https://doi.org/10.69714/x184mj>

### Nurcahyanie, Y. D., & Prihono. (2024). Analisis Faktor Penentu dalam Pemilihan Indekos

### Mahasiswa di Surabaya (Studi dengan Pendekatan Mixed-Method). Jurnal Sains Dan

### AplikasiKeilmuan Teknik Industri (SAKTI) , 04 (02), 87–92

### Nurelasari, E., & Purwaningsih, E. (2021). Sistem Pendukung Keputusan Pemilihan

### Perumahan KPR Terbaik dengan Metode SAW. Syntax: Jurnal Informatika , 10 (02), 52–

### 59

### Ramadhan, R. S., Rohman, A. N., & Rahmi, A. N. (2025). PENERAPAN METODE

### SIMPLE ADDITIVE WEIGHTING DALAM SISTEM PENDUKUNG KEPUTUSAN

### PEMILIHAN TEMPAT KOS DI CONDONG CATUR YOGYAKARTA. Information

### System Journal (INFOS) , 8 (2), 137–146

### <https://doi.org/https://doi.org/10.24076/infosjournal.2025v8i02>

### Reza, M., Ariyani, L., Sarwandianto, A., & Barkah, J. (2023). Sistem Pendukung Keputusan

### Pemilihan Rumah Kos menggunakan Metode Simple Additive Weighting (SAW)

### Jurnal JTIK (Jurnal Teknologi Informasi Dan Komunikasi) , 7 (4)

### <https://doi.org/https://doi.org/10.35870/jti> k.v7i4

### Sumarto, M. D., Purbaratri, W., Prapto, D. A. W., & Faried, M. I. (2024). Sistem Pendukung

### Keputusan Pemilihan Tempat Kos Mahasiswa Menggunakan Metode Saw (Simple

### Additive Weighting). Polygon : Jurnal Ilmu Komputer Dan Ilmu Pengetahuan Alam

### Vol. , 2 (6). <https://doi.org/https://doi.org/10.62383/polygon.v1i6>
