import { describe, expect, it } from "vitest";
import { SITE_CONTACT } from "@/config";

describe("public operator contact privacy", () => {
  it("keeps unapproved operator contact channels unpublished", () => {
    expect(SITE_CONTACT).toEqual({
      phone: "",
      whatsapp: "",
      email: "",
    });
  });
});
