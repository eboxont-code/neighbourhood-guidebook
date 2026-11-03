import type { Business, ListingPromotionPlacement } from "@/data/directory";

/** Public rows are already filtered to paid campaigns whose date window includes now. */
export function sponsoredFor(
  items: Business[],
  placement: ListingPromotionPlacement,
  target: string,
): Business[] {
  const now = Date.now();
  return items.filter((business) =>
    business.promotions?.some((promotion) =>
      promotion.placement === placement &&
      (placement === "area_featured" ? promotion.target_area === target : promotion.target_category === target) &&
      Date.parse(promotion.starts_at) <= now &&
      Date.parse(promotion.ends_at) > now,
    ),
  );
}
