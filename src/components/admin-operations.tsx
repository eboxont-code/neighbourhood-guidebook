import { useCallback, useEffect, useState } from "react";
import { RefreshCw, ShieldCheck, ShieldAlert, Clock3 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import type { Json, Tables } from "@/integrations/supabase/types";
import { useI18n, type Key } from "@/lib/i18n";

type AuditEntry = Tables<"admin_audit_log">;
type HealthState = {
  publishedListings: number;
  analyticsEvents: number;
  auditEntries: number;
  checkedAt: string;
};

const actionLabels: Record<string, Key> = {
  listing_created: "auListingCreated",
  listing_updated: "auListingUpdated",
  listing_deleted: "auListingDeleted",
  claim_status_changed: "auClaimStatusChanged",
  submission_status_changed: "auSubmissionStatusChanged",
  lead_status_changed: "auLeadStatusChanged",
};

const resourceLabels: Record<string, Key> = {
  listing: "auResourceListing",
  business_claim: "auResourceBusinessClaim",
  business_submission: "auResourceBusinessSubmission",
  contact_message: "auResourceContactMessage",
};

function formatTime(value: string, lang: "en" | "ne"): string {
  return new Intl.DateTimeFormat(lang === "ne" ? "ne-NP" : "en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Asia/Kathmandu",
  }).format(new Date(value));
}

/** Only approved, non-sensitive audit metadata is displayed. */
function detailSummary(details: Json, t: (key: Key) => string): string | null {
  if (!details || typeof details !== "object" || Array.isArray(details)) return null;
  const record = details as { [key: string]: Json | undefined };
  const changed = record.changed_fields;
  if (Array.isArray(changed)) {
    const fields = changed.filter((value): value is string => typeof value === "string");
    return fields.length ? `${t("auChangedFields")}: ${fields.join(", ")}` : null;
  }
  const before = record.previous_status;
  const after = record.current_status;
  if (typeof before === "string" && typeof after === "string") {
    return `${t("auStatusChange")}: ${before} → ${after}`;
  }
  const slug = record.slug;
  return typeof slug === "string" ? slug : null;
}

function Metric({ label, value }: { label: string; value: number }) {
  const { lang } = useI18n();
  return (
    <div className="rounded-xl border border-border bg-background p-3">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-1 text-2xl font-semibold tabular-nums">
        {new Intl.NumberFormat(lang === "ne" ? "ne-NP" : "en").format(value)}
      </p>
    </div>
  );
}

