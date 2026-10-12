import { describe, expect, it } from "vitest";
import { distanceKm, formatDistance, inNepal, sortByDistance } from "@/lib/geo";
import { FAV_KEY, readFavs, toggleFav } from "@/lib/favourites";
import { badgesFor, newSlugs, statusDetail, weekTable } from "@/lib/venue";
import { businesses, getBusiness, hasPin } from "@/data/directory";
import { parseCatSearch, parseSearchParams } from "@/lib/filters";

describe("Nepal location check", () => {
  it("accepts places in Nepal", () => {
    expect(inNepal(27.7172, 85.324)).toBe(true); // Kathmandu
    expect(inNepal(28.2096, 83.9856)).toBe(true); // Pokhara
    expect(inNepal(26.4525, 87.2718)).toBe(true); // Biratnagar
  });
  it("rejects places outside Nepal", () => {
    expect(inNepal(28.6139, 77.209)).toBe(false); // Delhi
    expect(inNepal(29.65, 91.1)).toBe(false); // Lhasa
    expect(inNepal(51.5072, -0.1276)).toBe(false); // London
    expect(inNepal(26.7271, 88.3953)).toBe(false); // Siliguri
  });
});

describe("distance formatting", () => {
  it("formats metres and kilometres in English", () => {
    expect(formatDistance(0.35, "en")).toBe("350 m away");
    expect(formatDistance(1.234, "en")).toBe("1.2 km away");
    expect(formatDistance(14.6, "en")).toBe("15 km away");
  });
  it("uses Nepali digits and units", () => {
    expect(formatDistance(1.234, "ne")).toBe("१.२ किमी टाढा");
    expect(formatDistance(0.35, "ne")).toBe("३५० मिटर टाढा");
  });
  it("measures real distances", () => {
    expect(distanceKm({ lat: 27.7172, lng: 85.324 }, { lat: 28.2096, lng: 83.9856 })).toBeGreaterThan(140);
  });
});

describe("near-me sorting", () => {
  it("puts nearest first and listings without coordinates last, in their original order", () => {
    const here = { lat: 27.7155833, lng: 85.310125 }; // Kathmandu Guest House
    const sorted = sortByDistance(businesses, here);
    expect(sorted[0]!.slug).toBe("kathmandu-guest-house-thamel");
    const firstNoPin = sorted.findIndex((b) => !hasPin(b));
    expect(sorted.slice(firstNoPin).every((b) => !hasPin(b))).toBe(true);
    expect(sorted.slice(firstNoPin).map((b) => b.id)).toEqual(businesses.filter((b) => !hasPin(b)).map((b) => b.id));
    expect(sorted).toHaveLength(businesses.length);
  });
});

describe("favourites storage", () => {
  const mem = () => { const m = new Map<string, string>(); return { getItem: (k: string) => m.get(k) ?? null, setItem: (k: string, v: string) => void m.set(k, v), m }; };
  it("adds and removes a slug", () => {
    const s = mem();
    expect(toggleFav(s, "a")).toEqual(["a"]);
    expect(toggleFav(s, "b")).toEqual(["b", "a"]);
    expect(toggleFav(s, "a")).toEqual(["b"]);
    expect(readFavs(s)).toEqual(["b"]);
  });
  it("ignores broken storage", () => {
    const s = mem();
    s.m.set(FAV_KEY, "{not json");
    expect(readFavs(s)).toEqual([]);
    s.m.set(FAV_KEY, JSON.stringify(["x", 3, "x"]));
    expect(readFavs(s)).toEqual(["x"]);
  });
});

describe("badge rules", () => {
  const oct13 = new Date("2026-10-13T06:00:00Z");
  it("never shows more than two badges", () => {
    for (const b of businesses) expect(badgesFor(b, oct13, true).length).toBeLessThanOrEqual(2);
  });
  it("only marks the post-launch batch as new, for 30 days", () => {
    const n = newSlugs(businesses, oct13);
    expect(n.has(getBusiness("kathmandu-guest-house-thamel")!.slug)).toBe(true); // b34
    expect(n.has(getBusiness("aavaran-durbar-marg")!.slug)).toBe(false); // b1, launch
    expect(newSlugs(businesses, new Date("2026-11-20T00:00:00Z")).size).toBe(0);
  });
  it("drops the new badge when most listings would have it", () => {
    const all = businesses.map((b) => ({ ...b, addedOn: b.id === "b1" ? "2026-10-01" : "2026-10-12" }));
    expect(newSlugs(all, oct13).size).toBe(0);
  });
  it("uses only recorded facts", () => {
    const b = getBusiness("aavaran-durbar-marg")!; // hours verified, website working
    expect(badgesFor(b, oct13, false)).toEqual(["hoursConfirmed", "webChecked"]);
    expect(badgesFor(b, oct13, true)).toEqual(["open", "hoursConfirmed"]);
    expect(badgesFor({ ...b, hoursVerified: false, websiteStatus: "failed" }, oct13, false)).toEqual([]);
  });
});

describe("hours detail", () => {
  const aav = getBusiness("aavaran-durbar-marg")!; // Sun–Fri 11:00–19:00, Sat 11:00–18:00
  it("expands parsable hours into a week", () => {
    const w = weekTable(aav.hours)!;
    expect(w[6]!.time).toBe("11:00–18:00");
    expect(w[0]!.time).toBe("11:00–19:00");
  });
  it("gives closing and opening times in Kathmandu time", () => {
    expect(statusDetail(aav.hours, new Date("2026-10-12T07:00:00Z"))).toEqual({ kind: "open", closes: "19:00" }); // Mon 12:45
    expect(statusDetail(aav.hours, new Date("2026-10-12T03:00:00Z"))).toEqual({ kind: "closed", opens: "11:00" }); // Mon 08:45
    expect(statusDetail(aav.hours, new Date("2026-10-12T15:00:00Z"))).toEqual({ kind: "closed", opens: "11:00", tomorrow: true }); // Mon 20:45
  });
  it("returns null when hours can't be read", () => {
    expect(statusDetail([{ days: "Every day", time: "From 10:00, last booking 18:00" }], new Date())).toBeNull();
  });
});

describe("URL params", () => {
  it("keeps plain URLs plain and reads near and map", () => {
    expect(parseSearchParams({ q: "" })).toEqual({ q: "" });
    expect(parseSearchParams({ q: "spa", near: "1", view: "map", open: "1", area: "thamel" })).toEqual({ q: "spa", near: true, view: "map", open: true, area: "thamel" });
    expect(parseCatSearch({ sort: "near", view: "map" })).toEqual({ sort: "near", view: "map" });
  });
});
