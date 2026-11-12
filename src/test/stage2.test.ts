import { describe, expect, it } from "vitest";
import { getBusiness } from "@/data/directory";
import { businessJsonLd, openingHoursSpec, pageMeta } from "@/lib/seo";
import { isBot, statusFromError } from "@/components/forms";

describe("listing JSON-LD", () => {
  it("uses a specific type and +977 phone", () => {
    const ld = businessJsonLd(getBusiness("tranquility-spa")!);
    expect(ld["@type"]).toBe("DaySpa");
    expect(String(ld["telephone"]).startsWith("+977")).toBe(true);
  });
  it("leaves out unverified hours", () => {
    expect(openingHoursSpec(getBusiness("tranquility-spa")!)).toBeUndefined();
  });
  it("adds url only for a working website", () => {
    expect(businessJsonLd(getBusiness("kaya-healing-thamel")!)["url"]).toBeUndefined();
    expect(businessJsonLd(getBusiness("aavaran-durbar-marg")!)["url"]).toBeTruthy();
  });
  it("writes verified every-day hours as Mo-Su", () => {
    expect(openingHoursSpec(getBusiness("deezy-cuts-baluwatar")!)).toEqual(["Mo-Su 08:00-20:00"]);
  });
});

describe("page meta", () => {
  it("has a canonical and no em dash", () => {
    const m = pageMeta("For businesses", "Simple sites.", "/for-businesses");
    expect(m.links[0]?.href).toBe("https://neighbourhood-guidebook.lovable.app/for-businesses");
    expect(JSON.stringify(m)).not.toContain("—");
  });
});

describe("spam protection", () => {
  it("treats a filled honeypot as a bot", () => {
    expect(isBot("http://spam")).toBe(true);
    expect(isBot("")).toBe(false);
  });
  it("shows the polite limit message for rate-limited sends", () => {
    expect(statusFromError({ message: "rate_limited" })).toBe("limited");
    expect(statusFromError({ message: "network" })).toBe("error");
    expect(statusFromError(null)).toBe("done");
  });
});
