```
Information System Journal (INFOS)
Vol. 8 , No. 2 , November 2025 , pp. 137 - 146
E-ISSN : 2655-142X , P-ISSN : 2655-190X, DOI:https://doi.org/10.24076/infosjournal.202 5 v 8 i02. 2429
```
## PENERAPAN METODE SIMPLE ADDITIVE WEIGHTING DALAM

## SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN TEMPAT KOS

## DI CONDONG CATUR YOGYAKARTA

```
Ridhwan Shodiq Ramadhan 1) , Arif Nur Rohman 2) , Alfie Nur Rahmi^3 )^
```
_1) 2 )3)_ (^) _Sistem Informasi, Fakultas Ilmu Komputer, Universitas Amikom Yogyakarta
email_ : _ridhwan.sr@students.amikom.ac.id 1), arifrahman@amikom.ac.id_^2 _), alfienurrahmi@amikom.ac.id_^3 _)_

### INFO ARTIKEL ABSTRAK

```
Riwayat Artikel:
Diterima November, 202 5
Revisi November, 202 5
Terbit November, 202 5
```
```
Pemilihan tempat kos yang ideal merupakan tantangan besar bagi
mahasiswa yang ingin melanjutkan pendidikannya keluar kota. Namun,
proses pencarian proses penilaian fasilitas tempat kos sering kali masih
harus dilakukan secara langsung, yang menghabiskan waktu dan biaya.
Oleh karena itu dibangunlah sistem pendukung keputusan menggunakan
metode Simple Additive Weighting (SAW) berbasis website yang dapat
membantu mahasiswa dalam menentukan tempat kos sesuai dengan
kriteria yang diinginkan. Metode penelitian dilakukan melalui beberapa
tahap: pengumpulan data dari sumber terkait, analisis sistem untuk
menyusun alur kerja, perancangan sistem rekomendasi, dan
implementasi sistem. Berdasarkan hasil perhitungan perangkingan,
Residence Permai terpilih sebagai rekomendasi terbaik dengan nilai
akhir 0.8500, diikuti oleh Griya Seturan dengan nilai 0,8400, dan Kos
Candi Gebang dengan nilai 0,8000. Hasil pengujian menunjukkan
bahwa sistem ini berjalan sesuai dengan yang diharapkan dan mampu
memberikan solusi yang lebih komprehensif dan praktis bagi mahasiswa
yang mencari tempat kos di Condong Catur, Sleman, Yogyakarta.
Kata Kunci :
Sistem Pendukung Keputusan; Tempat Kos; Website ; Simple Additive
Weighting; Rekomendasi
```
### ABSTRACT

```
Selecting an ideal boarding house is a significant challenge for students
who continue their studies outside their home region. However, the
assessment and evaluation process for boarding house facilities is often
conducted manually, requiring considerable time and cost. Therefore, a
web-based Decision Support System using the Simple Additive
Weighting (SAW) method was developed to assist students in
determining the most suitable boarding house according to their
preferred criteria. The research methodology consisted of several
stages, including data collection from relevant sources, system analysis
to design workflow processes, recommendation system design, and
system implementation. Based on the ranking results, Residence Permai
was selected as the best recommendation with a final score of 0.8500,
followed by Griya Seturan with a score of 0.8400, and Kos Candi
Gebang with a score of 0.8000. The evaluation results indicate that the
system performs as expected and provides a more comprehensive and
practical solution for students seeking boarding houses in Condong
Catur, Sleman, Yogyakarta.
```
(^)
**_Keywords_** **:**
_Decision Support System; Boarding House; Website; Simple Additive
Weighting; Recommendation_
**Penulis Korespondensi:**
Ridwan Shodiq Ramadhan
_Sistem Informasi, Fakultas Ilmu
Komputer, Universitas Amikom
Yogyakarta_
Email:
_ridhwan.sr@students.amikom.ac.id_


```
Penerapan Metode Simple...,
Information System Journal (INFOS) Vol. 8 , No. 2, November 2025 , pp. 1 37 - 146
```
# 1. PENDAHULUAN

Pemilihan tempat kos yang ideal merupakan tantangan besar bagi mahasiswa yang ingin melanjutkan
pendidikannya keluar kota. Setiap tahunnya, ribuan mahasiswa dari berbagai daerah di Indonesia datang ke
Yogyakarta untuk melanjutkan Pendidikannya. Hal ini mengakibatkan tingginya kebutuhan tempat tinggal,
terutama kos-kosan bagi para mahasiswa dari luar daerah. Berdasarkan data Badan Pusat Statistik (BPS)
Yogyakarta, pada tahun 2023 terdapat lebih dari 50.000 mahasiswa baru yang memerlukan tempat tinggal
sementara selama mereka menempuh pendidikan di kota ini. Maka dari itu permintaan akan tempat kos yang
nyaman, terjangkau, dan sesuai dengan kebutuhan meningkat setiap tahunnya. Namun, proses pencarian yang
efisien dan sesuai kriteria masih menjadi masalah yang belum terpecahkan. Jadi diperlukan sebuah sistem
pendukung keputusan (SPK) yang dapat membantu masyarakat, terutama mahasiswa dalam menentukan
tempat kos yang sesuai dengan kriteria [1].

