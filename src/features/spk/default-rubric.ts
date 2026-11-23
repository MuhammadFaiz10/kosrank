/**
 * Rubrik bawaan SPK dari data_kost.xlsx (sheet SAW):
 * 5 kriteria, bobot total 1,0, dan 5 sub kriteria per kriteria (skor 20-100).
 * Dipakai oleh seeder dan aksi "Pulihkan Default" modul SPK.
 */

export interface DefaultSubKriteria {
  name: string;
  value: string;
  score: number;
}

export interface DefaultKriteria {
  code: string;
  name: string;
  weight: number;
  attribute: "COST" | "BENEFIT";
  subKriteria: DefaultSubKriteria[];
}

export const DEFAULT_CRITERIA: DefaultKriteria[] = [
  {
    code: "C1",
    name: "Harga",
    weight: 0.3,
    attribute: "COST",
    subKriteria: [
      { name: "500.000 - 999.999", value: "<1000000", score: 100 },
      { name: "1.000.000 - 1.999.999", value: "<2000000", score: 80 },
      { name: "2.000.000 - 2.999.999", value: "<3000000", score: 60 },
      { name: "3.000.000 - 3.999.999", value: "<4000000", score: 40 },
      { name: "> 4.000.000", value: ">=4000000", score: 20 },
    ],
  },
  {
    code: "C2",
    name: "Fasilitas",
    weight: 0.3,
    attribute: "BENEFIT",
    subKriteria: [
      { name: "Sangat tidak lengkap (<= 5 fasilitas)", value: "<=5", score: 20 },
      { name: "Kurang lengkap (6 - 7 fasilitas)", value: "6-7", score: 40 },
      { name: "Cukup lengkap (8 - 10 fasilitas)", value: "8-10", score: 60 },
      { name: "Lengkap (11 - 13 fasilitas)", value: "11-13", score: 80 },
      { name: "Sangat lengkap (>= 14 fasilitas)", value: ">=14", score: 100 },
    ],
  },
  {
    code: "C3",
    name: "Jarak",
    weight: 0.2,
    attribute: "COST",
    subKriteria: [
      { name: "0 - 1 km", value: "0-1", score: 100 },
      { name: "1 - 5 km", value: "1-5", score: 80 },
      { name: "5 - 10 km", value: "5-10", score: 60 },
      { name: "10 - 15 km", value: "10-15", score: 40 },
      { name: "> 15 km", value: ">15", score: 20 },
    ],
  },
  {
    code: "C4",
    name: "Ukuran Ruangan",
    weight: 0.1,
    attribute: "BENEFIT",
    subKriteria: [
      { name: "Luas <= 6 m2", value: "<=6", score: 20 },
      { name: "Luas > 6-9 m2", value: "6-9", score: 40 },
      { name: "Luas > 9-12 m2", value: "9-12", score: 60 },
      { name: "Luas > 12-15 m2", value: "12-15", score: 80 },
      { name: "Luas > 15 m2", value: ">15", score: 100 },
    ],
  },
  {
    code: "C5",
    name: "Rating",
    weight: 0.1,
    attribute: "BENEFIT",
    subKriteria: [
      { name: "Not found", value: "null", score: 20 },
      { name: "1 - 2", value: "1-2", score: 40 },
      { name: "2 - 3", value: "2-3", score: 60 },
      { name: "3 - 4", value: "3-4", score: 80 },
      { name: "4 - 5", value: "4-5", score: 100 },
    ],
  },
];
