import logo from "@/assets/boxont-mark.jpg.asset.json";
import { dict, type Key } from "@/lib/i18n";

// Share assets are served by the published app; this does not change canonical URLs.
const ASSET_ORIGIN = "https://neighbourhood-guidebook.lovable.app";

export function shareText(key: Key, values: Record<string, string> = {}) {
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), String(dict.en[key]));
}

/** Share cards use the SEWA / Boxont mark, not business photos without separate share-use permission. */
export function shareImage() {
  return { image: `${ASSET_ORIGIN}${logo.url}`, imageAlt: dict.en.shareLogoAlt, imageWidth: 512, imageHeight: 512, card: "summary" as const };
}
