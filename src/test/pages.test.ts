import { describe, expect, it } from "vitest";
import { applyCatFilters, parseCatSearch, suggestedSearches } from "@/lib/filters";
import { businesses, searchBusinesses } from "@/data/directory";

describe("category filter params", () => {
  it("keeps plain URLs plain", () => {
    expect(parseCatSearch({})).toEqual({});
  });
  it("reads area, open and sort", () => {
    expect(parseCatSearch({ area: "thamel", open: "1", sort: "open" })).toEqual({ area: "thamel", open: true, sort: "open" });
  });
  it("drops unknown areas and sorts", () => {
    expect(parseCatSearch({ area: "nowhere", sort: "stars" })).toEqual({});
  });
  it("filters hotels to an area", () => {
    const hotels = businesses.filter((b) => b.category === "hotels");
    const out = applyCatFilters(hotels, { area: "thamel" }, null);
    expect(out.length).toBeGreaterThan(0);
    expect(out.every((b) => b.area === "thamel")).toBe(true);
  });
});

describe("Nepali search", () => {
  it("matches an area name in Nepali", () => {
    expect(searchBusinesses("ठमेल").every((b) => b.area === "thamel")).toBe(true);
    expect(searchBusinesses("ठमेल").length).toBe(businesses.filter((b) => b.area === "thamel").length);
  });
  it("matches a category name in Nepali", () => {
    expect(searchBusinesses("होटल").length).toBe(businesses.filter((b) => b.category === "hotels").length);
  });
  it("matches a Nepali suggestion like ठमेलमा क्याफे", () => {
    expect(searchBusinesses("ठमेलमा क्याफे").every((b) => b.area === "thamel" && b.category === "cafes")).toBe(true);
    expect(searchBusinesses("ठमेलमा क्याफे").length).toBeGreaterThan(0);
  });
  it("every suggested search finds something", () => {
    for (const lang of ["en", "ne"] as const) {
      const tpl = lang === "en" ? "{cat} in {area}" : "{area}मा {cat}";
      for (const s of suggestedSearches(lang, tpl)) expect(searchBusinesses(s).length, s).toBeGreaterThan(0);
    }
  });
});
