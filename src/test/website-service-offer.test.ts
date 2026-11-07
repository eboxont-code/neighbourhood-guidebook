import { describe, expect, it } from "vitest";
import { dict } from "@/lib/i18n";
import { Route } from "@/routes/for-businesses";

const serviceSummary = "Boxont designs simple, mobile-friendly websites that help Kathmandu businesses present their services and make it easy for customers to get in touch.";

describe("For Businesses website service summary", () => {
  it("states the service in one clear English sentence", () => {
    expect(dict.en.fbOwnerIntro).toBe(serviceSummary);
    expect(dict.en.fbOwnerIntro.match(/[.!?]/g)).toHaveLength(1);
  });

  it("communicates the same service in Nepali", () => {
    expect(dict.ne.fbOwnerIntro).toBe("Boxont ले काठमाडौंका व्यवसायहरूका लागि आफ्ना सेवाहरू प्रस्तुत गर्न र ग्राहकलाई सजिलै सम्पर्क गर्न सकिने सरल, मोबाइलमैत्री वेबसाइटहरू डिजाइन गर्छ।");
  });

  it("uses the canonical English sentence in page metadata and Service JSON-LD", () => {
    const head = (Route.options as unknown as {
      head?: () => {
        meta?: Array<{ name?: string; content?: string }>;
        scripts?: Array<{ children?: unknown }>;
      };
    }).head?.();

    const description = head?.meta?.find((item) => item.name === "description");
    expect(description?.content).toBe(serviceSummary + " Your SEWA directory listing stays free.");

    const serviceScript = head?.scripts?.find(
      (script) => typeof script.children === "string" && script.children.includes('"@type":"Service"'),
    );
    expect(serviceScript).toBeDefined();
    expect(JSON.parse(serviceScript?.children as string).description).toBe(serviceSummary);
  });
});
