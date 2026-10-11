import { describe, expect, it } from "vitest";
import { businesses, searchBusinesses, telLink, websiteStatusSentence, type Business } from "@/data/directory";

const base = businesses[0]!;
describe("directory rules", () => {
  it("has all twenty provided listings", () => {
    expect(businesses).toHaveLength(20);
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

describe("hours provenance", () => {
  it("hours not from the shop's own page are marked unverified", () => {
    for (const slug of ["toni-and-guy-durbar-mall", "tranquility-spa", "serene-durbar-marg"]) {
      expect(businesses.find((b) => b.slug === slug)?.hoursVerified).toBe(false);
    }
    expect(businesses.find((b) => b.slug === "aavaran-durbar-marg")?.hoursVerified).toBe(true);
  });
  it("shops with no published hours have none", () => {
    expect(businesses.find((b) => b.slug === "lavish-durbar-marg")?.hours).toBeUndefined();
  });
});

import { showWebsite, socialLinks, websiteButton } from "@/data/directory";
describe("website and social display", () => {
  const by = (s: string) => businesses.find((b) => b.slug === s)!;
  it("hides a listed website whose status is not checked", () => {
    expect(showWebsite(by("munney-durbar-marg"))).toBe(false);
    expect(showWebsite(by("aavaran-durbar-marg"))).toBe(true);
  });
  it("only a working website gets the button", () => {
    expect(websiteButton(by("the-new-barber-durbar-marg"))).toBe(false);
    expect(websiteButton(by("tranquility-spa"))).toBe(true);
  });
  it("sources are not website addresses", () => {
    expect(businesses.every((b) => !/\.(com|np)\b/.test(b.sourceNotes))).toBe(true);
  });
  it("social handles become links", () => {
    expect(socialLinks(by("deezy-cuts-baluwatar"))[0]?.url).toBe("https://www.tiktok.com/@deezycuts.np");
  });
});
