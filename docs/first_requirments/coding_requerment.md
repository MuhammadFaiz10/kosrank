# Software Requirements & Coding Guidelines

Based on the provided document ("PENERAPAN METODE SIMPLE ADDITIVE WEIGHTING DALAM SISTEM PENDUKUNG KEPUTUSAN PEMILIHAN TEMPAT KOS DI CONDONG CATUR YOGYAKARTA"), here is a comprehensive understanding document tailored for coding the application.

## 1. Project Overview
A web-based **Decision Support System (SPK)** designed to recommend boarding houses (kos) for students in the Condong Catur area, Yogyakarta. The system calculates recommendations using the **Simple Additive Weighting (SAW)** method.

## 2. Technology Stack
*   **Frontend**: HTML, CSS, JavaScript
*   **Backend**: PHP (Native)
*   **Database**: MySQL

## 3. Core Entities & Database Schema Design

Based on the paper, the database will need at least the following core tables:

1.  **`kriteria` (Criteria)**
    *   `id_kriteria` (PK)
    *   `kode_kriteria` (e.g., C1, C2)
    *   `nama_kriteria` (e.g., Harga, Luas Kamar)
    *   `bobot` (e.g., 0.3, 0.1)
    *   `atribut` (Enum: 'Cost', 'Benefit')

2.  **`sub_kriteria` (Sub-Criteria)**
    *   `id_sub_kriteria` (PK)
    *   `id_kriteria` (FK)
    *   `keterangan` (e.g., "<= 750.000", "< 500 meter")
    *   `nilai` (e.g., 20, 40, 60, 80, 100)

3.  **`alternatif` (Boarding Houses / Kos)**
    *   `id_alternatif` (PK)
    *   `kode_alternatif` (e.g., A01)
    *   `nama_kos` (e.g., Kos Gebang Candi)
    *   `harga` (Number)
    *   `luas_kamar` (String)
    *   `fasilitas_kamar` (String/Text)
    *   `fasilitas_umum` (String/Text)
    *   `jarak` (Number/Float in km or meters)

4.  **`penilaian` (Evaluation Matrix)**
    *   `id_penilaian` (PK)
    *   `id_alternatif` (FK)
    *   `id_kriteria` (FK)
    *   `nilai` (The converted score from 20-100 based on sub-criteria)

## 4. SAW (Simple Additive Weighting) Implementation

### Step 1: Define Criteria & Weights
The system must use the following baseline criteria (W):

| Code | Name | Weight (W) | Attribute |
| :--- | :--- | :--- | :--- |
| **C1** | Harga (Price) | 0.3 | **Cost** |
| **C2** | Luas Kamar (Room Size) | 0.1 | **Benefit** |
| **C3** | Fasilitas Kamar (Room Facilities) | 0.2 | **Benefit** |
| **C4** | Faslitas Umum (Public Facilities) | 0.2 | **Benefit** |
| **C5** | Jarak (Distance) | 0.2 | **Cost** |

### Step 2: Determine Suitability Rating (Sub-Criteria)
Raw data from the boarding house must be mapped to a score (20, 40, 60, 80, 100) before calculations begin. 

> [!IMPORTANT]
> The exact mapping rules are available in **Table 2** of the paper. Your PHP code will need logic to convert user inputs (like real prices or distances) into these specific integer scores based on the ranges provided.

### Step 3: Matrix Normalization (Rij)
Loop through the evaluation matrix and apply the normalization formula depending on the criteria attribute:

*   **If Attribute == Benefit (Keuntungan):**
    `Rij = Xij / Max(Xij)`
    *(Divide the current value by the highest value in that specific criteria column)*
*   **If Attribute == Cost (Biaya):**
    `Rij = Min(Xij) / Xij`
    *(Divide the lowest value in that specific criteria column by the current value)*

### Step 4: Final Ranking (Vi)
Multiply the normalized matrix (R) by the respective weight (W) and sum them up for each alternative.

`Vi = Sum(Wj * Rij)`

Sort the final results `Vi` in descending order. The highest score is the best recommendation.

## 5. UI/UX Requirements

### Admin Panel
*   **Input Criteria Page**: Forms to add, edit, or delete criteria and their weights (Bobot) and attributes (Cost/Benefit).
*   **Input Sub-criteria Page**: Forms to define the value mappings (20, 40, 60, 80, 100) for each criteria.
*   **Manage Alternatives**: Forms to add boarding houses and map their specific attributes.

### User/Student Interface
*   **Home / Recommendation Dashboard**: Displays the ranked list of boarding houses from highest SAW score to lowest.
*   **Filter System**: A sidebar or top-bar menu allowing users to filter the recommendations dynamically using JavaScript/PHP. Filters include:
    *   **Kampus (Campus Destination)**: Amikom, UPN, Mercu Buana.
    *   **Radius**: Maximum distance from the selected campus.
    *   **Range Harga**: Minimum and maximum budget.
    *   **Fasilitas Wajib (Required Facilities)**: Checkboxes for specific needs (e.g., WiFi, AC, Kamar Mandi Dalam).

## 6. Testing Validation
To ensure your code works correctly, use the test case provided in the document:
1. Input the 5 alternatives (`A01` to `A05`).
2. Run the SAW algorithm.
3. Assert that the output exactly matches **Table 6** in the document:
   - Rank 1: **Residence Permai (0.8500)**
   - Rank 2: **Griya Seturan (0.8400)**
   - Rank 3: **Kos Candi Gebang (0.8000)**
   - Rank 4: **Wisma Sembada (0.7733)**
   - Rank 5: **Kos Hijau Manis (0.6800)**
