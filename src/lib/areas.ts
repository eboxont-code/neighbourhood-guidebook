import { areasInUse, businesses, categoriesIn, hasPin, type Area } from "@/data/directory";
import { distanceKm, type Point } from "@/lib/geo";
import { isOpen } from "@/lib/filters";

/** Average position of an area's pinned places, or null when none are pinned. */
export function areaCentre(slug: string): Point | null {
  const pins = businesses.filter((b) => b.area === slug && hasPin(b));
  if (!pins.length) return null;
  return { lat: pins.reduce((s, b) => s + b.lat!, 0) / pins.length, lng: pins.reduce((s, b) => s + b.lng!, 0) / pins.length };
}

/** Other areas in the city with places: nearest first when both centres are known, otherwise in list order after them. */
export function otherAreas(city: string, slug: string): Area[] {
  const list = areasInUse(city).filter((a) => a.slug !== slug);
  const me = areaCentre(slug);
  if (!me) return list;
  const known = list.map((a) => ({ a, c: areaCentre(a.slug) })).filter((x) => x.c).sort((x, y) => distanceKm(me, x.c!) - distanceKm(me, y.c!)).map((x) => x.a);
  return [...known, ...list.filter((a) => !known.includes(a))];
}

/** Computed facts for the area header; zero counts are left for the page to hide. */
export function areaFacts(slug: string, now: Date | null) {
  const items = businesses.filter((b) => b.area === slug);
  return {
    places: items.length,
    types: categoriesIn(items).length,
    open: now ? items.filter((b) => isOpen(b, now)).length : 0,
    pinned: items.filter(hasPin).length,
  };
}
