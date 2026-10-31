import { listingSnapshot, type Business } from "@/data/directory";

/** Snapshot fallback preserves explicitly recorded brands when older database rows lack the field. */
export function recordedBrand(b: Business): string | undefined {
  return b.brand?.trim() || listingSnapshot.find((record) => record.slug === b.slug)?.brand;
}
export function otherBranches(b: Business, items: Business[]): Business[] {
  const brand = recordedBrand(b);
  if (!brand || b.demo) return [];
  return items.filter((other) => !other.demo && other.slug !== b.slug && recordedBrand(other) === brand);
}