```
JITET (Jurnal Informatika dan Teknik Elektro Terapan)
```

```
Vol. 1 3 No. 3 , pISSN: 2303-0577 eISSN: 2830-7062 http://dx.doi.org/10.23960/jitet.v1 3 i 3. 6558
```

# SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN

# SMARTPHONE MENGGUNAKAN METODE SIMPLE

# ADDITIVE WEIGHTIN G (SAW)

```
Ester Rante^1 , Solmin Paembonan^2 , Muhlis Muhallim^3 , Dasril^4 , Hisma Abduh^5 , Vaira Indah
Wahyuni^6
1,2Teknik Informatika/Universitas Andi Djemma; Jl. Tandipau, Kota Palopo;
```

**Keywords:**
Sistem Pendukung
Keputusan, _Simple Additive
Weighting_ (SAW), Pemilihan
Smartphone.

**Corespondent Email:**
<esterrantextkj2@gmail.co>

m

JITET is licensed under
a Creative Commons
Attribution-NonCommercial
4.0 International License

```
Abstrak. Pemilihan smartphone yang tepat menjadi tantangan bagi banyak
konsumen karena banyaknya pilihan dengan spesifikasi yang beragam. Untuk
mengatasi permasalahan ini, diperlukan sebuah Sistem Pendukung Keputusan
(SPK) yang dapat membantu pengguna dalam menentukan pilihan smartphone
yang sesuai dengan kebutuhan dan preferensi mereka. Penelitian ini bertujuan
untuk merancang dan mengembangkan SPK menggunakan metode Simple
Additive Weighting (SAW) dalam proses pengambilan keputusan. Metode
SAW digunakan karena kemampuannya dalam melakukan perhitungan multi-
kriteria dengan memberikan bobot pada setiap kriteria yang telah ditentukan,
kemudian melakukan perankingan berdasarkan hasil perhitungan tersebut.
Sistem ini mempertimbangkan beberapa kriteria utama dalam pemilihan
smartphone, seperti harga, kapasitas RAM, kualitas kamera, dan daya tahan
baterai. Hasil penelitian menunjukkan bahwa metode SAW dapat memberikan
rekomendasi yang objektif dan sesuai dengan preferensi pengguna. Sistem ini
diharapkan dapat membantu calon pembeli dalam memilih smartphone dengan
lebih mudah dan efisien.
```

```
Abstract. Choosing the right smartphone is a challenge for many consumers
due to the wide variety of options with diverse specifications. To address this
issue, a Decision Support System (DSS) is needed to assist users in selecting a
smartphone that best suits their needs and preferences. This study aims to
design and develop a DSS using the Simple Additive Weighting (SAW) method
for decision-making. The SAW method is employed due to its ability to perform
multi-criteria calculations by assigning weights to predefined criteria and
ranking the options based on the computed results. This system considers
several key criteria in smartphone selection, such as price, RAM capacity,
camera quality, and battery life. The study results indicate that the SAW
method can provide objective recommendations that align with user
preferences. This system is expected to help prospective buyers choose a
smartphone more easily and efficiently.
```

## 1. PENDAHULUAN

di era milenial ini, kemampuan untuk
menyelesaikan tugas sehari-hari menggunakan
berbagai perangkat teknologi informasi
menjadi sebuah keharusan agar hasil kerja
dapat ditingkatkan secara optimal. Pesatnya
perkembangan alat komunikasi sebagai
pendukung teknologi informasi mendorong
manusia untuk memilih alat komunikasi yang
sesuai dengan kebutuhan, seperti _smartphone_ ,
tablet, atau komputer pribadi (PC). Di antara
berbagai pilihan tersebut, _smartphone_ menjadi
alat komunikasi yang paling efektif, mudah
digunakan, dan paling banyak diminati untuk
memenuhi kebutuhan informasi.
Perkembangan teknologi yang pesat
telah mendorong semakin banyaknya produsen
_smartphone_ yang menawarkan berbagai pilihan
perangkat dengan berbagai fitur-fitur yang
canggih dan modern. Namun, seringkali
konsumen kekurangan dalam mengetahui
informasi, ditambah dengan kecenderungan
memilih _smartphone_ berdasarkan gengsi,
sering kali membuat konsumen menghadapi
kesulitan dalam menentukan pilihan.
Seiring dengan perkembangan zaman,
perkembangan dunia teknologi termasuk
_smartphone_ semakin maju. Tidak hanya fitur
dan tipe, harga juga menjadi poin penting saat
membeli _smartphone_.
_Smartphone_ juga memiliki berbagai
spesifikasi, seperti tipe resolusi kamera,
Baterai, RAM ( _Random Access Memory_ ), dan
sistem operasi yang sangat beragam. Hal ini
seringkali membuat masyarakat kesulitan
menentukan pilihan. Oleh karena itu,
diperlukan sebuah sistem yang mampu dalam
mempermudah proses pemilihan _smartphone_
untuk menghasilkan keputusan sesuai
keinginan dan kebutuhan para pengguna. Cara
yang dapat digunakan untuk mengatasi
permasalahan tersebut adalah dengan
mengimplementasikan sebuah sistem
pendukung Keputusan menggunakan Metode
SAW namun, keputusan akhir dalam pemilihan
_smartphone_ tetap tergantung pada pengguna.
Metode _Simple Additive Weighting_
(SAW), atau metode penjumlahan terbobot,
adalah cara menentukan pilihan terbaik dari
beberapa alternatif berdasarkan kriteria
tertentu. Metode ini bekerja dengan
menghitung total skor setiap alternatif, yaitu

```
menjumlahkan hasil perkalian antara bobot
atribut dan nilai ( rating ) yang telah
dinormalisasi. Proses normalisasi memastikan
semua nilai berada pada skala yang sama agar
bisa dibandingkan. SAW sering digunakan
karena sederhana dan efektif dalam membantu
pengambilan keputusan.
Marva Jaya Ratulangi merupakan salah
satu toko Smarphone yang masih
menggunakan sistem rekomendasi smartphone
ke nasabah dengan memperlihatan brosur
smartphone yang dapat membantu karyawan
dalam merekomendasikan pilihan smartphone
yang sesuai dengan keinginan pelangggan
berdasarkan kriteria yang telah ditentukan. Hal
ini mendasari penulis melakukan penelitian
dengan mengangkat judul “Sistem Pendukung
Keputusan Pemilihan Smartphone
menggunakan Metode SAW“.
```

## 2. TINJAUAN PUSTAKA

### 2.1 Sistem Pendukung Keputusan

```
Sistem pendukung keputusan (SPK)
atau Decision Support Sysem (DSS) adalah
sebuah sistem informasi interaktif yang
menyediakan informasi, pemodelan, dan
manipulasi data. SPK bukanlah alat untuk
mengambil keputusan secara langsung,
melainkan sebuah sistem yang membantu
mengambil keputusan dengan meyediakan
informasi yang relevan dan diperlukan, yang
telah diolah dengan baik, untuk mempermudah
pengambilan keputusan yang lebih cepat dan
akurat terkait suatu masalah[1].
Sistem pendukung keputusan
merupakan kumpulan elemen yang saling
terhubung dan bekerja sebagai satu kesatuan
untuk membantu dalam memilih berbagai
alternatif solusi, sehingga masalah dapat
diselesaikan dengan cara yang efektif dan
efisien[2].
Sistem pendukung keputusan (SPK) yang
ideal memiliki beberapa karakteristik sebagai
berikut:
```

1. SPK merupakan sistem berbasis komputer
    dengan antarmuka yang menghubungkan
    antara mesin/komputer dan pengguna.
2. SPK dirancang untuk membantu
    pengambil keputusan dalam
    menyelesaikan masalah pada berbagai
    tingkat manajemen, dan bukan untuk

```
menggantikan peran manusia sebagai
pembuat keputusan.
```

3. SPK dapat memberikan alternatif solusi
    untuk masalah yang bersifat semi-
    terstruktur atau tidak terstruktur, baik
    untuk individu maupun kelompok, serta
    dalam berbagai proses dan gaya
    pengambilan keputusan.
2. SPK memanfaatkan data, basis data, dan
    analisis model-model keputusan.
3. SPK menyediakan akses ke berbagai jenis
    dan format sumber data.
4. SPK memiliki sifat adaptif, efektif,
    interaktif, dan mudah digunakan.
       Sistem Pendukung Keputusan (SPK)
adalah sebuah sistem yang dirancang untuk
memberikan rekomendasi dalam
menyelesaikan masalah dengan kondisi semi-
terstruktur atau tidak terstruktur. SPK
membantu pengambil keputusan dalam
menentukan alternatif terbaik untuk
pengambilan keputusan. Sistem ini
menggunakan berbagai metode perhitungan
yang disesuaikan dengan kebutuhan dan
masalah yang dihadapi untuk menghasilkan
sistem informasi yang tepat. [3].
    Dari beberapa definisi diatas, maka
penulis menyimpulkan bahwa sistem
pendukung keputusan merupakan sebuah
sistem yang dapat membantu dalam
mengambil sebuah keputusan, baik berupa data
maupun prosedur yang memiliki sifa efektif
dan mudah digunakan.

### 2.2 Sistem

Secara umum, sistem adalah kumpulan
elemen atau komponen yang saling terhubung
dan bekerja bersama untuk mencapai tujuan
tertentu. Dalam konteks yang lebih luas, sistem
dapat merujuk pada berbagai jenis organisasi
atau struktur, baik itu dalam bidang teknologi,
sosial, atau lainnya. Sistem sering kali
dipahami sebagai suatu entitas yang memiliki
struktur tertentu, saling bergantung antar
komponennya, dan berfungsi untuk
menghasilkan suatu output dari input yang
diberikan[4].
Dalam suatu sistem terdapat beberapa
subsistem yang saling bekerja sama satu
dengan yang lainnya, guna mendukung semua
kegiatan yang ada dalam perusahaan yang
sifatnya rutin dengan menjalankan suatu sistem
yang benar dan teratur sesuai dengan prosedur