Sistem Pendukung Keputusan adalah sistem informasi yang dibangun guna membantu dalam
menangani permasalahan yang dihadapi, salah satu contohnya adalah untuk mempermudah proses pemilihan
tempat kos [2]. Salah satunya adalah penerapan teknologi informasi dalam bentuk website dan aplikasi mobile
yang memfasilitasi pencarian kos. Berbagai platform seperti Mamikos, Infokost, dan lainnya telah
menyediakan layanan pencarian kos dengan berbagai filter seperti harga, lokasi, dan fasilitas. Platform-
platform ini memungkinkan pengguna untuk melihat foto, membaca ulasan, dan menghubungi pemilik kos
secara langsung. Selain itu, beberapa peneliti juga mengembangkan sistem pendukung keputusan untuk
membantu dalam menentukan tempat kos seperti, Penelitian menggunakan Metode _Simple Additive Weighting_
(SAW) telah memberikan kemudahan dalam mengambil keputusan untuk memilih tempat kos [3]. Selain itu
SPK menggunakan Metode _Technique for Order Preference by Similarity to Ideal Solution_ (TOPSIS) dengan
pemrograman php juga mampu memberikan rekomendasi dengan memberikan perangkingan tempat kos sesuai
dengan nilai preferensinya [4].

Meskipun berbagai platform dan penelitian telah membantu dalam proses pencarian kos, masih ada
beberapa masalah yang belum sepenuhnya teratasi. Pertama proses penilaian fasilitas tempat kos sering kali
masih harus dilakukan secara langsung, yang menghabiskan waktu dan biaya. Bagi mahasiswa yang berasal
dari luar daerah, menemukan tempat kos di sekitar kampus bukanlah hal yang mudah, dikarenakan mereka
belum mengenal lokasi sekitar, khususnya lokasi di sekitar kampus [5]. Kedua, kriteria yang digunakan dalam
penelitian sebelumnya kurang detail dan spesifik sesuai kebutuhan pengguna, hal ini berpengaruh dalam
pertimbangan dan menyulitkan dalam pengambilan keputusan dalam menentukan tempat kos. Ketiga, metode
yang digunakan dalam penelitian sistem pendukung keputusan seringkali terlalu kompleks untuk digunakan
oleh orang awam tanpa latar belakang teknis.

Berdasarkan uraian latar belakang, maka akan dibangun sebuah sistem pendukung keputusan tempat
kos berbasis website yang lebih efektif dan efisien dalam membantu mahasiswa memilih tempat kos di wilayah
Condong Catur, Sleman, Yogyakarta. Sistem yang akan dibangun menggunakan metode _Simple Additive
Weighting_ untuk mengintegrasikan berbagai kriteria penting seperti harga, luas kamar, fasilitas kamar, fasilitas
umum, dan jarak dari beberapa kampus di daerah Condong Catur. Metode _Simple Additive Weighting_ dipilih
karena memiliki kelebihan dibanding dengan metode pengambil keputusan lainya yang terletak pada
kemampuan untuk melakukan penilaian lebih tepat karena didasarkan pada nilai kriteria dan bobot preferensi
yang sudah ditentukan, selain itu metode SAW juga dapat menyeleksi alternatif terbaik dari sejumlah alternatif
yang ada karena adanya proses perangkingan setelah menentukan bobot untuk setiap atribut [6]. Dengan
demikian, sistem ini diharapkan dapat membantu masyarakat, khususnya mahasiswa pencari tempat kos dalam
menentukan kos yang akan ditempati sesuai dengan kriteria yang diinginkan [7].

## 2. METODOLOGI PENELITIAN

Langkah awal dalam pengembangan sistem pada penelitian ini adalah menentukan model sistem
pendukung keputusan yang akan diterapkan. Tahapan-tahapan penelitian ini menggunakan pendekatan
sebagaimana Gambar 1.


```
Information System Journal (INFOS)
Vol. 8 , No. 2 , November 2025 , pp. 137 - 146
E-ISSN : 2655-142X , P-ISSN : 2655-190X, DOI:https://doi.org/10.24076/infosjournal.202 5 v 8 i02. 2429
```
```
Gambar 1. Metode penelitian.
```
Dalam Gambar 1., merupakan tahapan penilitian yang meliputi Identifikasi Masalah, Studi Literatur,
Pengumpulan Data, Analisis Data, Desain Sistem, Implementasi Metode SAW, dan Pengujian Sistem.

**2.1 Identifikasi Masalah**
Tahap awal proses penelitian dimulai dengan mengidentifikasi masalah yang ada. Tahap ini didasarkan
pada rumusan masalah yang diambil dari latar belakang masalah. Selain itu, pada tahap ini juga dilakukan
identifikasi terhadap sistem yang mencakup kebutuhan data, perangkat keras, dan perangkat lunak [8].

**2.2 Studi Literatur**
Studi literatur digunakan untuk mencari pustaka pendukung melalui artikel, buku, mengambil referensi
dari jurnal ilmiah, jurnal nasional, _browsing internet_ , dan makalah hasil penelitian terkait metode _Simple
Additive Weighting_ [9][10]. Metode _Simple Additive Weighting_ , atau yang sering dikenal dengan istilah metode
penjumlahan terbobot. Konsep dasar metode SAW adalah menghitung jumlah total yang terbobot dari
penilaian kinerja setiap alternatif berdasarkan semua atribut yang ada. Dalam metode ini, alternatif terbaik
dipilih berdasarkan nilai tertinggi [11]. Perhitungan metode SAW akan akurat jika alternatif memiliki nilai
yang sesuai dengan kriteria dan sub kriteria yang telah ditetapkan. Peneliti lebih memilih menggunakan metode
SAW karena lebih efisien dan waktu yang diperlukan untuk perhitungan lebih cepat. Proses ini melibatkan
normalisasi matriks keputusan (X) sehingga semua rating alternatif dapat dibandingkan pada skala yang sama
[8]. Berikut Adalah Langkah-langkah untuk perhitungan metode _Simple Additive Weighting_ :

