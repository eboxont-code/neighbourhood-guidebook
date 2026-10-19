import { describe, expect, it } from "vitest";
import { countByStatus, leadSource, leadTel, leadWarmth, leadWhatsapp } from "@/lib/leads";
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