```
yang berlaku, maka hal ini dapat membantu
kelancaran semua kagiatan yang dilakukan
perusahaan sehingga tujuan perusahaan dapat
tercapai[5].
Sistem merupakan kumpulan elemen yang
saling berhubungan atau terintegrasi dengan
tujuan untuk mencapai suatu sasaran. Sebagai
contoh, jika dalam suatu sistem ada elemen
yang tidak berkontribusi dalam mencapai
tujuan yang sama, maka elemen tersebut
dipastikan bukan bagian dari sistem tersebut.
Dari beberapa definisi diatas, penulis
menyimpulkan bahwa sistem adalah kumpulan
elemen atau komponen yang saling terhubung
dan bekerja sama untuk mencapai tujuan
tertentu guna membantu kelancaran semua
kegiatan yang dilakukan sehingga tujuan dapat
tercapai dengan baik.
```

### 2.3 Keputusan

```
Keputusan adalah hasil dari proses
penyelesaian masalah yang dihadapi secara
tegas. Keputusan ini berkaitan dengan jawaban
atas pertanyaan seperti "Lalu, bagaimana
langkah selanjutnya?" dan "Apa yang perlu
dilakukan?" serta banyak hal-hal lain yang
berhubungan dengan aspek perencanaan.
Selain itu, keputusan juga dapat diartikan
sebagai hasil pemikiran yang melibatkan
pemilihan satu dari beberapa alternatif yang
disediakan untuk menyelesaikan masalah yang
ada[1].
Keputusan pembelian melibatkan proses
memilih di antara dua atau lebih alternatif.
Dengan kata lain, seseorang harus memiliki
opsi atau alternatif yang tersedia saat
mengambil keputusan. Sebaliknya, jika
konsumen tidak memiliki pilihan dan terpaksa
melakukan pembelian, situasi tersebut tidak
dapat disebut sebagai sebuah keputusan[6].
Dari beberapa definisi diatas, penulis
dapat menyimpulkan bahwa keputusan adalah
hasil akhir dari proses pemikiran untuk
menyelesaikan masalah atau menjawab
pertanyaan dengan tegas. Keputusan ini
melibatkan pemilihan di antara beberapa
alternatif yang tersedia, serta harus
memberikan solusi yang jelas dalam konteks
perencanaan.
```

### 2.4 Simple Additive Weighting (SAW)

```
Metode SAW, yang sering disebut
sebagai metode penjumlahan terbobot,
```

memiliki konsep dasar berupa penghitungan
penjumlahan terbobot dari nilai kinerja setiap
alternatif pada semua atribut. Proses ini
memerlukan normalisasi matriks keputusan
(X) agar nilainya berada dalam skala yang
memungkinkan perbandingan antar alternatif.
Metode SAW adalah salah satu metode
yang paling populer dan banyak digunakan
dalam situasi pengambilan keputusan dengan
atribut ganda. Dalam metode ini, pembuat
keputusan harus menentukan bobot untuk
setiap atribut. skor total suatu alternatif
dihitung dengan menjumlahkan hasil perkalian
antara nilai atribut yang telah dinormalisasi
dan bobot atribut tersebut. Nilai atribut harus
bebas dimensi, yang berarti telah melalui
proses normalisasi sebelumnya.
Rumus yang digunakan untuk melakukan
normalisasi berdasarkan persamaan (1).

Keterangan:
Rij = Rating kinerja ternormalisasi
Max Xij = Nilai maksimum dari setiap
baris dan kolom
Min Xij = Nilai minimum dari setiap baris
dan kolom
Xij = Baris dan kolom dari matriks
Benefit = Jika nilai terbesar adalah yang
terbaik
Cost = Jika nilai terkecil adalah yang
terbaik
Dengan rij adalah rating kinerja
ternormalisasi dari alternatif Ai pada atribut
Cj; i = 1,2....m dan j = 1,2....n.
Nilai prefensi untuk setiap alternatif
(Vi) diberikan pada persamaan (2) berikut.

Vi = Nilai prefensi
Wj = Bobot rangking
Rij = Rating kinerja ternormalisasi
Nilai Vi yang lebih besar
mengindikasikan bahwa alternatif Ai lebih
terpilih.
Berikut adalah langkah-langkah
penyelesaian Simple Additive Weighting
(SAW):

1. Menentukan kriteria-kriteria yang akan
    dijadikan acuan dalam pengambilan
    keputusan, yaiu Ci. Total bobot sama
    dengan 1(Ʃwi=1).
       2. Menentukan rating kecocokan setiap
          alternatif pada setiap atribut.
       3. Membuat matriks keputusan berdasarkan
          kriteria (Ci), kemudian melakukan
          normalisasi matriks berdasarkan
          persamaan yang disesuaikan dengan jenis
          atribut (atribut keuntungan ataupun atribut
          biaya) sehingga diperoleh matriks
          ternormalisasi.
       4. Hasil akhir diperoleh dari proses
          perangkingan yaitu penjumlahan dari
          perkalian matriks ternormalisasi dengan
          vektor bobot sehingga diperoleh nilai
          terbesar yang dipilih sebagai alternatif
          terbaik (Ai) sebagai solusi.
             Dari beberapa definisi diatas, maka
       penulis menyimpulkan bahwa SAW adalah
       metode penjumlahan terbobot yang digunakan
       dalam membantu mengambil keputusan
       dengan atribut. Dengan melakukan rumus
       normalisasi berdasarkan persamaan.

### 2.5 Skala Likert

```
Skala likert adalah alat ukur yang
digunakan untuk menilai persepsi atau
pendapat individu mengenai suatu peristiwa
sosial. Skala ini dirancang untuk mengevaluasi
tingkat persetujuan atau ketidaksetujuan
responden terhadap pernyataan yang disusun
secara sistematis. Dalam penelitian ini, skala
likert digunakan untuk menentukan nilai
kriteria dari setiap alternatif penelitian, yang
selanjutnya diolah menggunakan metode
Simple Additive Weighting (SAW)[1].
Tabel 1 Skala Likert
No Keterangan Nilai
1 Sangat penting 5
2 Penting 4
3 Cukup penting 3
4 Tidak penting 2
5 Sangat tidak penting 1
```

```
Normalisasi dengan Pembagian 100:
Setiap nilai 𝑥𝑖 pada skala likert akan dibagi
dengan 100 untuk mendapatkan nilai dalam
rentang persentase.
Rumus normalisasi:
```

```
𝑁𝑖=
```

#### 𝜒𝑖

#### 100

#### 𝐷𝑖𝑚𝑎𝑛𝑎 𝜒𝑖= 1 , 2 , 3 , 4 , 5

```
Keterangan:
Ni = Nilai normalisasi
Xi = Nilai asli dari skala likert
Interpretasi:
```

Nilai skala likert yang awalnya berada
dalam rentang 1–5 sekarang akan terubah
menjadi nilai antara 0.01 hingga 0.05 setelah
dinormalisasi. Pembagian dengan 100
mengubah nilai menjadi suatu bentuk
persentase yang lebih kecil (berkisar antara
0.01 dan 0.05).

### 2.6 Pengujian Sistem (Akurasi)

Uji akurasi dilakukan untuk mengetahui
tingkat akurasi dari sistem pakar yang
dibangun. Uji akurasi dilakukan dengan cara
mencocokkan dari beberapa kasus yang
dicocokan dari seorang pakar. Tingkat akurasi
dihitung dengan menggunakan rumus[7].

### 2.7 Kriteria Pemilihan Smartphone

Membeli _smartphone_ bisa menjadi
pengalaman yang membingungkan, terutama
ketika harus memilih _smartphone_ dengan
kualitas baik. Sering kali, pembeli kurang
memperhatikan aspek-aspek penting sebelum
memutuskan untuk membawa _smartphone_
tersebut ke rumah. Jika salah dalam memilih,
mungkin tidak mendapatkan _smartphone_
dengan performa baik, melainkan _smartphone_
yang sering mengalami kerusakan sehingga
harus sering dibawa ke tempat perbaikan. Hal
ini tentu akan menimbulkan biaya perawatan
yang tidak sedikit. Oleh karena itu, penting
untuk memahami kriteria dalam membeli
_smartphone_ agar mendapatkan hasil yang
maksimal. Proses pembelian dapat melibatkan
beberapa langkah penting yang harus
dilakukan dengan cermat. Kelalaian dalam
memeriksa _smartphone_ yang ingin dibeli dapat
menyebabkan masalah di kemudian hari.
Memilih _smartphone_ yang sesuai
dengan kebutuhan memberikan berbagai
manfaat penting, antara lain:

1. _Smartphone_ yang tepat membantu
    menyelesaikan aktivitas sehari-hari, seperti
    pekerjaan, komunikasi, atau hiburan,
    dengan lebih mudah.
2. Kepuasan dalam menggunakan perangkat
    yang mampu memenuhi kebutuhan dan
    ekspektasi.
3. Dapat mengurangi frekuensi _upgrade_ atau
    penggantian, sehingga lebih hemat dalam
    jangka panjang.
       4. Fitur yang sesuai dengan kebutuhan dapat
          membantu meningkatkan produktivitas
          dalam bekerja atau menjalani aktivitas
          sehari-hari.
       5. _Smartphone_ yang selaras dengan
          kebutuhan memberikan pengalaman
          penggunaan yang nyaman dan bebas dari
          kendala.
       6. _Smartphone_ yang dipilih sesuai dengan
          gaya hidup akan lebih mudah terintegrasi
          dalam aktivitas harian.
       7. _Smartphone_ dengan fitur keamanan yang
          memadai dan pembaruan sistem reguler
          akan melindungi data pribadi secara lebih
          optimal.
       8. Dengan spesifikasi yang sesuai,
          _smartphone_ akan tetap nyaman digunakan
          untuk waktu yang lama tanpa merasa cepat
          usang.
             Dengan mempertimbangkan kebutuhan
       secara cermat, yang dapat memungkinkan
       untuk mendapatkan _smartphone_ yang tidak
       hanya memenuhi kebutuhan tetapi juga
       memberikan nilai tambah dalam berbagai
       aspek.

