export type WebsiteStatus =
  | "working"
  | "failed"
  | "owner_no_site"
  | "none_found"
  | "not_checked";
export type Verification = "not_verified" | "source_checked" | "business_confirmed";

export interface Category { slug: string; name: string; nameNe: string }
export interface City { slug: string; name: string; nameNe: string }
export interface Area { slug: string; name: string; city: string } // city slug

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
  hoursSource?: string; // where the hours came from
  hoursVerified?: boolean; // true only when the hours come from the shop's own page or post
  otherPhones?: { number: string; note?: "fromOtherListings" }[];
  social?: string[]; // "Platform handle", e.g. "Instagram name"
  directions?: string; // Google Maps link; falls back to the address
  sourceNotes: string;
  verification: Verification;
  lastChecked?: string; // ISO date, only when a check happened
  demo: boolean;
  cover?: { url: string; credit: string }; // only photos the business published
  sourceUrl?: string;
  lat?: number; // only from a reliable source; never guessed
  lng?: number;
}

/** Adding a city is a data-only change: add it here, then its areas and listings. */
export const cities: City[] = [
  { slug: "kathmandu", name: "Kathmandu", nameNe: "काठमाडौं" },
];

export const categories: Category[] = [
  { slug: "salons", name: "Salons", nameNe: "सैलुन" },
  { slug: "barbers", name: "Barbers", nameNe: "हजाम" },
  { slug: "spas", name: "Spas", nameNe: "स्पा" },
  { slug: "clinics", name: "Clinics", nameNe: "क्लिनिक" },
  { slug: "cafes", name: "Cafés", nameNe: "क्याफे" },
  { slug: "restaurants", name: "Restaurants", nameNe: "रेस्टुरेन्ट" },
  { slug: "gyms", name: "Gyms", nameNe: "जिम" },
  { slug: "hotels", name: "Hotels", nameNe: "होटल" },
];

export const areas: Area[] = [
  { slug: "durbar-marg", name: "Durbar Marg", city: "kathmandu" },
  { slug: "naxal", name: "Naxal", city: "kathmandu" },
  { slug: "kamaladi", name: "Kamaladi", city: "kathmandu" },
  { slug: "baluwatar", name: "Baluwatar", city: "kathmandu" },
  { slug: "boudha", name: "Boudha", city: "kathmandu" },
  { slug: "thamel", name: "Thamel", city: "kathmandu" },
  { slug: "lazimpat", name: "Lazimpat", city: "kathmandu" },
];

const CHECKED = "2026-10-11";
const base = { services: [], verification: "source_checked" as Verification, demo: false };