```
1) Rating Kecocokan Nilai
Mengubah nilai alternatif (spesifikasi tempat kos) sesuai dengan nilai bobot pada data sub kriteria.
```
```
2) Normalisasi Matriks
Proses normalisasi matriks adalah langkah penting untuk memastikan bahwa semua nilai berada
dalam skala yang dapat dibandingkan yaitu berupa angka, sehingga menghasilkan nilai yang konsisten
untuk perbandingan antar kriteria[12]. Berikut adalah rumus normalisasi matriks.
```
### 𝑟𝑖𝑗={

```
𝑥𝑖𝑗
𝑚𝑎𝑥(𝑥𝑖𝑗)^ apabila^ j^ merupakan^ atribut^ keuntungan^ (𝑏𝑒𝑛𝑒𝑓𝑖𝑡)
𝑚𝑖𝑛 (𝑥𝑖𝑗)
𝑥𝑖𝑗^ apabila^ j^ merupakan^ atribut^ biaya^
```
### (𝑐𝑜𝑠𝑡)

### (1)

```
Penjelasan dari rumus diatas 𝑟𝑖𝑗 = nilai rating kinerja ternormalisasi, 𝑥𝑖𝑗 = nilai atribut setiap kriteria,
𝑚𝑎𝑥(𝑥𝑖𝑗) = nilai tertinggi dari setiap kriteria, 𝑚𝑖𝑛 (𝑥𝑖𝑗) = nilai terrendah dari setiap kriteria.
```
```
3) Perangkingan
Tahap terakhir pada proses perhitungan SAW adalah perangkingan. Pada tahap ini, nilai-nilai yang
telah dinormalisasi dikalikan dengan bobot masing-masing kriteria, kemudian dijumlahkan untuk
memperoleh skor total setiap alternatif. Alternatif dengan skor tertinggi kemudian dipilih sebagai yang
terbaik. Berikut adalah rumus untuk proses perankingan:
```
```
𝑉𝑖= ∑𝑛𝑗= 1 𝑤𝑗𝑟𝑖𝑗 (2)
```
```
Dimana V𝑖 = perangkingan pada semua alternatif, 𝑟𝑖𝑗 = nilai untuk rating kinerja yang sudah
ternormalisasi, 𝑤𝑗= nilai bobot pada semua kriteria. Semakin besar nilai akhir dari sebuah alternatif
𝑉𝑖, maka semakin tinggi rangking dari alternatif tersebut [13].
```

```
Penerapan Metode Simple...,
Information System Journal (INFOS) Vol. 8 , No. 2, November 2025 , pp. 1 37 - 146
```
**2.3 Pengumpulan Data**
Pada tahap ini, data dikumpulkan melalui observasi langung di tempat kos sekitar wilayah condong
catur. Selain observasi, data tambahan diperoleh melalui informasi dari aplikasi Mamikos dan web Infokos,
termasuk harga, fasilitas-fasilitas, luas kamar dan lokasi kos.

**2.4 Analisa Data**
Setelah pengumpulan data, langkah berikutnya adalah menganalisis data spasial berdasarkan studi
literatur yang telah dipelajari, proses ini digunakan untuk menentukan tempat kos terbaik dengan menerapkan
metode SAW. Berdasarkan hasil yang digunakan pada jurnal terdahulu dan melakukan kuisioner, diperoleh
kriteria-kriteria yang digunakan sebagai parameter penilaian untuk memilih tempat kos yaitu harga, luas kamar,
fasilitas kamar, fasilitas umum, dan jarak. Kriteria yang menjadi prioritas pertama akan diberikan nilai lebih
tinggi dari pada kriteria yang dianggap memiliki prioritas lebih rendah [14]. Sub kriteria adalah pembatas dari
nilai setiap kriteria. Setiap sub kriteria memiliki bobot nilai masing-masing, lalu bobot nilai dari sub kriteria
tersebut yang akan digunakan dalam perhitungan SAW. Jika tidak menggunakan sub kriteria, maka bobot nilai
dari kriteria yang kan diproses dalam perhitungan SAW. Perhatikan dalam pemberian bobot untuk setiap sub
kriterianya. Pemberian bobot juga berpengaruh terhadap atribut dari kriteria.

**2.5 Desain Sistem**
Tahap perancangan sistem dan sistem rekomendasi yang akan dikembangkan dalam penelitian ini.
Proses perancangan memanfaatkan hasil analisis sebagai dasar dalam tahap desain. Proses awal _website_ dibuka
langsung menampilkan rekomendasi tempat kos di daerah condong catur dari yang terbaik sesuai perhitungan.
Mahasiswa juga dapat memfilter rekomendasi tempat kos berdasarkan _range_ harganya, fasilitas yang
dibutuhkan, tipe kos, dan radius jarak dari kampus Amikom atau UPN atau Mercubuana.

**2.6 Implementasi Metode SAW**
Pada tahap ini menerapkan metode _Simple Additive Weighting_ (SAW), yang prinsipnya adalah
melakukan perhitungan dengan menjumlahkan rating kinerja yang terbobot dari setiap alternatif pada semua
atribut. Pembuatan sistem ini dilakukan menggunakan bahasa _HTML_ , _CSS_ , _Javascript_ , dan _PHP native_ untuk
membuat sebuah _website_. Setelah tahap implementasi, sistem diuji untuk memastikan hasil perhitungan metode
_Simple Additive Weighting_ (SAW) sudah baik, semua fungsi berjalan sesuai dengan yang direncanakan, dan
kemudian disiapkan agar _website_ ini sudah siap digunakan untuk menentukan tempat kos terbaik.

