import { describe, expect, it } from "vitest";
import { areas, cities, dayLabel, placeName, timeLabel } from "@/data/directory";
import { pageMeta } from "@/lib/seo";

describe("Nepali place names", () => {
  it("every area and city has a Nepali name", () => {
    for (const p of [...areas, ...cities]) expect(p.nameNe.trim().length).toBeGreaterThan(0);
  });
  it("uses the supplied names", () => {
    expect(placeName(areas.find((a) => a.slug === "thamel"), "ne")).toBe("ठमेल");
    expect(placeName(areas.find((a) => a.slug === "durbar-marg"), "ne")).toBe("दरबारमार्ग");
    expect(placeName(cities[0], "ne")).toBe("काठमाडौं");
    expect(placeName(areas.find((a) => a.slug === "thamel"), "en")).toBe("Thamel");
  });
});

describe("hours wording", () => {
  it("translates day labels and Closed only", () => {
    expect(dayLabel("Every day", "ne")).toBe("हरेक दिन");
    expect(dayLabel("Sun–Fri", "ne")).toBe("आइत–शुक्र");
    expect(dayLabel("Sat", "ne")).toBe("शनि");
    expect(dayLabel("", "en")).toBe("Every day");
    expect(timeLabel("Closed", "ne")).toBe("बन्द");
    expect(timeLabel("06:00–20:30", "ne")).toBe("06:00–20:30");
  });
});

describe("titles", () => {
  it("home and city pages differ", () => {
    expect(pageMeta("A local guide to everyday businesses in Nepal", "x").meta[0]).not.toEqual(pageMeta("Kathmandu by neighbourhood: salons, cafés, hotels and more", "x").meta[0]);
  });
});
