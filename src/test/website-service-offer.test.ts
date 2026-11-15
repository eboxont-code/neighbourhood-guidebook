import { describe, expect, it } from "vitest";
import { dict } from "@/lib/i18n";
import { Route } from "@/routes/for-businesses";

const serviceSummaryEn =
  "SEWA designs simple, mobile-friendly websites that help Kathmandu businesses present their services and make it easy for customers to get in touch. A site can put your hours, phone, directions, services and photos in one place. See a free preview first. It is a concept, not a live website. Launching a site is a separate project, with scope and any costs agreed in writing before work starts.";
const serviceSummaryNe =
  "SEWA ले काठमाडौंका व्यवसायहरूका लागि आफ्ना सेवाहरू प्रस्तुत गर्न र ग्राहकलाई सजिलै सम्पर्क गर्न सकिने सरल, मोबाइलमैत्री वेबसाइटहरू डिजाइन गर्छ। वेबसाइटमा तपाईंको खुल्ने समय, फोन, बाटो, सेवा र फोटो एउटै ठाउँमा राख्न सकिन्छ। पहिले निःशुल्क नमुना हेर्नुहोस्। यो अवधारणा हो, लाइभ वेबसाइट होइन। वेबसाइट सुरु गर्ने काम छुट्टै परियोजना हो र काम सुरु हुनुअघि दायरा तथा लाग्ने खर्च लिखित रूपमा सहमति गरिन्छ।";
const metaDescription =
  "SEWA designs simple, mobile-friendly websites for Kathmandu businesses: salons, barbers, spas and clinics, with services, hours, one-tap call and map. Your directory listing stays free.";

describe("For Businesses website service summary", () => {
  it("states the service clearly in English, including the preview-versus-launch distinction", () => {
    expect(dict.en.fbOwnerIntro).toBe(serviceSummaryEn);
    expect(dict.en.fbOwnerIntro).toContain("Kathmandu businesses");
    expect(dict.en.fbOwnerIntro).toContain("concept, not a live website");
  });

  it("communicates the same service in Nepali", () => {
    expect(dict.ne.fbOwnerIntro).toBe(serviceSummaryNe);
    expect(dict.ne.fbOwnerIntro).toContain("काठमाडौंका व्यवसायहरू");
    expect(dict.ne.fbOwnerIntro).toContain("लाइभ वेबसाइट होइन");
  });

  it("keeps keyword-rich metadata and uses the intro in Service JSON-LD", () => {
    const head = (Route.options as unknown as {
      head?: () => {
        meta?: Array<{ name?: string; content?: string }>;
        scripts?: Array<{ children?: unknown }>;
      };
    }).head?.();

    const description = head?.meta?.find((item) => item.name === "description");
    expect(description?.content).toBe(metaDescription);

    const serviceScript = head?.scripts?.find(
      (script) => typeof script.children === "string" && script.children.includes('"@type":"Service"'),
    );
    expect(serviceScript).toBeDefined();
    expect(JSON.parse(serviceScript?.children as string).description).toBe(serviceSummaryEn);
  });
});