export const businesses: Business[] = [
  { ...base, id: "b1", slug: "aavaran-durbar-marg", cover: { url: "https://www.aavaranskin.com/uploaded_images/seo/aavaran-skin-clinic-225940.JPG", credit: "aavaranskin.com" },
    name: "Aavaran Skin & Hair Clinic", category: "clinics", area: "durbar-marg", address: "Durbar Marg, next to ANTA showroom, Kathmandu",
    phone: "9802323990", website: "https://www.aavaranskin.com", websiteStatus: "working", lastChecked: CHECKED,
    hours: [{ days: "Sun–Fri", time: "11:00–19:00" }, { days: "Sat", time: "11:00–18:00" }], hoursSource: "their own about page", hoursVerified: true,
    social: ["Facebook aavaranclinic", "TikTok @aavaranskinclinic", "YouTube @aavaranskinhairclinic833"],
    directions: "https://www.google.com/maps/search/?api=1&query=Aavaran+Skin+Hair+Clinic+Durbar+Marg+Kathmandu", sourceNotes: "Their own website" },
  { ...base, id: "b2", slug: "the-new-barber-durbar-marg", name: "The New Barber, Durbar Marg branch", category: "barbers", area: "durbar-marg",
    address: "Durbar Marg, Kathmandu", phone: "01-5367872", website: "https://www.thenewbarber.com.np", websiteStatus: "failed", lastChecked: CHECKED,
    hours: [{ days: "Every day", time: "From 10:00, last booking 18:00" }], hoursSource: "their post", hoursVerified: true,
    social: ["Instagram thenewbarber.nepal", "Facebook thenewbarber.nepal"],
    directions: "https://www.google.com/maps/search/?api=1&query=The+New+Barber+Durbar+Marg+Kathmandu", sourceNotes: "Their Instagram" },
  { ...base, id: "b3", slug: "femina-flaunt-naxal", name: "Femina Flaunt Studio Salon", category: "salons", area: "naxal",
    address: "1st Floor, Shrestha Tower, Nagpokhari Marg, Naxal, Kathmandu", phone: "01-4545676", websiteStatus: "none_found",
    hours: [{ days: "Every day", time: "11:00–19:00" }], hoursSource: "their Instagram", hoursVerified: true, social: ["Instagram femina_flaunt_nepal"],
    directions: "https://www.google.com/maps/search/?api=1&query=Femina+Flaunt+Salon+Naxal+Kathmandu", sourceNotes: "Their Instagram" },
  { ...base, id: "b4", slug: "toni-and-guy-durbar-mall", name: "TONI&GUY Nepal", category: "salons", area: "durbar-marg",
    address: "3rd Floor, Durbar Mall, Durbar Marg, Kathmandu", phone: "9851088880", websiteStatus: "none_found",
    hours: [{ days: "Every day", time: "10:00–19:00" }], hoursSource: "the global TONI&GUY Kathmandu page", hoursVerified: false,
    social: ["Instagram toniandguynepal", "Facebook toniandguynepal"],
    directions: "https://www.google.com/maps/search/?api=1&query=TONI+and+GUY+Durbar+Mall+Kathmandu", sourceNotes: "Their Instagram" },
  { ...base, id: "b5", slug: "munney-durbar-marg", name: "Munney Salon, Durbar Marg", category: "salons", area: "durbar-marg",
    address: "Durbar Marg, Kathmandu", phone: "9819412614", website: "https://munneysalon.com", websiteStatus: "not_checked",
    hours: [{ days: "", time: "10:00–20:00" }], hoursSource: "their Instagram", hoursVerified: true,
    social: ["Instagram munney_salon", "Facebook munneysalondurbarmarg", "TikTok @munneysalon"],
    directions: "https://www.google.com/maps/search/?api=1&query=Munney+Salon+Durbar+Marg+Kathmandu", sourceNotes: "Their Instagram; website as listed on their Facebook" },
  { ...base, id: "b6", slug: "tranquility-spa", cover: { url: "https://www.tranquilityspa.com.np/uploads/images/galleries/03534099-dc1e-46d4-b007-0a62f39a0cf9.jpg", credit: "tranquilityspa.com.np" },
    name: "Tranquility Spa", category: "spas", area: "lazimpat", address: "Lazimpat Road, opposite MBL Tower, Kathmandu (one of several branches)",
    phone: "9802021285", otherPhones: [{ number: "01-4425386", note: "fromOtherListings" }, { number: "01-5318396", note: "fromOtherListings" }],
    website: "https://www.tranquilityspa.com.np", websiteStatus: "working", lastChecked: CHECKED,
    hours: [{ days: "Every day", time: "08:00–21:00" }], hoursSource: "one directory listing", hoursVerified: false,
    
    description: "Nepal’s largest spa chain, recognised by the Nepal Tourism Board.",
    directions: "https://www.google.com/maps/search/?api=1&query=Tranquility+Spa+Kathmandu", sourceNotes: "Their own website" },
  { ...base, id: "b7", slug: "plush-lazimpat", name: "Plush Unisex Salon", category: "salons", area: "lazimpat",
    address: "Lazimpat, near Radisson, Kathmandu", phone: "9808428150", otherPhones: [{ number: "01-4168710" }],
    website: "https://plushsalon.com.np", websiteStatus: "not_checked",
    hours: [{ days: "Every day", time: "10:00–20:00" }], hoursSource: "their post", hoursVerified: true,
    social: ["Instagram plush_unisex_salon_np", "Facebook plushktm"],
    description: "Was in Kamaladi, near Kathmandu Plaza. They posted a move to Lazimpat near Radisson from 17 June 2026.",
    directions: "https://www.google.com/maps/search/?api=1&query=Plush+Unisex+Salon+Kathmandu", sourceNotes: "Their Facebook page (Plush Salon & Makeup Academy); website as listed there" },
  { ...base, id: "b8", slug: "deezy-cuts-baluwatar", name: "Deezy Cuts", category: "barbers", area: "baluwatar",
    phone: "9704549439", websiteStatus: "none_found",
    hours: [{ days: "", time: "08:00–20:00" }], hoursSource: "an earlier TikTok post", hoursVerified: true, social: ["TikTok deezycuts.np"],
    directions: "https://www.google.com/maps/search/?api=1&query=Deezy+Cuts+Baluwatar+Kathmandu", sourceNotes: "Their TikTok" },
  { ...base, id: "b9", slug: "serene-durbar-marg", name: "Serene Salon & Spa", category: "salons", area: "durbar-marg",
    address: "Yak & Yeti Lane, Durbar Marg, Kathmandu", phone: "01-5322702", otherPhones: [{ number: "9802335552" }], websiteStatus: "none_found",
    hours: [{ days: "Every day", time: "09:00–22:00" }], hoursSource: "a directory listing", hoursVerified: false,
    social: ["Instagram serenewellnessnepal", "Facebook serenewellnessnepal"],
    directions: "https://www.google.com/maps/search/?api=1&query=Serene+Salon+Spa+Yak+Yeti+Lane+Durbar+Marg", sourceNotes: "Their Instagram and Facebook page" },
  { ...base, id: "b10", slug: "club-oasis-hyatt", lat: 27.7220039, lng: 85.3568175, name: "Club Oasis, Hyatt Regency Kathmandu", category: "spas", area: "boudha",
    address: "Hyatt Regency Kathmandu, Taragaon, Boudha, Kathmandu", phone: "01-5171234",
    website: "https://www.hyatt.com/hyatt-regency/en-US/kathm-hyatt-regency-kathmandu", websiteStatus: "not_checked", 
    description: "Spa bookings go through the hotel. The phone is the hotel's number.",
    directions: "https://www.google.com/maps/search/?api=1&query=Hyatt+Regency+Kathmandu+Club+Oasis", sourceNotes: "The hotel's official contact page" },
  { ...base, id: "b11", slug: "lavish-durbar-marg", name: "Lavish Salon & Academy", category: "salons", area: "durbar-marg",
    address: "Hitipokhari, Durbar Marg, Kathmandu", phone: "01-4542030", otherPhones: [{ number: "9808018075" }], websiteStatus: "none_found",
    social: ["Instagram lavishsalon.np"], directions: "https://www.google.com/maps/search/?api=1&query=Lavish+Salon+Academy+Durbar+Marg", sourceNotes: "Their Instagram" },
  { ...base, id: "b12", slug: "nuad-thai-lazimpat", lat: 27.7284896, lng: 85.3250871, name: "Nuad Thai Spa, Panipokhari", category: "spas", area: "lazimpat",
    address: "Panipokhari, Lazimpat, Kathmandu", phone: "01-4002808", websiteStatus: "none_found", social: ["Instagram nuadthaispa.nepal"],
    directions: "https://www.google.com/maps/search/?api=1&query=Nuad+Thai+Spa+Panipokhari+Lazimpat", sourceNotes: "Their Instagram" },
  { ...base, id: "b13", slug: "kathmandu-spa-thamel", lat: 27.716144, lng: 85.3110464,
    name: "Kathmandu Spa", category: "spas", area: "thamel", address: "Bhagawati Marg, Thamel, Kathmandu", phone: "01-4522661",
    website: "https://kathmanduspa.com.np", websiteStatus: "not_checked", social: ["Facebook kathmanduspa"],
    directions: "https://www.google.com/maps/search/?api=1&query=Kathmandu+Spa+Thamel", sourceNotes: "Their Facebook page (Kathmandu Spa Pvt. Ltd.)" },
  { ...base, id: "b14", slug: "kaya-healing-thamel", lat: 27.7158128, lng: 85.3103243, name: "Kaya Healing Spa", category: "spas", area: "thamel",
    address: "Hotel Northfield, Chaksibari Marg, Thamel, Kathmandu", phone: "9803038823", otherPhones: [{ number: "01-5355882" }],
    website: "https://www.kayaspa.com.np", websiteStatus: "failed", social: ["Instagram kayaspa.thamel"],
    directions: "https://www.google.com/maps/search/?api=1&query=Kaya+Healing+Spa+Thamel", sourceNotes: "Their Instagram" },
  { ...base, id: "b15", slug: "crest-club-lazimpat", lat: 27.719318, lng: 85.3206915, name: "Crest Club and Spa", category: "spas", area: "lazimpat",
    address: "Dusit Princess Kathmandu, Lazimpat, Kathmandu", phone: "9802352729", websiteStatus: "none_found", social: ["Instagram crestclubandspa"],
    directions: "https://www.google.com/maps/search/?api=1&query=Crest+Club+Spa+Dusit+Princess+Lazimpat", sourceNotes: "Their Instagram" },
  { ...base, id: "b16", slug: "the-new-barber-thamel", name: "The New Barber, Thamel branch", category: "barbers", area: "thamel",
    address: "Thamel, Kathmandu", phone: "01-5908499", websiteStatus: "not_checked",
    hours: [{ days: "Every day", time: "From 10:00, last booking 18:00" }], hoursSource: "their post", hoursVerified: true,
    social: ["Instagram thenewbarber.nepal"], description: "Same brand as the Durbar Marg shop, different branch.",
    directions: "https://www.google.com/maps/search/?api=1&query=The+New+Barber+Thamel+Kathmandu", sourceNotes: "Their Instagram" },
  { ...base, id: "b17", slug: "the-new-barber-boudha", name: "The New Barber, Boudha branch", category: "barbers", area: "boudha",
    address: "Boudha, Kathmandu", phone: "01-4567713", websiteStatus: "not_checked",
    hours: [{ days: "Every day", time: "From 10:00, last booking 18:00" }], hoursSource: "their post", hoursVerified: true,
    social: ["Instagram thenewbarber.nepal"], description: "Same brand as the Durbar Marg shop, different branch.",
    directions: "https://www.google.com/maps/search/?api=1&query=The+New+Barber+Boudha+Kathmandu", sourceNotes: "Their Instagram" },
  { ...base, id: "b18", slug: "bliss-sakil-durbar-marg", name: "Bliss by Sakil Kunwar", category: "salons", area: "durbar-marg",
    address: "Level 2, Durbar Marg, Kathmandu", phone: "01-5339065", websiteStatus: "none_found",
    hours: [{ days: "", time: "10:00–20:00" }], hoursSource: "his page", hoursVerified: true, social: ["Facebook collage.sakil"],
    directions: "https://www.google.com/maps/search/?api=1&query=Bliss+by+Sakil+Kunwar+Durbar+Marg", sourceNotes: "Sakil Kunwar's Facebook page" },
  { ...base, id: "b19", slug: "annapurna-salon-durbar-marg", name: "Annapurna Salon & Spa", category: "salons", area: "durbar-marg",
    address: "3rd Floor, Annapurna Arcade, Durbar Marg, Kathmandu", phone: "9818981221", website: "https://annapurnasalon.com.np",
    websiteStatus: "not_checked", hours: [{ days: "Sunday to Saturday", time: "9:30–19:00" }], hoursSource: "their own contact page", hoursVerified: true,
    sourceNotes: "Their own website (contact page)" },
  { ...base, id: "b20", slug: "hair-n-shanti-kamaladi", name: "Hair n Shanti, Kamaladi", category: "salons", area: "kamaladi",
    address: "Siddhartha Complex, Kamaladi, Durbar Marg, Kathmandu", phone: "01-4428463", website: "https://hairnshantinepal.com",
    websiteStatus: "not_checked", sourceNotes: "Their own website (contacts page)" },
  // Stage 3: cafés, restaurants, gyms and hotels, as researched and supplied.
  { ...base, id: "b21", slug: "himalayan-java-mandala-street", name: "Himalayan Java Coffee, Mandala Street", category: "cafes", area: "thamel",
    address: "Mandala Street, Thamel, Kathmandu", phone: "01-4700627", website: "https://himalayanjava.com", websiteStatus: "working", lastChecked: CHECKED,
    lat: 27.7149490, lng: 85.3109555, sourceNotes: "Their own website (Mandala Street branch page)", sourceUrl: "https://himalayanjava.com/locations/mandala-street/" },
  { ...base, id: "b22", slug: "himalayan-java-lazimpat", name: "Himalayan Java Coffee, Lazimpat", category: "cafes", area: "lazimpat",
    address: "Bhanu Memorial Marg, Lazimpat, Kathmandu", phone: "01-4538305", website: "https://himalayanjava.com", websiteStatus: "working", lastChecked: CHECKED,
    sourceNotes: "Their own website (Lazimpat branch page)", sourceUrl: "https://himalayanjava.com/locations/lazimpat/" },
  { ...base, id: "b23", slug: "caffeophilia-durbar-marg", name: "Caffeophilia, Durbar Marg", category: "cafes", area: "durbar-marg",
    address: "Lal Durbar Marg, Durbar Marg, Kathmandu", phone: "9709420430", website: "https://caffeophilia.com", websiteStatus: "working", lastChecked: CHECKED,
    sourceNotes: "Their own website (locations page)", sourceUrl: "https://caffeophilia.com/locations" },
  { ...base, id: "b24", slug: "filli-cafe-lazimpat", name: "FiLLi Cafe, Lazimpat", category: "cafes", area: "lazimpat",
    address: "Lazimpat Road, Kathmandu", phone: "9820105007", website: "https://fillicafe.com", websiteStatus: "working", lastChecked: CHECKED,
    hours: [{ days: "Every day", time: "07:00–22:00" }], hoursSource: "their own store page", hoursVerified: true,
    sourceNotes: "Their own website (Lazimpat store page)", sourceUrl: "https://fillicafe.com/np/stores/kathmandu/lazimpat-kathmandu" },
  { ...base, id: "b25", slug: "peedee-beans-boudha", name: "PeeDee Beans Coffee", category: "cafes", area: "boudha",
    address: "Boudha Stupa, Kathmandu", phone: "9860671298", website: "https://peedeebeans.com", websiteStatus: "working", lastChecked: CHECKED,
    hours: [{ days: "Every day", time: "06:00–22:30" }], hoursSource: "their own website", hoursVerified: true,
    lat: 27.7210506, lng: 85.3624124, sourceNotes: "Their own website", sourceUrl: "https://peedeebeans.com/" },
  { ...base, id: "b26", slug: "roadhouse-cafe-thamel", name: "Roadhouse Cafe, Thamel", category: "restaurants", area: "thamel",
    address: "Thamel, Kathmandu", phone: "01-5367885", otherPhones: [{ number: "9863029293" }], website: "https://www.roadhousenepal.com", websiteStatus: "working", lastChecked: CHECKED,
    sourceNotes: "Their own website (Thamel page)", sourceUrl: "https://www.roadhousenepal.com/restaurants/thamel" },
  { ...base, id: "b27", slug: "roadhouse-cafe-boudha", name: "Roadhouse Cafe, Boudha", category: "restaurants", area: "boudha",
    address: "Boudha Stupa circle, Kathmandu", phone: "01-4916446", otherPhones: [{ number: "9863029297" }], website: "https://www.roadhousenepal.com", websiteStatus: "working", lastChecked: CHECKED,
    lat: 27.7209107, lng: 85.3619714, sourceNotes: "Their own website (Boudha page)", sourceUrl: "https://www.roadhousenepal.com/restaurants/boudha" },
  { ...base, id: "b28", slug: "mezze-by-roadhouse-durbar-marg", name: "Mezze by Roadhouse", category: "restaurants", area: "durbar-marg",
    address: "Rooftop, Durbar Marg, Kathmandu", phone: "01-5323087", otherPhones: [{ number: "9843737736" }], website: "https://www.roadhousenepal.com", websiteStatus: "working", lastChecked: CHECKED,
    lat: 27.7128231, lng: 85.3175004, sourceNotes: "Their own website (Mezze page)", sourceUrl: "https://www.roadhousenepal.com/restaurants/mezze" },
  { ...base, id: "b29", slug: "or2k-thamel", name: "OR2K", category: "restaurants", area: "thamel",
    address: "Mandala Street, Thamel, Kathmandu", phone: "01-4422097", website: "https://www.or2k.com", websiteStatus: "failed", lastChecked: CHECKED,
    lat: 27.7148007, lng: 85.3110168, sourceNotes: "Two directory listings (Trip.com, Yellow Pages Nepal); their website did not load when checked", sourceUrl: "https://www.yellowpagesnepal.com/or2k-restaurant" },
  { ...base, id: "b30", slug: "wellness-organic-club-lazimpat", name: "Wellness Organic Club", category: "gyms", area: "lazimpat",
    address: "Metropark Building, 5th floor, Uttar Dhoka, Lazimpat, Kathmandu", phone: "01-4005126", otherPhones: [{ number: "01-4005127" }],
    website: "https://wellnessorganicclub.com", websiteStatus: "working", lastChecked: CHECKED,
    hours: [{ days: "Every day", time: "06:00–21:00" }], hoursSource: "their own website", hoursVerified: true,
    lat: 27.7183528, lng: 85.3189239, sourceNotes: "Their own website (gym page)", sourceUrl: "https://wellnessorganicclub.com/gym/" },
  { ...base, id: "b31", slug: "fitness-studio-nepal-lazimpat", name: "Fitness Studio Nepal", category: "gyms", area: "lazimpat",
    address: "Uttar Dhoka, Lazimpat, Kathmandu", phone: "01-4005040", websiteStatus: "none_found",
    sourceNotes: "One directory listing (BizDire Nepal)", sourceUrl: "https://bizdirenepal.com/fitness-studio-nepal" },
  { ...base, id: "b32", slug: "thamel-physical-fitness", name: "Thamel Physical Fitness", category: "gyms", area: "thamel",
    address: "Paknajol Marg, Thamel, Kathmandu", phone: "01-4263496", websiteStatus: "none_found",
    hours: [{ days: "Sun–Fri", time: "06:00–20:30" }, { days: "Sat", time: "Closed" }], hoursSource: "one directory listing", hoursVerified: false,
    sourceNotes: "Directory listings (Kaha6 for address and hours; phone from one other listing)", sourceUrl: "https://kaha6.com/company/thamel-physical-fitness/" },
  { ...base, id: "b33", slug: "hotel-yak-and-yeti-durbar-marg", name: "Hotel Yak & Yeti", category: "hotels", area: "durbar-marg",
    address: "Paryatak Marg, Durbar Marg, Kathmandu", phone: "01-4248999", otherPhones: [{ number: "01-4240520" }], website: "https://www.yakandyeti.com", websiteStatus: "working", lastChecked: CHECKED,
    lat: 27.7115050, lng: 85.3199050, sourceNotes: "Their own website (contact page)", sourceUrl: "https://www.yakandyeti.com/contact-us" },
  { ...base, id: "b34", slug: "kathmandu-guest-house-thamel", name: "Kathmandu Guest House", category: "hotels", area: "thamel",
    address: "Satghumti, Thamel, Kathmandu", phone: "01-4700632", otherPhones: [{ number: "01-4700800" }], whatsapp: "9851073793", website: "https://ktmgh.com", websiteStatus: "working", lastChecked: CHECKED,
    lat: 27.7155833, lng: 85.3101250, sourceNotes: "Their own website (contact page)", sourceUrl: "https://ktmgh.com/kathmandu-guest-house/contact-kgh-hotel/" },
  { ...base, id: "b35", slug: "hotel-shanker-lazimpat", name: "Hotel Shanker", category: "hotels", area: "lazimpat",
    address: "Lazimpat, Kathmandu", phone: "01-4510151", otherPhones: [{ number: "01-4510152" }], website: "https://www.shankerhotel.com.np", websiteStatus: "working", lastChecked: CHECKED,
    lat: 27.7189329, lng: 85.3199249, sourceNotes: "Their own website (contact page)", sourceUrl: "https://www.shankerhotel.com.np/contact-page" },
  { ...base, id: "b36", slug: "radisson-hotel-kathmandu-lazimpat", name: "Radisson Hotel Kathmandu", category: "hotels", area: "lazimpat",
    address: "Lazimpat, Kathmandu", phone: "01-4511818", website: "https://www.radissonhotels.com/en-us/hotels/radisson-kathmandu", websiteStatus: "not_checked",
    lat: 27.7205961, lng: 85.3204553, sourceNotes: "The Radisson Hotels website and Hotel Association Nepal", sourceUrl: "https://www.radissonhotels.com/en-us/hotels/radisson-kathmandu" },
  { ...base, id: "b37", slug: "hotel-tibet-international-boudha", name: "Hotel Tibet International", category: "hotels", area: "boudha",
    address: "Boudha, Kathmandu", phone: "01-4588188", otherPhones: [{ number: "01-4567746" }], website: "https://hoteltibetintl.com", websiteStatus: "working", lastChecked: CHECKED,
    lat: 27.7202958, lng: 85.3595040, sourceNotes: "Their own website (contact page)", sourceUrl: "https://hoteltibetintl.com/inquiry/" },
];

