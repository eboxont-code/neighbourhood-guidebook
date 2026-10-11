import { describe, expect, it } from "vitest";
import { businesses, searchBusinesses, websiteStatusSentence, type Business } from "@/data/directory";

const base = businesses[0]!;
describe("directory rules", () => {
  it("shows a date only when a check happened", () => {
    expect(websiteStatusSentence({ ...base, websiteStatus: "working", lastChecked: "2026-09-20" })).toContain("20 September 2026");
    expect(websiteStatusSentence({ ...base, websiteStatus: "not_checked", lastChecked: "2026-09-20" } as Business)).toBe("Website not checked yet.");
  });
  it("search matches services and invents nothing", () => {
    expect(searchBusinesses("beard").map((b) => b.slug)).toEqual(["sample-sharp-barbers"]);
    expect(searchBusinesses("zzzqqq")).toEqual([]);
  });
  it("all sample businesses are flagged demo", () => {
    expect(businesses.every((b) => b.demo)).toBe(true);
  });
});
