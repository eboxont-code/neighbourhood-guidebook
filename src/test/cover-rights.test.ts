import { describe, expect, it } from "vitest";
import { hasRightsClearedCover } from "@/lib/cover-rights";

const base = {
  url: "https://example.com/business-photo.jpg",
  credit: "example.com",
};

describe("business cover image rights", () => {
  it("rejects a source credit without owner permission or a licence", () => {
    expect(hasRightsClearedCover(base)).toBe(false);
  });

  it("accepts an owner-provided image only with recorded evidence", () => {
    expect(hasRightsClearedCover({
      ...base,
      rights: "owner_provided",
      rightsEvidence: "Owner supplied this image for SEWA use.",
    })).toBe(true);
  });

  it("accepts a licensed image only with recorded evidence", () => {
    expect(hasRightsClearedCover({
      ...base,
      rights: "licensed",
      rightsEvidence: "https://example.com/image-licence",
    })).toBe(true);
  });

  it("rejects empty evidence and unsupported rights labels", () => {
    expect(hasRightsClearedCover({ ...base, rights: "licensed", rightsEvidence: " " })).toBe(false);
    expect(hasRightsClearedCover({ ...base, rights: "public", rightsEvidence: "source" })).toBe(false);
  });

  it("rejects non-web image URLs", () => {
    expect(hasRightsClearedCover({
      ...base,
      url: "data:image/jpeg;base64,abc",
      rights: "licensed",
      rightsEvidence: "https://example.com/licence",
    })).toBe(false);
  });
});
