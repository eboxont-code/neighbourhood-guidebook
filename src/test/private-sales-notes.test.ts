import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { contactSchema, submissionSchema } from "@/components/forms";

function readProjectFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

describe("private sales-note boundaries", () => {
  it("keeps admin notes out of public form schemas and routes", () => {
    const contactPayload = contactSchema.parse({
      name: "Suman",
      message: "I would like a website.",
      admin_note: "private internal sales note",
      quote_amount_npr: 15000,
      paid_amount_npr: 5000,
      payment_status: "paid",
    });
    expect(contactPayload).not.toHaveProperty("admin_note");
    expect(contactPayload).not.toHaveProperty("quote_amount_npr");
    expect(contactPayload).not.toHaveProperty("paid_amount_npr");
    expect(contactPayload).not.toHaveProperty("payment_status");

    const submissionPayload = submissionSchema.parse({
      business_name: "Example Cafe",
      category: "cafes",
      area: "thamel",
      is_owner: "yes",
      contact: "owner@example.com",
      admin_note: "private internal review note",
    });
    expect(submissionPayload).not.toHaveProperty("admin_note");

    const publicSources = [
      "src/components/forms.tsx",
      "src/components/claim-form.tsx",
      "src/routes/contact.tsx",
      "src/routes/index.tsx",
      "src/routes/for-businesses.tsx",
      "src/routes/s.$slug.tsx",
      "src/routes/s.$slug_.website-preview.tsx",
      "src/lib/listings.functions.ts",
    ].map(readProjectFile).join("\n");

    expect(publicSources).not.toMatch(/\badmin_note\b/i);
    expect(publicSources).not.toMatch(/\.from\(["']contact_messages["']\)\s*\.select/i);

    const adminRoute = readProjectFile("src/routes/admin.tsx");
    expect(adminRoute).toMatch(/\.from\(["']contact_messages["']\)\s*\.select\(["']\*["']\)/i);
    expect(adminRoute).toMatch(/\bm\.admin_note\b/);
  });

  it("limits contact-message sales-note writes and reads to administrators", () => {
    const base = readProjectFile("drizzle/migrations/0000_create_contact_and_correction_forms.sql");
    const rolePolicies = readProjectFile("drizzle/migrations/0002_listings_admin_and_roles.sql");
    const leadMigration = readProjectFile("drizzle/migrations/0003_contact_messages_lead_status.sql");
    const deployedLeadMigration = readProjectFile("supabase/migrations/20261019014611_contact_messages_lead_status.sql");

    expect(leadMigration).toBe(deployedLeadMigration);
    expect(base).toMatch(/ALTER TABLE public\.contact_messages ENABLE ROW LEVEL SECURITY/i);
    expect(rolePolicies).toMatch(/CREATE POLICY "Admins can read contact messages"[\s\S]*?public\.has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(leadMigration).toMatch(/CREATE POLICY "Admins can update contact messages"[\s\S]*?public\.has_role\(auth\.uid\(\),\s*'admin'/i);

    const publicInsertGrant = leadMigration.match(/GRANT INSERT\s*\(([^)]*)\)\s*ON public\.contact_messages TO anon, authenticated/i);
    expect(publicInsertGrant?.[1]).toBeDefined();
    expect(publicInsertGrant?.[1]).not.toMatch(/\badmin_note\b/i);
    expect(leadMigration).toMatch(/GRANT UPDATE\s*\(status,\s*admin_note\)\s*ON public\.contact_messages TO authenticated/i);

    const submissions = readProjectFile("drizzle/migrations/0005_business_submissions_and_form_topics.sql");
    expect(submissions).toMatch(/CREATE POLICY "Visitors submit new businesses"[\s\S]*?admin_note IS NULL/i);
    expect(submissions).toMatch(/CREATE POLICY "Admins read business submissions"[\s\S]*?public\.has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(submissions).toMatch(/CREATE POLICY "Admins review business submissions"[\s\S]*?public\.has_role\(auth\.uid\(\),\s*'admin'/i);
  });
});