**2.7 Pengujian Sistem**
Setelah sistem selesai dikembangkan, langkah terakhir adalah melakukan pengujian _website_. Pengujian
ini dilakukan dengan menguji metode _Simple Additive Weighting_ pada hasil penilaian yang berisikan nilai-nilai
kriteria dan sub kriteria. Pengujian Fungsionalitas untuk memastikan bahwa semua fitur yang dikembangkan,
termasuk sistem filter radius jarak, range harga, fasilitas dan tampilan rekomendasi, berjalan sesuai dengan
rancangan. Pengujian Akurasi Metode guna memastikan bahwa hasil perhitungan perangkingan menggunakan
metode SAW sudah sesuai dengan perhitungan manual yang dilakukan. Serta Pengujian Keberhasilan Sistem
untuk mengukur sejauh mana sistem mampu memberikan solusi yang komprehensif dan praktis bagi
mahasiswa dalam memilih tempat kos.

Kriteria keberhasilan penelitian ini adalah ketika sistem rekomendasi berhasil menampilkan hasil
rekomendasi tempat kos secara otomatis. Hasil perangkingan yang dihasilkan sistem sama dengan hasil
perhitungan manual dengan metode SAW, dan mendapatkan umpan balik positif dari calon pengguna bahwa
sistem mempermudah proses pengambilan keputusan dalam memilih tempat kos dibandingkan dengan cara
konvensional [6].

## 3. HASIL DAN PEMBAHASAN

Hasil implementasi sistem pendukung keputusan menggunakan Metode SAW dalam pemilihan kos di
daerah Condong Catur, Sleman. Langkah awal dalam analisis sistem ini adalah menentukan nilai bobot
preferensi pada 5 kriteria utama (Harga, Luas Kamar, Fasilitas Kamar, Fasilitas Bersama, dan Jarak) yang akan
diterapkan dalam proses pengambilan keputusan. Proses tersebut mengikuti tahapan-tahapan dari Metode
SAW, di mana setiap kriteria diklasifikasikan sebagai _cost_ atau _benefit_. Selanjutnya, alternatif pilihan kos
ditentukan berdasarkan kriteria tersebut. Setelah itu, nilai total dihitung dengan menjumlahkan skor dari setiap
kriteria untuk masing-masing pilihan kos. Berpedoman pada tahapan-tahapan metode ini, implementasi
dilakukan pada contoh kasus pemilihan kos terbaik di wilayah Condong Catur, Sleman dengan langkah-
langkah sebagai berikut [15]:


```
Information System Journal (INFOS)
Vol. 8 , No. 2 , November 2025 , pp. 137 - 146
E-ISSN : 2655-142X , P-ISSN : 2655-190X, DOI:https://doi.org/10.24076/infosjournal.202 5 v 8 i02. 2429
```
**3.1. Penentuan Kriteria, Bobot Kriteria, Sub Kriteria, dan Alternatif**
Bobot Kriteria yang digunakan dalam sistem pemilihan kos terbaik telah ditentukan berdasarkan tingkat
kepentingan setiap aspek yang dinilai. Kriteria serta bobot yang digunakan untuk menentukan kos terbaik
tercantum pada Tabel 1.

```
Tabel 1. Kriteria.
Kode Nama Kriteria Bobot Atribut
C1 Harga 0.3 Cost
C2 Luas Kamar 0.1 Benefit
C3 Fasilitas Kamar 0.2 Benefit
C4 Faslitas Umum 0.2 Benefit
C5 Jarak 0.2 Cost
```
Sub kriteria yang digunakan dalam pemilihan kos meliputi harga, luas kamar, fasilitas kamar, fasilitas
umum, dan jarak. Masing-masing kriteria ini diberikan bobot sesuai dengan tingkat kepentingannya dalam
proses pengambilan keputusan. Harga lebih rendah diberikan bobot lebih tinggi, karena mahasiswa cenderung
memilih kos yang lebih terjangkau. Luas kamar dinilai, dengan kamar yang lebih besar mendapatkan bobot
lebih tinggi, karena kenyamanan menjadi salah satu pertimbangan. Selain itu, fasilitas-fasilitas yang disediakan
di kos juga diperhitungkan, dengan kos yang menawarkan fasilitas lebih lengkap, seperti kamar mandi dalam,
ac wifi, dan penjaga kos, mendapatkan bobot lebih besar dibandingkan kos dengan fasilitas yang lebih terbatas.
Terakhir, Jarak dari kampus ke kos juga menjadi faktor penting, di mana kos yang lebih dekat memiliki bobot
lebih tinggi.

Tahap pembobotan subkriteria, akan ditentukan jenis berdasarkan subkriteria. Rentang nilai yang
digunakan dalam penelitian ini menggunakan skala likert dengan skor 1 hingga 5, kemudian diubah menjadi
indeks dengan rentang 20 hingga 100 untuk memudahkan interpretasi. Nilai 20 menunjukkan sangat kurang,
nilai 40 menunjukkan kurang, nilai 60 menunjukkan cukup, nilai 80 menunjukkan baik, dan nilai 100
menunjukkan sangat baik. Detail parameter nilai untuk setiap sub kriteria dapat dilihat pada Tabel 2.

