import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { describe, expect, it } from "vitest";
import { TRACK_EVENTS } from "@/lib/track";
import { redactLocation, redactLocationText } from "@/lib/location-redaction";

function readProjectFile(path: string): string {
  return readFileSync(resolve(process.cwd(), path), "utf8");
}

function extractAllowedEvents(sql: string): string[] {
  const match = sql.match(/CHECK\s*\(\s*event\s+IN\s*\(([\s\S]*?)\)\s*\)/i);
  if (!match?.[1]) throw new Error("Analytics event constraint was not found.");
  return [...match[1].matchAll(/'([^']+)'/g)].map((entry) => entry[1]!);
}

describe("SEWA database contracts", () => {
  it("keeps frontend analytics events aligned with the deployed SQL migration", () => {
    const sql = readProjectFile(
      "supabase/migrations/20261104100000_listing_promotions.sql",
    );
    const allowed = extractAllowedEvents(sql);

    expect(new Set(allowed).size).toBe(allowed.length);
    expect([...allowed].sort()).toEqual([...TRACK_EVENTS].sort());
  });

  it("keeps sponsored placement migrations byte-identical", () => {
    expect(readProjectFile("drizzle/migrations/0012_listing_promotions.sql")).toBe(
      readProjectFile("supabase/migrations/20261104100000_listing_promotions.sql"),
    );
  });

  it("keeps the parallel migration history aligned with the deployed SQL migration", () => {
    const deployed = readProjectFile(
      "supabase/migrations/20261029004600_analytics_funnel_events.sql",
    );
    const parallel = readProjectFile(
      "drizzle/migrations/0009_analytics_funnel_events.sql",
    );

    expect(extractAllowedEvents(parallel).sort()).toEqual(
      extractAllowedEvents(deployed).sort(),
    );
  });

  it("removes precise coordinates from client and server error context", () => {
    const safe = redactLocation({ lat: 27.7149, lng: 85.3109, message: "near 27.7149, 85.3109" });
    expect(safe).toEqual({ message: "near [location redacted]" });
    expect(redactLocationText("/near/27.7149,85.3109")).toBe("/near/[location redacted]");
  });

  it("keeps public listing reads and administrator writes protected by row-level policies", () => {
    const sql = readProjectFile(
      "drizzle/migrations/0002_listings_admin_and_roles.sql",
    );

    expect(sql).toMatch(/ALTER TABLE public\.listings ENABLE ROW LEVEL SECURITY/i);
    expect(sql).toMatch(/status\s*=\s*'published'/i);
    expect(sql).toMatch(/public\.has_role\(auth\.uid\(\),\s*'admin'\)/i);
    expect(sql).toMatch(/CREATE POLICY "Admins can add listings"/i);
    expect(sql).toMatch(/CREATE POLICY "Admins can change listings"/i);
    expect(sql).toMatch(/CREATE POLICY "Admins can remove listings"/i);
  });
  it("keeps all public form rate checks atomic across concurrent submissions", () => {
    const deployed = readProjectFile(
      "supabase/migrations/20261102130000_atomic_form_rate_limits.sql",
    );
    const parallel = readProjectFile(
      "drizzle/migrations/0010_atomic_form_rate_limits.sql",
    );

    expect(parallel).toBe(deployed);
    expect(deployed).toMatch(/SECURITY DEFINER/i);
    expect(deployed).toMatch(/SET search_path\s*=\s*pg_catalog\b/i);
    expect(deployed).not.toMatch(/SET search_path\s*=\s*pg_catalog\s*,\s*public/i);
    expect([...deployed.matchAll(/SET search_path\s*=\s*pg_catalog\b/gi)]).toHaveLength(5);
    const lock = deployed.indexOf("pg_catalog.pg_advisory_xact_lock");
    const eventTime = deployed.indexOf("event_time := pg_catalog.clock_timestamp()");
    const firstCount = deployed.indexOf("SELECT count(*)");
    expect(lock).toBeGreaterThanOrEqual(0);
    expect(eventTime).toBeGreaterThan(lock);
    expect(firstCount).toBeGreaterThan(eventTime);
    expect(deployed).toMatch(/created_at\s*>\s*event_time\s*-\s*interval '10 minutes'/i);
    expect(deployed).toMatch(/created_at\s*>\s*event_time\s*-\s*interval '1 hour'/i);
    expect(deployed).toMatch(/INSERT INTO public\.form_rate_log \(key_hash, created_at\) VALUES \(k, event_time\)/i);
    expect(deployed).toMatch(/NEW\.client_key\s*:=\s*NULL/i);
    expect(deployed).toMatch(/REVOKE ALL ON FUNCTION public\.enforce_form_rate_limit\(\) FROM PUBLIC, anon, authenticated/i);

    const rateTriggers = [
      "drizzle/migrations/0001_form_rate_limit.sql",
      "drizzle/migrations/0005_business_submissions_and_form_topics.sql",
      "drizzle/migrations/0007_business_claims.sql",
    ].map(readProjectFile).join("\n");
    expect(rateTriggers).toMatch(/CREATE TRIGGER contact_messages_rate_limit[\s\S]*?ON public\.contact_messages[\s\S]*?EXECUTE FUNCTION public\.enforce_form_rate_limit\(\)/i);
    expect(rateTriggers).toMatch(/CREATE TRIGGER correction_reports_rate_limit[\s\S]*?ON public\.correction_reports[\s\S]*?EXECUTE FUNCTION public\.enforce_form_rate_limit\(\)/i);
    expect(rateTriggers).toMatch(/CREATE TRIGGER business_submissions_rate_limit[\s\S]*?ON public\.business_submissions[\s\S]*?EXECUTE FUNCTION public\.enforce_form_rate_limit\(\)/i);
    expect(rateTriggers).toMatch(/CREATE TRIGGER business_claims_rate_limit[\s\S]*?ON public\.business_claims[\s\S]*?EXECUTE FUNCTION public\.enforce_form_rate_limit\(\)/i);
  });

  it("keeps admin authorization helpers unavailable to anonymous callers", () => {
    const sql = readProjectFile(
      "supabase/migrations/20261102130000_atomic_form_rate_limits.sql",
    );
    expect(sql).toMatch(/REVOKE ALL ON FUNCTION public\.has_role\(uuid, public\.app_role\) FROM PUBLIC, anon/i);
    expect(sql).toMatch(/GRANT EXECUTE ON FUNCTION public\.has_role\(uuid, public\.app_role\) TO authenticated/i);
    expect(sql).toMatch(/REVOKE ALL ON FUNCTION public\.has_role\(uuid, public\.app_role\) FROM PUBLIC, anon, service_role/i);
    expect(sql).toMatch(/auth\.uid\(\) IS NOT NULL[\s\S]*?_user_id = auth\.uid\(\)/i);
    expect(sql).toMatch(/SET search_path\s*=\s*pg_catalog\b/i);
    expect(sql).not.toMatch(/SET search_path\s*=\s*pg_catalog\s*,\s*public/i);

    const policyMigrations = [
      "drizzle/migrations/0002_listings_admin_and_roles.sql",
      "drizzle/migrations/0003_contact_messages_lead_status.sql",
      "drizzle/migrations/0005_business_submissions_and_form_topics.sql",
      "drizzle/migrations/0007_business_claims.sql",
      "drizzle/migrations/0008_analytics_events.sql",
    ].map(readProjectFile).join("\n");
    const rolePolicies = [...policyMigrations.matchAll(/CREATE POLICY[\s\S]*?;/gi)]
      .map((match) => match[0])
      .filter((policy) => /public\.has_role\s*\(/i.test(policy));
    expect(rolePolicies.length).toBeGreaterThan(0);
    for (const policy of rolePolicies) {
      expect(policy).toMatch(/\bTO authenticated\b/i);
      expect(policy).not.toMatch(/\bTO anon\b/i);
    }
  });

  it("keeps website-service quote fields scoped to visitor requests and admin updates", () => {
    const migrations = [
      readProjectFile("supabase/migrations/20261103114000_service_revenue_pipeline.sql"),
      readProjectFile("drizzle/migrations/0011_service_revenue_pipeline.sql"),
    ];
    expect(migrations[0]).toBe(migrations[1]);
    for (const sql of migrations) {
      expect(sql).toMatch(/service_package text/i);
      expect(sql).toMatch(/budget_band text/i);
      expect(sql).toMatch(/quote_amount_npr integer/i);
      expect(sql).toMatch(/paid_amount_npr integer NOT NULL DEFAULT 0/i);
      expect(sql).toMatch(/payment_status text NOT NULL DEFAULT 'not_quoted'/i);
      expect(sql).toMatch(/GRANT INSERT \(service_package, budget_band\) ON public\.contact_messages TO anon, authenticated/i);
      expect(sql).toMatch(/GRANT UPDATE \(quote_amount_npr, paid_amount_npr, payment_status\) ON public\.contact_messages TO authenticated/i);
      expect(sql).not.toMatch(/GRANT INSERT \([^)]*(?:quote_amount_npr|paid_amount_npr|payment_status)/i);
      expect(sql).not.toMatch(/GRANT UPDATE \([^)]*(?:quote_amount_npr|paid_amount_npr|payment_status)\)[^;]*TO anon/i);
      expect(sql).toMatch(/service_package_select/);
      expect(sql).toMatch(/service_quote_submit/);
    }

    const packages = readProjectFile("src/lib/commerce.ts");
    expect(packages).toMatch(/launch/);
    expect(packages).toMatch(/growth/);
    expect(packages).toMatch(/care/);
    expect(packages).toMatch(/promotion/);
    expect(packages).toMatch(/SERVICE_BUDGET_BANDS/);
  });

  it("keeps public form submission tables row-level protected and admin-only for private reads", () => {
    const migrations = [
      "drizzle/migrations/0000_create_contact_and_correction_forms.sql",
      "drizzle/migrations/0002_listings_admin_and_roles.sql",
      "drizzle/migrations/0005_business_submissions_and_form_topics.sql",
      "drizzle/migrations/0007_business_claims.sql",
      "drizzle/migrations/0008_analytics_events.sql",
    ].map(readProjectFile).join("\n");

    for (const table of [
      "contact_messages",
      "correction_reports",
      "business_submissions",
      "business_claims",
      "analytics_events",
    ]) {
      expect(migrations).toMatch(new RegExp(`ALTER TABLE public\\.${table} ENABLE ROW LEVEL SECURITY`, "i"));
      expect(migrations).not.toMatch(new RegExp(`GRANT\\s+(?:SELECT|UPDATE|DELETE|ALL)\\s+ON\\s+public\\.${table}\\s+TO\\s+anon`, "i"));
    }

    expect(migrations).toMatch(/CREATE POLICY "Admins can read contact messages"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(migrations).toMatch(/CREATE POLICY "Admins can read correction reports"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(migrations).toMatch(/CREATE POLICY "Admins read claims"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(migrations).toMatch(/CREATE POLICY "Admins read business submissions"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(migrations).toMatch(/CREATE POLICY "Admins can read events"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
  });

});
