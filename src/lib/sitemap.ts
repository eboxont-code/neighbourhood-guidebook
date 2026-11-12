import { SITE_URL } from "@/config";
import { areasIn, businesses, businessesIn, categoriesIn, citiesInUse } from "@/data/directory";
import { localCombinations } from "@/lib/local-pages";

/** Every indexable path: home, city pages, area and category pages per city, listings, for-businesses and static info pages. */
export function sitemapPaths(): string[] {
  const paths = ["/", "/for-businesses", "/about", "/contact", "/privacy", "/new", "/add-a-business", "/how-we-verify", "/claim"];
  for (const city of citiesInUse()) {
    const items = businessesIn(city.slug);
    paths.push(`/${city.slug}`);
    for (const a of areasIn(items)) paths.push(`/${city.slug}/${a.slug}`);
    for (const c of categoriesIn(items)) paths.push(`/${city.slug}/${c.slug}`);
    // City-based combinations are either noindex browsing pages or redirects to /a.
    // Only qualifying /a pages below are indexable combination destinations.
  }
  for (const b of businesses) paths.push(`/s/${b.slug}`);
  for (const { area, category } of localCombinations()) paths.push(`/a/${area.slug}/${category.slug}`);
  return [...new Set(paths)];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sitemapXml(): string {
  const urls = sitemapPaths().map((p) => `  <url><loc>${esc(`${SITE_URL}${p}`)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
