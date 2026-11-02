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
      "supabase/migrations/20261029010000_analytics_funnel_events.sql",
    );
    const allowed = extractAllowedEvents(sql);

    expect(new Set(allowed).size).toBe(allowed.length);
    expect([...allowed].sort()).toEqual([...TRACK_EVENTS].sort());
  });

  it("keeps the parallel migration history aligned with the deployed SQL migration", () => {
    const deployed = readProjectFile(
      "supabase/migrations/20261029010000_analytics_funnel_events.sql",
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
    expect(deployed).toMatch(/SET search_path\s*=\s*pg_catalog,\s*public/i);
    const lock = deployed.indexOf("pg_advisory_xact_lock");
    const firstCount = deployed.indexOf("SELECT count(*)");
    expect(lock).toBeGreaterThanOrEqual(0);
    expect(firstCount).toBeGreaterThan(lock);
    expect(deployed).toMatch(/NEW\.client_key\s*:=\s*NULL/i);
    expect(deployed).toMatch(/REVOKE ALL ON FUNCTION public\.enforce_form_rate_limit\(\) FROM PUBLIC, anon, authenticated/i);
  });

  it("keeps admin authorization helpers unavailable to anonymous callers", () => {
    const sql = readProjectFile(
      "supabase/migrations/20261102130000_atomic_form_rate_limits.sql",
    );
    expect(sql).toMatch(/REVOKE ALL ON FUNCTION public\.has_role\(uuid, public\.app_role\) FROM PUBLIC, anon/i);
    expect(sql).toMatch(/GRANT EXECUTE ON FUNCTION public\.has_role\(uuid, public\.app_role\) TO authenticated, service_role/i);
    expect(sql).toMatch(/SET search_path\s*=\s*pg_catalog,\s*public/i);
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
    expect(migrations).toMatch(/CREATE POLICY "Admins read claims"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(migrations).toMatch(/CREATE POLICY "Admins read business submissions"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
    expect(migrations).toMatch(/CREATE POLICY "Admins can read events"[\s\S]*?has_role\(auth\.uid\(\),\s*'admin'/i);
  });;

});
