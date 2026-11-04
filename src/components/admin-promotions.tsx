import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { useI18n } from "@/lib/i18n";

type Promotion = Tables<"listing_promotions">;
type Listing = Pick<Tables<"listings">, "id" | "name" | "slug" | "area" | "category" | "status">;
type Placement = "area_featured" | "category_featured";
type PromotionStatus = "draft" | "quoted" | "paid" | "cancelled" | "refunded";
type FormState = {
  id: string | null;
  listingId: string;
  placement: Placement;
  startDate: string;
  endDate: string;
  quoteAmount: string;
  status: PromotionStatus;
  confirmReceived: boolean;
  confirmRefunded: boolean;
};

const DAY_MS = 86_400_000;
const NEPAL_OFFSET_MS = 345 * 60_000;

function dateInKathmandu(value: Date | string): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(value instanceof Date ? value : new Date(value));
}

function addDays(day: string, amount: number): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, date! + amount)).toISOString().slice(0, 10);
}

function kathmanduMidnight(day: string): string {
  const [year, month, date] = day.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, date!) - NEPAL_OFFSET_MS).toISOString();
}

function initialForm(): FormState {
  const today = dateInKathmandu(new Date());
  return {
    id: null,
    listingId: "",
    placement: "area_featured",
    startDate: today,
    endDate: addDays(today, 29),
    quoteAmount: "",
    status: "draft",
    confirmReceived: false,
    confirmRefunded: false,
  };
}

function money(value: number): string {
  return new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(value);
}

const field = "field min-h-11 w-full";

