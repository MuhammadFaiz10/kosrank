# FUNCTIONAL SPECIFICATION DOCUMENT (FSD)

> Project: **KosRank**
> Framework: **Next.js 15**
> Database: **PostgreSQL**
> UI Style: **Modern Minimalist**
> Architecture: **Fullstack Web Application**
> Method: **Simple Additive Weighting (SAW)**

---

# 1. PROJECT OVERVIEW

## 1.1 Background

Mahasiswa sering mengalami kesulitan dalam memilih tempat kos karena:

* terlalu banyak pilihan
* informasi tidak terstruktur
* sulit membandingkan fasilitas
* harus melakukan survey langsung
* tidak ada sistem ranking objektif

Aplikasi ini dibangun untuk membantu mahasiswa menemukan tempat kos terbaik menggunakan metode SAW (Simple Additive Weighting).

---

# 1.2 Objective

Tujuan aplikasi:

* memberikan rekomendasi kos terbaik
* membantu pengambilan keputusan
* menyediakan filter pencarian kos
* memberikan pengalaman UI modern dan sederhana
* menyediakan sistem ranking otomatis

---

# 2. TECHNOLOGY STACK

## Frontend

| Technology     | Purpose            |
| -------------- | ------------------ |
| Next.js 15     | Frontend Framework |
| TypeScript     | Type Safety        |
| TailwindCSS    | Styling            |
| shadcn/ui      | UI Components      |
| Framer Motion  | Animation          |
| Zustand        | State Management   |
| TanStack Query | Data Fetching      |

---

## Backend

| Technology            | Purpose        |
| --------------------- | -------------- |
| Next.js Route Handler | API            |
| Server Actions        | Backend Logic  |
| Prisma ORM            | ORM            |
| PostgreSQL            | Database       |
| Auth.js               | Authentication |

---

## Deployment

| Service        | Purpose            |
| -------------- | ------------------ |
| Vercel         | Frontend Hosting   |
| Neon / Railway | PostgreSQL Hosting |
| Cloudinary     | Image Upload       |

---

# 3. USER ROLE

## Guest

Guest dapat:

* melihat daftar kos
* melakukan filter kos
* melihat ranking kos
* melihat detail kos

---

## Admin

Admin dapat:

* login
* CRUD kos
* CRUD fasilitas
* CRUD kriteria
* CRUD sub kriteria
* melihat hasil SAW
* upload gambar

---

# 4. CORE FEATURES

# 4.1 Authentication

## Login

### Input

* email
* password

### Validation

* email valid
* password minimal 8 karakter

---

## Logout

Menghapus session login.

---

# 4.2 Landing Page

## Features

* Hero Section
* Search Bar
* Recommendation Section
* Featured Kos
* CTA Section
* Footer

---

# 4.3 Explore Kos

## Features

* grid list kos
* sorting ranking
* pagination
* responsive layout

---

## Filter

| Filter    | Description            |
| --------- | ---------------------- |
| Harga     | Range harga            |
| Radius    | Radius kampus          |
| Kampus    | Kampus tujuan          |
| Fasilitas | Filter fasilitas       |
| Gender    | Putra / Putri / Campur |

---

# 4.4 Detail Kos

## Features

* gallery gambar
* map location
* fasilitas
* skor SAW
* ranking
* kontak pemilik

---

# 4.5 Admin Dashboard

## Features

* statistik kos
* statistik user
* ranking tertinggi
* grafik rekomendasi
* table management

---

# 5. SAW IMPLEMENTATION

# 5.1 Criteria

| Code | Criteria        | Weight | Attribute |
| ---- | --------------- | ------ | --------- |
| C1   | Harga           | 0.3    | Cost      |
| C2   | Luas Kamar      | 0.1    | Benefit   |
| C3   | Fasilitas Kamar | 0.2    | Benefit   |
| C4   | Fasilitas Umum  | 0.2    | Benefit   |
| C5   | Jarak           | 0.2    | Cost      |

---

# 5.2 SAW Flow

```txt
Input Data
    ↓
Convert To Score
    ↓
Decision Matrix
    ↓
Normalization
    ↓
Weighted Calculation
    ↓
Final Score
    ↓
Ranking
```

---

# 5.3 Formula Benefit

```math
rij = xij / max(xij)
```

---

# 5.4 Formula Cost

```math
rij = min(xij) / xij
```

---

# 5.5 Formula Ranking

```math
Vi = Σ(wj * rij)
```

---

# 6. DATABASE DESIGN

# 6.1 users

```prisma
model User {
  id          String   @id @default(cuid())
  name        String
  email       String   @unique
  password    String
  role        Role
  createdAt   DateTime @default(now())
}
```

---

# 6.2 kos

