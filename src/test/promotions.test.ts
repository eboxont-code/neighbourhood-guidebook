import { describe, expect, it } from "vitest";
import type { Business } from "@/data/directory";
import { sponsoredFor } from "@/lib/promotions";

function business(overrides: Partial<Business> = {}): Business {
  return {
    id: "listing-1",
    slug: "sample-business",
    name: "Sample Business",
    category: "salons",
    area: "durbar-marg",
    websiteStatus: "none_found",
    services: [],
    sourceNotes: "",
    verification: "not_verified",
    demo: false,
    ...overrides,
  };
}

describe("SEWA sponsored placements", () => {
  it("returns only active campaigns matching the booked placement and target", () => {
    const now = Date.now();
    const item = business({
      promotions: [
        {
          id: "active-area-campaign",
          placement: "area_featured",
          target_area: "durbar-marg",
          target_category: null,
          starts_at: new Date(now - 60_000).toISOString(),
          ends_at: new Date(now + 60_000).toISOString(),
        },
        {
          id: "other-area",
          placement: "area_featured",
          target_area: "thamel",
          target_category: null,
          starts_at: new Date(now - 60_000).toISOString(),
          ends_at: new Date(now + 60_000).toISOString(),
        },
        {
          id: "category-campaign",
          placement: "category_featured",
          target_area: null,
          target_category: "salons",
          starts_at: new Date(now - 60_000).toISOString(),
          ends_at: new Date(now + 60_000).toISOString(),
        },
        {
          id: "not-started",
          placement: "area_featured",
          target_area: "durbar-marg",
          target_category: null,
          starts_at: new Date(now + 60_000).toISOString(),
          ends_at: new Date(now + 120_000).toISOString(),
        },
        {
          id: "expired",
          placement: "area_featured",
          target_area: "durbar-marg",
          target_category: null,
          starts_at: new Date(now - 120_000).toISOString(),
          ends_at: new Date(now - 60_000).toISOString(),
        },
      ],
    });

    const result = sponsoredFor([item], "area_featured", "durbar-marg");
    expect(result).toHaveLength(1);
    expect(result[0]?.slug).toBe("sample-business");
    expect(result[0]?.promotionClickId).toBe("active-area-campaign");
  });

  it("does not change the original business or its verification state", () => {
    const item = business({
      promotions: [{
        id: "campaign-1",
        placement: "category_featured",
        target_area: null,
        target_category: "salons",
        starts_at: new Date(Date.now() - 60_000).toISOString(),
        ends_at: new Date(Date.now() + 60_000).toISOString(),
      }],
    });

    const result = sponsoredFor([item], "category_featured", "salons");
    expect(result[0]?.verification).toBe("not_verified");
    expect(item.promotionClickId).toBeUndefined();
    expect(item.verification).toBe("not_verified");
  });

  it("returns nothing for a non-matching or absent campaign", () => {
    expect(sponsoredFor([business()], "area_featured", "durbar-marg")).toEqual([]);
    expect(sponsoredFor([business({ promotions: [{
      id: "wrong-slot",
      placement: "category_featured",
      target_area: null,
      target_category: "salons",
      starts_at: new Date(Date.now() - 60_000).toISOString(),
      ends_at: new Date(Date.now() + 60_000).toISOString(),
    }] })], "area_featured", "durbar-marg")).toEqual([]);
  });
});
