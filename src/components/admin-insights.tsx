import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { getBusiness } from "@/data/directory";
import { funnel, summarise, summariseLeads, type Counted, type EventRow, type LeadRow } from "@/lib/insights";
import { useI18n, type Key } from "@/lib/i18n";

function Table({ title, rows, label }: { title: string; rows: Counted; label?: (k: string) => string }) {
  const { t } = useI18n();
  return <section className="rounded-2xl border border-border bg-card p-4">
    <h2 className="mb-2 text-base font-semibold">{title}</h2>
    {rows.length ? <table className="w-full text-sm"><tbody>{rows.map(([k, n]) => <tr key={k} className="border-t border-border first:border-0"><td className="break-all py-2 pr-2">{label ? label(k) : k}</td><td className="py-2 text-right font-semibold tabular-nums">{n}</td></tr>)}</tbody></table>
      : <p className="text-sm text-muted-foreground">{t("inNone")}</p>}
  </section>;
}

export function AdminInsights() {
  const { t } = useI18n();
  const [days, setDays] = useState<7 | 30>(7);
  const [rows, setRows] = useState<EventRow[] | null>(null);
  const [leads, setLeads] = useState<LeadRow[] | null>(null);
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    Promise.all([
      supabase.from("analytics_events").select("event, listing_slug, query, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(10000),
      supabase.from("contact_messages").select("source_listing_slug, created_at").not("source_listing_slug", "is", null).gte("created_at", since).order("created_at", { ascending: false }).limit(10000),
    ]).then(([events, enquiries]) => {
      if (events.error || enquiries.error) {
        setFailed(true);
        return;
      }
      setRows(events.data ?? []);
      setLeads(enquiries.data ?? []);
    });
  }, []);
  if (failed) return <p role="alert" className="text-sm text-error">{t("inError")}</p>;
  if (!rows || !leads) return <p className="text-sm text-muted-foreground">{t("inLoading")}</p>;
  const s = summarise(rows, days);
  const f = funnel(rows, days);
  const leadSummary = summariseLeads(leads, days);
  const clickLabel = (k: string) => { const key = `inEv_${k}` as Key; return t(key); };
  return <div className="space-y-4">
    <p className="text-sm text-muted-foreground">{t("inIntro")}</p>
    <div role="group" aria-label={t("inPeriod")} className="chip-row">
      {([7, 30] as const).map((d) => <button key={d} type="button" aria-pressed={days === d} onClick={() => setDays(d)} className={`chip min-h-11 ${days === d ? "chip-on" : ""}`}>{t(d === 7 ? "inDays7" : "inDays30")}</button>)}
    </div>
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="text-base font-semibold">{t("inFunnel")}</h2>
      <p className="mb-2 text-sm text-muted-foreground">{t("inFunnelNote")}</p>
      <table className="w-full text-sm"><tbody>{f.steps.map((st, i) => <tr key={st.event} className="border-t border-border first:border-0"><td className="py-2 pr-2">{clickLabel(st.event)}</td><td className="py-2 text-right font-semibold tabular-nums">{st.count}</td><td className="w-14 py-2 text-right tabular-nums text-muted-foreground">{i === 0 ? "" : st.rate === null ? "-" : `${st.rate}%`}</td></tr>)}</tbody></table>
    </section>
    <section className="rounded-2xl border border-border bg-card p-4">
      <h2 className="text-base font-semibold">{t("inBusinessLeads")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("inBusinessLeadsNote")}</p>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{new Intl.NumberFormat().format(leadSummary.total)}</p>
      <p className="text-sm text-muted-foreground">{t("inBusinessLeadTotal")}</p>
    </section>
    <Table title={t("inTopLeadListings")} rows={leadSummary.listings} label={(slug) => getBusiness(slug)?.name ?? slug} />
    <Table title={t("inTopPreviews")} rows={f.topPreviews} />
    <Table title={t("inZero")} rows={s.zero} />
    <Table title={t("inSearches")} rows={s.searches} />
    <Table title={t("inClicks")} rows={s.clicks} label={clickLabel} />
    <Table title={t("inListings")} rows={s.listings} />
  </div>;
}