```
Tabel 2. Sub kriteria harga.
```
```
Kode Kriteria Nama Kriteria Harga Nilai
```
```
C1 Harga
```
```
<= 750.000 20
<= 1.500.000 40
<= 2.250.000 60
<= 3.000.000 80
> 3.000.000 100
```
```
C2 Luas Kamar
```
```
<= 3x3 meter 20
<= 4x4 meter 40
<= 5x5 meter 60
<= 6x6 meter 80
> 6x6 meter 100
```
```
C3 Fasilitas Kamar
```
```
Kamar Mandi Luar, Kipas Angin 20
Kamar Mandu Luar, Kipas Angin, Lemari 40
Kamar Mandi Dalam, Kipas Angin, Lemari 60
Kamar Mandi Dalam, Wastafel, Lemari, Kasur, AC 80
Kamar Mandi Dalam, Wastafel, Lemari, Kasur, Meja, AC, TV 100
```
```
C4 Fasilitas Umum
```
```
Wifi, Dapur 20
Wifi, Dapur, Tempat Cuci, Tempat Jemur Pakaian 40
Wifi, Dapur, Tempat Cuci, Tempat Jemur Pakaian, Ruang Tamu 60
Wifi, Dapur, Ruang Tamu, TV, CCTV, Parkir Luas 80
Wifi, Dapur, Ruang Tamu, TV, CCTV, Penjaga Kos, Parkir Luas 100
```
```
C5 Jarak
```
```
< 500 meter 20
< 2 km 40
< 5 km 60
< 7 km 80
>= 7 km 100
```
```
Data alternatif tempat kos yang berada di daerah Condong Catur dapat ditemukan pada Tabel 3.
```

```
Penerapan Metode Simple...,
Information System Journal (INFOS) Vol. 8 , No. 2, November 2025 , pp. 1 37 - 146
```
```
Tabel 3. Alternatif kos.
```
```
Kode Nama Kos Harga /bulan Luas Fasilitas Kamar Fasilitas Umum Jarak dari Amikom
```
```
A 01 Kos Gebang Candi 1.800.000 6x6 AC, K. Mandi Dalam, Kasur Wifi, Ruang Tamu, CCTV, Parkir Luas 0.
```
```
A 02 Griya Seturan 1.500.000 5x6 K. Mandi Dalam, Kasur, Meja, Lemari Wifi, Dapur, Ruang Tamu, CCTV, Parkir Luas 1.
```
```
A 03 Residence Permai 2.500.000 6x7 AC, K. Mandi Dalam, Air Panas, TV Wifi, Dapur, Ruang Tamu, TV, CCTV, Penjaga Kos, Parkir Luas 1.
```
```
A 04 Kos Manis Hijau 1.100.000 5x5 Kasur, Lemari, Kipas Angin Wifi, Dapur 1.
```
```
A 05 Wisma Sembada 1.950.000 6x6 AC, K. Mandi Dalam, Meja, TV Wifi, Dapur, Ruang Tamu, CCTV, Parkir Luas 2.
```
**3.2. Perhitungan Menggunakan Metode Simple Additive Weighting**
Dalam penelitian ini, akan diberikan sebuah contoh perhitungan untuk memiliih kos dari 5 alternatif
kos yang tersedia. Langkah awal proses pengambilan Keputusan dilakukan dengan mengubah nilai-nilai pada
alternatif diubah sesuai dengan bobot yang ditetapkan untuk setiap sub kriteria, sehingga menghasilkan data
seperti yang ditunjukkan Tabel 4.

```
Tabel 4. Rating kecocokan.
```
```
Kode C1 C2 C3 C4 C
A01 60 80 80 80 40
A02 40 60 60 80 40
A03 80 100 100 100 40
A04 40 60 40 20 40
A05 60 80 100 80 60
```
```
Matriks keputusan yang terbentuk adalah sebagai berikut:
```
### X =

```
[
```
```
60 80 80 80 40
40 60 60 80 40
80 100 100 100 40
40 60 40 20 40
60 80 100 80 60 ]
```
```
Normalisasi Matriks :
Kos 1 (A1): Kos 2 (A2): Kos 3 (A3):
```
```
𝑅 11 = 𝑀𝑖𝑛{^60 ,^4060 ,^80 ,^40 ,^60 } = 23 = 0.66 67 𝑅 21 = 𝑀𝑖𝑛{^60 ,^4040 ,^80 ,^40 ,^60 } = 22 = 1 𝑅 31 = 𝑀𝑖𝑛{^60 ,^4080 ,^80 ,^40 ,^60 } = 24 = 0. 5
```
```
𝑅 12 =
```
```
80
𝑀𝑎𝑥{ 80 , 60 , 100 , 60 , 80 }^ =^
```
```
4
5 = 0.^8 𝑅^22 =
```
```
60
𝑀𝑎𝑥{ 80 , 60 , 100 , 60 , 80 }^ =^
```
```
3
5 = 0.6^7 𝑅^32 =
```
```
100
𝑀𝑎𝑥{ 80 , 60 , 100 , 60 , 80 }^ =^
```
```
5
5 =^1
```
```
𝑅 13 = 𝑀𝑎𝑥{ 80 , 6080 , 100 , 40 , 100 } = 45 = 0. 8 𝑅 23 = 𝑀𝑎𝑥{ 80 , 6060 , 100 , 40 , 100 } = 35 = 0. 67 𝑅 33 = 𝑀𝑎𝑥{ 80 , 6100 , 1000 , 40 , 100 } = 55 = 1
```
```
𝑅 14 =
```
```
80
𝑀𝑎𝑥{ 80 , 80 , 100 , 20 , 80 }^ =^
```
```
4
5 = 0.^8 𝑅^24 =
```
```
80
𝑀𝑎𝑥{ 80 , 80 , 100 , 20 , 80 }^ =^
```
```
4
5 = 0.^8 𝑅^34 =
```
```
100
𝑀𝑎𝑥{ 80 , 80 , 100 , 20 , 80 }^ =^
```
```
5
5 =^1
```
```
𝑅 15 = 𝑀𝑖𝑛{^40 ,^4040 ,^40 ,^40 ,^60 } = 22 = 1 𝑅 25 = 𝑀𝑖𝑛{^40 ,^4040 ,^40 ,^40 ,^60 } = 22 = 1 𝑅 35 = 𝑀𝑖𝑛{^40 ,^4040 ,^40 ,^40 ,^60 } = 22 = 1
```
```
Kos 4 (A4): Kos 5 (A5):
```
(^) 𝑅 41 = 𝑀𝑖𝑛{^60 ,^4040 ,^80 ,^40 ,^60 } = 22 = 1 𝑅 51 = 𝑀𝑖𝑛{^60 ,^4060 ,^80 ,^40 ,^60 } = 23 = 0.
𝑅 42 = 𝑀𝑎𝑥{ 80 , 6600 , 100 , 60 , 80 } = 35 = 0. 6 𝑅 52 = 𝑀𝑎𝑥{ 80 , 6800 , 100 , 60 , 80 } = 45 = 0. 8
𝑅 43 = 𝑀𝑎𝑥{ 80 , 604 ,^0100 , 40 , 100 } = 25 = 0. 4 𝑅 53 = 𝑀𝑎𝑥{ 80 , 6100 , 1000 , 40 , 100 } = 55 = 1
𝑅 44 = 𝑀𝑎𝑥{ 80 , 8200 , 100 , 20 , 80 } = 15 = 0. 2 𝑅 54 = 𝑀𝑎𝑥{ 80 , 8800 , 100 , 20 , 80 } = 45 = 0. 8
𝑅 45 = 𝑀𝑖𝑛{^40 ,^4040 ,^40 ,^40 ,^60 } = 22 = 1 𝑅 55 = 𝑀𝑖𝑛{^40 ,^4060 ,^40 ,^40 ,^60 } = 23 = 0.