export function AdminPromotions() {
  const { t } = useI18n();
  const [promotions, setPromotions] = useState<Promotion[] | null>(null);
  const [listings, setListings] = useState<Listing[]>([]);
  const [clickEvents, setClickEvents] = useState<{ query: string | null; created_at: string }[]>([]);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(() => initialForm());

  async function load() {
    setFailed(false);
    const since = new Date(Date.now() - 365 * DAY_MS).toISOString();
    const [p, l, e] = await Promise.all([
      supabase.from("listing_promotions").select("*").order("created_at", { ascending: false }),
      supabase.from("listings").select("id,name,slug,area,category,status").eq("status", "published").order("name"),
      supabase.from("analytics_events").select("query").eq("event", "sponsored_click").gte("created_at", since).limit(10000),
    ]);
    if (p.error || l.error) {
      setFailed(true);
      return;
    }
    setPromotions(p.data ?? []);
    setListings((l.data ?? []) as Listing[]);
    if (!e.error) {
      setClickEvents((e.data ?? []) as { query: string | null; created_at: string }[]);
    }
  }

  useEffect(() => { void load(); }, []);

  const listingById = useMemo(() => new Map(listings.map((listing) => [listing.id, listing])), [listings]);
  const now = Date.now();
  const stats = useMemo(() => {
    const rows = promotions ?? [];
    const active = rows.filter((row) => row.status === "paid" && new Date(row.starts_at).getTime() <= now && new Date(row.ends_at).getTime() > now).length;
    const upcoming = rows.filter((row) => row.status === "paid" && new Date(row.starts_at).getTime() > now).length;
    const quoted = rows.reduce((sum, row) => sum + (row.status === "quoted" || row.status === "paid" || row.status === "refunded" ? row.quote_amount_npr ?? 0 : 0), 0);
    const netCash = rows.reduce((sum, row) => sum + row.paid_amount_npr - row.refunded_amount_npr, 0);
    return { active, upcoming, quoted, netCash, opens: clickEvents.length };
  }, [promotions, clickEvents, now]);

  const set = (patch: Partial<FormState>) => setForm((current) => ({ ...current, ...patch }));
  const reset = () => { setForm(initialForm()); setNote(null); };

  function edit(row: Promotion) {
    const endDay = addDays(dateInKathmandu(row.ends_at), -1);
    setForm({
      id: row.id,
      listingId: row.listing_id,
      placement: row.placement as Placement,
      startDate: dateInKathmandu(row.starts_at),
      endDate: endDay,
      quoteAmount: row.quote_amount_npr?.toString() ?? "",
      status: row.status as PromotionStatus,
      confirmReceived: row.status === "paid" || row.status === "refunded",
      confirmRefunded: row.status === "refunded",
    });
    setNote(null);
    document.getElementById("promotion-editor")?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  const selectedListing = listingById.get(form.listingId);
  const quote = form.quoteAmount.trim() === "" ? null : Number(form.quoteAmount);
  const validQuote = quote === null || (Number.isSafeInteger(quote) && quote > 0 && quote <= 5_000_000);

  async function save(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy || !form.listingId || !selectedListing) return;
    const endExclusive = addDays(form.endDate, 1);
    if (!form.startDate || !form.endDate || form.endDate < form.startDate) {
      setNote(t("promoInvalidWindow"));
      return;
    }
    if (!validQuote || ((form.status === "quoted" || form.status === "paid" || form.status === "refunded") && (!quote || quote < 1))) {
      setNote(t("promoInvalidAmounts"));
      return;
    }
    if (form.status === "paid" && !form.confirmReceived) {
      setNote(t("promoConfirmReceived"));
      return;
    }
    if (form.status === "refunded" && !form.confirmRefunded) {
      setNote(t("promoConfirmRefunded"));
      return;
    }
    const previous = form.id ? (promotions ?? []).find((row) => row.id === form.id) : undefined;
    if (form.status === "refunded" && (!previous || (previous.status !== "paid" && previous.status !== "refunded"))) {
      setNote(t("promoRefundRule"));
      return;
    }
    if (previous?.status === "paid" && form.status !== "paid" && form.status !== "refunded") {
      setNote(t("promoRefundRule"));
      return;
    }
    if (previous?.status === "paid" && quote !== previous.quote_amount_npr) {
      setNote(t("promoPaidQuoteLocked"));
      return;
    }
    if (previous?.status === "refunded") {
      setNote(t("promoRefundRule"));
      return;
    }
    if (form.id && (promotions ?? []).some((row) => row.id === form.id && row.status === "refunded") && form.status !== "refunded") {
      setNote(t("promoRefundRule"));
      return;
    }

    const startsAt = kathmanduMidnight(form.startDate);
    const endsAt = kathmanduMidnight(endExclusive);
    const target = form.placement === "area_featured" ? selectedListing.area : selectedListing.category;
    const conflict = (promotions ?? []).some((row) => {
      if (row.id === form.id || (row.status !== "quoted" && row.status !== "paid") || row.placement !== form.placement) return false;
      const existingTarget = form.placement === "area_featured" ? row.target_area : row.target_category;
      return existingTarget === target && row.starts_at < endsAt && row.ends_at > startsAt;
    });
    if (conflict) {
      setNote(t("promoConflict"));
      return;
    }

    const amount = quote ?? null;
    const payload = {
      listing_id: form.listingId,
      placement: form.placement,
      target_area: form.placement === "area_featured" ? selectedListing.area : null,
      target_category: form.placement === "category_featured" ? selectedListing.category : null,
      starts_at: startsAt,
      ends_at: endsAt,
      quote_amount_npr: form.status === "draft" ? null : amount,
      paid_amount_npr: form.status === "paid" || form.status === "refunded" ? amount ?? 0 : 0,
      refunded_amount_npr: form.status === "refunded" ? amount ?? 0 : 0,
      status: form.status,
    };
    setBusy(true);
    setNote(null);
    const result = form.id
      ? await supabase.from("listing_promotions").update(payload).eq("id", form.id).select("*").single()
      : await supabase.from("listing_promotions").insert(payload).select("*").single();
    setBusy(false);
    if (result.error || !result.data) {
      setNote(result.error?.code === "23P01" || result.error?.message.includes("promotion_slot_unavailable") ? t("promoConflict") : t("promoSaveError"));
      return;
    }
    setNote(t("promoSuccess"));
    setForm(initialForm());
    await load();
  }

  if (failed) return (
    <div className="space-y-3 rounded-2xl border border-border bg-card p-4">
      <p className="text-sm text-error">{t("promoLoadError")}</p>
      <button type="button" className="action-btn action-secondary" onClick={() => void load()}>{t("adRetry")}</button>
    </div>
  );
  if (!promotions) return <p className="text-sm text-muted-foreground">{t("promoLoading")}</p>;

  const statusLabel = (status: string) => t(({
    draft: "promoDraft",
    quoted: "promoQuoted",
    paid: "promoPaid",
    cancelled: "promoCancelled",
    refunded: "promoRefunded",
  }[status] ?? "promoDraft") as import("@/lib/i18n").Key);
  const statusClass = (status: string) => status === "paid"
    ? "bg-success-soft text-success"
    : status === "quoted" ? "bg-warning-soft text-warning" : "bg-muted text-muted-foreground";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{t("adTabPromotions")}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("promoIntro")}</p>
        <p className="rounded-xl border border-border bg-muted/40 p-3 text-sm">{t("promoPublicRule")}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{t("promoCashRule")} {t("promoUnpublished")}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          [t("promoActive"), String(stats.active)],
          [t("promoUpcoming"), String(stats.upcoming)],
          [t("promoNetCash"), "NPR " + money(stats.netCash)],
          [t("promoQuoteTotal"), "NPR " + money(stats.quoted)],
          [t("promoClickTotal"), money(stats.opens)],
        ].map(([label, value]) => (
          <section key={label} className="min-w-0 rounded-2xl border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 break-words text-lg font-semibold tabular-nums">{value}</p>
          </section>
        ))}
      </div>

      <section id="promotion-editor" className="scroll-mt-4 rounded-2xl border border-border bg-card p-4">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="text-base font-semibold">{t(form.id ? "promoEdit" : "promoNew")}</h3>
          {form.id && <button type="button" onClick={reset} className="min-h-10 px-2 text-sm font-semibold text-muted-foreground underline">{t("promoReset")}</button>}
        </div>
        <form className="space-y-3" onSubmit={save}>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{t("promoListing")}</span>
            <select className={field} required value={form.listingId} onChange={(e) => set({ listingId: e.target.value })}>
              <option value="">{t("promoSelectListing")}</option>
              {listings.map((listing) => <option key={listing.id} value={listing.id}>{listing.name} · {listing.area}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{t("promoPlacement")}</span>
            <select className={field} value={form.placement} onChange={(e) => set({ placement: e.target.value as Placement })}>
              <option value="area_featured">{t("promoAreaFeatured")}</option>
              <option value="category_featured">{t("promoCategoryFeatured")}</option>
            </select>
          </label>
          {selectedListing && (
            <p className="rounded-xl bg-muted/50 p-3 text-sm text-muted-foreground">
              {t("promoTarget")}: {form.placement === "area_featured" ? selectedListing.area : selectedListing.category}
            </p>
          )}
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">{t("promoStartDate")}</span>
              <input className={field} type="date" required value={form.startDate} onChange={(e) => set({ startDate: e.target.value })} />
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-semibold">{t("promoEndDate")}</span>
              <input className={field} type="date" required min={form.startDate} value={form.endDate} onChange={(e) => set({ endDate: e.target.value })} />
            </label>
          </div>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{t("promoQuote")}</span>
            <input className={field} type="number" min="1" max="5000000" step="1" inputMode="numeric" disabled={form.status === "paid" || form.status === "refunded"} value={form.quoteAmount} onChange={(e) => set({ quoteAmount: e.target.value })} placeholder="NPR" />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-sm font-semibold">{t("promoStatus")}</span>
            <select className={field} value={form.status} onChange={(e) => set({ status: e.target.value as PromotionStatus })}>
              {form.status === "paid" ? <>
                <option value="paid">{t("promoPaid")}</option>
                <option value="refunded">{t("promoRefunded")}</option>
              </> : form.status === "refunded" ? (
                <option value="refunded">{t("promoRefunded")}</option>
              ) : <>
                <option value="draft">{t("promoDraft")}</option>
                <option value="quoted">{t("promoQuoted")}</option>
                <option value="paid">{t("promoPaid")}</option>
                <option value="cancelled">{t("promoCancelled")}</option>
              </>}
            </select>
          </label>
          {form.status === "paid" && (
            <label className="flex min-h-11 items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4" checked={form.confirmReceived} onChange={(e) => set({ confirmReceived: e.target.checked })} />
              <span>{t("promoConfirmReceived")}</span>
            </label>
          )}
          {form.status === "refunded" && (
            <label className="flex min-h-11 items-start gap-2 text-sm">
              <input type="checkbox" className="mt-1 h-4 w-4" checked={form.confirmRefunded} onChange={(e) => set({ confirmRefunded: e.target.checked })} />
              <span>{t("promoConfirmRefunded")}</span>
            </label>
          )}
          {note && <p role="status" className="rounded-xl bg-muted/60 p-3 text-sm">{note}</p>}
          <div className="flex flex-wrap gap-2">
            <button type="submit" disabled={busy || !form.listingId} className="action-btn action-primary min-h-11 disabled:opacity-60">{busy ? t("promoSaving") : t("promoSave")}</button>
            {!form.id && <button type="button" onClick={reset} className="action-btn action-secondary min-h-11">{t("promoReset")}</button>}
          </div>
        </form>
      </section>

      <section className="space-y-3">
        <h3 className="text-base font-semibold">{t("promoBooked")}</h3>
        {promotions.length === 0 ? <p className="rounded-xl border border-border p-4 text-sm text-muted-foreground">{t("promoNoCampaigns")}</p> : (
          <div className="overflow-x-auto rounded-2xl border border-border bg-card">
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-muted/60 text-xs text-muted-foreground">
                <tr>
                  <th className="p-3">{t("promoListing")}</th>
                  <th className="p-3">{t("promoSlot")}</th>
                  <th className="p-3">{t("promoWindow")}</th>
                  <th className="p-3">{t("promoStatus")}</th>
                  <th className="p-3 text-right">{t("promoQuote")}</th>
                  <th className="p-3 text-right">{t("promoClicks")}</th>
                  <th className="p-3"></th>
                </tr>
              </thead>
              <tbody>
                {promotions.map((row) => {
                  const listing = listingById.get(row.listing_id);
                  const target = row.target_area ?? row.target_category ?? "—";
                  return (
                    <tr key={row.id} className="border-t border-border align-top">
                      <td className="p-3 font-semibold">{listing?.name ?? row.listing_id}</td>
                      <td className="p-3">{t(row.placement === "area_featured" ? "promoAreaFeatured" : "promoCategoryFeatured")}<span className="mt-1 block text-xs text-muted-foreground">{target}</span></td>
                      <td className="p-3 tabular-nums">{dateInKathmandu(row.starts_at)}<span className="block text-xs text-muted-foreground">– {addDays(dateInKathmandu(row.ends_at), -1)}</span></td>
                      <td className="p-3"><span className={"inline-flex rounded-lg px-2 py-1 text-xs font-semibold " + statusClass(row.status)}>{statusLabel(row.status)}</span></td>
                      <td className="p-3 text-right tabular-nums">{row.quote_amount_npr === null ? "—" : money(row.quote_amount_npr)}</td>
                      <td className="p-3 text-right tabular-nums">{clickEvents.filter((event) => event.query === row.placement + ":" + (row.target_area ?? row.target_category) && event.created_at >= row.starts_at && event.created_at < row.ends_at).length}</td>
                      <td className="p-3">{row.status !== "refunded" && <button type="button" className="text-sm font-semibold text-primary underline" onClick={() => edit(row)}>{t("promoEdit")}</button>}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
        <p className="text-xs leading-relaxed text-muted-foreground">{t("promoClickNote")}</p>
      </section>
    </div>
  );
}
