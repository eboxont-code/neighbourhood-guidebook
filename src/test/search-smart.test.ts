import { describe, expect, it } from "vitest";
import { businesses, editDistance, searchBusinesses } from "@/data/directory";

describe("smarter search", () => {
  it("finds spas and salons from a service word", () => {
    const r = searchBusinesses("massage");
    expect(r.some((b) => b.category === "spas")).toBe(true);
    expect(searchBusinesses("मसाज").some((b) => b.category === "spas")).toBe(true);
  });
  it("forgives small typos", () => {
    expect(editDistance("resturant", "restaurant")).toBe(1);
    const r = searchBusinesses("resturant");
    expect(r.length).toBe(businesses.filter((b) => b.category === "restaurants").length);
    expect(searchBusinesses("thammel").every((b) => b.area === "thamel")).toBe(true);
    expect(searchBusinesses("thammel").length).toBeGreaterThan(0);
  });
  it("filters to an area with 'in' or 'near'", () => {
    for (const q of ["cafe in thamel", "coffee near thamel"]) {
      const r = searchBusinesses(q);
      expect(r.length).toBeGreaterThan(0);
      expect(r.every((b) => b.area === "thamel")).toBe(true);
      expect(r.some((b) => b.category === "cafes")).toBe(true);
    }
  });
  it("still returns nothing for nonsense", () => {
    expect(searchBusinesses("zzzqqq")).toEqual([]);
  });
});