### 2.8 XAMPP

```
XAMPP adalah perangkat lunak bebas,
yang mendukung banyak sistem operasi, dan
merupakan kompilasi dari beberapa program
seperti Apache , MySQL, PHP, dan Perl.
Software ini mendukung berbagai bahasa
pemrograman, seperti HTML, Javascript , CSS,
PHP, SQL, dan lainnya. XAMPP juga
mencakup Apache , yang berfungsi sebagai
localhost atau web server untuk
pengembangan website. Untuk menggunakan
localhost dan database pada XAMPP,
pengguna perlu mengaktifkan Apache dan
MySQL di dalam software , yang dapat diakses
melalui tautan https://localhost dan
https://localhost/phpmyadmin menggunakan
web browser [4].
XAMPP dan MySQL menjelaskan
bahwa XAMPP adalah sebuah software yang
berfungsi untuk menjalankan website berbasis
PHP dan menggunakan pengolah data MySQL
di komputer local. Sedangkan pendapat
Bertha (dalam Suhimarita and Susianto 2019)
XAMPP adalah server web PHP dan basis data
MySQL yang paling terkenal di antara para
insinyur web yang menggunakan PHP dan
```

MySQL sebagai _database_ nya[9].
Dari beberapa pendapat diatas maka
penulis menyimpulkan bahwa XAMPP adalah
perangkat lunak _open source_ yang
mengintegrasikan berbagai program untuk
mendukung pengembangan _website. Software_
ini mencakup _apache_ sebagai _web server_ lokal
dan MySQL sebagai pengolah data, serta
mendukung berbagai bahasa pemrograman
seperti PHP dan SQL. XAMPP mempermudah
pengembangan _website_ berbasis PHP dengan
menjalankan server lokal di komputer.

### 2.9 PHP ( Personal Home Page )

PHP adalah bahasa pemrograman _open
source_ yang banyak digunakan untuk
pengembangan web dan dapat diintegrasikan
ke dalam HTML[10]. Penggunaan PHP
memberikan beberapa keuntungan, meskipun
bagi pemula mungkin terasa kurang mudah.
Namun, bahasa ini menawarkan banyak fitur
yang berguna bagi programmer profesional.
Fungsi PHP meliputi:

1. Mengatur pengguna atau _user_.
2. Berperan sebagai salah satu bahasa
    pemrograman terbesar di dunia saat ini.
3. Memiliki kemampuan untuk
    mengamankan data.
    PHP merupakan bahasa pemrograman
script yang diletakkan dalam server yang biasa
digunakan untuk membuat aplikasi web yang
bersifat dinamis[11].
    Dari beberapa pendapat di atas maka
penulis menyimpulkan bahwa PHP adalah
bahasa pemrograman _open source_ yang banyak
digunakan untuk pengembangan _web_ ,
mendukung aplikasi dinamis, dan memiliki
fitur unggulan seperti pengaturan pengguna,
pengamanan data, serta integrasi dengan
HTML

### 2.10 MySQL ( My Structured Query

**_Language_** **)**
MySQL adalah salah satu _database
server_ yang sangat populer. Kepopulerannya
didukung oleh penggunaan SQL sebagai
bahasa utama untuk mengakses databasenya.
Selain itu, MySQL bersifat _open source_ dan
dilengkapi dengan _source code_ , yaitu kode
yang digunakan untuk mengembangkan
MySQL[12].
MySQL merupakan perangkat lunak
_open-source_ yang memanfaatkan _Structured_

```
Query Language (SQL) untuk mengelola data.
MySQL adalah salah satu database server
yang populer dan sering digunakan untuk
pengembangan aplikasi website yang
memanfaatkan database sebagai sumber data
dan alat pengelolaannya. MySQL bersifat open
source dan menggunakan SQL ( Structured
Query Language ). Database ini dapat
dijalankan di berbagai platform , seperti
Windows, Linux, dan lainnya[13].
Dari beberapa pendapat diatas, maka
penulis menyimpulkan bahwa MySQL adalah
database server yang sangat populer yang
bersifat open-source memiliki kemampuan
untuk mengelola database dengan efisien,
mendukung akses oleh banyak pengguna
secara besamaan.
```

### 2.11 UML ( Unified Modeling Language )

```
Unified Modeling Language (UML)
adalah sebuah bahasa pemodelan visual yang
dapat berguna untuk mendokumentasikan,
merancang, serta mengembangkan sistem
perangkat lunak. Menurut Dicoding-intern[14].
UML merupakan metode pemodelan
visual yang berfungsi sebagai alat untuk
merancang sistem berorientasi objek. Dengan
menggunakan diagram yang menggambarkan
struktur dan perilaku sistem, Unified Modeling
Language (UML) membantu programmer
dalam memahami, menganalisis, dan
menyederhanakan proses pembuatan program.
Metode ini diharapkan dapat mempermudah
pengembangan perangkat lunak serta
memenuhi kebutuhan pengguna secara efektif
dan akurat[15].
UML merupakan alat yang sangat
andal dalam pengembangan sistem berbasis
objek. Hal ini karena UML menyediakan
bahasa pemodelan visual yang memungkinkan
pengembang sistem untuk membuat blue print
atau rancangan mekanisme yang efektif dalam
berbagi dan menyampaikan desain mereka
kepada orang lain[16].
Berdasarkan definisi di atas, maka
penulis menyimpulkan bahwa Unified
Modeling Language (UML) adalah bahasa
pemodelan visual yang digunakan untuk
mendokumentasikan, merancang, dan
mengembangkan sistem perangkat lunak
berorientasi objek. Dengan berbagai diagram,
UML mempermudah analisis, perancangan,
dan komunikasi antar pengembang, sehingga
```

mendukung pengembangan perangkat lunak
yang efektif dan sesuai kebutuhan pengguna.

1. Diagram _Use Case_
    _Use case_ diagram adalah model yang
    digunakan untuk menggambarkan perilaku
    sistem informasi yang akan dikembangkan.
    Diagram ini membantu mengidentifikasi
    berbagai fungsi dalam sistem informasi
    serta pihak-pihak yang berhak mengakses
    fungsi tersebut[17]. Berikut ini adalah
    symbol-simbol yang ada dalam diagram
    _Use case_ :
Tabel 2 Simbol-simbol Diagram _Use Case_
**N
o**

```
Simbol Nama Keterangan
```

```
1
Use
case
```

```
Sebuah fungsi yang
disediakan oleh sistem
sebagai unit yang
saling bertukar pesan
atar setiap unit pada
sistem.
```

```
2
Actor
```

```
Orang, proses, atau
sistem yang berinteraksi
dengan sistem informasi
yang akan dibuat diluar
sistem informasi dibuat
itu sendiri.
```

(^3)
_Associa
tion_
Komunikasi antara
aktor dan _Use case_
melakukan interaksi
dengan aktor.
4
_Extend_
Relasi _Use case_
tambahan ke sebuah _Use
case_ yang dapat berdiri
sendiri walaupun tanpa
harus ada _Use case_
tambahan itu.
5 _Include_ Fungsinya sebagai syarat
di jalankan _Use case_

1. Diagram _Actifity_
    Diagram aktivitas atau _activity_ diagram
    menggambarkan _workflow_ (aliran kerja)
    atau aktivitas dari sebuah sistem atau
    proses bisnis atau menu yang ada pada
    perangkat lunak[4]. Berikut ini adalah
    simbol – simbol _Activity_ diagram dapat
    dilihat pada Tabel dibawah :

```
Tabel 3 Simbol-simbol Actifity
Diagram
```

3. Diagram _Class_
    _Class_ diagram merupakan ilustrasi yang
    menunjukkan struktur program yang
    dirancang dengan pendekatan _Object_
    _Oriented Programming_ (OOP). Diagram
    ini merepresentasikan objek-objek dari
    dunia nyata dalam bentuk struktur yang
    umumnya memiliki atribut dan metode.
    Berikut ini adala simbol-simbol yang
    digunakan dalam class diagram dapat
    ditemukan pada Tabel dibawah.
       Tabel 4 Simbol-simbol _Class_ Diagram
2. Diagram _Sequence_
    _Sequence_ diagram adalah grafik dua
    dimensi dimana obyek ditunjukkan dalam
    dimensi _horizontal_ , sedangkan _lifeline_
    ditunjukkan dalam dimensi _vertikal_.
    Berikut ini adalah simbol – simbol

```
Sequence Diagram dapat dilihat pada
Tabel dibawah.
Tabel 5 Simbol-simbol Sequence
Diagram
```

### 2.12 Hasil Penelitian yang Relevan

Penelitian yang relevan merupakan
penelitian yang telah dilakukan oleh pihak lain
dan menghasilkan temuan yang _valid_ sesuai
dengan judul serta tujuan penelitian.
Tabel 6 Penelitian yang _Relevan_

### 2.13 Marva Jaya Ratulangi

```
Gambar 1 Marva Jaya Ratulangi
Toko Smartphone Marva Jaya
Ratulangi adalah toko HP ke-3 setelah Marva
Jaya Samsung Official Store dan Marva Jaya
Kelapa. berlokasi di jl. Dr. Ratulangi,
Salobulo, sebelah Samsung Official Store, Kec.
Wara Utara, Kota Palopo, Sulawesi Selatan
```

91913. Toko ini fokus menyediakan berbagai
jenis _smartphone_ seperti, vivo, Samsung, oppo,
realme, infinix, iphone, tecno serta _tablet_ dan
berbagai macam elektronik lainnya untuk
memenuhi kebutuhan masyarakat di Kota
Palopo dan sekitarnya. Marva Jaya Ratulangi
menyediakan barang-barang yang _original,_
baru, dan bergaransi resmi.

## 3. METODE PENELITIAN

