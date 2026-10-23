import type { Business } from "@/data/directory";

/** The free website preview for a listing. Noindex and never in the sitemap. */
export const previewPath = (slug: string) => `/s/${slug}/website-preview`;

/** Owners are pointed to the preview only when no website was found or the listed one failed its check. */
export const offersPreview = (b: Pick<Business, "websiteStatus">) =>
  b.websiteStatus === "none_found" || b.websiteStatus === "owner_no_site" || b.websiteStatus === "failed";

/** Matches /s/<slug>/website-preview and returns the slug. */
export function previewSlug(pathname: string): string | null {
  const m = pathname.match(/^\/s\/([^/]+)\/website-preview\/?$/);
  return m ? decodeURIComponent(m[1]!) : null;
}

/** Hand-picked real listings shown on /for-businesses as proof the free preview exists: a salon, a café and a gym. */
export const EXAMPLE_PREVIEW_SLUGS = ["serene-durbar-marg", "cafe-deja-vu-naxal", "fitness-studio-nepal-lazimpat"];

/**
 * Up to three published, non-demo listings that get a free preview, in different categories.
 * Uses the picked slugs when they still qualify, then fills from the rest so the strip never shows a dead link.
 */
export function previewExamples<T extends Pick<Business, "slug" | "category" | "websiteStatus" | "demo">>(items: T[], n = 3): T[] {
  const ok = (b: T) => !b.demo && offersPreview(b);
  const picked = EXAMPLE_PREVIEW_SLUGS.map((s) => items.find((b) => b.slug === s)).filter((b): b is T => !!b && ok(b));
  for (const b of items) {
    if (picked.length >= n) break;
    if (ok(b) && !picked.some((p) => p.slug === b.slug || p.category === b.category)) picked.push(b);
  }
  return picked.slice(0, n);
}
