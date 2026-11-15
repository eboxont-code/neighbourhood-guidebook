import { describe, expect, it } from "vitest";
import { countByStatus, leadContactActions, leadListingLinks, leadSource, leadStageDuration, leadTel, leadWarmth, leadWhatsapp } from "@/lib/leads";
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
  it("uses the saved stage-change time, falling back to creation only for new leads", () => {
    const now = Date.parse("2026-11-10T12:00:00.000Z");
    expect(leadStageDuration("new", "2026-11-10T10:30:00.000Z", null, now)).toEqual({ value: 1, unit: "hour" });
    expect(leadStageDuration("contacted", "2026-11-01T00:00:00.000Z", "2026-11-10T11:00:00.000Z", now)).toEqual({ value: 1, unit: "hour" });
    expect(leadStageDuration("contacted", "2026-11-01T00:00:00.000Z", null, now)).toBeNull();
  });
  it("uses readable duration units and rejects invalid or future stage timestamps", () => {
    const now = Date.parse("2026-11-10T12:00:00.000Z");
    const ago = (ms: number) => new Date(now - ms).toISOString();
    expect(leadStageDuration("new", ago(30_000), null, now)).toEqual({ value: 1, unit: "minute", lessThanMinute: true });
    expect(leadStageDuration("new", ago(45 * 60_000), null, now)).toEqual({ value: 45, unit: "minute" });
    expect(leadStageDuration("new", ago(3 * 3_600_000), null, now)).toEqual({ value: 3, unit: "hour" });
    expect(leadStageDuration("new", ago(2 * 86_400_000), null, now)).toEqual({ value: 2, unit: "day" });
    expect(leadStageDuration("new", ago(45 * 86_400_000), null, now)).toEqual({ value: 1, unit: "month" });
    expect(leadStageDuration("new", ago(364 * 86_400_000), null, now)).toEqual({ value: 12, unit: "month" });
    expect(leadStageDuration("new", ago(365 * 86_400_000), null, now)).toEqual({ value: 1, unit: "year" });
    expect(leadStageDuration("new", ago(730 * 86_400_000), null, now)).toEqual({ value: 2, unit: "year" });
    expect(leadStageDuration("new", "not-a-date", null, now)).toBeNull();
    expect(leadStageDuration("new", ago(-60_000), null, now)).toBeNull();
  });
  it("builds call links only for valid Nepali mobile and landline numbers", () => {
    expect(leadTel("01-4545676")).toBe("tel:+97714545676");
    expect(leadTel("+977 01-4545676")).toBe("tel:+97714545676");
    expect(leadTel("9802323990")).toBe("tel:+9779802323990");
    expect(leadTel("1234567")).toBeNull();
    expect(leadTel("+1 202 555 0123")).toBeNull();
    expect(leadTel("12")).toBeNull();
    expect(leadTel(null)).toBeNull();
    expect(leadWhatsapp("9802323990", "Hi")).toBe("https://wa.me/9779802323990?text=Hi");
    expect(leadWhatsapp("+977 980-2323990", "Hi")).toBe("https://wa.me/9779802323990?text=Hi");
    expect(leadWhatsapp("01-4545676", "Hi")).toBeNull();
    expect(leadWhatsapp("9999999999", "Hi")).toBeNull();
  });

  it("builds admin contact actions only from each submitted record's phone", () => {
    const lead = {
      phone: "9802323990",
      name: "Visitor",
      business_name: "Example Business",
      operatorPhone: "01-4545676",
    };
    expect(leadContactActions(lead, "Hi")).toEqual({
      tel: "tel:+9779802323990",
      whatsapp: "https://wa.me/9779802323990?text=Hi",
    });

    const businessSubmission = { phone: "01-4545676", business_name: "Example Business" };
    expect(leadContactActions(businessSubmission, "Hi")).toEqual({
      tel: "tel:+97714545676",
      whatsapp: null,
    });

    const missingPhone = { phone: null, operatorPhone: "9802323990" };
    expect(leadContactActions(missingPhone, "Hi")).toEqual({ tel: null, whatsapp: null });
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
