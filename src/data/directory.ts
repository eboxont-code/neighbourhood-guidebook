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
  cover?: { url: string; credit: string }; // only photos the business published
}

export const categories: Category[] = [
  { slug: "salons", name: "Salons", nameNe: "सैलुन" },
  { slug: "barbers", name: "Barbers", nameNe: "हजाम" },
  { slug: "spas", name: "Spas", nameNe: "स्पा" },
  { slug: "salon-and-spa", name: "Salon and spa", nameNe: "सैलुन र स्पा" },
  { slug: "clinics", name: "Clinics", nameNe: "क्लिनिक" },
];

export const areas: Area[] = [
  { slug: "durbar-marg", name: "Durbar Marg", city: "Kathmandu" },
  { slug: "naxal", name: "Naxal", city: "Kathmandu" },
  { slug: "kamaladi", name: "Kamaladi", city: "Kathmandu" },
  { slug: "baluwatar", name: "Baluwatar", city: "Kathmandu" },
  { slug: "boudha", name: "Boudha", city: "Kathmandu" },
  { slug: "thamel", name: "Thamel", city: "Kathmandu" },
  { slug: "lazimpat", name: "Lazimpat", city: "Kathmandu" },
  { slug: "kathmandu", name: "Kathmandu", city: "Kathmandu" },
];

const CHECKED = "2026-10-11";
const base = { services: [], verification: "source_checked" as Verification, demo: false };

