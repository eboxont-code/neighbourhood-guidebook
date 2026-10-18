import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { getBusiness } from "@/data/directory";
import { offersPreview, previewPath, previewSlug } from "@/lib/preview";
import { sitemapPaths } from "@/lib/sitemap";
import { dict } from "@/lib/i18n";

describe("free website preview", () => {
  it("matches /s/<slug>/website-preview as its own route, not the listing", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/s/nuad-thai-lazimpat/website-preview").at(-1)?.routeId).toBe("/s/$slug_/website-preview");
    expect(router.matchRoutes("/s/nuad-thai-lazimpat").at(-1)?.routeId).toBe("/s/$slug");
  });
  it("builds and reads the preview path", () => {
    expect(previewPath("deezy-cuts-baluwatar")).toBe("/s/deezy-cuts-baluwatar/website-preview");
    expect(previewSlug("/s/deezy-cuts-baluwatar/website-preview")).toBe("deezy-cuts-baluwatar");
    expect(previewSlug("/s/deezy-cuts-baluwatar")).toBeNull();
  });
  it("is offered only when no website was found or the listed one failed", () => {
    expect(offersPreview(getBusiness("nuad-thai-lazimpat")!)).toBe(true);
    expect(offersPreview({ websiteStatus: "failed" })).toBe(true);
    expect(offersPreview({ websiteStatus: "owner_no_site" })).toBe(true);
    expect(offersPreview(getBusiness("aavaran-durbar-marg")!)).toBe(false);
    expect(offersPreview({ websiteStatus: "not_checked" })).toBe(false);
  });
  it("never appears in the sitemap", () => {
    expect(sitemapPaths().some((p) => p.includes("website-preview"))).toBe(false);
  });
  it("has every preview string in English and Nepali, with no em dash", () => {
    const en = Object.keys(dict.en).filter((k) => k.startsWith("pv"));
    expect(en.length).toBeGreaterThan(20);
    for (const k of en) {
      const ne = (dict.ne as Record<string, string>)[k];
      expect(ne, k).toBeTruthy();
      expect((dict.en as Record<string, string>)[k]).not.toContain("\u2014");
      expect(ne).not.toContain("\u2014");
    }
  });
});
