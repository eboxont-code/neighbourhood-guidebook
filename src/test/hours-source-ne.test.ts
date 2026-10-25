import { describe, it, expect } from "vitest";
import { businesses } from "@/data/directory";
import { hoursSourceNe, hoursSourceLabel } from "@/lib/i18n";

describe("hours source note in Nepali", () => {
  it("has a Nepali label for every hours source in the data", () => {
    for (const b of businesses) if (b.hoursSource) expect(hoursSourceNe[b.hoursSource], b.slug).toBeTruthy();
  });
  it("keeps English on the English site", () => {
    expect(hoursSourceLabel("their post", "en")).toBe("their post");
  });
});
