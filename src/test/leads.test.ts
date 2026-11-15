import { describe, expect, it } from "vitest";
import { countByStatus, leadContactActions, leadSource, leadTel, leadWarmth, leadWhatsapp } from "@/lib/leads";
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
