import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ne";
const KEY = "dir-lang";

const dict = {
  en: {
    tagline: "Local shops and services in Kathmandu — phone, hours, and whether their website was checked.",
    searchPlaceholder: "Search name, area, or service", search: "Search",
    categories: "Categories", areas: "Areas", listings: "Listings", sample: "Sample listing. Not a real business.",
    call: "Call", website: "Visit website", whatsapp: "WhatsApp", directions: "Get directions",
    hours: "Hours", noHours: "Hours not recorded.", services: "Services", about: "About this record",
    source: "Source", noResults: "No matching businesses.", noneListed: "None listed yet.", lastChecked: "Last checked", photo: "Photo", websiteStatus: "Website", address: "Address", note: "Note", tryOther: "Try a different word, or browse categories.",
    resultsFor: "Results for", enterQuery: "Type something to search.", home: "Home", notFound: "Not found",
    notFoundBody: "We couldn't find that page.", goHome: "Go home",
    verif_not_verified: "Not verified.", verif_source_checked: "Checked against a source.", verif_business_confirmed: "Confirmed by the business.",
    footAbout: "About the directory", footSuggest: "Suggest a correction", footHelp: "Website help", footPrivacy: "Privacy", footContact: "Contact",
    noindex: "Prototype. Details come from each business’s public pages.", inArea: "in",
  },
  ne: {
    tagline: "काठमाडौंका स्थानीय पसल र सेवा — फोन, समय, र वेबसाइट जाँच भएको छ कि छैन।",
    searchPlaceholder: "नाम, क्षेत्र वा सेवा खोज्नुहोस्", search: "खोज्नुहोस्",
    categories: "प्रकारहरू", areas: "क्षेत्रहरू", listings: "सूची", sample: "नमुना सूची। वास्तविक व्यवसाय होइन।",
    call: "फोन गर्नुहोस्", website: "वेबसाइट हेर्नुहोस्", whatsapp: "ह्वाट्सएप", directions: "बाटो हेर्नुहोस्",
    hours: "खुल्ने समय", noHours: "समय रेकर्ड गरिएको छैन।", services: "सेवाहरू", about: "यस रेकर्डबारे",
    source: "स्रोत", noResults: "कुनै मिल्ने व्यवसाय छैन।", noneListed: "अहिलेसम्म कुनै सूचीमा छैन।", lastChecked: "पछिल्लो जाँच", photo: "फोटो", websiteStatus: "वेबसाइट", address: "ठेगाना", note: "टिप्पणी", tryOther: "अर्को शब्द प्रयोग गर्नुहोस् वा प्रकारहरू हेर्नुहोस्।",
    resultsFor: "नतिजा:", enterQuery: "खोज्न केही लेख्नुहोस्।", home: "गृहपृष्ठ", notFound: "भेटिएन",
    notFoundBody: "त्यो पृष्ठ भेटिएन।", goHome: "गृहपृष्ठमा जानुहोस्",
    verif_not_verified: "प्रमाणित छैन।", verif_source_checked: "स्रोतसँग जाँच गरिएको।", verif_business_confirmed: "व्यवसायले पुष्टि गरेको।",
    footAbout: "निर्देशिकाबारे", footSuggest: "सुधार सुझाव", footHelp: "वेबसाइट सहयोग", footPrivacy: "गोपनीयता", footContact: "सम्पर्क",
    noindex: "प्रोटोटाइप। विवरण प्रत्येक व्यवसायको सार्वजनिक पृष्ठबाट।", inArea: "मा",
  },
} as const;

export type Key = keyof (typeof dict)["en"];

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en", setLang: () => {}, t: (k) => dict.en[k],
});

export function LangProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const s = localStorage.getItem(KEY);
    if (s === "ne" || s === "en") setLangState(s);
  }, []);
  useEffect(() => { document.documentElement.lang = lang === "ne" ? "ne" : "en"; }, [lang]);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem(KEY, l); };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</Ctx.Provider>;
}

export const useI18n = () => useContext(Ctx);
