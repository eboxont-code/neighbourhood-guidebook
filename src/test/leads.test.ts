import { describe, expect, it } from "vitest";
import { countByStatus, leadListingLinks, leadSource, leadTel, leadWarmth, leadWhatsapp } from "@/lib/leads";
import { dict } from "@/lib/i18n";

describe("sales leads", () => {
  it("tags each form source and treats unknown pages as other", () => {
    expect(leadSource("preview")).toBe("preview");
    expect(leadSource("claim")).toBe("claim");
    expect(leadSource("for-businesses")).toBe("for-businesses");
    expect(leadSource("something")).toBe("other");
    expect(leadWarmth("preview")).toBeLessThan(leadWarmth("contact"));
  });
  it("counts leads per status", () => {
    const c = countByStatus([{ status: "new" }, { status: "new" }, { status: "won" }, { status: "odd" }]);
    expect(c).toEqual({ all: 4, new: 2, contacted: 0, quoted: 0, won: 1, lost: 0 });
  });
  it("builds call links for landlines and WhatsApp only for mobiles", () => {
    expect(leadTel("01-4545676")).toBe("tel:+97714545676");
    expect(leadTel("12")).toBeNull();
    expect(leadTel(null)).toBeNull();
    expect(leadWhatsapp("9802323990", "Hi")).toBe("https://wa.me/9779802323990?text=Hi");
    expect(leadWhatsapp("01-4545676", "Hi")).toBeNull();
  });
  it("has every lead string in English and Nepali, with no em dashes", () => {
    const keys = Object.keys(dict.en).filter((k) => k.startsWith("adLead") || k.startsWith("adSt_") || k.startsWith("adSrc_"));
    expect(keys.length).toBeGreaterThan(20);
    for (const k of keys) {
      const ne = (dict.ne as Record<string, string>)[k];
      expect(ne, k).toBeTruthy();
      expect((dict.en as Record<string, string>)[k]).not.toMatch(/\u2014/);
      expect(ne).not.toMatch(/\u2014/);
    }
  });
});


describe("lead listing destinations", () => {
  const currentListing = {
    slug: "current-business",
    name: "Current Business",
    websiteStatus: "none_found" as const,
  };

  it("uses the current slug for a direct listing and its eligible preview", () => {
    expect(leadListingLinks("current-business", [currentListing], {})).toEqual({
      business: currentListing,
      slug: "current-business",
      previewPath: "/s/current-business/website-preview",
    });
  });

  it("follows one or more recorded redirects to the current published listing", () => {
    const result = leadListingLinks("old-business", [currentListing], {
      "old-business": "middle-business",
      "middle-business": "current-business",
    });
    expect(result).toEqual({
      business: currentListing,
      slug: "current-business",
      previewPath: "/s/current-business/website-preview",
    });
  });

  it("uses the existing legacy redirect map when no live redirect is supplied", () => {
    const plush = { ...currentListing, slug: "plush-lazimpat", name: "Plush" };
    expect(leadListingLinks("plush-kamaladi", [plush])).toEqual({
      business: plush,
      slug: "plush-lazimpat",
      previewPath: "/s/plush-lazimpat/website-preview",
    });
  });

  it("offers a preview only when the current listing remains eligible", () => {
    const working = {
      slug: "current-business",
      name: "Current Business",
      websiteStatus: "working" as const,
      website: "https://example.com",
    };
    expect(leadListingLinks("old-business", [working], { "old-business": "current-business" })).toEqual({
      business: working,
      slug: "current-business",
      previewPath: null,
    });
  });

  it("returns no destinations for missing targets, empty slugs, or redirect cycles", () => {
    expect(leadListingLinks(" ", [currentListing], {})).toBeNull();
    expect(leadListingLinks("deleted-business", [currentListing], { "deleted-business": "missing-business" })).toBeNull();
    expect(leadListingLinks("old-business", [currentListing], {
      "old-business": "middle-business",
      "middle-business": "old-business",
    })).toBeNull();
  });
});
