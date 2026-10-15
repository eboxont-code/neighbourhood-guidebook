import { describe, expect, it } from "vitest";
import { hoursToWeek, normalizePhone, slugify, validUrl, weekToHours } from "@/lib/admin-listing";
import { rowToBusiness } from "@/lib/listings.functions";
import { businesses, getBusiness, listingSnapshot, liveSlugRedirects, setListings } from "@/data/directory";

describe("admin listing helpers", () => {
  it("keeps phones in 01-XXXXXXX or 98/97XXXXXXXX", () => {
    expect(normalizePhone("014545676")).toBe("01-4545676");
    expect(normalizePhone("+977 980-2323990")).toBe("9802323990");
    expect(normalizePhone("12345")).toBeNull();
    expect(normalizePhone("9612345678")).toBeNull();
  });
  it("accepts only full web links", () => {
    expect(validUrl("https://example.com")).toBe(true);
    expect(validUrl("example.com")).toBe(false);
  });
  it("makes slugs from names", () => expect(slugify("Hair n Shanti & Spa, Kamaladi")).toBe("hair-n-shanti-and-spa-kamaladi"));
  it("round-trips day by day hours", () => {
    const week = hoursToWeek([{ days: "Sun–Fri", time: "11:00–19:00" }, { days: "Sat", time: "Closed" }])!;
    expect(week[6]).toEqual({ kind: "closed" });
    expect(weekToHours(week)).toEqual([{ days: "Sun–Fri", time: "11:00–19:00" }, { days: "Sat", time: "Closed" }]);
    expect(weekToHours(hoursToWeek([{ days: "Every day", time: "10:00–20:00" }])!)).toEqual([{ days: "Every day", time: "10:00–20:00" }]);
  });
  it("leaves free-text hours alone and drops unknown days", () => {
    expect(hoursToWeek([{ days: "Every day", time: "From 10:00, last booking 18:00" }])).toBeNull();
    const w = hoursToWeek([{ days: "Mon", time: "09:00–17:00" }])!;
    expect(weekToHours(w)).toEqual([{ days: "Mon", time: "09:00–17:00" }]);
  });
});

describe("live listings", () => {
  it("maps a database row back to the same listing", () => {
    const b = listingSnapshot[0]!;
    const { id, slug, name, area, category, ...data } = b;
    expect(rowToBusiness({ id, slug, name, area, category, data })).toEqual(b);
  });
  it("swaps listings and slug redirects in place, then restores", () => {
    setListings([{ ...listingSnapshot[0]!, slug: "renamed" }], { old: "renamed" });
    expect(businesses).toHaveLength(1);
    expect(getBusiness("renamed")).toBeTruthy();
    expect(liveSlugRedirects).toEqual({ old: "renamed" });
    setListings(listingSnapshot.map((x) => ({ ...x })));
    expect(businesses).toHaveLength(37);
    expect(liveSlugRedirects).toEqual({});
  });
});