```
3.1 Jenis dan Sumber Data
Jenis data yang dilakukan penulis
dalam penelitian ini adalah data kualitatif yang
berhubungan dengan Sisem Pendukung
Keputusan Pemilihan Smartphone.
Data Primer yaitu data yang
didapatkan langsung dari sumbernya mengenai
informasi tentang bagaimana menentukan atau
memilih smartphone yang dilakukan oleh para
pelanggan di toko Marva Jaya Ratulangi.
Data Sekunder yaitu sekumpulan
informasi yang telah ada sebelumnya dan
digunakan sebagai pelengkap kebutuhan data,
seperti jurnal, dokumen, skripsi, maupun situs
resmi dari internet.
```

```
3.2 Tempat dan Waktu Penelitian
Tempat penelitian ini dilakukan di
Toko Smartphone Marva Jaya Ratulangi yang
berlokasi berlokasi di jl. Dr. Ratulangi,
Salobulo, Kec. Wara Utara, Kota Palopo,
Sulawesi Selatan 91913. Penelitian ini akan
```

dimulai pada minggu ke-4 bulan Januari 2025
sampai minggu ke- 2 bulan Maret 2025.
Tabel 7 Waktu Penelitian

**3.3 Teknik Pengumpulan Data**

1. Pengumpulan Data
    Tahap pengumpulan data dilakukan
dengan menganalisis sistem yang sedang
berjalan di lokasi yang akan di teliti. Untuk
memperoleh informasi terkait permasalahan-
permasalahan yang ada di tempat tersebut,
digunakan beberapa metode pengumpulan
data, yaitu melalui observasi, wawancara, dan
studi pustaka.
a. Observasi
    Pengumpulan data melalui observasi
ini dilakukan untuk memperkuat dengan
melihat secara langsung tempat penelitian
yaitu toko Marva Jaya Ratulangi tentang
cara pelanggan dalam memilih dan
menentukan _smartphone_ yang sesuai
kriteria.
b. Wawancara
    Metode wawancara ini dilakukan
dengan melibatkan narasumber dari pihak
Toko Marva Jaya yaitu Ibu Serlyani
melalui pengajuan pertanyaan yang relevan
untuk mendukung Penulis melaksanakan
wawancara informatif dengan mengajukan
pertanyaan yang berkaitan langsung
dengan bagaimana dan apa saja yang
sering menjadi pertimbangan pelanggan
dalam memilih dan menentukan
_smartphone_.
c. Studi Pusaka
    Studi pustaka dilakukan untuk
mengumpulkan data dari berbagai sumber
seperti jurnal, artikel internet, buku
perpustakaan, dan referensi lainnya, baik
yang berbentuk _online_ maupun _offline,_
yang dianggap relevan dan mendukung
dalam penyusunan ini. Penulis
memanfaatkan beberapa literatur, seperti
jurnal dan penelitian sebelumnya yang
telah dilakukan dalam bentuk skripsi,
untuk mendalami topik yang diteliti.
2. Analisis Sistem

```
a. Sistem yang Berjalan
Analisis sistem yang berajalan dapat
dilihat pada gambar berikut:
```

```
Gambar 2 Analisis Sistem yang Sedang
Berjalan
```

```
Penjelasan dari gambar di atas, dimana
pelanggan datang ke toko untuk mencari
informasi mengenai smartphone , dan
pihak toko akan melayani pelanggan dan
memberikan informasi atau brosur kepada
pelanggan.
b. Sistem yang Diusulkan
Dari analisis data yang berjalan pada Toko
Marva Jaya Ratulangi penulis
mengusulkan untuk merancang sistem
pendukung keputusan pemilihan
smartphone menggunakan metode SAW
yang dapat mempermudah pelanggan
dalam pemilihan smartphone. Adapun
sistem yang penulis usulkan dapat dilihat
pada gambar berikut:
```

```
Gambar 3 Analisis Sistem yang Diusulkan
c. Kebutuhan Fungsional
Kebutuhan ini terdiri dari beberapa fungsi
utama yang saling terhubung serta
mendukung sistem satu dengan yang lain,
berikut adalah kebutuhan fungsional
kebutuhan Admin:
1) Admin dapat melakukan login
2) Admin dapat melihat Dashbord
```

1) Admin dapat melihat data kriteria
2) Admin dapat mengedit sub kriteria
3) Admin dapat melihat alternative
4) Admin dapat melakukan proses
perhitungan SAW
5) Admin dapat melihat hasil akhir
6) Admin dapat melihat data pengguna
7) Admin dapat melihat profil
8) Admin dapat keluar dari sistem
d. Kebutuhan Nonfungsioal
Adapun untuk mewujudkan tujuan tersebut
maka dibutuhkan beberapa kebutuhan
nonfungsioanl dalam pengembangan
Sistem Pendukung Keputusan pemilihan
_smartphone_ menggunakan Metode SAW
yaitu meliputi bahasa pemrograman,
_Database_ , dan _Webserver_. Spesifikasi
perangkat lunak dan perangkat keras yang
digunakan penulis dalam perancangan
aplikasi ini adalah sebagai berikut:
9) Perangkat Lunak
▪ _Xampp Versi_ 3.2.2;
▪ _Visual Studio Code_
▪ _Microsoft Edge;_
▪ _Google Chrome;_
▪ _Windows_ 10, 64 bit;
10) Perangkat Keras
▪ _Prosesor Intel(R) Celeron(R) CPU
N3050 @ 1.60GHz_
▪ RAM DDR3 2GB _;_
▪ _Keyboard;_

**3.1 Kriteria yang digunakan**
Berikut adalah beberapa kriteria yang
seringkali menjadi acuan dalam memilih
_smartphone_ :
a. Harga
Pelanggan sering mempertimbangkan
apakah harga _smartphone_ sesuai dengan
anggaran mereka dan pelanggan juga harus
mempertimbangkan nilai yang didapatkan
dari _smartphone_ tersebut.
b. Memori
Pelanggan harus mempertimbangkan
tentang kapasitas memori _smartphone_
dalam kualitas penyimpanan yang
diperlukan seperti aplikasi, foto, video, dan
data lainnya.
c. Resolusi kamera
Pelanggan harus mempertimbangkan
tentang resolusi kamera dalam kualitas
mengambil gambar dan video.
d. Baterai

```
Pertimbangan tentang apakah kapasitas
baterai mampu digunakan untuk setaip
aktivitas sehari-hari.
```

## 4. HASIL DAN PEMBAHASAN

```
4.1 Proses Metode Simple Additive
Weighting (SAW)
Pada penelitian ini, peneliti
menggunakan metode Simple Additive
Weighting (SAW) sebagai metode dalam
pengambilan keputusan untuk pemilihan
Smartphone di Marva Jaya Ratulangi. Berikut
ini adalah proses yang akan dilakukan:
Berikut adalah tabel alternatif dan kode
alternatif yang terdiri dari jenis smartphone
yang akan digunakan:
Tabel 8 Alternatif
```

```
No Kode Alternatif
1 A01 VIVO
2 A02 OPPO
3 A03 REALME
4 A04 SAMSUNG
5 A05 IPHONE
6 A06 TECNO
7 A07 INFINIX
```

```
Berikut ini adalah tabel skala likert yang
digunakan dalam menentukan bobot setiap
kriteria:
Tabel 9 Skala likert bobot kepentingan
```

```
No Keterangan Nilai
```

```
1 Sangat Penting 5
2 Penting 4
3 Cukup 3
4 Tidak Penting 2
5 Sangat Tidak
Penting
```

#### 1

```
Menentukan kriteria yang akan dijadikan
acuan dalam pengambilan keputusan. Berikut
adalah kriteria, atribut, dan bobot yang akan
digunakan dalam penelitian ini, dapat dilihat
pada tabel berikut:
```

```
Tabel 10 Bobot dan Atribut dari kriteria
Kode
Kriteria
```

```
Nama
Kriteria
```

**Bobot** (^) **Atribut**
C1 Harga 5 Cost
C2 Baterai 3 Benefit
C3 Resolusi
Kamera
4 Benefit
C4 Memori 4 Benefit
Setelah menentukan bobot dan atribut
dari kriteria maka berikut adalah tabel data
himpunan sub kriteria dari harga, karena
kriteria harga adalah _cost_ maka semakin
rendah biaya yang dibutuhkan maka semakin
menguntungkan, dapat dilihat pada tabel
berikut:
Tabel 11 Data Himpunan Sub Kriteria Harga
**No
Nama Kriteria Bobot Atribut**
1 <Rp.3 JT Sangat
Rendah

#### 5

```
2 Rp.3.000.000 -
Rp.5.999.
```

```
Rendah 4
```

```
3 Rp.6.000.000 -
Rp.9.999.
```

```
Cukup 3
```

```
4 Rp.10.000.000 -
Rp.13.999.
```

```
Tinggi 2
```

```
5 >=Rp. 14 JT Sangat
Tinggi
```

#### 1

Setelah menentukan data himpunan sub
kriteria harga diatas, maka berikut adalah tabel
data himpunan sub kriteria dari baterai, karena
kriteria baterai adalah _benefit_ maka semakin
tinggi nilainya maka akan semakin
menguntungkan, dapat dilihat pada tabel
berikut:
Tabel 12 Data Himpunan sub Kriteria Baterai
**No Nama Kriteria Bobot Atribut**
1 <1.000 mAh Sangat
Rendah

#### 1

#### 2 1.000 – 2

```
mAh
```

```
Rendah 2
```

```
3 3.000 – 4.
mAh
```

```
Cukup 3
```

```
4 5.000 – 5.
mAh
```

```
Tinggi 4
```

```
5 >=6.000 mAh Sangat
Tinggi
```

#### 5

```
Setelah menentukan data himpunan sub
kriteria baterai diatas, maka berikut adalah
tabel data himpunan sub kriteria dari resolusi
kamera, karena kriteria baterai adalah benefit
maka semakin tinggi nilainya maka akan
semakin menguntungkan, dapat dilihat pada
tabel berikut:
Tabel 13 Data Himpunan Sub Kriteria Resolusi
Kamera
No
Nama Kriteria Bobot Atribut
```

```
1 <=20 MP Sangat
Rendah
```

#### 1

