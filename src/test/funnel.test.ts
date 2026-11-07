import { describe, expect, it } from "vitest";
import { funnel } from "@/lib/insights";
import { splitAreaQuery } from "@/lib/filters";
import { TRACK_EVENTS } from "@/lib/track";

const now = new Date("2026-10-30T00:00:00Z");
const at = (d: number) => new Date(now.getTime() - d * 86400000).toISOString();
const ev = (event: string, d = 1, listing_slug: string | null = null) => ({ event, listing_slug, query: null, created_at: at(d) });

describe("funnel", () => {
  it("tracks listing and preview funnel events", () => {
    for (const e of ["listing_view", "preview_view", "preview_enquiry_click", "claim_submit", "enquiry_submit", "nearby_click"]) expect(TRACK_EVENTS).toContain(e);
  });
  it("computes step-to-step percentages and a dash when the earlier step is 0", () => {
    const rows = [ev("preview_click"), ev("preview_click"), ev("preview_click"), ev("preview_click"), ev("preview_view", 1, "a"), ev("preview_view", 2, "a"), ev("preview_view", 2, "b"), ev("preview_enquiry_click"), ev("claim_submit"), ev("preview_view", 20, "c")];
    const f = funnel(rows, 7, now);
    expect(f.steps.map((s) => s.count)).toEqual([0, 4, 3, 1, 0, 1, 0]);
    expect(f.steps.map((s) => s.rate)).toEqual([null, null, 75, 33, 0, null, 0]);
    expect(f.topPreviews).toEqual([["a", 2], ["b", 1]]);
    expect(funnel(rows, 30, now).topPreviews).toContainEqual(["c", 1]);
  });
});

describe("splitAreaQuery", () => {
  it("pulls an area out of 'X near Y' and 'X Y'", () => {
    expect(splitAreaQuery("spa near lazimpat")).toEqual({ area: "lazimpat", rest: "spa" });
    expect(splitAreaQuery("cafe Thamel")).toEqual({ area: "thamel", rest: "cafe" });
    expect(splitAreaQuery("salon in durbar marg")).toEqual({ area: "durbar-marg", rest: "salon" });
    expect(splitAreaQuery("सैलुन नक्सालमा")).toEqual({ area: "naxal", rest: "सैलुन" });
  });
  it("leaves queries without an area alone", () => {
    expect(splitAreaQuery("barber")).toEqual({ rest: "barber" });
  });
});
