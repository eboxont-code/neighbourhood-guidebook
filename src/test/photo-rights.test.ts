import { describe, expect, it } from "vitest";
import { publicCover } from "@/lib/photo-rights";
import { businessJsonLd } from "@/lib/seo";
import { getBusiness } from "@/data/directory";
import { shareImage } from "@/lib/social-meta";

describe("public photo permission", () => {
  const cover = { url: "https://sewa.test/photo.jpg", credit: "Sewa test fixture" };
  it("does not treat a source credit as permission", () => {
    expect(publicCover(cover)).toBeUndefined();
    expect(shareImage(cover).imageAlt).toBe(shareImage().imageAlt);
  });
  it.each(["owner_provided", "licensed"] as const)("requires evidence for %s", (rights) => {
    expect(publicCover({ ...cover, rights, evidence: " " })).toBeUndefined();
    expect(publicCover({ ...cover, rights, evidence: "Test permission record" })).toEqual({ ...cover, rights, evidence: "Test permission record" });
  });
  it("excludes unpermitted images from structured data without removing stored covers", () => {
    const b = getBusiness("aavaran-durbar-marg");
    if (!b?.cover) throw new Error("Missing recorded cover");
    expect(businessJsonLd(b)["image"]).toBeUndefined();
    expect(b.cover.url).toBeTruthy();
  });
});