```
Information System Journal (INFOS)
Vol. 8 , No. 2 , November 2025 , pp. 137 - 146
E-ISSN : 2655-142X , P-ISSN : 2655-190X, DOI:https://doi.org/10.24076/infosjournal.202 5 v 8 i02. 2429
```
```
Normalisasi matriks R yang diperoleh dari hasil normalisasi matriks X adalah sebagai berikut:
```
```
R =
```
```
[
```
```
0 , 6667 0 , 8 0 , 8 0 , 8 1
1 0 , 6 0 , 6 0 , 8 1
0 , 5 1 1 1 1
1 0 , 6 0 , 4 0 , 2 1
0 , 6667 0 , 8 1 0 , 8 0 , 6667 ]
```
Selanjutnya proses perkalian W*R dan penjumlahan hasil perkalian untuk memperoleh alternatif
terbaik dengan melakukan perangkingan nilai tertinggi sebagaimana Tabel 5.

```
Tabel 5. Nilai preferensi.
```
```
Kode Nama Kos Perkalian W*R Hasil
A01 Kos Candi Gebang (0.3 * 0,666) + (0.1 * 0,8) + (0.2 * 0,8) + (0.2 * 0,8) + (0.2 * 1) 0. 8000
A02 Griya Seturan (0.3 * 1) + (0.1 * 0,6) + (0.2 * 0,6) + (0.2 * 0,8) + (0.2 * 1) 0.8 400
A03 Residence Permai (0.3 * 0,5) + (0.1 * 1) + (0.2 * 1) + (0.2 * 1) + (0.2 * 1) 0,85 00
A04 Kos Hijau Manis (0.3 * 1) + (0.1 * 0,6) + (0.2 * 0,4) + (0.2 * 0,2) + (0.2 * 1) 0,68 00
A05 Wisma Sembada (0.3 * 0,666) + (0.1 * 0,8) + (0.2 * 1) + (0.2 * 0,8) + (0.2 *0,666) 0,773 3
```
Setelah dilakukan perhitungan nilai preferensi, didapatkan hasil berupa angka yang berbeda tiap
alternatif. Perhitungan tersebut dapat dikatakan akurat, karena nilai dari setiap alternatif pada setiap kriteria
memiliki bobot yang telah disepakati. Hasil perhitungan nilai akhir dapat dilihat dalam Tabel 6 berikut.

```
Tabel 6. Nilai akhir.
```
```
Ranking Kode Nama Kos Nilai
1 A0 3 Residence Permai 0. 8500
2 A02 Griya Seturan 0.8 400
3 A0 1 Kos Candi Gebang 0,8 000
4 A0 5 Wisma Sembada 0, 7733
5 A0 4 Kos Hijau Manis 0, 6800
```
Hasil dari proses perhitungan dengan metode SAW, penentuan tempat kos menjadi lebih mudah.
Berdasarkan perhitungan manual tersebut, Tempat kos “Residence Permai” mendapatkan nilai tertinggi dengan
total nilai 0,8500, sehingga diremokendasikan sebagai tempat kos terbaik.

**3.3. Implementasi Sistem**
Implementasi sistem rekomendasi kos di daerah Condong Catur Sleman berbasis _website_ dirancang
menggunakan _HTML_ , _CSS_ , _Javascript_ , _PHP native_ , dan _MySQL_ sebagai _database_.

```
Gambar 2. Input kriteria.
```
Halaman admin _input_ kriteria dan nilai bobot kriteria pada Gambar 2., ini menampilkan _form_ untuk
mengisi kriteria dan nilai bobot kriteria untuk menghitung peringkat atau skor untuk setiap rumah kos
berdasarkan kriteria dan bobot yang telah dimasukkan.


