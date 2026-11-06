import { QueryClient } from "@tanstack/react-query";
import { createRouter } from "@tanstack/react-router";
import { describe, expect, it } from "vitest";
import { routeTree } from "@/routeTree.gen";
import { getBusiness } from "@/data/directory";
import { Route as PreviewRoute } from "@/routes/s.$slug_.website-preview";
import { offersPreview, previewPath, previewSlug } from "@/lib/preview";
import { sitemapPaths } from "@/lib/sitemap";
import { dict } from "@/lib/i18n";

function loadPreview(slug: string) {
  const loader = PreviewRoute.options.loader;
  if (!loader) throw new Error("Missing website-preview route loader");
  return loader({ params: { slug } } as never);
}

describe("free website preview", () => {
  it("matches /s/<slug>/website-preview as its own route, not the listing", () => {
    const router = createRouter({ routeTree, context: { queryClient: new QueryClient() } });
    expect(router.matchRoutes("/s/nuad-thai-lazimpat/website-preview").at(-1)?.routeId).toBe("/s/$slug_/website-preview");
    expect(router.matchRoutes("/s/nuad-thai-lazimpat").at(-1)?.routeId).toBe("/s/$slug");
  });

  it("loads the business matching the requested preview slug", () => {
    const result = loadPreview("nuad-thai-lazimpat") as { business: { slug: string } };
    expect(result.business.slug).toBe("nuad-thai-lazimpat");
  });
  it("redirects a known legacy slug to the current business preview", () => {
    let thrown: unknown;
    try {
      loadPreview("plush-kamaladi");
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toMatchObject({
      isRedirect: true,
      to: "/s/$slug/website-preview",
      params: { slug: "plush-lazimpat" },
      statusCode: 301,
    });
  });
  it("returns not-found for an unknown preview slug instead of another business", () => {
    let thrown: unknown;
    try {
      loadPreview("not-a-real-sewa-business");
    } catch (error) {
      thrown = error;
    }
    expect(thrown).toMatchObject({ isNotFound: true });
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
    expect(offersPreview({ websiteStatus: "not_checked" })).toBe(true);
    expect(offersPreview({ websiteStatus: "not_checked", website: "https://example.com" })).toBe(false);
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

describe("preview examples on /for-businesses", () => {
  it("only shows real listings that get a preview, one per category", async () => {
    const { previewExamples } = await import("@/lib/preview");
    const { businesses } = await import("@/data/directory");
    const list = previewExamples(businesses);
    expect(list.length).toBe(3);
    expect(new Set(list.map((b) => b.category)).size).toBe(3);
    for (const b of list) { expect(b.demo).toBe(false); expect(offersPreview(b)).toBe(true); }
  });
  it("skips a picked slug that no longer qualifies", async () => {
    const { previewExamples } = await import("@/lib/preview");
    const items = [
      { slug: "serene-durbar-marg", category: "salons", websiteStatus: "working" as const, demo: false },
      { slug: "a", category: "cafes", websiteStatus: "none_found" as const, demo: false },
      { slug: "b", category: "cafes", websiteStatus: "none_found" as const, demo: false },
      { slug: "c", category: "gyms", websiteStatus: "failed" as const, demo: true },
    ];
    expect(previewExamples(items).map((b) => b.slug)).toEqual(["a"]);
  });
  it("has every string in English and Nepali", () => {
    for (const k of ["fbExTitle", "fbExBody", "fbExOpen", "fbExLabel"] as const) { expect(dict.en[k]).toBeTruthy(); expect(dict.ne[k]).toBeTruthy(); expect(dict.en[k]).not.toMatch(/\u2014/); }
  });
});
