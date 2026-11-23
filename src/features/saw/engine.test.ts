import { describe, it, expect } from "vitest";
import {
  SEEDED_KOS_SCORES,
  rankFromScoreMatrix,
  roundHalfUp2,
  facilityLevelFromCount,
  getC1Score,
  getC2Score,
  getC3Score,
  getC4Score,
  getC5Score,
  parseRoomArea,
} from "./engine";

// Bobot & atribut dari data_kost.xlsx (juga di-seed ke tabel Criteria)
const WEIGHTS: Record<string, number> = { C1: 0.3, C2: 0.3, C3: 0.2, C4: 0.1, C5: 0.1 };
const ATTRIBUTES: Record<string, "COST" | "BENEFIT"> = {
  C1: "COST",
  C2: "BENEFIT",
  C3: "COST",
  C4: "BENEFIT",
  C5: "BENEFIT",
};
const CODES = ["C1", "C2", "C3", "C4", "C5"];

describe("Scorer per kriteria (rubrik data_kost.xlsx)", () => {
  it("C1 harga (cost): <1jt=100, <2jt=80, <3jt=60, <4jt=40, >=4jt=20", () => {
    expect(getC1Score(999999)).toBe(100);
    expect(getC1Score(1000000)).toBe(80);
    expect(getC1Score(1700000)).toBe(80);
    expect(getC1Score(2000000)).toBe(60);
    expect(getC1Score(3100000)).toBe(40);
    expect(getC1Score(4000000)).toBe(20);
  });

  it("C2 fasilitas (benefit): level dari jumlah fasilitas, skor = level x 20", () => {
    expect(facilityLevelFromCount(5)).toBe(1);
    expect(facilityLevelFromCount(6)).toBe(2);
    expect(facilityLevelFromCount(8)).toBe(3);
    expect(facilityLevelFromCount(11)).toBe(4);
    expect(facilityLevelFromCount(14)).toBe(5);
    expect(getC2Score(facilityLevelFromCount(8))).toBe(60);
    expect(getC2Score(facilityLevelFromCount(14))).toBe(100);
  });

  it("C3 jarak (cost): 0-1=100, 1-5=80, 5-10=60, 10-15=40, >15=20", () => {
    expect(getC3Score(0.6)).toBe(100);
    expect(getC3Score(1)).toBe(100);
    expect(getC3Score(1.9)).toBe(80);
    expect(getC3Score(9)).toBe(60);
    expect(getC3Score(12.9)).toBe(40);
    expect(getC3Score(16)).toBe(20);
  });

  it("C4 ukuran ruangan (benefit) dari '3.5 x 3 meter'", () => {
    expect(parseRoomArea("3.5 x 3 meter")).toBeCloseTo(10.5);
    expect(getC4Score(6)).toBe(20);
    expect(getC4Score(7.5)).toBe(40);
    expect(getC4Score(9.99)).toBe(60);
    expect(getC4Score(12)).toBe(60);
    expect(getC4Score(20)).toBe(100);
  });

  it("C5 rating (benefit): null=20, <2=40, <3=60, <4=80, >=4=100", () => {
    expect(getC5Score(null)).toBe(20);
    expect(getC5Score(1.9)).toBe(40);
    expect(getC5Score(2.5)).toBe(60);
    expect(getC5Score(3.4)).toBe(80);
    expect(getC5Score(4.5)).toBe(100);
    expect(getC5Score(5.0)).toBe(100);
  });
});

describe("rankFromScoreMatrix — oracle data_kost.xlsx", () => {
  // Urutan alternatif sesuai Excel: A01..A05
  const ALTERNATIVES = [
    "Kost Noeks Cinere Depok",
    "Kost Pondok Rindang Tipe C Beji Depok",
    "Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok",
    "Kost Singgahsini DFlory Tipe B Cinere Depok",
    "Kost Rumah Nimas Sawangan Depok",
  ];
  const ids = ALTERNATIVES;
  const matrix = Object.fromEntries(ids.map((id) => [id, SEEDED_KOS_SCORES[id]]));
  const ranked = rankFromScoreMatrix(ids, matrix, WEIGHTS, ATTRIBUTES, CODES);

  it("A04 (DFlory) = 0.9333, rank 1", () => {
    expect(ranked[0].id).toBe("Kost Singgahsini DFlory Tipe B Cinere Depok");
    expect(ranked[0].score).toBe(0.9333);
  });

  it("Urutan & skor lengkap sesuai Excel (2 desimal: 0.93, 0.9, 0.85, 0.69, 0.68)", () => {
    expect(ranked.map((r) => r.id)).toEqual([
      "Kost Singgahsini DFlory Tipe B Cinere Depok",
      "Kost Singgahsini Taman Bunga Tipe C Cimanggis Depok",
      "Kost Rumah Nimas Sawangan Depok",
      "Kost Noeks Cinere Depok",
      "Kost Pondok Rindang Tipe C Beji Depok",
    ]);
    expect(ranked.map((r) => r.score)).toEqual([0.9333, 0.9, 0.845, 0.69, 0.6767]);
    expect(ranked.map((r) => roundHalfUp2(r.score))).toEqual([0.93, 0.9, 0.85, 0.69, 0.68]);
  });

  it("Matrix kosong menghasilkan array kosong", () => {
    expect(rankFromScoreMatrix([], {}, {}, {}, CODES)).toEqual([]);
  });
});
