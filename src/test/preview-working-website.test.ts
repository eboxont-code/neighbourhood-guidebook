import { describe, expect, it } from "vitest";
import { getBusiness, websiteButton, websiteShortLabel } from "@/data/directory";
import { offersPreview, previewExamples } from "@/lib/preview";
import { Route as PreviewRoute } from "@/routes/s.$slug_.website-preview";

const loadPreview = PreviewRoute.options.loader as
  | ((args: { params: { slug: string } }) => unknown)
  | undefined;

describe("shared website preview eligibility", () => {
  it("does not serve or promote a preview for a listing with a working official website", () => {
    const business = getBusiness("aavaran-durbar-marg");
    if (!business) throw new Error("Missing working-website listing fixture");

    expect(business.websiteStatus).toBe("working");
    expect(business.website).toBe("https://www.aavaranskin.com");
    expect(websiteButton(business)).toBe(true);
    expect(websiteShortLabel(business)).toBe("webWorking");
    expect(offersPreview(business)).toBe(false);
    expect(previewExamples([business])).toEqual([]);
    expect(loadPreview).toBeTypeOf("function");
    expect(() => loadPreview!({ params: { slug: business.slug } })).toThrow();
  });

  it("continues to serve an eligible preview when no official website was found", () => {
    const business = getBusiness("the-new-barber-durbar-marg");
    if (!business) throw new Error("Missing no-website listing fixture");

    expect(offersPreview(business)).toBe(true);
    expect(loadPreview).toBeTypeOf("function");
    expect(loadPreview!({ params: { slug: business.slug } })).toEqual({ business });
  });
});
