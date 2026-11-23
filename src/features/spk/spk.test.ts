import { describe, it, expect } from "vitest";
import {
  buildDecisionX,
  facilityLevelFromCount,
  validateBobotTotal,
  parseRoomSize,
} from "./spk";
import { rankFromScoreMatrix } from "@/features/saw/engine";

// Bobot & atribut dari data_kost.xlsx
const W: Record<string, number> = { C1: 0.3, C2: 0.3, C3: 0.2, C4: 0.1, C5: 0.1 };
const ATTR: Record<string, "COST" | "BENEFIT"> = {
  C1: "COST", C2: "BENEFIT", C3: "COST", C4: "BENEFIT", C5: "BENEFIT",
};
const CODES = ["C1", "C2", "C3", "C4", "C5"];

describe("Level fasilitas C2 (keputusan Q1: otomatis)", () => {
  it("5 sampel Excel: 8,8,13,12,11 -> level 3,3,4,4,4", () => {
    expect(facilityLevelFromCount(8)).toBe(3);
    expect(facilityLevelFromCount(8)).toBe(3);
    expect(facilityLevelFromCount(13)).toBe(4);
    expect(facilityLevelFromCount(12)).toBe(4);
    expect(facilityLevelFromCount(11)).toBe(4);
  });
  it("Batas bucket: 5,6,7,10,11,13,14", () => {
    expect(facilityLevelFromCount(5)).toBe(1);
    expect(facilityLevelFromCount(6)).toBe(2);
    expect(facilityLevelFromCount(7)).toBe(2);
    expect(facilityLevelFromCount(10)).toBe(3);
    expect(facilityLevelFromCount(11)).toBe(4);
    expect(facilityLevelFromCount(13)).toBe(4);
    expect(facilityLevelFromCount(14)).toBe(5);
  });
});

describe("buildDecisionX - matriks keputusan X 5 sampel (spesifikasi bagian 9)", () => {
  // rating kecocokan A01-A05 dari tabel bagian 9
  const samples = [
    { nama: "A01", harga: 1700000, fas: 8, jarak: 9, luas: 7.5, rating: 1.9 },
    { nama: "A02", harga: 1500000, fas: 8, jarak: 0.6, luas: 9, rating: 3.4 },
    { nama: "A03", harga: 2000000, fas: 13, jarak: 1.9, luas: 10.5, rating: 4.5 },
    { nama: "A04", harga: 2025000, fas: 12, jarak: 7.7, luas: 9.99, rating: 5.0 },
    { nama: "A05", harga: 1000000, fas: 11, jarak: 12.9, luas: 12, rating: null },
  ];

  const X = samples.map((s) => buildDecisionX({ harga: s.harga, fasilitasLevel: facilityLevelFromCount(s.fas), jarakKm: s.jarak, luas: s.luas, rating: s.rating }));

  it("Matriks X persis tabel spesifikasi bagian 9", () => {
    expect(X.map((x) => [x.C1, x.C2, x.C3, x.C4, x.C5])).toEqual([
      [80, 60, 60, 40, 40],   // A01
      [80, 60, 100, 40, 80],  // A02
      [60, 80, 80, 60, 100],  // A03
      [60, 80, 60, 60, 100],  // A04
      [80, 80, 40, 60, 20],   // A05
    ]);
  });

  it("Oracle V: A04 0.9333 rank 1, urutan A04>A03>A05>A01>A02", () => {
    const ids = samples.map((s) => s.nama);
    const matrix = Object.fromEntries(ids.map((id, i) => [id, X[i]]));
    const ranked = rankFromScoreMatrix(ids, matrix, W, ATTR, CODES);

    expect(ranked[0].id).toBe("A04");
    expect(ranked.map((r) => r.score)).toEqual([0.9333, 0.9, 0.845, 0.69, 0.6767]);
  });

  it("parseRoomSize memecah '2.5 x 3 meter'", () => {
    expect(parseRoomSize("2.5 x 3 meter")).toEqual({ panjang: 2.5, lebar: 3 });
  });
});

describe("validateBobotTotal (FR-3)", () => {
  it("Total tepat 1 diterima", () => {
    expect(validateBobotTotal({ C1: 0.3, C2: 0.3, C3: 0.2, C4: 0.1, C5: 0.1 }).ok).toBe(true);
  });
  it("Total 0.9 ditolak dengan pesan", () => {
    const r = validateBobotTotal({ C1: 0.3, C2: 0.3, C3: 0.2, C4: 0.1, C5: 0 });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("1,0");
  });
  it("Total 1.1 ditolak dengan pesan", () => {
    const r = validateBobotTotal({ C1: 0.4, C2: 0.3, C3: 0.2, C4: 0.1, C5: 0.1 });
    expect(r.ok).toBe(false);
    expect(r.error).toContain("1,0");
  });
});
