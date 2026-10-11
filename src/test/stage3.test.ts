import { describe, expect, it } from "vitest";
import { areas, businesses, categories, citiesInUse, getBusiness, hasPin, resolveSection } from "@/data/directory";
import { businessJsonLd } from "@/lib/seo";

describe("cities", () => {
  it("every area belongs to a known city and only Kathmandu has listings", () => {
    expect(citiesInUse().map((c) => c.slug)).toEqual(["kathmandu"]);
    expect(areas.every((a) => a.city === "kathmandu")).toBe(true);
  });
  it("area and category slugs never collide", () => {
    expect(areas.some((a) => categories.some((c) => c.slug === a.slug))).toBe(false);
  });
  it("city sections resolve to an area or a category", () => {
    expect(resolveSection("kathmandu", "thamel")).toEqual({ kind: "area", slug: "thamel" });
    expect(resolveSection("kathmandu", "hotels")).toEqual({ kind: "category", slug: "hotels" });
    expect(resolveSection("kathmandu", "nowhere")).toBeNull();
  });
});

describe("stage 3 listings", () => {
  it("has 37 listings with ids up to b37", () => {
    expect(businesses).toHaveLength(37);
    expect(new Set(businesses.map((b) => b.id)).size).toBe(37);
  });
  it("adds the four new categories", () => {
    for (const c of ["cafes", "restaurants", "gyms", "hotels"]) expect(categories.some((x) => x.slug === c)).toBe(true);
  });
  it("pins only listings with supplied coordinates", () => {
    expect(getBusiness("crest-club-lazimpat")!.lat).toBe(27.719318);
    expect(hasPin(getBusiness("aavaran-durbar-marg")!)).toBe(false);
    expect(hasPin(getBusiness("himalayan-java-lazimpat")!)).toBe(false);
    expect(businesses.filter(hasPin)).toHaveLength(16);
  });
  it("only Kathmandu Guest House has a WhatsApp number", () => {
    expect(businesses.filter((b) => b.whatsapp).map((b) => b.slug)).toEqual(["kathmandu-guest-house-thamel"]);
  });
  it("respects unverified hours", () => {
    expect(getBusiness("thamel-physical-fitness")!.hoursVerified).toBe(false);
  });
  it("JSON-LD uses the new types and geo", () => {
    const ld = businessJsonLd(getBusiness("kathmandu-guest-house-thamel")!);
    expect(ld["@type"]).toBe("Hotel");
    expect(ld["geo"]).toEqual({ "@type": "GeoCoordinates", latitude: 27.7155833, longitude: 85.310125 });
    expect(businessJsonLd(getBusiness("thamel-physical-fitness")!)["@type"]).toBe("ExerciseGym");
    expect(businessJsonLd(getBusiness("or2k-thamel")!)["@type"]).toBe("Restaurant");
    expect(businessJsonLd(getBusiness("himalayan-java-lazimpat")!)["geo"]).toBeUndefined();
  });
});
