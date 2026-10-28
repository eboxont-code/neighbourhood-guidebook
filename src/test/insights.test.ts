import { describe, expect, it } from "vitest";
import { summarise } from "@/lib/insights";
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
  it("sends no personal data or location", () => {
    const p = trackPayload("search", { query: "  Hair   SALON " });
    expect(Object.keys(p).sort()).toEqual(["event", "lang", "listing_slug", "path", "query"]);
    expect(p.query).toBe("hair salon");
    expect(TRACK_EVENTS).toContain("search_zero");
  });
});
