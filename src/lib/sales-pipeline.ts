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
