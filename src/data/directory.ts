export type WebsiteStatus =
  | "working"
  | "failed"
  | "owner_no_site"
  | "none_found"
  | "not_checked";
export type Verification = "not_verified" | "source_checked" | "business_confirmed";

export interface Category { slug: string; name: string; nameNe: string }
export interface Area { slug: string; name: string; city: string }

export interface Business {
  id: string;
  slug: string;
  name: string;
  category: string; // category slug
  area: string; // area slug
  address?: string;
  phone?: string;
  whatsapp?: string;
  website?: string;
  websiteStatus: WebsiteStatus;
  description?: string;
  services: { name: string; price?: string }[];
  hours?: { days: string; time: string }[];
  sourceNotes: string;
  verification: Verification;
  lastChecked?: string; // ISO date, only when a check happened
  demo: boolean;
}

export const categories: Category[] = [
  { slug: "salons", name: "Salons", nameNe: "सैलुन" },
  { slug: "barbers", name: "Barbers", nameNe: "हजाम" },
  { slug: "pharmacies", name: "Pharmacies", nameNe: "औषधि पसल" },
  { slug: "tailors", name: "Tailors", nameNe: "सिलाई पसल" },
];

export const areas: Area[] = [
  { slug: "new-baneshwor", name: "New Baneshwor", city: "Kathmandu" },
  { slug: "koteshwor", name: "Koteshwor", city: "Kathmandu" },
  { slug: "thamel", name: "Thamel", city: "Kathmandu" },
];

export const businesses: Business[] = [
  {
    id: "b1", slug: "example-lotus-salon", name: "Example Lotus Salon", category: "salons", area: "new-baneshwor",
    address: "Sample Marg 1, New Baneshwor, Kathmandu", phone: "+977 1 5550101", whatsapp: "9779800000001",
    website: "https://example.com", websiteStatus: "working",
    description: "A fictional salon used to show how a listing looks.",
    services: [{ name: "Haircut" }, { name: "Hair colouring" }, { name: "Threading" }],
    hours: [{ days: "Sun–Fri", time: "9:00–19:00" }, { days: "Sat", time: "Closed" }],
    sourceNotes: "Invented for this prototype.", verification: "source_checked", lastChecked: "2026-09-20", demo: true,
  },
  {
    id: "b2", slug: "sample-sharp-barbers", name: "Sample Sharp Barbers", category: "barbers", area: "new-baneshwor",
    phone: "+977 1 5550102", websiteStatus: "owner_no_site",
    services: [{ name: "Haircut" }, { name: "Beard trim" }, { name: "Shave" }],
    hours: [{ days: "Daily", time: "8:00–20:00" }],
    sourceNotes: "Invented for this prototype.", verification: "business_confirmed", lastChecked: "2026-09-28", demo: true,
  },
  {
    id: "b3", slug: "demo-himal-pharmacy", name: "Demo Himal Pharmacy", category: "pharmacies", area: "new-baneshwor",
    address: "Sample Chowk 4, New Baneshwor, Kathmandu", phone: "+977 1 5550103",
    website: "https://example.org", websiteStatus: "failed",
    description: "A fictional pharmacy for the prototype.",
    services: [{ name: "Prescriptions" }, { name: "Blood pressure check" }],
    sourceNotes: "Invented for this prototype.", verification: "not_verified", lastChecked: "2026-10-02", demo: true,
  },
  {
    id: "b4", slug: "placeholder-stitch-tailors", name: "Placeholder Stitch Tailors", category: "tailors", area: "koteshwor",
    whatsapp: "9779800000004", websiteStatus: "none_found",
    services: [{ name: "Alterations" }, { name: "Kurta stitching" }],
    hours: [{ days: "Sun–Fri", time: "10:00–18:00" }],
    sourceNotes: "Invented for this prototype.", verification: "not_verified", demo: true,
  },
  {
    id: "b5", slug: "fictional-glow-studio", name: "Fictional Glow Studio", category: "salons", area: "koteshwor",
    phone: "+977 1 5550105", websiteStatus: "not_checked", services: [],
    sourceNotes: "Invented for this prototype.", verification: "not_verified", demo: true,
  },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
export const getBusiness = (slug: string) => businesses.find((b) => b.slug === slug);

export const categoriesInUse = () => categories.filter((c) => businesses.some((b) => b.category === c.slug));
export const areasInUse = () => areas.filter((a) => businesses.some((b) => b.area === a.slug));

export function searchBusinesses(query: string): Business[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return businesses.filter((b) => {
    const cat = getCategory(b.category);
    const area = getArea(b.area);
    const hay = [b.name, cat?.name, cat?.nameNe, area?.name, ...b.services.map((x) => x.name)].join(" ").toLowerCase();
    return q.split(/\s+/).every((w) => hay.includes(w));
  });
}

export function formatDate(iso: string) {
  return new Date(iso + "T00:00:00Z").toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export function websiteStatusSentence(b: Business, lang: "en" | "ne" = "en"): string {
  const d = b.lastChecked ? formatDate(b.lastChecked) : "";
  const en: Record<WebsiteStatus, string> = {
    working: `Website checked and working on ${d}.`,
    failed: `Website check failed on ${d}.`,
    owner_no_site: "The owner says the business has no website.",
    none_found: "No official website was found.",
    not_checked: "Website not checked yet.",
  };
  const ne: Record<WebsiteStatus, string> = {
    working: `वेबसाइट ${d} मा जाँच गरियो र चल्छ।`,
    failed: `वेबसाइट जाँच ${d} मा असफल भयो।`,
    owner_no_site: "मालिकका अनुसार वेबसाइट छैन।",
    none_found: "आधिकारिक वेबसाइट भेटिएन।",
    not_checked: "वेबसाइट अझै जाँच गरिएको छैन।",
  };
  let s = (lang === "ne" ? ne : en)[b.websiteStatus];
  if ((b.websiteStatus === "working" || b.websiteStatus === "failed") && !d) {
    s = lang === "ne" ? (b.websiteStatus === "working" ? "वेबसाइट चल्छ।" : "वेबसाइट जाँच असफल भयो।") : (b.websiteStatus === "working" ? "Website checked and working." : "Last website check failed.");
  }
  return s;
}

export const whatsappLink = (n: string) =>
  `https://wa.me/${n.replace(/\D/g, "")}?text=${encodeURIComponent("Hello, I found you on the directory.")}`;
export const mapsLink = (addr: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
export const telLink = (p: string) => `tel:${p.replace(/[^\d+]/g, "")}`;