```
Penerapan Metode Simple...,
Information System Journal (INFOS) Vol. 8 , No. 2, November 2025 , pp. 1 37 - 146
```
### ^

```
Gambar 3. Input sub kriteria.
```
Halaman admin _input_ sub kriteria yang dimana sub kriteria sebagai pembatas dari nilai setiap kriteria.
Setiap sub kriteria memiliki bobot nilai masing-masing, lalu bobot nilai dari sub kriteria tersebut yang akan
digunakan dalam perhitungan SAW. Jika tidak menggunakan sub kriteria, maka bobot nilai dari kriteria yang
kan diproses dalam perhitungan SAW. Perhatikan dalam pemberian bobot untuk setiap sub kriterianya.
Pemberian bobot juga berpengaruh terhadap atribut dari kriteria.

```
Gambar 4. Tampilan rekomendasi.
```
Halaman awal ketika mahasiswa membuka _website_ rekomendasi tempat kos, sudah menampilkan
tempat kos mulai dari peringkat tertinggi hingga terendah beserta total skor perhitungan SAW di wilayah
Condong Catur, Sleman dari Kampus Universitas Amikom Yogyakarta.

```
Gambar 5. Menu filter.
```

```
Information System Journal (INFOS)
Vol. 8 , No. 2 , November 2025 , pp. 137 - 146
E-ISSN : 2655-142X , P-ISSN : 2655-190X, DOI:https://doi.org/10.24076/infosjournal.202 5 v 8 i02. 2429
```
Fitur untuk menentukan kebutuhan kriteria apa saja yang dicari oleh mahasiswa. Kampus filter
digunakan untuk memilih disekitar kampus mana yang akan dicari, terdapat tiga pilihan kampus yaitu Amikom,
UPN, dan Mercu Buana Kampus II. Menu radius berfungsi untuk menampilkan tempat kos dengan radius yang
diinginkan, _filter range_ harga bisa disesuai dengan kebutuhan uang mahasiswa. Fasilitas wajib berisikan
fasilitas-fasilitas yang tersedia sesuai kebutuhan yang dicari mahasiswa.

**3.4. Pembahasan**
Pembahasan ini menganalisis implementasi metode _Simple Additive Weighting_ (SAW) serta evaluasi
keberhasilan sistem pendukung keputusan dalam mengatasi permasalahan pemilihan tempat kos di wilayah
Condong Catur.

**3.4.1. Hasil Implementasi Metode SAW dan Perangkingan**
Hasil implementasi metode SAW dalam sistem pendukung keputusan pemilihan tempat kos
menunjukkan efektivitasnya dalam memberikan rekomendasi yang sesuai dengan kebutuhan mahasiswa.
Berdasarkan hasil perangkingan, Kos “Residence Permai” memperoleh nilai tertinggi 0.8500 karena mencapai
keseimbangan optimal antara bobot kriteria dan nilai alternatif. Meskipun harganya sedikit lebih mahal, bobot
yang lebih signifikan pada kriteria Fasilitas-fasilitas dan Luas Kamar membuat alternatif ini unggul, yang
sesuai dengan preferensi mahasiswa terhadap kenyamanan dan fasilitas lengkap.

**3.4.2. Kriteria Keberhasilan dan Solusi Masalah**
Dibandingkan dengan metode manual, sistem ini memungkinkan mahasiswa untuk menghemat waktu
dan tenaga dalam mengumpulkan dan mengevaluasi informasi kos. Keberhasilan sistem juga terletak pada
kemampuannya mengintegrasikan berbagai kriteria penting dan menyajikannya dalam bentuk perangkingan
terbobot. Selain itu, adanya fitur filter harga, tujuan kampus, jarak menjadikan rekomendasi yang diberikan
lebih spesifik dan mendekati kebutuhan pengguna.

Penelitian ini membuka peluang untuk pengembangan lebih lanjut, terutama dalam mengatasi
keterbatasan sistem. Masih banyak fitur yang perlu dikembangkan lagi seperti Integrasi dengan _Firebase_
memastikan data kos tersinkronisasi secara _real-time_ , memungkinkan pengguna memperoleh informasi terkini
mengenai ketersediaan kos yang sudah diterapkan oleh peneliti Candra Ihsan Purwanto [15]. Cakupan
penelitian ini yang terbatas hanya pada wilayah Condong Catur, Sleman. Penelitian lanjutan dapat memperluas
cakupan geografis, menambah variabel kriteria, dan mengoptimalkan fitur-fitur lainnya berbasi _website_.

## 4. KESIMPULAN

Berdasarkan hasil penelitian ini, dapat disimpulkan bahwa sistem rekomendasi untuk pemilihan kos
dengan mengimplementasikan Metode SAW efektif dalam memberikan rekomendasi yang relevan dan sejalan
dengan kebutuhan mahasiswa berdasarkan kriteria utama seperti harga, luas kamar, fasilitas kamar, fasilitas
umum dan jarak. Selain itu, sistem ini juga menerapkan fitur filter yang memudahkan pengguna untuk
menemukan tempat kos yang sesuai dengan preferensi mereka. Hasil dari sistem rekomendasi ini dapat menjadi
acuan bagi mahasiswa untuk memilih kos yang sesuai dengan preferensi mereka berdasarkan harga, luas
kamar, fasilitas, dan jarak. Berdasarkan hasil perhitungan perangkingan, Residence Permai terpilih sebagai
rekomendasi terbaik dengan nilai akhir 0.8500, diikuti oleh Griya Seturan dengan nilai 0,8400, dan Kos Candi
Gebang dengan nilai 0,_._

## DAFTAR PUSTAKA

