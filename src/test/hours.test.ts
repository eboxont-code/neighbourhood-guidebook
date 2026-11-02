import { describe, expect, it } from "vitest";
import { weeklySchedule, openState, opensOn, parseTime, openingHoursSpecification } from "@/lib/hours";
import { parseRange } from "@/data/directory";
import { statusDetail } from "@/lib/venue";

// Kathmandu is UTC+5:45. 2026-10-28 is a Wednesday.
const ktm = (iso: string) => new Date(iso + "+05:45");

describe("structured hours from recorded data", () => {
  it("reads every day formats", () => {
    for (const days of ["Every day", "Sunday to Saturday", ""]) {
      const w = weeklySchedule([{ days, time: "10:00–20:00" }]);
      expect(w?.every((d) => d && !d.closed)).toBe(true);
    }
  });
  it("reads Sun–Fri and a closed Saturday", () => {
    const w = weeklySchedule([{ days: "Sun–Fri", time: "11:00–19:00" }, { days: "Sat", time: "Closed" }])!;
    expect(w[0]).toMatchObject({ closed: false, ranges: [[660, 1140]] });
    expect(w[6]).toMatchObject({ closed: true });
    expect(opensOn([{ days: "Sun–Fri", time: "11:00–19:00" }, { days: "Sat", time: "Closed" }], 6)).toBe(false);
    expect(opensOn([{ days: "Sun–Fri", time: "11:00–19:00" }], 0)).toBe(true);
  });
  it("reads single digit hours and last booking text", () => {
    expect(parseTime("9:30–19:00")).toEqual([570, 1140]);
    expect(parseTime("From 10:00, last booking 18:00")).toEqual([600, 1080]);
  });
  it("treats 00:00–24:00 as open 24 hours", () => {
    const allDay = [{ days: "Every day", time: "00:00–24:00" }];
    expect(openState(allDay, ktm("2026-10-28T03:00:00"))).toEqual({ kind: "open24" });
    expect(statusDetail(allDay, ktm("2026-10-28T03:00:00"))).toEqual({ kind: "open24" });
  });
  it("returns null and invents nothing for missing or unreadable hours", () => {
    expect(weeklySchedule(undefined)).toBeNull();
    expect(weeklySchedule([{ days: "Every day", time: "Call to ask" }])).toBeNull();
    expect(openState(undefined, new Date())).toBeNull();
    expect(openingHoursSpecification(undefined)).toBeUndefined();
  });
  it("works out open, closes soon and closed in Kathmandu time", () => {
    const h = [{ days: "Every day", time: "10:00–20:00" }];
    expect(openState(h, ktm("2026-10-28T12:00:00"))?.kind).toBe("open");
    expect(openState(h, ktm("2026-10-28T19:15:00"))?.kind).toBe("closesSoon");
    expect(openState(h, ktm("2026-10-28T20:00:00"))?.kind).toBe("closed");
  });
  it("handles times near midnight in Kathmandu, not UTC", () => {
    const h = [{ days: "Every day", time: "06:00–22:30" }];
    expect(openState(h, ktm("2026-10-28T23:50:00"))?.kind).toBe("closed");
    expect(openState(h, ktm("2026-10-28T22:00:00"))?.kind).toBe("closesSoon");
    // 00:10 UTC is 05:55 in Kathmandu, so still closed.
    expect(openState(h, new Date("2026-10-28T00:10:00Z"))?.kind).toBe("closed");
  });
  it("rejects impossible or ambiguous clock ranges", () => {
    expect(parseRange("25:00–26:00")).toBeNull();
    expect(parseRange("09:75–10:00")).toBeNull();
    expect(parseRange("24:00–01:00")).toBeNull();
    expect(parseRange("10:00–10:00")).toBeNull();
    expect(parseRange("09:00–24:00")).toEqual([540, 1440]);
    expect(parseTime("From 25:00, last booking 26:00")).toBeNull();
    expect(parseTime("From 10:90, last booking 18:00")).toBeNull();
  });
  it("does not guess when different rows define the same day twice", () => {
    expect(
      weeklySchedule([
        { days: "Sun–Fri", time: "09:00–17:00" },
        { days: "Wed", time: "10:00–18:00" },
      ]),
    ).toBeNull();
  });
  it("reports overnight opening hours consistently on listing details", () => {
    const h = [{ days: "Every day", time: "22:00–02:00" }];
    expect(statusDetail(h, ktm("2026-10-28T23:00:00"))).toEqual({
      kind: "open",
      closes: "02:00",
    });
    expect(statusDetail(h, ktm("2026-10-28T03:00:00"))).toEqual({
      kind: "closed",
      opens: "22:00",
    });
  });
  it("builds openingHoursSpecification only for open days", () => {
    const spec = openingHoursSpecification([{ days: "Sun–Fri", time: "11:00–19:00" }, { days: "Sat", time: "Closed" }])!;
    expect(spec).toHaveLength(6);
    expect(spec[0]).toMatchObject({ dayOfWeek: "https://schema.org/Sunday", opens: "11:00", closes: "19:00" });
  });
});
