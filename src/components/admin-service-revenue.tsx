import type { Tables } from "@/integrations/supabase/types";
import { useI18n, type Key } from "@/lib/i18n";

type RevenueRow = Pick<Tables<"contact_messages">, "service_package" | "page" | "quote_amount_npr" | "paid_amount_npr" | "payment_status">;

export function AdminServiceRevenue({ rows }: { rows: RevenueRow[] }) {
  const { t } = useI18n();
  const leads = rows.filter((row) => !!row.service_package || row.page === "for-businesses" || row.page === "preview");
  const active = leads.filter((row) => row.payment_status !== "cancelled" && row.payment_status !== "refunded");
  const quoted = active.reduce((sum, row) => sum + (row.quote_amount_npr ?? 0), 0);
  const paid = active.reduce((sum, row) => sum + row.paid_amount_npr, 0);
  const outstanding = active.reduce((sum, row) => sum + Math.max(0, (row.quote_amount_npr ?? 0) - row.paid_amount_npr), 0);
  const packages = new Map<string, number>();
  for (const lead of leads) if (lead.service_package) packages.set(lead.service_package, (packages.get(lead.service_package) ?? 0) + 1);
  const money = (value: number) => `NPR ${new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(value)}`;

  return (
    <section aria-labelledby="sales-title" className="rounded-2xl border border-border bg-card p-4">
      <h2 id="sales-title" className="text-lg font-semibold">{t("adRevenueTitle")}</h2>
      <p className="mt-1 text-sm text-muted-foreground">{t("adRevenueNote")}</p>
      <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs font-semibold text-muted-foreground">{t("adRevenuePaid")}</p><p className="mt-1 text-xl font-bold tabular-nums">{money(paid)}</p></div>
        <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs font-semibold text-muted-foreground">{t("adRevenueOutstanding")}</p><p className="mt-1 text-xl font-bold tabular-nums">{money(outstanding)}</p></div>
        <div className="rounded-xl bg-muted/60 p-3"><p className="text-xs font-semibold text-muted-foreground">{t("adRevenueQuoted")}</p><p className="mt-1 text-xl font-bold tabular-nums">{money(quoted)}</p></div>
      </div>
      <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-sm">
        <span>{t("adRevenueLeads")}: <strong className="tabular-nums">{leads.length}</strong></span>
        {[...packages.entries()].map(([id, count]) => <span key={id}>{t(`pkg_${id}_title` as Key)}: <strong className="tabular-nums">{count}</strong></span>)}
      </div>
    </section>
  );
}
