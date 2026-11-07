import { describe, expect, it } from "vitest";
import { funnel, summarise } from "@/lib/insights";
import { trackPayload, TRACK_EVENTS } from "@/lib/track";
import { readFileSync } from "node:fs";

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
  it("keeps listing-page and website-preview views separate from clicks", () => {
    const rows = [
      { event: "listing_view", query: null, listing_slug: "a", created_at: at(1) },
      { event: "preview_click", query: null, listing_slug: "a", created_at: at(1) },
      { event: "preview_view", query: null, listing_slug: "a", created_at: at(1) },
      { event: "preview_enquiry_click", query: null, listing_slug: "a", created_at: at(1) },
      { event: "click_call", query: null, listing_slug: "a", created_at: at(1) },
    ];
    const summary = summarise(rows, 7, now);
    expect(summary.clicks.map(([event]) => event)).toEqual(["click_call", "preview_click", "preview_enquiry_click"]);
    const result = funnel(rows, 7, now);
    expect(result.steps.slice(0, 4).map(({ event, count }) => [event, count])).toEqual([
      ["listing_view", 1],
      ["preview_click", 1],
      ["preview_view", 1],
      ["preview_enquiry_click", 1],
    ]);
  });

  it("allows the anonymous listing_view event in both migration histories", () => {
    expect(TRACK_EVENTS).toContain("listing_view");
    expect(TRACK_EVENTS).toContain("preview_view");
    const payload = trackPayload("listing_view", { slug: "listing-a" });
    expect(payload.event).toBe("listing_view");
    expect(payload.listing_slug).toBe("listing-a");
    expect(Object.keys(payload).sort()).toEqual(["event", "lang", "listing_slug", "path", "query"]);

    const supabaseMigration = readFileSync("supabase/migrations/20261107091900_listing_view_event.sql", "utf8");
    const drizzleMigration = readFileSync(new URL("../../drizzle/migrations/0013_listing_view_event.sql", import.meta.url), "utf8");
    expect(supabaseMigration).toBe(drizzleMigration);
    expect(supabaseMigration).toContain("'listing_view'");
  });

});
