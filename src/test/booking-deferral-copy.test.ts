import { describe, expect, it } from "vitest";
import { dict } from "@/lib/i18n";

describe("online booking launch gate copy", () => {
  it("keeps both English messages unavailable and tied to the launch gate", () => {
    expect(dict.en.fbWhy4).toBe(dict.en.fb2BookingLater);
    for (const copy of [dict.en.fbWhy4, dict.en.fb2BookingLater]) {
      expect(copy).toContain("Online booking is not available.");
      expect(copy).toContain("demand is proven");
      expect(copy).toContain("participating businesses");
      expect(copy).toContain("support capacity");
      expect(copy).not.toMatch(/coming soon|planned for later/i);
    }
  });

  it("keeps both Nepali messages unavailable and tied to the launch gate", () => {
    expect(dict.ne.fbWhy4).toBe(dict.ne.fb2BookingLater);
    for (const copy of [dict.ne.fbWhy4, dict.ne.fb2BookingLater]) {
      expect(copy).toContain("अनलाइन बुकिङ अहिले उपलब्ध छैन");
      expect(copy).toContain("प्रमाणित माग");
      expect(copy).toContain("सहभागी व्यवसाय");
      expect(copy).toContain("सहयोग क्षमता");
      expect(copy).not.toContain("छिट्टै आउँदैछ");
      expect(copy).not.toContain("पछि थप्ने योजना");
    }
  });

  it("keeps the public directory boundary explicit in both languages", () => {
    expect(dict.en.aboutLimitsBody).toContain("We are not a booking site.");
    expect(dict.ne.aboutLimitsBody).toContain("हामी बुकिङ साइट होइनौं");
  });
});