```
2 21 – 50 MP Rendah 2
3 51 – 80 MP Cukup 3
4 81 – 120 MP Tinggi 4
5 >=121 MP Sangat
Tinggi
```

#### 5

```
Setelah menentukan data himpunan sub
kriteria resolusi kamera diatas, maka berikut
adalah tabel data himpunan sub kriteria dari
memori, karena kriteria baterai adalah benefit
maka semakin tinggi nilainya maka akan
semakin menguntungkan, dapat dilihat pada
tabel berikut:
Tabel 14 Data Himpunan Sub Kriteria Memori
No
Nama Kriteria Bobot Atribut
```

```
1 4 GB Sangat
Rendah
```

#### 1

```
2 8 GB Cukup 3
3 12 GB Sangat
Tinggi
```

#### 5

```
Setelah menentukan data himpunan
dari setiap kriteria maka berikut adalah tabel
matriks keputusan yaitu menentukan rating
kecocokan setiap alternatif pada setiap atribut,
dapat dilihat pada tabel berikut:
Tabel 15 Matriks Keputusan
ALTERNA
TIF
```

#### C1/

```
Har
ga
```

#### C2/

```
Bater
ai
```

#### C3/

```
Memori
```

#### C4/

```
Kamer
a
VIVO 5 3 5 3
OPPO 1 3 3 1
REALME 5 4 4 5
SAMSUNG 4 5 3 5
IPHONE 3 4 3 1
TECNO 5 3 3 1
INFINIX 3 4 5 3
```

#### BOBOT

```
kriteria 5 3 4 4
Normalisas
i Bobot 0.05 0.03 0.04 0.
MAX 5 5 5 5
MIN 1 3 3 1
```

Setelah membuat matriks keputusan
berdasarkan kriteria, selanjutnya melakukan
normalisasi matriks berdasarkan persamaan
yang disesuaikan dengan jenis atribut sehingga
diperoleh matriks ternormalisasi dengan
menggunakan rumus persamaan 1, berikut:

Keterangan:
Rij = Rating kinerja ternormalisasi
Max Xij = Nilai maksimum dari setiap
baris dan kolom
Min Xij = Nilai minimum dari setiap baris
dan kolom
Xij = Baris dan kolom dari matriks
Benefit = Jika nilai terbesar adalah yang
terbaik
Cost = Jika nilai terkecil adalah yang
terbaik
Berikut ini adalah hasil dari melakukan rumus
persamaan 1 dapat dilihat pada Tabel dibawah.
Tabel 16 Matriks Ternormalisasi

#### ALTERNA

#### TIF

```
Cost Benefit Benefit Benefit
```

#### C1/

```
Harga
```

#### C2/

```
Baterai
```

#### C3/

```
Memori
```

#### C4/

```
Kamera
```

VIVO 0, 6 0,6 1 0,
OPPO 3 0,6 0,6 0,

REALME 0,6 0,8 0,8 1
SAMSUNG 0,75 1 0,6 1

IPHONE 1 0,8 0,6 0,
TECNO 0,6 0,6 0,6 0,

INFINIX 1 0,8 1 0,
**Normalisasi
Bobot 0.05 0.03 0.04 0.**

Hasil akhir diperoleh dari proses
peRankingan yaitu penjumlahan dari perkalian
rating kinerja ternormalisasi (Rij) dengan nilai
bobot rangking (wj) sehingga diperoleh nilai
preferensi (Vi) terbesar yang dipilih sebagai
alternatif terbaik (Ai) sebagai solusi.

```
Nilai prefensi untuk setiap alternatif
(Vi) diberikan pada persamaan (2) berikut.
```

```
Keterangan :
Vi = Nilai preferensi
Wj = Bobot rangking
Rij = Rating kinerja ternormalisasi
Nilai Vi yang lebih besar
mengindikasikan bahwa alternatif Ai lebih
terpilih dapat dilihat pada Tabel dibawah.
Tabel 17 Nilai Preferensi dan Ranking
ALTERNATI
F
```

#### NILAI

#### PREFERE

#### NSI

#### RANKING

#### OPPO 0. 2 1

#### INFINIX 0. 138 2

#### SAMSUNG 0. 1315 3

#### REALME 0.1 26 4

#### VIVO 0. 112 5

#### IPHONE 0. 106 6

#### TECNO 0. 08 7

```
Dari hasil perhitungan di atas dapat di
ambil kesimpulan bahwa alternatif Oppo yang
mendapat Ranking pertama dengan nilai
preferensi tertinggi 0. 2 , Infinix yang mendapat
Ranking Kedua dengan nilai preferensi 0.13 8 ,
dan Samsung yang mendapat Ranking Ketiga
dengan nilai preferensi 0.126.
```

```
4.1 Perancangan Sistem
Perancangan sistem merupakan tahap
dalam perancangan sistem yang akan dibuat.
Langkah ini merupakan langkah awal dalam
membentuk suatu sistem yang akan dibuat.
Berikut merupakan langkah dalam
perancangan Sistem Pendukung Keputusan
Pemilihan Smartphone Menggunakan Metode
Simple Additive Weighting (SAW) yang akan
ditampilkan pada use case diagram berikut:
4.2.1 Use Case Diagram
Usecase diagram admin
menggambarkan sistem dari sudut pandang
admin , dimana dalam sistem ini admin tidak
hanya dapat mengakses semua menu, tetapi
juga dapat melakukan kelola data yang ada di
dalam sistem seperti pada gambar berikut :
```

Gambar 4 _Use Case_ Diagram
**4.2.2** **_Activity_** **Diagram**
_Activiy_ Diagram adalah diagram yang
memberikan gambaran tentang alur kerja atau
aktivitas dalam sistem yang sedang dirancang.

1. _Activity_ Diagram _Login_
    Pada _Activity_ Diagram _login, Admin_ akan
    masuk ke menu _login_ kemudian sistem
    akan menampilkan halaman _login,_
    selanjutnya _admin_ akan menginputkan
    _username_ dan _password_ kemudian klik
    tombol masuk, jika salah satu dari
    _password_ atau _username_ ada yang salah
    maka sistem akan tetap menampilkan
    halaman _login,_ tetapi jika susdah benar
    maka akan menampilkan halaman utama.

```
Gambar 5 Activity Login
```

2. _Activity_ Diagram Menu Utama
    Selanjutnya _admin_ mengakses halaman
    utama dan sistem akan menampilkan setiap
    menu.

```
Gambar 6 Activiy Menu Utama
```

3. _Activity_ Diagram Menu Data Kriteria
    Selanjutnya _admin_ mengakses halaman
    utama kemudian sistem menampilkan
    pilihan menu, setelah itu _admin_ memilih
    menu data kriteria maka sistem akan
    menampilkan halaman dari menu data
    kriteria.

```
Gambar 7 Activity Menu Data Kriteria
```

4. _Activity_ Diagram Menu Tambah Data
    Kriteria
    Selanjutnya _admin_ mengakses halaman
    menu kriteria kemudian sistem
    menampilkan halaman menu kriteria
    kemudian _admin_ memilih menu tambah
    data selanjutnya sistem menampilkan
    halaman tambah data krieria kemudian
    _admin_ dapat menginput data setelah itu
    klik simpan dan sistem berhasil menimpan
    data.

```
Gambar 8 Activity Menu Tambah Data
Kriteria
```

5. _Activity_ Diagram Menu _Edit_ Data Kriteria
    Selanjutnya _admin_ mengakses halaman
    menu kriteria kemudian sistem
    menampilkan halaman menu kriteria
    kemudian _admin_ memilih menu _edit_ data
    selanjutnya sistem menampilkan halaman
    data kriteria yang telah diinputkan
    sebelumnya kemudian _admin_ dapat
    menginput perubahan data setelah itu klik
    _update_ dan sistem berhasil _update_ data.

```
Gambar 9 Activity Menu Edit Data Kriteria
```

6. _Activity_ Diagram Menu Hapus Data
    Kriteria
    Selanjutnya _admin_ mengakses halaman
    menu kriteria kemudian sistem
    menampilkan halaman menu kriteria
    kemudian _admin_ memilih menu hapus data
    selanjutnya sistem menampilkan
    pertanyaan apakah anda yakin menghapus
    data ini? jika _admin_ memilih oke maka
    sistem akan berhasil menghapus data dan
    jika _cancel_ maka sistem akan tetap
    menampilkan halaman menu kriteria.

```
Gambar 10 Activity Menu Hapus Data Krieria
```

7. _Activity_ Diagram Menu Data Sub Kriteria
    Selanjutnya _admin_ mengakses halaman
    utama kemudian sistem menampilkan
    pilihan menu, setelah itu _admin_ memilih
    menu data sub kriteria maka sistem akan
    menampilkan halaman dari menu data sub
    kriteria.

```
Gambar 11 Activity Menu Data Sub
Kriteria
```

8. _Activity_ Diagram Menu Tambah Data Sub
    Kriteria
    Selanjutnya _admin_ mengakses halaman
    menu sub kriteria kemudian sistem
    menampilkan halaman menu sub kriteria
    kemudian _admin_ memilih menu tambah
    data selanjutnya sistem menampilkan
    halaman tambah data kriteria kemudian
    _admin_ dapat menginput data sub kriteria
    setelah itu klik simpan dan sistem berhasil
    menimpan data.

```
Gambar 12 Activity Menu Tambah Data
Sub Kriteria
```

9. _Activity_ Diagram Menu _Edit_ Data Sub
    Kriteria
    Selanjutnya _admin_ mengakses halaman
    menu sub kriteria kemudian sistem
    menampilkan halaman dari menu sub
    kriteria kemudian _admin_ memilih menu
    _edit_ data selanjutnya sistem menampilkan
    halaman data sub kriteria yang telah
    diinputkan sebelumnya kemudian _admin_
    dapat menginput perubahan data setelah itu
    klik _update_ dan sistem berhasil _update_
    data.

```
Gambar 13 Activity Menu Edit Data
Sub Kriteria
```

