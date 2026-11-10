import { describe, expect, it } from "vitest";
import { searchAnalyticsLabel } from "@/data/directory";
import { summarise } from "@/lib/insights";
import { safeSearchClass } from "@/lib/search-analytics";
import { trackPayload } from "@/lib/track";

describe("privacy-safe search analytics", () => {
  it("stores only known category and area labels", () => {
    expect(searchAnalyticsLabel("Dentist near Thamel", "thamel")).toBe(
      "category:clinics;area:thamel",
    );
    expect(searchAnalyticsLabel("मसाज", "lazimpat")).toBe(
      "category:mixed;area:lazimpat",
    );
  });

  it("does not retain arbitrary free text or contact details", () => {
    for (const query of [
      "Asha Sharma 9801234567",
      "asha@example.com",
      "call 01-5551234",
    ]) {
      expect(searchAnalyticsLabel(query)).toBe("other");
    }
    expect(searchAnalyticsLabel("Asha Sharma", "not-a-real-area")).toBe("other");
  });

  it("rejects malformed labels before they reach analytics", () => {
    expect(safeSearchClass("category:clinics;area:thamel")).toBe(
      "category:clinics;area:thamel",
    );
    expect(safeSearchClass("Asha Sharma")).toBe("other");
    expect(safeSearchClass("category:clinics;email:asha@example.com")).toBe("other");
  });

  it("never falls back to raw text for search events", () => {
    expect(trackPayload("search_zero", { query: "asha@example.com" }).query).toBe("other");
    expect(trackPayload("search", { query: "9801234567" }).query).toBe("other");
    expect(
      trackPayload("search_zero", {
        searchClass: searchAnalyticsLabel("dentist", "thamel"),
      }).query,
    ).toBe("category:clinics;area:thamel");
    expect(trackPayload("service_quote_submit", { query: "custom" }).query).toBe("custom");
  });

  it("buckets legacy free-text rows as unclassified instead of showing them", () => {
    const summary = summarise(
      [
        {
          event: "search_zero",
          listing_slug: null,
          query: "asha@example.com",
          created_at: "2026-11-10T00:00:00Z",
        },
      ],
      7,
      new Date("2026-11-10T01:00:00Z"),
    );
    expect(summary.zero).toEqual([["other", 1]]);
    expect(summary.searches).toEqual([["other", 1]]);
  });
});
