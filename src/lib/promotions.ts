import type { Business, ListingPromotionPlacement } from "@/data/directory";

/** Public rows are already filtered to paid campaigns whose date window includes now. */
export function sponsoredFor(
  items: Business[],
  placement: ListingPromotionPlacement,
  target: string,
): Business[] {
  const now = Date.now();
  return items.flatMap((business) => {
    const promotion = business.promotions?.find((entry) =>
      entry.placement === placement &&
      (placement === "area_featured" ? entry.target_area === target : entry.target_category === target) &&
      Date.parse(entry.starts_at) <= now &&
      Date.parse(entry.ends_at) > now,
    );
    return promotion ? [{ ...business, promotionClickKey: placement + ":" + target }] : [];
  });
}
