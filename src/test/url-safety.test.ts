import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { areas, categories } from "@/data/directory";
import { submissionSchema } from "@/components/forms";
import { validUrl } from "@/lib/admin-listing";
import { claimSchema } from "@/lib/claims";
import { rowToBusiness } from "@/lib/listings.functions";
import { externalUrlHost, safeExternalHttpUrl } from "@/lib/urls";
import { sourceUrl } from "@/lib/provenance";

function readProjectFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("untrusted external URL safety", () => {
  it("normalises valid HTTP and HTTPS domain links", () => {
    expect(safeExternalHttpUrl("https://example.com/proof?id=1")).toBe("https://example.com/proof?id=1");
    expect(safeExternalHttpUrl(" http://example.com ")).toBe("http://example.com/");
    expect(externalUrlHost("https://www.Example.com/proof")).toBe("example.com");
    expect(validUrl("https://example.com")).toBe(true);
  });

  it.each([
    "javascript:alert(1)",
    "data:text/html,<script>alert(1)</script>",
    "vbscript:msgbox(1)",
    "//example.com/path",
    "example.com",
    "ftp://example.com/file",
    "https://user:password@example.com",
    "https://127.0.0.1/admin",
    "https://[::1]/admin",
    "https://localhost/admin",
    "https://example.com/path with spaces",
    "https://example.com.",
  ])("rejects unsafe or ambiguous external URL %s", (value) => {
    expect(safeExternalHttpUrl(value)).toBeNull();
    expect(validUrl(value)).toBe(false);
    expect(sourceUrl(value)).toBeUndefined();
  });

  it("rejects unsafe proof links in public claim submissions", () => {
    const claim = {
      listing_slug: "test-business",
      listing_id: null,
      name: "Test Owner",
      role: "owner",
      contact: "owner@example.com",
      proof_url: "https://example.com/proof",
      wants: [],
      note: "",
    };
    expect(claimSchema.safeParse(claim).success).toBe(true);
    expect(claimSchema.safeParse({ ...claim, proof_url: "javascript:alert(1)" }).success).toBe(false);
    expect(claimSchema.safeParse({ ...claim, proof_url: "https://user@example.com" }).success).toBe(false);
  });

  it("rejects unsafe website links in public business submissions", () => {
    const submission = {
      business_name: "Test Business",
      category: categories[0]!.slug,
      area: areas[0]!.slug,
      address: "",
      phone: "",
      website: "https://example.com",
      opening_hours: "",
      is_owner: "yes",
      name: "",
      contact: "owner@example.com",
      note: "",
    };
    expect(submissionSchema.safeParse(submission).success).toBe(true);
    expect(submissionSchema.safeParse({ ...submission, website: "javascript:alert(1)" }).success).toBe(false);
    expect(submissionSchema.safeParse({ ...submission, website: "https://user@example.com" }).success).toBe(false);
  });

  it("drops unsafe URLs from untrusted listing JSON before public rendering", () => {
    const business = rowToBusiness({
      id: "test-id",
      slug: "test-business",
      name: "Test Business",
      area: "thamel",
      category: "cafes",
      data: {
        website: "https://user:password@example.com",
        websiteStatus: "working",
        directions: "javascript:alert(1)",
        sourceUrl: "https://127.0.0.1/admin",
        cover: { url: "data:text/html,unsafe", credit: "Test" },
      },
    });
    expect(business.website).toBeUndefined();
    expect(business.websiteStatus).toBe("not_checked");
    expect(business.directions).toBeUndefined();
    expect(business.sourceUrl).toBeUndefined();
    expect(business.cover).toBeUndefined();
  });

  it("keeps admin links guarded and labels valid external destinations", () => {
    const claims = readProjectFile("src/components/admin-claims.tsx");
    const admin = readProjectFile("src/routes/admin.tsx");
    expect(claims).toContain("safeExternalHttpUrl(row.proof_url)");
    expect(admin).toContain("safeExternalHttpUrl(m.website)");
    expect(claims).toContain('rel="noopener noreferrer nofollow"');
    expect(admin).toContain('rel="noopener noreferrer nofollow"');
    expect(claims).toContain("adExternalLinkWarning");
    expect(admin).toContain("adExternalLinkWarning");
  });
});
