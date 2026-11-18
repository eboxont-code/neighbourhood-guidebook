import type { Business } from "@/data/directory";

/** Source attribution is not permission. Keep the stored cover available to editors. */
export function publicCover(cover: Business["cover"]): Business["cover"] {
  return cover && (cover.rights === "owner_provided" || cover.rights === "licensed") && cover.evidence?.trim()
    ? cover : undefined;
}