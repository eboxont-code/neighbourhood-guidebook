import { describe, expect, it } from "vitest";
import { summarise, summariseContactActions } from "@/lib/insights";
import { trackPayload, TRACK_EVENTS } from "@/lib/track";

const now = new Date("2026-10-28T00:00:00Z");
const at = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();

describe("admin insights", () => {
  it("counts searches, zero-result demand and clicks inside the window", () => {
    const s = summarise([
      { event: "search", query: "spa", listing_slug: null, created_at: at(1) },
      { event: "search_zero", query: "vet", listing_slug: null, created_at: at(2) },
      { event: "search_zero", query: "vet", listing_slug: null, created_at: at(3) },
      { event: "click_call", query: null, listing_slug: "a", created_at: at(1) },
      { event: "click_call", query: null, listing_slug: "a", created_at: at(20) },
    ], 7, now);
    expect(s.zero).toEqual([["vet", 2]]);
    expect(s.searches[0]).toEqual(["vet", 2]);
    expect(s.clicks).toEqual([["click_call", 1]]);
    expect(s.listings).toEqual([["a", 1]]);
  });
  it("tracks the SEWA service quote funnel without personal data", () => {
    expect(TRACK_EVENTS).toContain("service_package_select");
    expect(TRACK_EVENTS).toContain("service_quote_submit");
    expect(TRACK_EVENTS).toContain("sponsored_click");
    const payload = trackPayload("service_quote_submit", { slug: "sewa-business", query: "Launch" });
    expect(payload.event).toBe("service_quote_submit");
    expect(payload.listing_slug).toBe("sewa-business");
    expect(payload.query).toBe("launch");
    expect(Object.keys(payload).sort()).toEqual(["event", "lang", "listing_slug", "path", "query"]);
  });
  it("sends no personal data or location", () => {
    const p = trackPayload("search", { query: "  Hair   SALON " });
    expect(Object.keys(p).sort()).toEqual(["event", "lang", "listing_slug", "path", "query"]);
    expect(p.query).toBe("hair salon");
    expect(TRACK_EVENTS).toContain("search_zero");
  });
});


describe("business contact-action insights", () => {
  it("counts recent call and WhatsApp taps by listing, excluding unrelated or unlinked events", () => {
    const result = summariseContactActions([
      { event: "click_call", listing_slug: "salon-a", query: null, created_at: at(1) },
      { event: "click_whatsapp", listing_slug: "salon-a", query: null, created_at: at(2) },
      { event: "click_whatsapp", listing_slug: "clinic-b", query: null, created_at: at(1) },
      { event: "click_directions", listing_slug: "salon-a", query: null, created_at: at(1) },
      { event: "click_call", listing_slug: null, query: null, created_at: at(1) },
      { event: "click_call", listing_slug: "salon-a", query: null, created_at: at(10) },
      { event: "click_call", listing_slug: "future", query: null, created_at: new Date(now.getTime() + 86400000).toISOString() },
    ], 7, now);

    expect(result).toEqual({
      total: 3,
      calls: 1,
      whatsapps: 2,
      listings: [["salon-a", 2], ["clinic-b", 1]],
    });
  });
});
