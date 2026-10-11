import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "ne";
const KEY = "dir-lang";

const dict = {
  en: {
    tagline: "Local shops and services in Kathmandu, with phone numbers, opening hours and whether their website works.",
    searchPlaceholder: "Search name, area, or service", search: "Search",
    categories: "Categories", areas: "Areas", listings: "Listings", sample: "Sample listing. Not a real business.",
    call: "Call", website: "Visit website", whatsapp: "WhatsApp", directions: "Get directions",
    hours: "Hours", noHours: "Hours not recorded.", services: "Services", about: "About this record",
    source: "Source", noResults: "No matching businesses.", noneListed: "None listed yet.", lastChecked: "Last checked", photo: "Photo", websiteStatus: "Website", address: "Address", note: "Note", otherPhones: "Other phones", social: "Social", openMaps: "Open in Google Maps", hoursFrom: "From", hoursUnverified: "Unverified. From", tryOther: "Try a different word, or browse categories.",
    resultsFor: "Results for", enterQuery: "Type something to search.", home: "Home", notFound: "Not found",
    notFoundBody: "We couldn't find that page.", goHome: "Go home",
    verif_not_verified: "Not verified.", verif_source_checked: "Checked against a source.", verif_business_confirmed: "Confirmed by the business.",
    footAbout: "About the directory", footSuggest: "Suggest a correction", footHelp: "Website help", footPrivacy: "Privacy", footContact: "Contact",
    openNow: "Open now", closedNow: "Closed now", hoursNotListed: "Hours not listed", today: "Today", unverifiedShort: "unverified",
    webWorking: "Website working", webDown: "Website down", webNone: "No website found", webNotChecked: "Website not checked yet",
    fromOtherListings: "from other listings",
    isYourBusiness: "Is this your business?", isYourBusinessBody: "Let us know if you'd like to update these details.",
    suggestThis: "Suggest a correction", spotMistake: "Spotted something out of date?",
    contactTitle: "Contact us",
    contactIntro: "Questions about the directory, a listing, or a website? Leave a note and we'll get back to you.",
    fName: "Your name", fBusiness: "Business name", fBusinessHint: "If you're writing about a business", fPhone: "Phone to call you back on",
    fPhoneHint: "Optional. We'll only use it to reply.", fMessage: "Message", fRequired: "required", fOptional: "optional",
    send: "Send", sending: "Sending…",
    thanksTitle: "Thank you", thanksContact: "We've got your message and will be in touch soon.",
    thanksCorrection: "Thanks for helping keep this right. We'll check it before changing the listing.",
    sendError: "That didn't go through. Please check your connection and try again.",
    correctionTitle: "Suggest a correction",
    correctionIntro: "If a phone, hour, or website is wrong, send the correct detail. We check each one before we change a listing.",
    fListing: "Listing", fChoose: "Choose a business", fWrong: "What's wrong", fWrongHint: "For example, the new phone number or the right hours.",
    fContact: "Your contact", fContactHint: "Optional. A phone or email in case we have a question.",
    helpTitle: "Website check and new site",
    helpBody1: "We check whether a business website works. If it is down, missing, or out of date, we can update it or make a new one.",
    helpBody2: "Your listing stays free either way. If we build your site, you can also ask us to edit your listing later.",
    helpCta: "Ask about a website",
    errName: "Please add your name.", errMessage: "Please write a message.", errListing: "Please choose a business.", errWrong: "Please tell us what needs changing.", errTooLong: "That's a little too long.",
    noindex: "Prototype. Details come from each business’s public pages.", inArea: "in",
  },
  ne: {
    tagline: "काठमाडौंका स्थानीय पसल र सेवाहरू: फोन नम्बर, खुल्ने समय र वेबसाइट चल्छ कि चल्दैन।",
    searchPlaceholder: "नाम, क्षेत्र वा सेवा खोज्नुहोस्", search: "खोज्नुहोस्",
    categories: "प्रकारहरू", areas: "क्षेत्रहरू", listings: "सूची", sample: "नमुना सूची। वास्तविक व्यवसाय होइन।",
    call: "फोन गर्नुहोस्", website: "वेबसाइट हेर्नुहोस्", whatsapp: "ह्वाट्सएप", directions: "बाटो हेर्नुहोस्",
    hours: "खुल्ने समय", noHours: "समय रेकर्ड गरिएको छैन।", services: "सेवाहरू", about: "यस रेकर्डबारे",
    source: "स्रोत", noResults: "कुनै मिल्ने व्यवसाय छैन।", noneListed: "अहिलेसम्म कुनै सूचीमा छैन।", lastChecked: "पछिल्लो जाँच", photo: "फोटो", websiteStatus: "वेबसाइट", address: "ठेगाना", note: "टिप्पणी", otherPhones: "अन्य फोन", social: "सामाजिक सञ्जाल", openMaps: "गुगल नक्सामा खोल्नुहोस्", hoursFrom: "स्रोत:", hoursUnverified: "पुष्टि नभएको। स्रोत:", tryOther: "अर्को शब्द प्रयोग गर्नुहोस् वा प्रकारहरू हेर्नुहोस्।",
    resultsFor: "नतिजा:", enterQuery: "खोज्न केही लेख्नुहोस्।", home: "गृहपृष्ठ", notFound: "भेटिएन",
    notFoundBody: "त्यो पृष्ठ भेटिएन।", goHome: "गृहपृष्ठमा जानुहोस्",
    verif_not_verified: "प्रमाणित छैन।", verif_source_checked: "स्रोतसँग जाँच गरिएको।", verif_business_confirmed: "व्यवसायले पुष्टि गरेको।",
    footAbout: "निर्देशिकाबारे", footSuggest: "सुधार सुझाव", footHelp: "वेबसाइट सहयोग", footPrivacy: "गोपनीयता", footContact: "सम्पर्क",
    openNow: "अहिले खुला", closedNow: "अहिले बन्द", hoursNotListed: "समय उल्लेख छैन", today: "आज", unverifiedShort: "पुष्टि नभएको",
    webWorking: "वेबसाइट चल्छ", webDown: "वेबसाइट चलेन", webNone: "वेबसाइट भेटिएन", webNotChecked: "वेबसाइट अझै जाँच भएको छैन",
    fromOtherListings: "अन्य सूचीबाट",
    isYourBusiness: "यो तपाईंको व्यवसाय हो?", isYourBusinessBody: "विवरण अद्यावधिक गर्न चाहनुहुन्छ भने हामीलाई भन्नुहोस्।",
    suggestThis: "सुधार सुझाव दिनुहोस्", spotMistake: "केही पुरानो वा गलत देख्नुभयो?",
    contactTitle: "सम्पर्क गर्नुहोस्",
    contactIntro: "निर्देशिका, कुनै सूची वा वेबसाइटबारे प्रश्न छ? सन्देश छोड्नुहोस्, हामी जवाफ दिनेछौं।",
    fName: "तपाईंको नाम", fBusiness: "व्यवसायको नाम", fBusinessHint: "कुनै व्यवसायबारे लेख्दै हुनुहुन्छ भने", fPhone: "फिर्ता फोन गर्ने नम्बर",
    fPhoneHint: "ऐच्छिक। जवाफ दिन मात्र प्रयोग गरिन्छ।", fMessage: "सन्देश", fRequired: "आवश्यक", fOptional: "ऐच्छिक",
    send: "पठाउनुहोस्", sending: "पठाउँदै…",
    thanksTitle: "धन्यवाद", thanksContact: "तपाईंको सन्देश पाइयो। हामी चाँडै सम्पर्क गर्नेछौं।",
    thanksCorrection: "सही राख्न सहयोग गर्नुभएकोमा धन्यवाद। सूची बदल्नुअघि हामी जाँच गर्नेछौं।",
    sendError: "पठाउन सकिएन। इन्टरनेट जाँचेर फेरि प्रयास गर्नुहोस्।",
    correctionTitle: "सुधार सुझाव",
    correctionIntro: "फोन, समय वा वेबसाइट गलत छ भने सही विवरण पठाउनुहोस्। सूची बदल्नुअघि हामी हरेक सुझाव जाँच्छौं।",
    fListing: "सूची", fChoose: "व्यवसाय छान्नुहोस्", fWrong: "के गलत छ", fWrongHint: "जस्तै, नयाँ फोन नम्बर वा सही समय।",
    fContact: "तपाईंको सम्पर्क", fContactHint: "ऐच्छिक। प्रश्न भएमा फोन वा इमेल।",
    helpTitle: "वेबसाइट जाँच र नयाँ साइट",
    helpBody1: "हामी व्यवसायको वेबसाइट चल्छ कि चल्दैन जाँच्छौं। बन्द, नभएको वा पुरानो भए हामी अद्यावधिक गर्न वा नयाँ बनाउन सक्छौं।",
    helpBody2: "तपाईंको सूची जे भए पनि निःशुल्क रहन्छ। हामीले साइट बनायौं भने पछि सूची सम्पादन गर्न पनि भन्न सक्नुहुन्छ।",
    helpCta: "वेबसाइटबारे सोध्नुहोस्",
    errName: "कृपया नाम लेख्नुहोस्।", errMessage: "कृपया सन्देश लेख्नुहोस्।", errListing: "कृपया व्यवसाय छान्नुहोस्।", errWrong: "कृपया के बदल्नुपर्छ लेख्नुहोस्।", errTooLong: "अलि लामो भयो।",
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
