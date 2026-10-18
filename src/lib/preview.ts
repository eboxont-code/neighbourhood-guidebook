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
