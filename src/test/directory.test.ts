import { describe, expect, it } from "vitest";
import { businesses, searchBusinesses, telLink, websiteStatusSentence, type Business } from "@/data/directory";

const base = businesses[0]!;
describe("directory rules", () => {
  it("has every provided listing", () => {
    expect(businesses).toHaveLength(37);
  });
  it("shows a date only when a check happened", () => {
    expect(websiteStatusSentence(base)).toBe("Website checked and working on 11 October 2026.");
    expect(websiteStatusSentence({ ...base, websiteStatus: "not_checked" } as Business)).toBe("Website not checked yet.");
  });
  it("search finds by name and invents nothing", () => {
    expect(searchBusinesses("tranquility").map((b) => b.slug)).toEqual(["tranquility-spa"]);
    expect(searchBusinesses("zzzqqq")).toEqual([]);
  });
  it("tel links use +977 and digits only", () => {
    expect(telLink("01-5367872")).toBe("tel:+97715367872");
    expect(telLink("9802323990")).toBe("tel:+9779802323990");
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
    expect(businesses.find((b) => b.slug === "club-oasis-hyatt")?.hours).toBeUndefined();
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
    expect(websiteButton(by("or2k-thamel"))).toBe(false);
    expect(websiteButton(by("tranquility-spa"))).toBe(true);
  });
  it("sources are not website addresses", () => {
    expect(businesses.every((b) => !/https?:|www\.|\.np\b/.test(b.sourceNotes))).toBe(true);
  });
  it("social handles become links", () => {
    expect(socialLinks(by("deezy-cuts-baluwatar"))[0]?.url).toBe("https://www.tiktok.com/@deezycuts.np");
  });
});

import { areas, areasInUse, categories, categoryRedirects, hoursStatus, slugRedirects, websiteShortLabel, whatsappLink } from "@/data/directory";
describe("stage 1 data rules", () => {
  const by = (s: string) => businesses.find((b) => b.slug === s)!;
  it("areas match addresses", () => {
    expect(by("hair-n-shanti-kamaladi").area).toBe("kamaladi");
    expect(by("tranquility-spa").area).toBe("lazimpat");
    expect(by("club-oasis-hyatt").area).toBe("boudha");
  });
  it("plush moved to a lazimpat slug and the old one redirects", () => {
    expect(by("plush-lazimpat").area).toBe("lazimpat");
    expect(slugRedirects["plush-kamaladi"]).toBe("plush-lazimpat");
  });
  it("no kathmandu area, no salon-and-spa category", () => {
    expect(areas.some((a) => a.slug === "kathmandu")).toBe(false);
    expect(categories.some((c) => c.slug === "salon-and-spa")).toBe(false);
    expect(categoryRedirects["salon-and-spa"]).toBe("salons");
    expect(by("serene-durbar-marg").category).toBe("salons");
    expect(by("annapurna-salon-durbar-marg").category).toBe("salons");
  });
  it("every area in use has a listing", () => {
    expect(areasInUse().every((a) => businesses.some((b) => b.area === a.slug))).toBe(true);
  });
  it("phones use one format", () => {
    const ok = /^(01-\d{7}|9[78]\d{8})$/;
    for (const b of businesses) {
      if (b.phone) expect(b.phone).toMatch(ok);
      for (const p of b.otherPhones ?? []) expect(p.number).toMatch(ok);
    }
    expect(by("hair-n-shanti-kamaladi").phone).toBe("01-4428463");
  });
  it("whatsapp links use 977 and digits", () => {
    expect(whatsappLink("9802323990")).toContain("https://wa.me/9779802323990?");
  });
  it("kathmandu spa has no stock cover", () => {
    expect(by("kathmandu-spa-thamel").cover).toBeUndefined();
  });
  it("website short labels", () => {
    expect(websiteShortLabel(by("aavaran-durbar-marg"))).toBe("webWorking");
    expect(websiteShortLabel(by("kaya-healing-thamel"))).toBe("webNone");
    expect(websiteShortLabel(by("deezy-cuts-baluwatar"))).toBe("webNone");
    expect(websiteShortLabel(by("lavish-durbar-marg"))).toBe("webWorking");
  });
});

describe("open now in Kathmandu time", () => {
  // 2026-10-11 is a Sunday. Kathmandu is UTC+5:45.
  const at = (utc: string) => new Date(utc);
  it("every day range", () => {
    const h = [{ days: "Every day", time: "10:00–20:00" }];
    expect(hoursStatus(h, at("2026-10-11T06:15:00Z")).kind).toBe("open"); // 12:00 NPT
    expect(hoursStatus(h, at("2026-10-11T15:15:00Z")).kind).toBe("closed"); // 21:00 NPT
  });
  it("empty days and Sunday to Saturday mean every day", () => {
    expect(hoursStatus([{ days: "", time: "08:00–20:00" }], at("2026-10-11T06:15:00Z")).kind).toBe("open");
    expect(hoursStatus([{ days: "Sunday to Saturday", time: "9:30–19:00" }], at("2026-10-11T06:15:00Z")).kind).toBe("open");
  });
  it("day ranges pick the right line", () => {
    const h = [{ days: "Sun–Fri", time: "11:00–19:00" }, { days: "Sat", time: "11:00–18:00" }];
    // Saturday 2026-10-10 at 18:30 NPT: closed (Saturday closes at 18:00)
    expect(hoursStatus(h, at("2026-10-10T12:45:00Z"))).toEqual({ kind: "closed", today: "11:00–18:00" });
  });
  it("unparseable times fall back to text", () => {
    expect(hoursStatus([{ days: "Every day", time: "From 10:00, last booking 18:00" }], at("2026-10-11T06:15:00Z")).kind).toBe("text");
    expect(hoursStatus(undefined, new Date()).kind).toBe("none");
  });
});