export const getCategory = (slug: string) => categories.find((c) => c.slug === slug);
export const getArea = (slug: string) => areas.find((a) => a.slug === slug);
export const getBusiness = (slug: string) => businesses.find((b) => b.slug === slug);

export const categoriesInUse = () => categories.filter((c) => businesses.some((b) => b.category === c.slug));
export const areasInUse = (city?: string) => areas.filter((a) => (!city || a.city === city) && businesses.some((b) => b.area === a.slug));
export const getCity = (slug: string) => cities.find((c) => c.slug === slug);
export const cityOf = (b: Business) => getArea(b.area)?.city ?? "";
export const citiesInUse = () => cities.filter((c) => businesses.some((b) => cityOf(b) === c.slug));
export const businessesIn = (city: string) => businesses.filter((b) => cityOf(b) === city);
export const categoriesIn = (items: Business[]) => categories.filter((c) => items.some((b) => b.category === c.slug));
export const areasIn = (items: Business[]) => areas.filter((a) => items.some((b) => b.area === a.slug));
export const hasPin = (b: Business) => typeof b.lat === "number" && typeof b.lng === "number";

/** Where a city section slug points: an area or a category in that city, or nothing. */
export function resolveSection(city: string, section: string): { kind: "area"; slug: string } | { kind: "category"; slug: string } | null {
  const a = getArea(section);
  if (a && a.city === city) return { kind: "area", slug: a.slug };
  if (getCategory(section)) return { kind: "category", slug: section };
  return null;
}