10. _Activity_ Diagram Menu Hapus Data Sub
    Kriteria
    Selanjutnya _admin_ mengakses halaman
    menu sub kriteria kemudian sistem
    menampilkan halaman menu sub kriteria
    kemudian _admin_ memilih menu hapus data
    selanjutnya sistem menampilkan
    pertanyaan apakah anda yakin menghapus
    data ini? jika _admin_ memilih oke maka
    sistem akan berhasil menghapus data dan
    jika _cancel_ maka sistem akan tetap
    menampilkan halaman menu kriteria.

```
Gambar 14 Activity Menu Hapus Data Sub
Kriteria
```

1. _Activity_ Diagram Menu Data Alternatif
    Selanjutnya _admin_ mengakses halaman
    utama kemudian sistem menampilkan
    pilihan menu, setelah itu _admin_ memilih
    menu data alternatif maka sistem akan
    menampilkan halaman dari menu data
    alternative.

```
Gambar 15 Activity Menu Data Alternatif
```

12. _Activity_ Diagram Menu Tambah Data
    Alternatif
    Selanjutnya _admin_ mengakses halaman
    menu alternatif kemudian sistem
    menampilkan halaman menu kriteria
    kemudian _admin_ memilih menu tambah
    data selanjutnya sistem menampilkan
    halaman tambah data krieria kemudian
    _admin_ dapat menginput data setelah itu
    klik simpan dan sistem berhasil
    menyimpan data.

```
Gambar 16 Activity Menu Tambah Data
Alternatif
```

13. _Activity_ Diagram Menu _Edit_ Data Alernatif
    Selanjutnya _admin_ mengakses halaman
    menu alternatif kemudian sistem
    menampilkan halaman menu alternatif
    kemudian _admin_ memilih menu _edit_ data
    selanjutnya sistem menampilkan halaman
    data alternatif yang telah diinputkan
    sebelumnya kemudian _admin_ dapat
    menginput perubahan data setelah itu klik
    _update_ dan sistem berhasil _update_ data.

```
Gambar 17 Activity Edit Data Alternatif
```

14. _Activity_ Diagram Menu Hapus Data
    Alternatif
    Selanjutnya _admin_ mengakses halaman
    menu alternatif kemudian sistem
    menampilkan halaman menu alternatif
    kemudian _admin_ memilih menu hapus data
    selanjutnya sistem menampilkan
    pertanyaan apakah anda yakin menghapus
    data ini? jika _admin_ memilih oke maka
    sistem akan berhasil menghapus data dan
    jika _cancel_ maka sistem akan tetap
    menampilkan halaman menu kriteria.

```
Gambar 18 Activity Menu Hapus Data
Alternatif
```

15. _Activity_ Diagram Menu Proses SAW
    Selanjutnya _admin_ mengakses halaman
    utama kemudian sistem menampilkan
    pilihan menu, setelah itu _admin_ memilih
    menu proses SAW maka sistem akan
    menampilkan pilihan menu.

```
Gambar 19 Activity Menu Proses SAW
```

16. _Activity_ Diagram Menu Penilaian
    Alternatif
    Selanjutnya _admin_ mengakses halaman
    menu Proses SAW kemudian sistem
    menampilkan pilihan menu kemudian
    _admin_ memilih menu penilaian alternatif
    selanjutnya sistem menampilkan halaman.

```
Gambar 20 Activity Menu Penilaian
Alternatif
```

17. _Activity_ Diagram Menu _Edit_ Data
    Penilaian Alternatif
    Selanjutnya _admin_ mengakses halaman
    menu penilaian alternatif kemudian sistem
    menampilkan halaman menu kemudian
    _admin_ memilih menu _edit_ data selanjutnya
    sistem menampilkan halaman data yang
    telah diinputkan sebelumnya kemudian
    _admin_ dapat menginput perubahan data
    setelah itu klik _update_ dan sistem berhasil
    _update_ data.

```
Gambar 21 Activity Menu Edit Data
Penilaian Alternatif
```

18. _Activity_ Diagram Menu Perhitungan
    Selanjutnya _admin_ mengakses halaman
    menu Proses SAW kemudian sistem
    menampilkan pilihan menu kemudian
    _admin_ memilih menu perhitungan
    selanjutnya sistem menampilkan halaman.

```
Gambar 22 Activity Menu Perhiungan
```

19. _Activity_ Diagram Menu Hasil Akhir
    Selanjutnya _admin_ mengakses halaman
    utama kemudian sistem menampilkan
    pilihan menu kemudian _admin_ memilih
    menu hasil akhir selanjutnya sistem
    menampilkan halaman.

```
Gambar 23 Activity Menu Hasil Akhir
```

20. _Activity_ Diagram Menu Cetak Data
    Selanjutnya _admin_ mengakses halaman
    menu hasil akhir kemudian sistem
    menampilkan halaman dari menu hasil
    akhir kemudian _admin_ memilih menu
    cetak data selanjutnya sistem menampilkan
    halaman.

```
Gambar 24 Activity Menu Cetak Data
```

21. _Activity_ Diagram Menu Data _User_
    Selanjutnya _admin_ mengakses halaman
    utama kemudian sistem menampilkan
    pilihan menu kemudian _admin_ memilih
    menu data _user_ selanjutnya sistem
    menampilkan halaman.

```
Gambar 25 Activity Menu Data User
```

22. _Activity_ Diagram Menu Tambah Data _User_
    Selanjutnya _admin_ mengakses halaman
    menu tambah data _user_ kemudian sistem
    menampilkan halaman menu kemudian
    _admin_ memilih menu tambah data
    selanjutnya sistem menampilkan halaman
    tambah data kemudian _admin_ dapat
    menginput data setelah itu klik simpan dan
    sistem berhasil menyimpan data.

```
Gambar 26 Activity Menu Tambah User
```

1. _Activity_ Diagram Menu _Edit_ Data _User_
    Selanjutnya _admin_ mengakses halaman
    menu data _user_ kemudian sistem
    menampilkan halaman menu data _user_
    kemudian _admin_ memilih menu _edit_ data
    selanjutnya sistem menampilkan halaman
    data yang telah diinputkan sebelumnya
    kemudian _admin_ dapat mengedit data
    setelah itu klik _update_ dan sistem berhasil
    _update_ data.

```
Gambar 27 Activiy Menu Edit Data User
```

24. _Activity_ Diagram Menu Hapus Data _User_
    Selanjutnya _admin_ mengakses halaman
    menu data _user_ kemudian sistem
    menampilkan halaman menu data _user_
    kemudian _admin_ memilih menu hapus
    data selanjutnya sistem menampilkan
    pertanyaan apakah anda yakin menghapus
    data ini? jika oke maka data berhasil
    dihapus jika _cancel_ maka kembali
    menampilkan halaman menu data _user_.

```
Gambar 28 Activity Menu Hapus Data
User
```

25. _Activity_ Diagram Menu Profil
    Selanjutnya _admin_ mengakses halaman
    utama kemudian sistem menampilkan
    pilihan menu, setelah itu _admin_ memilih
    menu menu profil maka sistem akan
    menampilkan halaman dari menu profil.

```
Gambar 29 Activity Menu Profil
```

26. _Activity_ Diagram Menu _Edit_ Data Profil
    Selanjutnya _admin_ mengakses halaman
    menu profil kemudian sistem
    menampilkan menu profil kemudian _admin_
    memilih menu _edit_ data selanjutnya sistem
    menampilkan halaman data yang telah
    diinputkan sebelumnya kemudian _admin_
    dapat mengedit data setelah itu klik _update_
    dan sistem berhasil _update_ data.

```
Gambar 30 Activity Menu Edit Data Profil
```

27. _Activity_ Diagram Menu Hapus Data Profil
    Selanjutnya _admin_ mengakses halaman
    menu profil kemudian sistem
    menampilkan halaman menu dari profil
    kemudian _admin_ memilih menu hapus
    data selanjutnya sistem menampilkan
    pertanyaan apakah anda yakin menghapus
    data ini? jika oke maka data berhasil
    dihapus jika _cancel_ maka kembali
    menampilkan halaman menu data _user_.

```
Gambar 31 Activity Menu Hapus Data
Profil
```

28. _Activity_ Diagram Menu _Logout_
    Selanjutnya _admin_ mengakses halaman
    menu profil kemudian sistem
    menampilkan halaman menu profil, setelah
    itu _admin_ memilih menu menu _admin_
    kemudian pilih _logout_ maka sistem akan
    menampilkan pesan, apakah anda yakin
    untuk keluar? Jika _cancel_ maka sistem
    menampilkan halaman menu profil, jika
    oke maka sistem akan kembali ke halaman
    _login._

Gambar 32 _Activity_ Menu _Logout_
**4.2.3** **_Sequence_** **Diagram**
Diagram urutan ( _sequence diagram_ )
adalah diagram yang menggambarkan interaksi
antara sistem dan penggunanya, termasuk
peran admin. Dalam _sequence diagram_ yang
berfokus pada _admin_ , diagram ini
menunjukkan menu serta aktivitas yang dapat
diakses dan dikelola oleh _admin_ dalam sistem.

Gambar 33 _Sequence_ Diagram
**4.2.4** **_Database_** **(Basis Data)**
Basis data adalah himpunan informasi
yang tersusun secara terstruktur dalam
komputer dan dapat diakses serta dikelola
melalui perangkat lunak sistem manajemen
basis data. Basis data berfungsi untuk
menyimpan, mengatur, dan mengelola data
secara efisien, memungkinkan pengguna
dengan mudah mengakses, memanipulasi, serta
mengambil informasi yang dibutuhkan.
Adapun basis data dalam sistem pendukung
keputusan ini adalah sebagai berikut.

1. _User_
    Berikut ini adalah tabel _database_ dari _user_
    dimana _id_user_ dengan tipe data _integer_
    yang dapat menampung 5 karakter
    digunakan sebagai _primary key_.
       Tabel 18 _User_
**Nama
Field**

```
Tipe Data Keterangan
```

```
id_user int(5) Primary Key
Usernam
e
```

