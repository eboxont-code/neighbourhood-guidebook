import { areas, businesses, categories, cityOf, hasPin, type Business } from "@/data/directory";
import { opensOn } from "@/lib/hours";
import { verificationLevel } from "@/lib/verification";

/** Public, real records only. The same threshold drives pages, links and the sitemap. */
export function localItems(area: string, category: string, items: Business[] = businesses): Business[] {
  return items.filter((b) => !b.demo && b.area === area && b.category === category);
}
export function qualifiesLocalPage(area: string, category: string, items: Business[] = businesses): boolean {
  return localItems(area, category, items).length >= 3;
}
export function localCombinations(items: Business[] = businesses) {
  return areas.flatMap((area) => categories.filter((category) => qualifiesLocalPage(area.slug, category.slug, items)).map((category) => ({ area, category })));
}
export function localFacts(items: Business[]) {
  return {
    listings: items.length,
    mapped: items.filter(hasPin).length,
    saturday: items.filter((b) => opensOn(b.hours, 6)).length,
    verified: items.filter((b) => ["website", "social"].includes(verificationLevel(b))).length,
  };
}
export const categoryLocalAreas = (city: string, category: string) => localCombinations().filter((pair) => pair.category.slug === category && pair.area.city === city);
export const areaLocalCategories = (area: string) => localCombinations().filter((pair) => pair.area.slug === area);