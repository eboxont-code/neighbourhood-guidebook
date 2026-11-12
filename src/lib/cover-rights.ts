import type { BusinessCover } from "@/data/directory";

/** Reject legacy or unproven business photos before they reach a public page or search preview. */
export function hasRightsClearedCover(value: unknown): value is BusinessCover {
  if (!value || typeof value !== "object") return false;
  const cover = value as Record<string, unknown>;
  if (typeof cover.url !== "string" || typeof cover.credit !== "string") return false;
  let protocol = "";
  try {
    protocol = new URL(cover.url).protocol;
  } catch {
    return false;
  }
  return (
    (protocol === "http:" || protocol === "https:") &&
    cover.credit.trim().length > 0 &&
    (cover.rights === "owner_provided" || cover.rights === "licensed") &&
    typeof cover.rightsEvidence === "string" &&
    cover.rightsEvidence.trim().length > 0
  );
}