export function searchBusinesses(query: string): Business[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return businesses.filter((b) => {
    const cat = getCategory(b.category);
    const area = getArea(b.area);
    const hay = [b.name, cat?.name, cat?.nameNe, cat?.name.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), area?.name, getCity(area?.city ?? "")?.name, ...b.services.map((x) => x.name)].join(" ").toLowerCase();
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
  `https://wa.me/${intlDigits(n)}?text=${encodeURIComponent("Hello, I found you on the directory.")}`;
export const mapsLink = (addr: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(addr)}`;
/** Digits only, in international form: 01-5367872 -> 97715367872, 9802323990 -> 9779802323990. */
export function intlDigits(p: string): string {
  let d = p.replace(/\D/g, "");
  if (d.startsWith("977")) d = d.slice(3);
  if (d.startsWith("0")) d = d.slice(1);
  return `977${d}`;
}
export const telLink = (p: string) => `tel:+${intlDigits(p)}`;

export const directionsLink = (b: Business) => b.directions ?? (b.address ? mapsLink(`${b.name}, ${b.address}`) : undefined);

const SOCIAL_BASE: Record<string, (h: string) => string> = {
  Instagram: (h) => `https://www.instagram.com/${h}/`,
  Facebook: (h) => `https://www.facebook.com/${h}`,
  TikTok: (h) => `https://www.tiktok.com/@${h.replace(/^@/, "")}`,
  YouTube: (h) => `https://www.youtube.com/@${h.replace(/^@/, "")}`,
};
export function socialLinks(b: Business) {
  return (b.social ?? []).flatMap((entry) => {
    const [platform, handle] = entry.split(" ");
    const make = platform && handle ? SOCIAL_BASE[platform] : undefined;
    return make && handle ? [{ platform, handle, url: make(handle) }] : [];
  });
}
// A website is shown only when one is listed and its status is known from a check.
export const showWebsite = (b: Business) => Boolean(b.website) && (b.websiteStatus === "working" || b.websiteStatus === "failed");
export const websiteButton = (b: Business) => Boolean(b.website) && b.websiteStatus === "working";

export const slugRedirects: Record<string, string> = { "plush-kamaladi": "plush-lazimpat" };
export const categoryRedirects: Record<string, string> = { "salon-and-spa": "salons" };

export type WebsiteLabel = "webWorking" | "webDown" | "webNone" | "webNotChecked";
export function websiteShortLabel(b: Business): WebsiteLabel {
  if (b.websiteStatus === "working") return "webWorking";
  if (b.websiteStatus === "failed") return "webDown";
  if (b.websiteStatus === "none_found" || b.websiteStatus === "owner_no_site") return "webNone";
  return "webNotChecked";
}

// ---- Hours: open/closed in Kathmandu time ----
const DAY_INDEX: Record<string, number> = { sun: 0, mon: 1, tue: 2, wed: 3, thu: 4, fri: 5, sat: 6 };
const EVERY_DAY = ["", "every day", "daily", "sunday to saturday", "sun–sat", "sun-sat"];

/** Days of week (0 = Sunday) covered by a days label, or null if it can't be read. */
export function parseDays(label: string): number[] | null {
  const l = label.trim().toLowerCase();
  if (EVERY_DAY.includes(l)) return [0, 1, 2, 3, 4, 5, 6];
  const m = l.match(/^([a-z]{3})[a-z]*\s*(?:[–-]|to)\s*([a-z]{3})[a-z]*$/);
  if (m) {
    const a = DAY_INDEX[m[1]!], b = DAY_INDEX[m[2]!];
    if (a === undefined || b === undefined) return null;
    const out: number[] = [];
    for (let d = a; ; d = (d + 1) % 7) { out.push(d); if (d === b) break; }
    return out;
  }
  const one = DAY_INDEX[l.slice(0, 3)];
  return one !== undefined && /^[a-z]+$/.test(l) ? [one] : null;
}

/** Minutes since midnight for "HH:MM–HH:MM", or null; "Closed" returns "closed". */
export function parseRange(time: string): [number, number] | "closed" | null {
  if (/^closed$/i.test(time.trim())) return "closed";
  const m = time.trim().match(/^(\d{1,2}):(\d{2})\s*[–-]\s*(\d{1,2}):(\d{2})$/);
  if (!m) return null;
  return [Number(m[1]) * 60 + Number(m[2]), Number(m[3]) * 60 + Number(m[4])];
}

export function kathmanduNow(now: Date): { day: number; minutes: number } {
  const parts = new Intl.DateTimeFormat("en-US", { timeZone: "Asia/Kathmandu", weekday: "short", hour: "2-digit", minute: "2-digit", hourCycle: "h23" }).formatToParts(now);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return { day: DAY_INDEX[get("weekday").toLowerCase().slice(0, 3)] ?? 0, minutes: Number(get("hour")) * 60 + Number(get("minute")) };
}

export type HoursStatus =
  | { kind: "none" }
  | { kind: "open" | "closed"; today: string }
  | { kind: "text"; today: string };

export function hoursStatus(hours: Business["hours"], now: Date): HoursStatus {
  if (!hours?.length) return { kind: "none" };
  const { day, minutes } = kathmanduNow(now);
  for (const h of hours) {
    const days = parseDays(h.days);
    if (!days) return { kind: "text", today: hours.map((x) => `${x.days} ${x.time}`.trim()).join(", ") };
    if (!days.includes(day)) continue;
    const r = parseRange(h.time);
    if (r === "closed") return { kind: "closed", today: h.time };
    if (!r) return { kind: "text", today: h.time };
    return { kind: minutes >= r[0] && minutes < r[1] ? "open" : "closed", today: h.time };
  }
  return { kind: "closed", today: "" };
}