```
varchar(255)
```

```
Password varchar(255)
Nama varchar(70)
Email varchar(50)
```

```
Role char(1)
```

2. Alternatif
    Berikut ini adalah tabel _database_ dari
    alternatif dimana id_alternatif dengan tipe
    data _integer_ yang dapat menampung 11
    karakter digunakan sebagai _primary key_ :
       Tabel 19 Alternatif
**Nama Field Tipe
Data**

```
Keterangan
```

```
id_alternatif Int(11) Primary Key
```

```
Alternatif Varchar(
00 )
```

#### -

1. Hasil
    Berikut ini adalah tabel _database_ dari hasil
    dimana id_hasil dengan tipe data _integer_
    yang dapat menampung 11 karakter
    digunakan sebagai _primary key_ :
       Tabel 20 Hasil
**Nama
Field**

```
Tipe Data Keterangan
```

```
id_hasil int(11) Primary Key
Kode_hasil varchar(255)
Id_alternatif int(11)
Nilai Float
```

4. Kriteria
    Berikut ini adalah tabel _database_ dari
    kriteria dimana id_kriteria dengan tipe data
    _integer_ yang dapat menampung 11
    karakter digunakan sebagai _primary key_ :
       Tabel 21 Kriteria
    **Nama Field Tipe Data Keterangan**
id_kriteria int(11) _Primary Key_
kode_kriteria varchar(10)
Kriteria varchar(50)
Type Enum
Bobot Float
ada_pilihan Tinyint
2. Penilaian
    Berikut ini adalah tabel _database_ dari
    kriteria dimana id_penilaian dengan tipe
    data _integer_ yang dapat menampung 11
    karakter digunakan sebagai _primary key_ :
       Tabel 22 Penilaian
**Nama
Field**

```
Tipe
Data
```

```
Keterangan
```

```
id_penilaian int(11) Primary Key
Id_alternatif int(10)
```

```
Id_kriteria Int(10)
Nilai Float
```

6. Sub kriteria
    Berikut ini adalah tabel _database_ dari
    kriteria dimana id_sub_kriteria dengan tipe
    data _integer_ yang dapat menampung 11
    karakter digunakan sebagai _primary key_ :
       Tabel 23 Sub Kriteria
**Nama Field Tipe Data Keterangan**
id_sub_kriteria int(11) _Primary Key_
Id_kriteria int(11)
sub_kriteria Varchar(50)
Nilai Float

```
4.2.5 Relasi Tabel
Berikut dibawah ini adalah gambar
dari relasi tabel sebagai berikut.
```

```
Gambar 34 Relasi Tabel
Setelah menentukan primary key dari
database setiap kriteria, selanjutnya yaitu
menghubungkan tabel database berdasarkan
primary key yang telah ditentukan.
```

**4.2 Implementasi**

1. Halaman _Login_
    Tampilan halaman _login_ dapat dilihat
    pada Gambar dibawah.

```
Gambar 35 Halaman Login
Halaman ini digunakan oleh admin untuk
masuk ke dalam sistem pendukung
keputusan, dihalaman ini admin harus
menginput username dan password yang
benar dan mengklik button untuk masuk ke
dalam sistem ketika admin salah
memasukkan salah satu antara username
dan password maka sistem akan kembai ke
halaman login.
```

2. Halaman _Dashboard_
    Tampilan halaman _login_ dapat dilihat pada
    Gambar dibawah.

```
Gambar 36 Halaman Dashboard
Halaman dashboard merupakan halaman
utama setelah admin berhasil memasukkan
password dan username yang benar.
Dihalaman dashboard ini disajikan
beberapa pilihan menu yang nanti nya
akan digunakan oleh admin untuk
mengelola sistem ini.
```

3. Halaman Menu Data Kriteria
    Halaman menu data kriteria dapat dilihat
    pada Gambar dibawah.

```
Gambar 37 Halaman Data Kriteria
Halaman ini merupakan halaman data
kriteria dimana admin dapat menambahkan
data dengan mengklik button tambah yang
akan diarahkan kehalaman tambah data
kriteria, button edit diarahkan ke halaman
edit data dan button hapus untuk
menghapus data kriteria.
```

4. Halaman Tambah Data Kriteria
    Halaman tambah data kriteria dapat dilihat
    pada Gambar dibawah.

```
Gambar 38 Halaman Tambah Data Kriteria
Halaman tambah data kriteria merupakan
halaman yang dikelola oleh admin dimana
admin dapat menambah data kriteria
melalui halaman ini dengan cara
```

```
menginput kode kriteria, nama kriteria,
memilih type, bobot, dan memilih cara
penilaian.
```

5. Halaman _Edit_ Data Kriteria
    Halaman _Edit_ data kriteria dapat dilihat
    pada Gambar dibawah.

```
Gambar 39 Halaman Edit Data Kriteria
Halaman ini merupakan halaman edit data
kriteria dan merupakan salah satu halaman
yang dikelola oleh admin, dimana admin
dapat mengedit data kriteria dihalaman ini.
```

6. Halaman Menu Data Sub Kriteria
    Tampilan dari halaman data sub kriteria
    dapat dilhat pada Gambar dibawah.

```
Gambar 40 Halaman Data Sub Kriteria
Halaman ini merupakan halaman data sub
kriteria dan merupakan salah satu halaman
yang dikelola oleh admin. Pada halaman
ini admin dapat menambah data sub
kriteria, mengedit data sub kriteria dan
menghapus data sub kriteria.
```

7. Halaman _Edit_ Data Sub Kriteria
    Tampilan halaman _edit_ data sub kriteria
    dapat dilihat pada Gambar dibawah.

```
Gambar 41 Halaman Edit Data Sub
Kriteria
Halaman ini merupakan halaman edit data
sub kriteria yang merupakan salah satu
halaman yang dikelola oleh admin, pada
halaman ini admin dapat mengedit data
```

```
yang telah diinputkan sebelumnya.
```

8. Halaman Menu Data Alternatif
    Halaman menu data alternatif dapat dilihat
    pada Gambar dibawah.

```
Gambar 42 Halaman Menu Data
Alternatif
Halaman ini merupakan halaman data
alternatif dimana admin dapat
menambahkan data dengan mengklik
button tambah yang akan diarahkan
kehalaman tambah data alternatif, button
edit maka akan diarahkan ke halaman edit
data alternatif dan button hapus untuk
menghapus data.
```

9. Halaman _Edit_ Data Alternatif
    Tampilan halaman _edit_ data alternatif
    dapat dilihat pada Gambar dibawah.

```
Gambar 43 Halaman Edit Data Alernatif
Halaman ini merupakan halaman edit data
alternatif yang merupakan salah satu
halaman yang dikelola oleh admin, pada
halaman ini admin dapat mengedit data
yang telah diinputkan sebelumnya.
```

10. Halaman Menu Data Penilaian
    Halaman menu data alternatif dapat dilihat
    pada Gambar dibawah.

```
Gambar 44 Halaman Data Penilaian
Halaman ini merupakan halaman data
penilaian dimana admin dapat melihat
alternatif dan mengedit data dengan
```

```
mengklik button edit yang akan diarahkan
kehalaman edit data penilaian.
```

11. Halaman _Edit_ Data Penilaian Pilihan
    Inputan Langsung
    Halaman _edit_ data penilaian pilihan
    inputan langsung dapat dilihat pada
    Gambar dibawah.

```
Gambar 45 Halaman Edit Penilaian
Inputan Langsung
Halaman ini merupakan halaman edit data
penilaian pilihan inputan langsung dimana
admin dapat melakukan edit pada data
yang telah diinputkan sebelumnya sesuai
dengan bobot 1-5.
```

12. Halaman _Edit_ Data Penilaian Pilihan Sub
    Kriteria
    Halaman _edit_ data penilaian pilihan
    inputan langsung dapat dilihat pada
    Gambar dibawah.

```
Gambar 46 Halaman Edit Data Penilaian
Sub Kriteria
Halaman ini merupakan halaman edit data
penilaian pilihan sub kriteria dimana
admin dapat melakukan edit pada data
yang telah diinputkan sebelumnya sesuai
dengan sub kriteria yang tersedia.
```

13. Halaman Data Perhitungan
    Berikut ini adalah gambar tampilan dari
    halaman data perhitungan yaitu, bobot
    preferensi, matriks keputusan, matrik
    ternormalisasi, menghitung nilai preferensi
    dan perankingan.

```
a. Bobot Preferensi (W)
Berikut adalah tampilan dari bobot
preferensi, dapat dilihat pada Gambar
dibawah.
```

```
Gambar 47 Bobot Preferensi
Pada menu data perhitungan sistem akan
menampilkan bobot preferensi yang telah
ditentukan sebelumnya di menu data
kriteria untuk melakukan perhitungan.
b. Matriks Keputusan (X)
Berikut adalah tampilan dari matriks
keputusan, dapat dilihat pada Gambar
dibawah.
```

```
Gambar 48 Matriks Keputusan
Selanjutnya yaitu sistem akan
menampilkan tabel matriks keputusan
yaitu menentukan rating kecocokan setiap
alternatif pada setiap atribut.
c. Matriks Ternormalisasi (R)
Berikut adalah tampilan dari matriks
ternormalisasi, dapat dilihat pada Gambar
dibawah.
```

```
Gambar 49 Matriks Ternormalisasi
Setelah membuat matriks keputusan
berdasarkan persamaan yang disesuaikan
dengan jenis atribut kemudian diperoleh
matriks ternormalisasi dengan
menggunakan persamaan 1.
```

d. Menghitung Nilai Preferensi (V)
Berikut adalah tampilan dari perhitungan
nilai preferensi, dapat dilihat pada Gambar
dibawah.

Gambar 50 Menghitung Nilai Preferensi
Setelah melakukan matriks normalisasi
selanjutnya menghitung nilai preferensi
dengan cara melakukan penjumlahan dari
perkalian matriks ternormalisasi (Rij)
dengan nilai bobot. Nilai preferensi untuk
setiap alternatif (Vi) menggunakan rumus
persamaan 2.
e. Perankingan
Berikut adalah tampilan dari perankingan,
dapat dilihat pada Gambar dibawah.

