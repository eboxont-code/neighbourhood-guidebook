import { SITE_URL } from "@/config";
import { areasIn, businesses, businessesIn, categoriesIn, citiesInUse } from "@/data/directory";

/** Every indexable path: home, city pages, area and category pages per city, listings, for-businesses and static info pages. */
export function sitemapPaths(): string[] {
  const paths = ["/", "/for-businesses", "/about", "/contact", "/privacy", "/new"];
  for (const city of citiesInUse()) {
    const items = businessesIn(city.slug);
    paths.push(`/${city.slug}`);
    for (const a of areasIn(items)) paths.push(`/${city.slug}/${a.slug}`);
    for (const c of categoriesIn(items)) paths.push(`/${city.slug}/${c.slug}`);
    // Area + category pages, only for combos with at least one listing.
    for (const a of areasIn(items)) for (const c of categoriesIn(items.filter((b) => b.area === a.slug))) paths.push(`/${city.slug}/${a.slug}/${c.slug}`);
  }
  for (const b of businesses) paths.push(`/s/${b.slug}`);
  return [...new Set(paths)];
}

const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

export function sitemapXml(): string {
  const urls = sitemapPaths().map((p) => `  <url><loc>${esc(`${SITE_URL}${p}`)}</loc></url>`).join("\n");
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
}
