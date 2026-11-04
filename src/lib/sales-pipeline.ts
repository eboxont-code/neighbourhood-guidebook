import type { Business } from "@/data/directory";

export const SALES_STAGES = [
  "identified",
  "qualified",
  "contacted",
  "replied",
  "meeting",
  "proposal",
  "won",
  "lost",
  "do_not_contact",
] as const;
export type SalesStage = (typeof SALES_STAGES)[number];

export const SALES_INTERESTS = ["website", "redesign", "care", "sponsored_placement", "unsure"] as const;
export type SalesInterest = (typeof SALES_INTERESTS)[number];

export const SALES_CHANNELS = ["whatsapp", "phone", "email", "in_person", "none"] as const;
export type SalesChannel = (typeof SALES_CHANNELS)[number];

export const SALES_ACTIVITY_TYPES = [
  "call",
  "whatsapp",
  "email",
  "meeting",
  "follow_up",
  "proposal",
  "payment",
  "note",
  "stage_change",
] as const;
export type SalesActivityType = (typeof SALES_ACTIVITY_TYPES)[number];

const interestCopy = {
  en: {
    website: "a mobile-friendly business website",
    redesign: "website improvements",
    care: "ongoing website care",
    sponsored_placement: "a clearly labelled sponsored placement on SEWA",
    unsure: "online presence options",
  },
  ne: {
    website: "मोबाइलमैत्री व्यवसाय वेबसाइट",
    redesign: "वेबसाइट सुधार",
    care: "नियमित वेबसाइट हेरचाह",
    sponsored_placement: "SEWA मा स्पष्ट रूपमा चिनाइएको प्रायोजित स्थान",
    unsure: "अनलाइन उपस्थितिका विकल्प",
  },
} as const;

/** Human-reviewed draft only. This function never sends or stores a message. */
export function buildSalesOutreachDraft(
  business: Pick<Business, "name" | "area">,
  interest: SalesInterest,
  lang: "en" | "ne",
): string {
  const service = interestCopy[lang][interest];
  if (lang === "ne") {
    return `नमस्कार ${business.name} टिम,

म Boxont बाट सम्पर्क गर्दैछु। हामी SEWA, काठमाडौंका स्थानीय व्यवसायहरूको निर्देशिका, सञ्चालन गर्छौं। ${service} सम्बन्धी विकल्पहरू तपाईंलाई उपयोगी हुन सक्छन् कि भनेर बुझ्न चाहन्थ्यौं।

रुचि भए छोटो कुराकानी वा तपाईंको आवश्यकताअनुसार लिखित कोट पठाउन सक्छौं। कुनै प्रतिबद्धता आवश्यक छैन।

धन्यवाद,
Boxont`;
  }
  return `Hello ${business.name} team,

I'm reaching out from Boxont, the team behind SEWA's Kathmandu business directory. We thought ${service} might be useful for your business.

Would you be open to a brief conversation? We can first share a tailored written quote for you to review. There's no obligation.

Thank you,
Boxont`;
}


export function inboundLeadStage(status: string): SalesStage {
  switch (status) {
    case "contacted": return "contacted";
    case "quoted": return "proposal";
    case "won": return "won";
    case "lost": return "lost";
    default: return "identified";
  }
}

export function inboundLeadInterest(servicePackage: string | null | undefined): SalesInterest {
  switch (servicePackage) {
    case "launch":
    case "growth":
      return "website";
    case "redesign":
      return "redesign";
    case "care":
      return "care";
    case "promotion":
      return "sponsored_placement";
    default:
      return "unsure";
  }
}


const proposalServiceCopy = {
  en: {
    website: "Business website",
    redesign: "Website improvement",
    care: "Website care",
    sponsored_placement: "SEWA sponsored placement",
    unsure: "Custom digital service",
  },
  ne: {
    website: "व्यवसाय वेबसाइट",
    redesign: "वेबसाइट सुधार",
    care: "वेबसाइट हेरचाह",
    sponsored_placement: "SEWA प्रायोजित स्थान",
    unsure: "अनुकूलित डिजिटल सेवा",
  },
} as const;

export type ServiceProposalInput = {
  businessName: string;
  interest: SalesInterest;
  scope: string;
  timeline: string;
  quoteNpr: number;
  preparedOn: string;
  lang: "en" | "ne";
};

/** Builds a copy-ready custom proposal; no price or delivery promise is inferred. */
export function buildServiceProposalDraft(input: ServiceProposalInput): string | null {
  const businessName = input.businessName.trim().slice(0, 100);
  const scope = input.scope.trim().slice(0, 520);
  const timeline = input.timeline.trim().slice(0, 120);
  if (!businessName || !scope || !Number.isSafeInteger(input.quoteNpr) || input.quoteNpr <= 0 || input.quoteNpr > 5_000_000) {
    return null;
  }
  const amount = new Intl.NumberFormat(input.lang === "ne" ? "ne-NP" : "en-NP", { maximumFractionDigits: 0 }).format(input.quoteNpr);
  const service = proposalServiceCopy[input.lang][input.interest];
  if (input.lang === "ne") {
    return [
      "BOXONT | सेवा प्रस्ताव",
      `व्यवसाय: ${businessName}`,
      `सेवा: ${service}`,
      `मिति: ${input.preparedOn.slice(0, 40)}`,
      "",
      "कामको दायरा तथा उपलब्धि:",
      scope,
      "",
      "समयतालिका:",
      timeline || "दायरा स्वीकृत भएपछि दुवै पक्षको सहमतिमा तय गरिनेछ।",
      "",
      `अनुकूलित कोट: NPR ${amount}`,
      "अर्को चरण: कृपया दायरा समीक्षा गरी संशोधन वा स्वीकृति जानकारी दिनुहोस्। काम सुरु हुनुअघि अन्तिम समयतालिका र भुक्तानी व्यवस्था लिखित रूपमा पुष्टि गरिनेछ।",
      "",
      "Boxont | SEWA",
    ].join("\n").slice(0, 1499);
  }
  return [
    "BOXONT | SERVICE PROPOSAL",
    `Prepared for: ${businessName}`,
    `Service: ${service}`,
    `Date: ${input.preparedOn.slice(0, 40)}`,
    "",
    "SCOPE AND DELIVERABLES:",
    scope,
    "",
    "DELIVERY PLAN:",
    timeline || "To be agreed in writing after the scope is approved.",
    "",
    `CUSTOM QUOTE: NPR ${amount}`,
    "Next step: Please review the scope and reply with any changes or approval. The final schedule and payment arrangement will be confirmed in writing before work begins.",
    "",
    "Boxont | SEWA",
  ].join("\n").slice(0, 1499);
}

export function isOpenSalesStage(stage: string): boolean {
  return stage !== "won" && stage !== "lost" && stage !== "do_not_contact";
}

export function salesFollowUpState(nextFollowUpAt: string | null | undefined, now = Date.now()): "overdue" | "due" | "later" | "none" {
  if (!nextFollowUpAt) return "none";
  const due = new Date(nextFollowUpAt).getTime();
  if (!Number.isFinite(due)) return "none";
  if (due < now) return "overdue";
  if (due < now + 7 * 86_400_000) return "due";
  return "later";
}
