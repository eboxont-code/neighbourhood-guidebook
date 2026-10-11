import { describe, expect, it } from "vitest";
import { businesses, searchBusinesses, telLink, websiteStatusSentence, type Business } from "@/data/directory";

const base = businesses[0]!;
describe("directory rules", () => {
  it("has all eighteen provided listings", () => {
    expect(businesses).toHaveLength(18);
  });
  it("shows a date only when a check happened", () => {
    expect(websiteStatusSentence(base)).toBe("Website checked and working on 11 October 2026.");
    expect(websiteStatusSentence({ ...base, websiteStatus: "not_checked" } as Business)).toBe("Website not checked yet.");
  });
  it("search finds by name and invents nothing", () => {
    expect(searchBusinesses("tranquility").map((b) => b.slug)).toEqual(["tranquility-spa"]);
    expect(searchBusinesses("zzzqqq")).toEqual([]);
  });
  it("phone link uses the phone as written", () => {
    expect(telLink("01-5367872")).toBe("tel:01-5367872");
  });
  it("only listings with a stated address get one", () => {
    expect(businesses.find((b) => b.slug === "deezy-cuts-baluwatar")?.address).toBeUndefined();
  });
});

describe("search fields", () => {
  it("matches by area and by category", () => {
    expect(searchBusinesses("baluwatar").map((b) => b.slug)).toEqual(["deezy-cuts-baluwatar"]);
    expect(searchBusinesses("barbers").map((b) => b.slug).sort()).toEqual(["deezy-cuts-baluwatar", "the-new-barber-boudha", "the-new-barber-durbar-marg", "the-new-barber-thamel"]);
  });
});
