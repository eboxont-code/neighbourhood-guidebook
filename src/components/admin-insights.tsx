import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { funnel, summarise, summariseContactActions, type Counted, type EventRow } from "@/lib/insights";
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
  const [failed, setFailed] = useState(false);
  useEffect(() => {
    const since = new Date(Date.now() - 30 * 86400000).toISOString();
    supabase.from("analytics_events").select("event, listing_slug, query, created_at").gte("created_at", since).order("created_at", { ascending: false }).limit(10000)
      .then(({ data, error }) => { if (error) setFailed(true); else setRows(data ?? []); });
  }, []);
  if (failed) return <p role="alert" className="text-sm text-error">{t("inError")}</p>;
  if (!rows) return <p className="text-sm text-muted-foreground">{t("inLoading")}</p>;
  const s = summarise(rows, days);
  const f = funnel(rows, days);
  const contactActions = summariseContactActions(rows, days);
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
      <h2 className="text-base font-semibold">{t("inContactActions")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("inContactActionsNote")}</p>
      <p className="mt-3 text-3xl font-semibold tabular-nums">{new Intl.NumberFormat().format(contactActions.total)}</p>
      <p className="text-sm text-muted-foreground">
        {t("inCallTaps")}: {contactActions.calls} · {t("inWhatsAppTaps")}: {contactActions.whatsapps}
      </p>
    </section>
    <Table title={t("inTopContactListings")} rows={contactActions.listings} />
    <Table title={t("inTopPreviews")} rows={f.topPreviews} />
    <Table title={t("inZero")} rows={s.zero} />
    <Table title={t("inSearches")} rows={s.searches} />
    <Table title={t("inClicks")} rows={s.clicks} label={clickLabel} />
    <Table title={t("inListings")} rows={s.listings} />
  </div>;
}