```prisma
model Kos {
  id                  String   @id @default(cuid())
  name                String
  slug                String   @unique
  description         String
  price               Int
  roomSize            String
  latitude            Float
  longitude           Float
  address             String
  genderType          GenderType
  campus              String
  finalScore          Float?
  ranking             Int?
  createdAt           DateTime @default(now())

  images              KosImage[]
  facilities          KosFacility[]
}
```

---

# 6.3 facilities

```prisma
model Facility {
  id          String   @id @default(cuid())
  name        String
  icon        String?
  type        FacilityType
}
```

---

# 6.4 kos_facilities

```prisma
model KosFacility {
  id          String   @id @default(cuid())
  kosId       String
  facilityId  String

  kos         Kos      @relation(fields: [kosId], references: [id])
  facility    Facility @relation(fields: [facilityId], references: [id])
}
```

---

# 6.5 criteria

```prisma
model Criteria {
  id          String   @id @default(cuid())
  code        String
  name        String
  weight      Float
  attribute   CriteriaAttribute
}
```

---

# 6.6 sub_criteria

```prisma
model SubCriteria {
  id            String   @id @default(cuid())
  criteriaId    String
  name          String
  value         String
  score         Int

  criteria      Criteria @relation(fields: [criteriaId], references: [id])
}
```

---

# 7. ENUM DESIGN

```prisma
enum Role {
  ADMIN
}

enum GenderType {
  PUTRA
  PUTRI
  CAMPUR
}

enum CriteriaAttribute {
  BENEFIT
  COST
}

enum FacilityType {
  ROOM
  PUBLIC
}
```

---

# 8. FOLDER STRUCTURE

```txt
src/
 ├── app/
 │    ├── (public)/
 │    ├── admin/
 │    ├── api/
 │    └── auth/
 │
 ├── components/
 │    ├── ui/
 │    ├── cards/
 │    ├── forms/
 │    └── layout/
 │
 ├── features/
 │    ├── auth/
 │    ├── kos/
 │    ├── dashboard/
 │    └── saw/
 │
 ├── hooks/
 ├── lib/
 ├── services/
 ├── store/
 ├── types/
 ├── utils/
 ├── prisma/
 └── constants/
```

---

# 9. API SPECIFICATION

# Public API

## GET /api/kos

Mengambil daftar kos.

---

## GET /api/kos/:id

Mengambil detail kos.

---

## GET /api/recommendation

Mengambil ranking SAW.

---

# Admin API

## POST /api/admin/kos

Menambah kos.

---

## PUT /api/admin/kos/:id

Update kos.

---

## DELETE /api/admin/kos/:id

Hapus kos.

---

# 10. UI DESIGN SYSTEM

# 10.1 Color Palette

| Purpose    | Color   |
| ---------- | ------- |
| Primary    | #2563EB |
| Secondary  | #0F172A |
| Accent     | #14B8A6 |
| Background | #FAFAFA |
| Card       | #FFFFFF |

---

# 10.2 Typography

| Font              | Usage       |
| ----------------- | ----------- |
| Inter             | Main        |
| Geist             | Modern      |
| Plus Jakarta Sans | Alternative |

---

# 10.3 UI Principles

* modern minimalist
* banyak whitespace
* rounded-xl / rounded-2xl
* soft shadow
* clean typography
* responsive
* smooth animation

---

# 11. WIREFRAME STRUCTURE

# Landing Page

```txt
Navbar
Hero Section
Search Filter
Top Recommendation
Featured Kos
CTA Section
Footer
```

---

# Explore Page

```txt
Sidebar Filter
Kos Grid
Pagination
```

---

# Detail Page

```txt
Gallery
Kos Information
Facilities
Map
SAW Score
Recommendation Section
```

---

# Admin Dashboard

```txt
Sidebar
Navbar
Statistics
Charts
Table Data
```

---

# 12. DEVELOPMENT ROADMAP

# Phase 1

* setup Next.js
* setup Prisma
* setup PostgreSQL
* setup Auth.js
* CRUD kos

---

# Phase 2

* implementasi SAW
* recommendation engine
* filter system
* responsive UI

---

# Phase 3

* maps integration
* image upload
* dashboard analytics
* optimization

---

# Phase 4

* AI recommendation
* compare kos
* favorite kos
* review system
* realtime availability

---

# 13. FUTURE ENHANCEMENT

## Planned Features

* booking system
* payment gateway
* owner dashboard
* mobile application
* push notification
* AI chatbot recommendation

---

# 14. UI REFERENCES

## Inspiration

* Airbnb
* Linear
* Apple
* Vercel
* Mamikos redesign

---

# 15. CONCLUSION

KosRank adalah sistem rekomendasi tempat kos modern berbasis SAW yang dibangun menggunakan Next.js dan PostgreSQL.

Aplikasi dirancang:

* scalable
* clean architecture
* production ready
* responsive
* modern minimalist
* mudah dikembangkan di masa depan

Dengan metode SAW, pengguna dapat memperoleh rekomendasi kos terbaik berdasarkan berbagai kriteria secara objektif dan efisien.
