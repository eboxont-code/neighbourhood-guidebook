import logo from "@/assets/boxont-mark.jpg.asset.json";
import aavaran from "@/assets/aavaran-cover.jpg.asset.json";
import tranquility from "@/assets/tranquility-cover.jpg.asset.json";
import { dict, type Key } from "@/lib/i18n";

// Share assets are served by the published app; this does not change canonical URLs.
const ASSET_ORIGIN = "https://neighbourhood-guidebook.lovable.app";

export function shareText(key: Key, values: Record<string, string> = {}) {
  return Object.entries(values).reduce((text, [name, value]) => text.replaceAll(`{${name}}`, value), String(dict.en[key]));
}

/** Only use a resized business cover when it matches the recorded source exactly. */
const covers: Record<string, { url: string }> = {
  "https://www.aavaranskin.com/uploaded_images/seo/aavaran-skin-clinic-225940.JPG": aavaran,
  "https://www.tranquilityspa.com.np/uploads/images/galleries/03534099-dc1e-46d4-b007-0a62f39a0cf9.jpg": tranquility,
};

export function shareImage(cover?: { url: string }, name?: string) {
  if (cover) {
    const resized = covers[cover.url];
    // Unknown covers stay with the host's page preview rather than tagging an unsized original.
    if (!resized) return {};
    return { image: `${ASSET_ORIGIN}${resized.url}`, imageAlt: name, imageWidth: 1200, imageHeight: 630 };
  }
  return { image: `${ASSET_ORIGIN}${logo.url}`, imageAlt: dict.en.shareLogoAlt, imageWidth: 512, imageHeight: 512, card: "summary" as const };
}