```
Gambar 51 Perankingan
Setelah melakukan perhitungan preferensi,
maka nilai preferensi terbesar yang akan
dipilih sebagai alternatif terbaik sebagai
solusi.
```

14. Halaman Hasil Akhir
    Halaman hasil akhir dapat dilihat pada
    Gambar dibawah.

```
Gambar 52 Halaman Hasil Akhir
```

```
Pada halaman ini admin dapat melihat
hasil akhir dan admin juga dapat mencetak
hasil akhir tersebut.
```

15. Halaman Data _User_
    Halaman data _user_ dapat dilihat pada
    Gambar dibawah.

```
Gambar 53 Halaman Data User
Pada bagian ini admin dapat melakukan
tambah data, melakukan edit data , dan
admin juga dapat menghapus data yang
tidak diinginkan.
```

16. Halaman Data Profil
    Halaman data profil dapat dilihat pada
    Gambar dibawah.

```
Gambar 54 Halaman Data Profil
Pada halaman ini admin dapat melakukan
edit data profil dan kemudian
memperbaharuinya.
4.3 Uji Akurasi
Pengujian akurasi dilakukan untuk
mengetahui keberhasilan dari sistem dalam
melakukan perhitungan rangking. Dalam
menghitung akurasi yang dilakukan yaitu data
uji benar dibagi dengan total data uji kemudian
dikalikan dengan nilai 100. Berikut adalah
perbandingan nilai preferensi antara sistem
dengan excel.
```

1. Nilai Preferensi _Excel_
    Tabel 24 Nilai Preferensi _Excel_
    **ALTERNAT**
       **IF**

```
Nilai
Preferensi
```

```
Ranki
ng
OPPO 0.2 1
INFINIX 0.138 2
SAMSUNG 0.1315 3
REALME 0.126 4
```

#### VIVO 0.112 5

#### IPHONE 0.106 6

#### TECNO 0.08 7

1. Nilai Preferensi Sistem
    Berikut adalah gambar halaman hasil
    akhir dari sistem:

```
Gambar 55 Nilai Preferensi Sistem
Perbandingan akurasi perhitungan
antara nilai pada excel dan sistem pada
Nilai prefrerensi menghasilkan nilai
yang sama. Sehingga presentase nilai
akurasi 100%.
```

## 5. KESIMPULAN

Berdasarkan hasil penelitian yang
dilakukan penulis menarik kesimpulan dengan
pengujian yang dilakukan dengan data-data
yang didapatkan dari Toko Marva Jaya tentang
Sistem Pendukung Keputusan Pemilihan
_Smartphone_ menggunakan metode _Simple
Additive Weighting_ (SAW).

1. Sistem pendukung keputusan dalam
    pemilihan _smartphone_ dengan metode
    SAW diterapkan dengan menggunakan
    data kebutuhan yang telah dimasukkan
    oleh _Admin_ , seperti data kriteria, sub
    kriteria, alternatif, serta bobot untuk setiap
    alternatif dan kriteria. Data ini berfungsi
    sebagai dasar yang akan dinormalisasi dan
    diurutkan berdasarkan hasil alternatif
    terbaik untuk masing-masing _smartphone_.
    Tahap akhir dari metode SAW adalah
    proses perankingan, yang dapat menjadi
    rekomendasi bagi pelanggan dalam
    memilih _smartphone_ , sehingga
    memudahkan mereka dalam menentukan
    pilihan yang sesuai.
2. Hasil pengujian metode membuktikan
    bahwa program memiliki tingkat akurasi
    sebesar 100%, yang menunjukkan bahwa
    perhitungan dalam program ini dapat
    diandalkan untuk membantu dalam
    pemilihan _smartphone._

#### UCAPAN TERIMA KASIH

```
Penulis mengucapkan terima kasih kepada
pihak-pihak terkait yang telah memberi
dukungan terhadap penelitian ini.
```

```
DAFTAR PUSTAKA
```

```
[1] M. M. Fauzia Rahmasari, Solmin
Paembonan, “Sistem Pendukung Keputusan
Pemilihan Sekolah Menengah Pertama
(Smp) Di Palopo Menggunakan Metode
Simple Additive Weighting (SAW),” JRKT
(Jurnal Rekayasa Komputasi Ter. , vol. 4,
no. 01, pp. 70 – 77, 2024, doi:
10.30998/jrkt.v4i01.10248.
```

```
[2] A. Putra, S. Achmadi, and A. Mahmudi,
“Sistem Pendukung Keputusan Dengan
Metode Simple Additive Weighting (Saw)
Dalam Memilih Saham Badan Usaha Milik
Negara (Bumn) Berbasis Web,” JATI
(Jurnal Mhs. Tek. Inform. , vol. 6, no. 1, pp.
301 – 308, 2022, doi:
10.36040/jati.v6i1.4609.
```

```
[3] D. Wira et al. , “Perancangan Sistem
Pendukung Keputusan Menggunakan
Metode Multi-Attribute Utility Theory
(MAUT) Dalam Seleksi Pengangkatan
Karyawan Tetap pada Dinas Pekerjaan
Umum Kota Sawahlunto,” vol. 5, no. 2, pp.
53 – 59, 2022.
```

```
[4] S. D. Danda, S. Paembonan, and H. Abduh,
“Rancang Bangun Sistem Informasi
Penerimaan Siswa Baru Menggunakan
Framework Codeigniter Di Sma Pgri
Walenrang,” vol. 12, no. 3, 2024.
```

```
[5] A. Rochman, R. Tullah, and A. Rahman,
“Sistem Informasi Data Pasien di Klinik
Aulia Medika Pasarkemis,” J. Sisfotek
Glob. , vol. 9, no. 2, 2019, doi:
10.38101/sisfotek.v9i2.241.
```

```
[6] D. Pratiwi, G. B. Santoso, I. Mardianto, A.
Sediyono, and A. Rochman, “Pengelolaan
Pengelolaan Konten Web Menggunakan
Wordpress, Canva dan Photoshop untuk
Guru-Guru Wilayah Jakarta,” Abdihaz J.
Ilm. Pengabdi. pada Masy. , vol. 2, no. 1, p.
11, 2020, doi: 10.32663/abdihaz.v2i1.1093.
```

[7] A. Masdin, H. Abduh, and S. Paembonan,
“Sistem Pakar Diagnosa Kerusakan
Hardware Komputer Mengunakan Metode
Case Based Reasoning,” _J. Publ. Tek.
Inform._ , vol. 3, no. 1, pp. 110–123, 2024,
doi: 10.55606/jupti.v3i1.2709.

[8] J. Suhimarita and D. Susianto, “Aplikasi
Akutansi Persediaan Obat pada Klinik
Kantor Badan Pemeriksa Keuangan
Perwakilan Lampung,” _J. Sist. Inf. Akunt._ ,
vol. 2, no. 1, pp. 24–33, 2019.

[9] F. D. Putra, J. Riyanto, and A. F. Zulfikar,
“Rancang Bangun Sistem Informasi
Manajemen Aset pada Universitas
Pamulang Berbasis WEB,” _J. Eng. Technol.
Appl. Sci._ , vol. 2, no. 1, pp. 32–50, 2020,
doi: 10.36079/lamintang.jetas-0201.93.

[10] C. E. F. Muhammad Saed Novendri, Ade
Saputra, “Aplikasi Inventaris Barang Pada
Mts Nurul Islam Dumai Menggunakan
Php Dan Mysql,” _Lentera Dumai_ , vol. 10,
no. 2, pp. 46–57, 2019.

[11] R. Hermiati, A. Asnawati, and I. Kanedi,
“Pembuatan E-Commerce Pada Raja
Komputer Menggunakan Bahasa
Pemrograman Php Dan Database Mysql,”
_J. Media Infotama_ , vol. 17, no. 1, pp. 54–
66, 2021, doi: 10.37676/jmi.v17i1.1317.

[12] R. F. Ramadhan and R. Mukhaiyar,
“Penggunaan Database Mysql dengan
Interface PhpMyAdmin sebagai
Pengontrolan Smarthome Berbasis
Raspberry Pi,” _JTEIN J. Tek. Elektro
Indones._ , vol. 1, no. 2, pp. 129–134, 2020,
doi: 10.24036/jtein.v1i2.55.

[13] Sitanggang Rianto, Urian Dachi Teddy,
and Manurung H G Immanuel, “Rancang
Bangun Sistem Penjualan Tanaman
Hiasberbasis Web Menggunakan Php Dan
Mysql,” _Tekesnos_ , vol. 4, no. 1, pp. 84–
90, 2022.

[14] S. Anardani, “Perancangan Sistem
Berorientasi Objek Dengan Pemodelan
Uml (Unified Modeling Language)
Tools,” _Univ. Nusant. PGRI Kediri_ , vol.
01, pp. 1–7, 2019.

```
[15] T. Arianti, A. Fa’izi, S. Adam, and Mira
Wulandari, “Perancangan Sistem
Informasi Perpustakaan Menggunakan
Diagram Uml (Unified Modelling
Language),” J. Ilm. Komput. ... , vol. 1,
no. 1, pp. 19–25, 2022, [Online].
Available:
https://journal.polita.ac.id/index.php/polit
ati/article/view/110/88
```

```
[16] Putra and N. Hendra, “Implementasi
Diagram UML ( Unified Modelling
Language ) dalam Perancangan Aplikasi
Data Pasien Rawat Inap pada Puskesmas
Lubuk Buaya,” J. Penelit. Tek. Inform. ,
vol. 2, no. 2, pp. 69–77, 2018.
```

```
[17] F. F. T. Rahayu Sri Utami , Alda,
“Analisis Sistem Informasi Manajemen
Organisasi Berbasis Komputer Sebagai
Pengambilan Keputusan Perusahaan Dan
Organisasi,” vol. 4, no. April, pp. 226–
239, 2021.
```
