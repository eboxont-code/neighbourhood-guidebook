import { describe, expect, it } from "vitest";
import { listingSnapshot, type Business } from "@/data/directory";
import { localCombinations, localFacts, localItems, qualifiesLocalPage } from "@/lib/local-pages";
import { otherBranches } from "@/lib/branches";
import { sitemapPaths, sitemapXml } from "@/lib/sitemap";
import { redactLocation, redactLocationText } from "@/lib/location-redaction";

const first = listingSnapshot[0];
if (!first) throw new Error("Missing source data");
const sample = (id: string, patch: Partial<Business> = {}): Business => ({ ...first, id, slug: id, area: "thamel", category: "cafes", demo: false, ...patch });

describe("local page qualification", () => {
  it("requires at least three real listings in the exact area and category", () => {
    const two = [sample("one"), sample("two")];
    expect(qualifiesLocalPage("thamel", "cafes", two)).toBe(false);
    expect(qualifiesLocalPage("thamel", "cafes", [...two, sample("three")])).toBe(true);
  });
  it("does not count demos, other areas or other categories", () => {
    const records = [sample("one"), sample("two"), sample("demo", { demo: true }), sample("elsewhere", { area: "boudha" }), sample("different", { category: "spas" })];
    expect(localItems("thamel", "cafes", records).map((b) => b.slug)).toEqual(["one", "two"]);
    expect(qualifiesLocalPage("thamel", "cafes", records)).toBe(false);
  });
  it("includes every qualifying real combination and no thin /a page in the sitemap", () => {
    const paths = sitemapPaths();
    const combinations = localCombinations();
    expect(combinations.length).toBeGreaterThan(0);
    for (const { area, category } of combinations) expect(paths).toContain(`/a/${area.slug}/${category.slug}`);
    expect(paths).not.toContain("/a/baluwatar/hotels");
    expect(sitemapXml()).not.toContain("<lastmod>");
  });
  it("counts mapped, Saturday and official-source verified facts only", () => {
    const records = [sample("one", { lat: 27.7, lng: 85.3, hours: [{ days: "Sat", time: "10:00–18:00" }], website: "https://example.com", lastChecked: "2026-10-11" }), sample("two", { lat: undefined, lng: undefined, hours: undefined, website: undefined, social: [], lastChecked: undefined })];
    expect(localFacts(records)).toEqual({ listings: 2, mapped: 1, saturday: 1, verified: 1 });
  });
});

describe("explicit sibling branches", () => {
  it("returns only the two recorded New Barber siblings and excludes self", () => {
    const branch = listingSnapshot.find((b) => b.slug === "the-new-barber-thamel");
    if (!branch) throw new Error("Missing recorded branch");
    expect(otherBranches(branch, listingSnapshot).map((b) => b.slug)).toEqual(["the-new-barber-durbar-marg", "the-new-barber-boudha"]);
    expect(otherBranches({ ...branch, brand: undefined }, listingSnapshot)).toHaveLength(2);
  });
  it("never infers a brand from a similar name or includes demo branches", () => {
    const branch = sample("one", { name: "Same name" });
    expect(otherBranches(branch, [branch, sample("two", { name: "Same name" })])).toEqual([]);
    const known = { ...branch, brand: "Recorded brand" };
    expect(otherBranches(known, [known, sample("demo", { brand: known.brand, demo: true })])).toEqual([]);
  });
});

describe("location-safe error breadcrumbs", () => {
  it("strips coordinate objects recursively without removing diagnostic labels", () => {
    expect(redactLocation({ boundary: "listing", breadcrumbs: [{ data: { lat: 27.712345, lng: 85.312345, nested: { coords: { latitude: 27.7 }, status: "denied" } } }] })).toEqual({ boundary: "listing", breadcrumbs: [{ data: { nested: { status: "denied" } } }] });
    expect(redactLocationText("location lat=27.712345 lng=85.312345 27.712345,85.312345")).not.toContain("27.712345");
  });
});