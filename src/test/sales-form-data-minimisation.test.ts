import { describe, expect, it } from "vitest";
import { contactSchema } from "@/components/forms";
import { dict } from "@/lib/i18n";

describe("business enquiry data minimisation", () => {
  it("asks for a business area, not a home address or personal location, in both languages", () => {
    expect(dict.en.fbOwnerStep1).toContain("business area");
    expect(dict.en.fbOwnerStep1).toContain("home address");
    expect(dict.en.fbOwnerStep1).toContain("precise personal location");
    expect(dict.en.fbOwnerFormBody).toContain("business area");
    expect(dict.en.fbOwnerFormBody).toContain("home address");
    expect(dict.en.fbOwnerFormBody).toContain("precise personal location");
    expect(dict.ne.fbOwnerStep1).toContain("व्यवसाय रहेको क्षेत्र वा छिमेक");
    expect(dict.ne.fbOwnerStep1).toContain("घरको ठेगाना");
    expect(dict.ne.fbOwnerStep1).toContain("सटीक स्थान");
    expect(dict.ne.fbOwnerFormBody).toContain("व्यवसाय रहेको क्षेत्र वा छिमेक");
    expect(dict.ne.fbOwnerFormBody).toContain("घरको ठेगाना");
    expect(dict.ne.fbOwnerFormBody).toContain("सटीक स्थान");

    expect(dict.en.fb2LeadBody).toContain("business area");
    expect(dict.en.fb2LeadBody).toContain("home address");
    expect(dict.ne.fb2LeadBody).toContain("व्यवसाय रहेको क्षेत्र वा छिमेक");
    expect(dict.ne.fb2LeadBody).toContain("घरको ठेगाना");
  });

  it("does not define home-address or precise-location fields in the sales enquiry schema", () => {
    const fields = Object.keys(contactSchema.shape);
    for (const field of ["address", "home_address", "location", "latitude", "longitude", "coordinates"]) {
      expect(fields).not.toContain(field);
    }
    expect(fields).toContain("business_name");
    expect(fields).toContain("phone");
    expect(fields).toContain("message");
  });
});
