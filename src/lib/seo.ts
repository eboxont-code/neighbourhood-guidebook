import { SITE_NAME, SITE_URL } from "@/config";
import { getArea, intlDigits, parseDays, parseRange, websiteButton, type Business } from "@/data/directory";

/** Per-page head tags: title, description, Open Graph, Twitter card and canonical. */
export function pageMeta(title: string, description: string, path?: string, opts: { image?: string; type?: string } = {}) {
  const full = `${title} · ${SITE_NAME}`;
  const url = path ? `${SITE_URL}${path}` : undefined;
  const meta: Record<string, string>[] = [
    { title: full },
    { name: "description", content: description },
    { property: "og:title", content: full },
    { property: "og:description", content: description },
    { property: "og:type", content: opts.type ?? "website" },
    { property: "og:site_name", content: SITE_NAME },
    { name: "twitter:card", content: opts.image ? "summary_large_image" : "summary" },
    { name: "twitter:title", content: full },
    { name: "twitter:description", content: description },
  ];
  if (url) meta.push({ property: "og:url", content: url });
  if (opts.image) meta.push({ property: "og:image", content: opts.image }, { name: "twitter:image", content: opts.image });
  return { meta, links: url ? [{ rel: "canonical", href: url }] : [] };
}

const SCHEMA_TYPE: Record<string, string> = {
  salons: "BeautySalon",
  barbers: "HairSalon",
  spas: "DaySpa",
  clinics: "MedicalClinic",
};
const DAY_CODES = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

/** schema.org openingHours strings, only when every entry is verified and parses cleanly. */
export function openingHoursSpec(b: Business): string[] | undefined {
  if (!b.hours?.length || !b.hoursVerified) return undefined;
  const out: string[] = [];
  for (const h of b.hours) {
    const days = parseDays(h.days);
    const r = parseRange(h.time);
    if (!days || !r || r === "closed") return undefined;
    const fmt = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
    const d = days.length === 7 ? "Mo-Su" : days.length === 1 ? DAY_CODES[days[0]!] : `${DAY_CODES[days[0]!]}-${DAY_CODES[days[days.length - 1]!]}`;
    out.push(`${d} ${fmt(r[0])}-${fmt(r[1])}`);
  }
  return out;
}

/** LocalBusiness JSON-LD built only from recorded fields; nothing is filled in. */
export function businessJsonLd(b: Business): Record<string, unknown> {
  const area = getArea(b.area);
  const ld: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": SCHEMA_TYPE[b.category] ?? "LocalBusiness",
    name: b.name,
    "@id": `${SITE_URL}/s/${b.slug}`,
  };
  if (b.address || area) {
    ld["address"] = {
      "@type": "PostalAddress",
      ...(b.address ? { streetAddress: b.address } : {}),
      ...(area ? { addressLocality: area.name, addressRegion: area.city } : {}),
      addressCountry: "NP",
    };
  }
  if (b.phone) ld["telephone"] = `+${intlDigits(b.phone)}`;
  if (websiteButton(b)) ld["url"] = b.website;
  const oh = openingHoursSpec(b);
  if (oh) ld["openingHours"] = oh;
  if (b.cover) ld["image"] = b.cover.url;
  return ld;
}