export const businesses: Business[] = [
  { ...base, id: "b1", slug: "aavaran-durbar-marg", cover: { url: "https://www.aavaranskin.com/uploaded_images/seo/aavaran-skin-clinic-225940.JPG", credit: "aavaranskin.com" }, name: "Aavaran Skin & Hair Clinic", category: "clinics", area: "durbar-marg",
    phone: "9802323990", website: "https://www.aavaranskin.com", websiteStatus: "working", lastChecked: CHECKED, sourceNotes: "aavaranskin.com" },
  { ...base, id: "b2", slug: "the-new-barber-durbar-marg", name: "The New Barber, Durbar Marg branch", category: "barbers", area: "durbar-marg",
    phone: "01-5367872", websiteStatus: "failed", lastChecked: CHECKED,
    hours: [{ days: "Open", time: "From 10:00, last booking 18:00" }], sourceNotes: "Instagram thenewbarber.nepal" },
  { ...base, id: "b3", slug: "femina-flaunt-naxal", name: "Femina Flaunt Studio Salon", category: "salons", area: "naxal",
    address: "1st Floor, Shrestha Tower, Nagpokhari Marg, Naxal, Kathmandu", phone: "01-4545676", websiteStatus: "not_checked",
    hours: [{ days: "Every day", time: "11:00–19:00" }], sourceNotes: "Instagram femina_flaunt_nepal" },
  { ...base, id: "b4", slug: "toni-and-guy-durbar-mall", name: "TONI&GUY Nepal", category: "salons", area: "durbar-marg",
    address: "3rd Floor, Durbar Mall, Durbar Marg, Kathmandu", phone: "9851088880", websiteStatus: "not_checked", sourceNotes: "Instagram toniandguynepal" },
  { ...base, id: "b5", slug: "munney-durbar-marg", name: "Munney Salon, Durbar Marg", category: "salons", area: "durbar-marg",
    phone: "9819412614", websiteStatus: "not_checked", hours: [{ days: "Open", time: "10:00–20:00" }], sourceNotes: "Instagram munney_salon" },
  { ...base, id: "b6", slug: "tranquility-spa", cover: { url: "https://www.tranquilityspa.com.np/uploads/images/galleries/03534099-dc1e-46d4-b007-0a62f39a0cf9.jpg", credit: "tranquilityspa.com.np" }, name: "Tranquility Spa", category: "spas", area: "kathmandu",
    phone: "9802021285", website: "https://www.tranquilityspa.com.np", websiteStatus: "working", lastChecked: CHECKED,
    description: "Nepal’s largest spa chain, recognised by the Nepal Tourism Board.", sourceNotes: "tranquilityspa.com.np" },
  { ...base, id: "b7", slug: "plush-kamaladi", name: "Plush Unisex Salon", category: "salons", area: "kamaladi",
    address: "Kamaladi, near Kathmandu Plaza, Kathmandu", phone: "9808428150", websiteStatus: "not_checked",
    hours: [{ days: "Open", time: "10:00–20:00" }], description: "They posted a move toward Lazimpat in 2026.",
    sourceNotes: "Plush Salon & Makeup Academy Facebook" },
  { ...base, id: "b8", slug: "deezy-cuts-baluwatar", name: "Deezy Cuts", category: "barbers", area: "baluwatar",
    phone: "9704549439", websiteStatus: "not_checked", hours: [{ days: "Open", time: "08:00–20:00" }], sourceNotes: "TikTok deezycuts.np" },
  { ...base, id: "b9", slug: "serene-durbar-marg", name: "Serene Salon & Spa", category: "salon-and-spa", area: "durbar-marg",
    address: "Yak & Yeti Lane, Durbar Marg, Kathmandu", phone: "01-5322702", websiteStatus: "not_checked",
    sourceNotes: "Instagram serenewellnessnepal and their Facebook page" },
  { ...base, id: "b10", slug: "club-oasis-hyatt", name: "Club Oasis, Hyatt Regency Kathmandu", category: "spas", area: "boudha",
    address: "Hyatt Regency Kathmandu, Taragaon, Boudha, Kathmandu", phone: "01-5171234",
    website: "https://www.hyatt.com/hyatt-regency/en-US/kathm-hyatt-regency-kathmandu", websiteStatus: "not_checked",
    description: "Spa bookings go through the hotel.", sourceNotes: "Hyatt Regency Kathmandu official contact" },
  { ...base, id: "b11", slug: "lavish-durbar-marg", name: "Lavish Salon & Academy", category: "salons", area: "durbar-marg",
    address: "Hitipokhari, Durbar Marg, Kathmandu", phone: "01-4542030", websiteStatus: "not_checked", sourceNotes: "Instagram lavishsalon.np" },
  { ...base, id: "b12", slug: "nuad-thai-lazimpat", name: "Nuad Thai Spa, Panipokhari", category: "spas", area: "lazimpat",
    address: "Panipokhari, Lazimpat, Kathmandu", phone: "01-4002808", websiteStatus: "not_checked", sourceNotes: "Instagram nuadthaispa.nepal" },
  { ...base, id: "b13", slug: "kathmandu-spa-thamel", cover: { url: "https://www.kathmanduspa.com.np/wp-content/uploads/2019/12/Massage-therapy-e1575457181795.jpg", credit: "kathmanduspa.com.np" }, name: "Kathmandu Spa", category: "spas", area: "thamel",
    address: "Bhagawati Marg, Thamel, Kathmandu", phone: "01-4522661", website: "https://kathmanduspa.com.np", websiteStatus: "not_checked",
    sourceNotes: "Facebook Kathmandu Spa Pvt. Ltd." },
  { ...base, id: "b14", slug: "kaya-healing-thamel", name: "Kaya Healing Spa", category: "spas", area: "thamel",
    address: "Hotel Northfield, Chaksibari Marg, Thamel, Kathmandu", phone: "9803038823", website: "https://www.kayaspa.com.np",
    websiteStatus: "not_checked", sourceNotes: "Instagram kayaspa.thamel" },
  { ...base, id: "b15", slug: "crest-club-lazimpat", name: "Crest Club and Spa", category: "spas", area: "lazimpat",
    address: "Dusit Princess Kathmandu, Lazimpat, Kathmandu", phone: "9802352729", websiteStatus: "not_checked", sourceNotes: "Instagram crestclubandspa" },
  { ...base, id: "b16", slug: "the-new-barber-thamel", name: "The New Barber, Thamel branch", category: "barbers", area: "thamel",
    phone: "01-5908499", websiteStatus: "not_checked", hours: [{ days: "Open", time: "From 10:00, last booking 18:00" }],
    description: "Same brand as the Durbar Marg shop, different branch.", sourceNotes: "Instagram thenewbarber.nepal" },
  { ...base, id: "b17", slug: "the-new-barber-boudha", name: "The New Barber, Boudha branch", category: "barbers", area: "boudha",
    phone: "01-4567713", websiteStatus: "not_checked", hours: [{ days: "Open", time: "From 10:00, last booking 18:00" }],
    description: "Same brand as the Durbar Marg shop, different branch.", sourceNotes: "Instagram thenewbarber.nepal" },
  { ...base, id: "b18", slug: "bliss-sakil-durbar-marg", name: "Bliss by Sakil Kunwar", category: "salons", area: "durbar-marg",
    address: "Level 2, Durbar Marg, Kathmandu", phone: "01-5339065", websiteStatus: "not_checked",
    hours: [{ days: "Open", time: "10:00–20:00" }], sourceNotes: "Sakil Kunwar Facebook page" },
  { ...base, id: "b19", slug: "annapurna-salon-durbar-marg", name: "Annapurna Salon & Spa", category: "salon-and-spa", area: "durbar-marg",
    address: "3rd Floor, Annapurna Arcade, Durbar Marg, Kathmandu", phone: "9818981221", website: "https://annapurnasalon.com.np",
    websiteStatus: "not_checked", hours: [{ days: "Sunday to Saturday", time: "9:30–19:00" }],
    sourceNotes: "annapurnasalon.com.np/contact-us.html" },
  { ...base, id: "b20", slug: "hair-n-shanti-kamaladi", name: "Hair n Shanti, Kamaladi", category: "salons", area: "durbar-marg",
    address: "Siddhartha Complex, Kamaladi, Durbar Marg, Kathmandu", phone: "+97714428463", website: "https://hairnshantinepal.com",
    websiteStatus: "not_checked", sourceNotes: "hairnshantinepal.com/contacts" },
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
export const telLink = (p: string) => `tel:${p}`;
