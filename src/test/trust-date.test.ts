import { describe, expect, it } from "vitest";
import { getBusiness } from "@/data/directory";
import { verifiedHours, verificationLevel } from "@/lib/verification";

describe("dated verification", () => {
  it("does not label undated hours or source notes as verified", () => {
    const b = getBusiness("aavaran-durbar-marg");
    if (!b) throw new Error("Missing recorded fixture");
    const { lastChecked, ...undated } = b;
    expect(verifiedHours(undated)).toBe(false);
    expect(verificationLevel(undated)).toBe("needed");
    expect(verifiedHours({ ...undated, lastChecked: "2026-02-30" })).toBe(false);
    if (!lastChecked) throw new Error("Missing recorded check date");
    expect(verifiedHours({ ...undated, lastChecked })).toBe(true);
  });
});