[1] J. Coding et al., “PENERAPAN METODE ANALYTIC NETWORK PROCESS (ANP) BERBASIS ANDROID
SEBAGAI SISTEM PENDUKUNG KEPUTUSAN DALAM PEMILIHAN TEMPAT KOS,” 2018.
[2] I. Putu and D. Suarnatha, “SISTEM PENDUKUNG KEPUTUSAN SELEKSI KETUA BEM MENGGUNAKAN
METODE PROFILE MATCHING,” 2023.
[3] M. Reza, L. Ariyani, A. Sarwandianto, and J. Barkah, “Sistem Pendukung Keputusan Pemilihan Rumah Kost
menggunakan Metode Simple Additive Weighting (SAW),” Jurnal Teknologi Informasi dan Komunikasi), vol. 7, no.
4, p. 2023, 2023, doi: 10.35870/jti.
[4] M. Fitra Abdillah and H. Dafitri, “Sistem Pendukung Keputusan Pemilihan Indekos Terbaik DiSekitar Universitas
Harapan Medan Menggunakan Metode TOPSIS,” 2023.
[5] R. Lestari, E. Kurniawati, and M. Dizani, “Sistem Pendukung Keputusan Pemilihan Rumah Kostt Di Sekitar
Lingkungan Kampus Universitas Serang Raya Menggunakan Metode Analytical Hierarchy Process (AHP),” Jurnal
Sistem Informasi, vol. 2, 2015.


```
Penerapan Metode Simple...,
Information System Journal (INFOS) Vol. 8 , No. 2, November 2025 , pp. 1 37 - 146
```
[6] S. Yunita, “KLIK: Kajian Ilmiah Informatika dan Komputer Sistem Pendukung Keputusan Pemilihan Tempat Kost
Menggunakan Metode Simple Addtive Weighting (SAW) Kotawaringin Timur,” Media Online, vol. 2, no. 2, pp. 84–
87, 2021, [Online]. Available: https://djournals.com/klik
[7] T. A. Masangin, T. Widiastuti, and B. S. Djahi, “‘Jurnal TRANSFORMASI (Informasi & Pengembangan Iptek)’
(STMIK BINA PATRIA) SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN TEMPAT KOS DENGAN
METODE WEIGHTED AGREGATED SUM PRODUCT ASSESMENT (WASPAS) (STUDI KASUS KOTA
KUPANG NUSA TENGGARA TIMUR),” Jurnal TRANSFORMASI, vol. 17, no. 2, pp. 13–23, 2021.
[8] A. Ahmad and Y. I. Kurniawan, “SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN PEGAWAI TERBAIK
MENGGUNAKAN SIMPLE ADDITIVE WEIGHTING,” Jurnal Teknik Informatika (Jutif), vol. 1, no. 2, pp. 101–
108, Dec. 2020, doi: 10.20884/1.jutif.2020.1.2.14.
[9] H. Hamidah, O. Rizan, D. Wahyuningsih, and L. Laurentinus, “Sistem Pendukung Keputusan Pemilihan Kepala Biro
Menggunakan Metode Simple Additive Weighting (SAW),” Jurnal Sisfokom (Sistem Informasi dan Komputer), vol.
10, no. 3, pp. 413–418, Dec. 2021, doi: 10.32736/sisfokom.v10i3.1297.
[10] S. Shofia, M. Jhulianawati, F. Nurapriani, and P. D. Atika, “Sistem Pendukung Keputusan Penentuan Status Gizi
Balita dengan Menggunakan Metode Simple Additive Weighting (SAW),” Jurnal Informatika Utama, vol. 1, no. 1,
pp. 11–14, Jun. 2023, doi: 10.55903/jitu.v1i1.71.
[11] N. Wardhani and D. M. A. Nur, “SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN TEMPAT KOS UNTUK
MAHASISWA DI LUWUK BANGGAI DENGAN METODE SAW (SIMPLE ADDITIVE WEIGHTING),”
JTRISTE, vol. 4, no. 1, pp. 9–14, 2017.
[12] M. R. Ramadhan and M. Khairul, “Penerapan Metode SAW (Simple Additive Weighting) Dalam Pemilihan Siswa-
Siswi Berprestasi Pada Sekolah SMK Swasta Mustafa,” Terapan Informatika Nusantara, vol. 1, no. 9, pp. 459–471,
2021, [Online]. Available: https://ejurnal.seminar-id.com/index.php/tin
[13] Rizky Jelang Ramadhani, Ivan Althirafi R., Rifardhi Reza S., Astian Afif A., and Retno Aulia Vinarti, “Sistem
Pendukung Keputusan Pemilihan Kost Murah di Surabaya untuk Mahasiswa ITS dengan Metode Simple Additive
Weighting (SAW),” Journal of Advances in Information and Industrial Technology, vol. 3, no. 2, pp. 1–10, Nov. 2021,
doi: 10.52435/jaiit.v3i2.108.
[14] R. D. Gunawan, F. Ariany, and Novriyadi, “Implementasi Metode SAW Dalam Sistem Pendukung Keputusan
Pemilihan Plano Kertas,” Journal of Artificial Intelligence and Technology Information (JAITI), vol. 1, no. 1, pp. 29–
38, Feb. 2023, doi: 10.58602/jaiti.v1i1.23.
[15] C. I. Purwanto, E. Iman, and H. Ujianto, “SISTEM REKOMENDASI PEMILIHAN TEMPAT KOS MAHASISWA
DI WILAYAH SLEMAN MENGGUNAKAN SIMPLE ADDITIVE WEIGHTING BERBASIS MOBILE,” 2025


