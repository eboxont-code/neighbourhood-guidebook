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
});