export function AdminOperations() {
  const { t, lang } = useI18n();
  const [rows, setRows] = useState<AuditEntry[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [health, setHealth] = useState<HealthState | null>(null);
  const [healthFailed, setHealthFailed] = useState(false);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setFailed(false);
    setHealthFailed(false);
    try {
      const [audit, listingCount, eventCount, auditCount] = await Promise.all([
        supabase.from("admin_audit_log").select("*").order("created_at", { ascending: false }).limit(100),
        supabase.from("listings").select("id", { count: "exact", head: true }).eq("status", "published"),
        supabase.from("analytics_events").select("id", { count: "exact", head: true }),
        supabase.from("admin_audit_log").select("id", { count: "exact", head: true }),
      ]);

      if (audit.error) {
        setFailed(true);
        setRows(null);
      } else {
        setRows(audit.data ?? []);
      }

      if (listingCount.error || eventCount.error || auditCount.error) {
        setHealthFailed(true);
        setHealth(null);
      } else {
        setHealth({
          publishedListings: listingCount.count ?? 0,
          analyticsEvents: eventCount.count ?? 0,
          auditEntries: auditCount.count ?? 0,
          checkedAt: new Date().toISOString(),
        });
      }
    } catch {
      setFailed(true);
      setHealthFailed(true);
      setRows(null);
      setHealth(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    void load();
  }, [load]);

  const number = (value: number) =>
    new Intl.NumberFormat(lang === "ne" ? "ne-NP" : "en").format(value);

  return (
    <div className="space-y-5">
      <section aria-labelledby="au-health-title" className="rounded-2xl border border-border bg-card p-4 sm:p-5">
        <div className="flex flex-wrap items-start justify-between gap-3">
          <div>
            <h2 id="au-health-title" className="text-lg font-semibold">{t("auHealthTitle")}</h2>
            <p className="mt-1 max-w-2xl text-sm leading-relaxed text-muted-foreground">{t("auHealthIntro")}</p>
          </div>
          <button
            type="button"
            onClick={() => void load()}
            disabled={loading}
            className="action-btn action-secondary min-h-11 gap-2 px-4 disabled:opacity-60"
          >
            <RefreshCw aria-hidden className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            {loading ? t("auRefreshing") : t("auRefresh")}
          </button>
        </div>

        {healthFailed ? (
          <p role="alert" className="mt-4 flex items-center gap-2 text-sm font-semibold text-error">
            <ShieldAlert aria-hidden className="h-4 w-4" />{t("auHealthUnavailable")}
          </p>
        ) : health ? (
          <>
            <p role="status" className="mt-4 flex items-center gap-2 text-sm font-semibold text-success">
              <ShieldCheck aria-hidden className="h-4 w-4" />{t("auHealthReady")}
            </p>
            <div className="mt-3 grid gap-3 sm:grid-cols-3">
              <Metric label={t("auPublishedListings")} value={health.publishedListings} />
              <Metric label={t("auAnalyticsEvents")} value={health.analyticsEvents} />
              <Metric label={t("auAuditEntries")} value={health.auditEntries} />
            </div>
            <p className="mt-3 flex flex-wrap items-center gap-1.5 text-xs text-muted-foreground">
              <Clock3 aria-hidden className="h-3.5 w-3.5" />
              {t("auLastChecked")}: {formatTime(health.checkedAt, lang)}
            </p>
          </>
        ) : (
          <p className="mt-4 text-sm text-muted-foreground">{t("auAuditLoading")}</p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-muted-foreground">{t("auHealthNote")}</p>
      </section>

      <section aria-labelledby="au-audit-title">
        <div className="mb-3">
          <h2 id="au-audit-title" className="text-lg font-semibold">{t("auAuditTitle")}</h2>
          <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t("auAuditIntro")}</p>
        </div>

        {failed ? (
          <div className="rounded-2xl border border-border bg-card p-4">
            <p role="alert" className="text-sm text-error">{t("auAuditError")}</p>
            <button type="button" onClick={() => void load()} className="action-btn action-secondary mt-3 min-h-11 px-4">
              {t("adRetry")}
            </button>
          </div>
        ) : rows === null ? (
          <p className="text-sm text-muted-foreground">{t("auAuditLoading")}</p>
        ) : rows.length === 0 ? (
          <p className="rounded-2xl border border-border bg-card p-4 text-sm text-muted-foreground">{t("auAuditEmpty")}</p>
        ) : (
          <ol className="space-y-2.5">
            {rows.map((row) => {
              const action = t(actionLabels[row.action] ?? "auUnknownAction");
              const resource = t(resourceLabels[row.resource_type] ?? "auResourceListing");
              const label = row.resource_label || row.resource_id;
              const summary = detailSummary(row.details, t);
              const actor = row.actor_user_id
                ? t("auActor").replace("{id}", row.actor_user_id.slice(0, 8))
                : t("auSystemActor");
              return (
                <li key={row.id} className="rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <p className="font-semibold">{action}</p>
                    <time className="text-xs tabular-nums text-muted-foreground">{formatTime(row.created_at, lang)}</time>
                  </div>
                  <p className="mt-1 break-words text-sm">{resource}: <span className="font-medium">{label}</span></p>
                  {summary && <p className="mt-1 break-words text-sm text-muted-foreground">{summary}</p>}
                  <p className="mt-2 text-xs text-muted-foreground">{actor}</p>
                </li>
              );
            })}
          </ol>
        )}
        {rows && rows.length > 0 && <p className="mt-3 text-xs text-muted-foreground">{t("auLatestLimit").replace("{n}", number(rows.length))}</p>}
      </section>
    </div>
  );
}
