import { useEffect, useMemo, useState, type FormEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import type { Business } from "@/data/directory";
import { rowToBusiness } from "@/lib/listings.functions";
import { leadTel, leadWhatsapp } from "@/lib/leads";
import { useI18n, type Key } from "@/lib/i18n";
import {
  buildSalesOutreachDraft,
  inboundLeadInterest,
  inboundLeadStage,
  isOpenSalesStage,
  salesFollowUpState,
  type SalesActivityType,
  type SalesInterest,
  type SalesStage,
  type SalesChannel,
} from "@/lib/sales-pipeline";

type Prospect = Tables<"business_sales_prospects">;
type Activity = Tables<"business_sales_activities">;
type InboundMessage = Tables<"contact_messages">;
type ListingRow = Pick<Tables<"listings">, "id" | "slug" | "name" | "area" | "category" | "data">;
type ProspectForm = {
  id: string | null;
  listingId: string;
  contactMessageId: string | null;
  stage: SalesStage;
  interest: SalesInterest;
  channel: SalesChannel;
  nextFollowUpAt: string;
  quoteAmount: string;
  paidAmount: string;
  notes: string;
};

const field = "field min-h-11 w-full";

function emptyForm(): ProspectForm {
  return {
    id: null,
    listingId: "",
    contactMessageId: null,
    stage: "identified",
    interest: "unsure",
    channel: "none",
    nextFollowUpAt: "",
    quoteAmount: "",
    paidAmount: "0",
    notes: "",
  };
}

function kathmanduInput(value: string | null): string {
  if (!value) return "";
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Kathmandu",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  }).formatToParts(new Date(value));
  const get = (type: string) => parts.find((part) => part.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")}T${get("hour")}:${get("minute")}`;
}

function kathmanduIso(value: string): string | null {
  if (!value) return null;
  const date = new Date(`${value}:00+05:45`);
  return Number.isFinite(date.getTime()) ? date.toISOString() : null;
}

function dateLabel(value: string | null, lang: "en" | "ne"): string {
  if (!value) return "—";
  return new Intl.DateTimeFormat(lang === "ne" ? "ne-NP" : "en-NP", {
    timeZone: "Asia/Kathmandu",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function npr(value: number): string {
  return new Intl.NumberFormat("en-NP", { maximumFractionDigits: 0 }).format(value);
}

const stageKeys: Record<SalesStage, Key> = {
  identified: "salesStageIdentified",
  qualified: "salesStageQualified",
  contacted: "salesStageContacted",
  replied: "salesStageReplied",
  meeting: "salesStageMeeting",
  proposal: "salesStageProposal",
  won: "salesStageWon",
  lost: "salesStageLost",
  do_not_contact: "salesStageDoNotContact",
};
const interestKeys: Record<SalesInterest, Key> = {
  website: "salesInterestWebsite",
  redesign: "salesInterestRedesign",
  care: "salesInterestCare",
  sponsored_placement: "salesInterestPromotion",
  unsure: "salesInterestUnsure",
};
const channelKeys: Record<SalesChannel, Key> = {
  whatsapp: "salesChannelWhatsapp",
  phone: "salesChannelPhone",
  email: "salesChannelEmail",
  in_person: "salesChannelInPerson",
  none: "salesChannelNone",
};
const activityKeys: Record<SalesActivityType, Key> = {
  call: "salesActivityCall",
  whatsapp: "salesActivityWhatsapp",
  email: "salesActivityEmail",
  meeting: "salesActivityMeeting",
  follow_up: "salesActivityFollowUp",
  proposal: "salesActivityProposal",
  payment: "salesActivityPayment",
  note: "salesActivityNote",
  stage_change: "salesActivityStageChange",
};

export function AdminSalesPipeline() {
  const { t, lang } = useI18n();
  const [prospects, setProspects] = useState<Prospect[] | null>(null);
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [inboundMessages, setInboundMessages] = useState<InboundMessage[]>([]);
  const [failed, setFailed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [form, setForm] = useState<ProspectForm>(() => emptyForm());
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [activityType, setActivityType] = useState<SalesActivityType>("whatsapp");
  const [activitySummary, setActivitySummary] = useState("");

  async function load() {
    setFailed(false);
    const [p, l, a, m] = await Promise.all([
      supabase.from("business_sales_prospects").select("*").order("updated_at", { ascending: false }),
      supabase.from("listings").select("id,slug,name,area,category,data").eq("status", "published").order("name"),
      supabase.from("business_sales_activities").select("*").order("happened_at", { ascending: false }).limit(1000),
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(300),
    ]);
    if (p.error || l.error || a.error || m.error) {
      setFailed(true);
      return;
    }
    const linkedIds = (p.data ?? []).map((prospect) => prospect.contact_message_id).filter((id): id is string => Boolean(id));
    const loadedIds = new Set((m.data ?? []).map((message) => message.id));
    const missingIds = linkedIds.filter((id) => !loadedIds.has(id));
    let linkedMessages: InboundMessage[] = [];
    if (missingIds.length > 0) {
      const linked = await supabase.from("contact_messages").select("*").in("id", missingIds);
      if (linked.error) {
        setFailed(true);
        return;
      }
      linkedMessages = linked.data ?? [];
    }
    setProspects(p.data ?? []);
    setBusinesses(((l.data ?? []) as ListingRow[]).map(rowToBusiness));
    setActivities(a.data ?? []);
    setInboundMessages([...(m.data ?? []), ...linkedMessages]);
  }

  useEffect(() => { void load(); }, []);

  const businessById = useMemo(() => new Map(businesses.map((business) => [business.id, business])), [businesses]);
  const messageById = useMemo(() => new Map(inboundMessages.map((message) => [message.id, message])), [inboundMessages]);
  const linkedMessageIds = useMemo(() => new Set((prospects ?? []).map((prospect) => prospect.contact_message_id).filter((id): id is string => Boolean(id))), [prospects]);
  const unconvertedMessages = inboundMessages.filter((message) =>
    !linkedMessageIds.has(message.id) &&
    (message.page === "for-businesses" || message.page === "preview" || Boolean(message.service_package) || Boolean(message.source_listing_slug))
  ).slice(0, 50);
  const now = Date.now();
  const open = (prospects ?? []).filter((prospect) => isOpenSalesStage(prospect.stage));
  const overdue = open.filter((prospect) => salesFollowUpState(prospect.next_follow_up_at, now) === "overdue");
  const dueSoon = open.filter((prospect) => salesFollowUpState(prospect.next_follow_up_at, now) === "due");
  const quoteFor = (prospect: Prospect) => prospect.contact_message_id
    ? messageById.get(prospect.contact_message_id)?.quote_amount_npr ?? 0
    : prospect.quote_amount_npr ?? 0;
  const cashFor = (prospect: Prospect) => prospect.contact_message_id
    ? messageById.get(prospect.contact_message_id)?.paid_amount_npr ?? 0
    : prospect.paid_amount_npr;
  const quotedValue = open.reduce((sum, prospect) => sum + quoteFor(prospect), 0);
  const receivedCash = (prospects ?? []).reduce((sum, prospect) => sum + cashFor(prospect), 0);
  const wonCount = (prospects ?? []).filter((prospect) => prospect.stage === "won").length;

  const visible = useMemo(() => (prospects ?? []).filter((prospect) => {
    if (filter !== "all" && prospect.stage !== filter) return false;
    const business = prospect.listing_id ? businessById.get(prospect.listing_id) : undefined;
    const message = prospect.contact_message_id ? messageById.get(prospect.contact_message_id) : undefined;
    const q = search.trim().toLowerCase();
    return !q || [business?.name, business?.area, business?.category, business?.slug, message?.business_name, message?.name, message?.phone]
      .some((value) => value?.toLowerCase().includes(q));
  }), [prospects, filter, search, businessById, messageById]);

  const selected = selectedId ? (prospects ?? []).find((prospect) => prospect.id === selectedId) ?? null : null;
  const selectedMessage = selected?.contact_message_id ? messageById.get(selected.contact_message_id) ?? null : null;
  const selectedBusiness = selected?.listing_id
    ? businessById.get(selected.listing_id) ?? null
    : businessById.get(form.listingId) ?? null;
  const outreachBusiness = selectedBusiness ?? (selectedMessage
    ? { name: selectedMessage.business_name || selectedMessage.name, area: "" }
    : null);
  const outreachPhone = selectedMessage?.phone ?? selectedBusiness?.whatsapp ?? selectedBusiness?.phone ?? null;
  const history = selected ? activities.filter((activity) => activity.prospect_id === selected.id) : [];
  const draft = outreachBusiness ? buildSalesOutreachDraft(outreachBusiness, form.interest, lang) : "";
  const whatsappUrl = outreachPhone && draft && isOpenSalesStage(form.stage)
    ? leadWhatsapp(outreachPhone, draft)
    : null;
  const phoneUrl = outreachPhone ? leadTel(outreachPhone) : null;

  const set = (patch: Partial<ProspectForm>) => setForm((current) => ({ ...current, ...patch }));

  function startNew() {
    setSelectedId(null);
    setForm(emptyForm());
    setNote(null);
  }

  function editProspect(prospect: Prospect) {
    setSelectedId(prospect.id);
    setForm({
      id: prospect.id,
      listingId: prospect.listing_id ?? "",
      contactMessageId: prospect.contact_message_id,
      stage: prospect.stage as SalesStage,
      interest: prospect.service_interest as SalesInterest,
      channel: prospect.contact_channel as SalesChannel,
      nextFollowUpAt: kathmanduInput(prospect.next_follow_up_at),
      quoteAmount: prospect.quote_amount_npr?.toString() ?? "",
      paidAmount: prospect.paid_amount_npr.toString(),
      notes: prospect.notes ?? "",
    });
    setActivitySummary("");
    setNote(null);
  }

  async function saveProspect(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (busy) return;
    const hasLinkedEnquiry = Boolean(form.contactMessageId);
    if (!hasLinkedEnquiry && (!form.listingId || !businessById.has(form.listingId))) {
      setNote(t("salesSelectBusiness"));
      return;
    }
    const quote = hasLinkedEnquiry ? null : form.quoteAmount.trim() === "" ? null : Number(form.quoteAmount);
    const paid = hasLinkedEnquiry ? 0 : Number(form.paidAmount || "0");
    const previousCash = form.id && !hasLinkedEnquiry ? (prospects ?? []).find((row) => row.id === form.id)?.paid_amount_npr ?? 0 : 0;
    if (paid < previousCash) {
      setNote(t("salesCashCannotDecrease"));
      return;
    }
    if ((quote !== null && (!Number.isSafeInteger(quote) || quote < 1 || quote > 5_000_000))
      || !Number.isSafeInteger(paid) || paid < 0 || paid > 5_000_000 || paid > (quote ?? 0)) {
      setNote(t("salesInvalidMoney"));
      return;
    }
    const followUp = kathmanduIso(form.nextFollowUpAt);
    if (form.nextFollowUpAt && !followUp) {
      setNote(t("salesInvalidDate"));
      return;
    }
    const existing = form.id ? (prospects ?? []).find((row) => row.id === form.id) : undefined;
    const payload = {
      listing_id: form.listingId || null,
      contact_message_id: form.contactMessageId,
      stage: form.stage,
      service_interest: form.interest,
      contact_channel: form.channel,
      next_follow_up_at: followUp,
      quote_amount_npr: quote,
      paid_amount_npr: paid,
      notes: form.notes.trim() || null,
    };
    setBusy(true);
    setNote(null);
    const result = form.id
      ? await supabase.from("business_sales_prospects").update(payload).eq("id", form.id).select("*").single()
      : await supabase.from("business_sales_prospects").insert(payload).select("*").single();
    if (result.error || !result.data) {
      setBusy(false);
      setNote(result.error?.code === "23505" ? t("salesDuplicate") : t("salesSaveError"));
      return;
    }

    const events: {
      prospect_id: string;
      activity_type: string;
      summary: string;
      amount_npr?: number;
    }[] = [];
    if (!existing) {
      events.push({
        prospect_id: result.data.id,
        activity_type: "note",
        summary: "Prospect added from the published SEWA directory.",
      });
    } else if (existing.stage !== result.data.stage) {
      events.push({
        prospect_id: result.data.id,
        activity_type: "stage_change",
        summary: `Stage changed from ${existing.stage} to ${result.data.stage}.`,
      });
    }
    if (paid > (existing?.paid_amount_npr ?? 0)) {
      events.push({
        prospect_id: result.data.id,
        activity_type: "payment",
        summary: t("salesPaymentLog"),
        amount_npr: paid - (existing?.paid_amount_npr ?? 0),
      });
    }
    let historyWarning = false;
    if (events.length) {
      const logged = await supabase.from("business_sales_activities").insert(events);
      historyWarning = Boolean(logged.error);
    }
    await load();
    editProspect(result.data);
    setBusy(false);
    setNote(historyWarning ? t("salesSavedHistoryWarning") : t("salesSaved"));
  }

  async function convertInboundMessage(message: InboundMessage) {
    if (busy || linkedMessageIds.has(message.id)) return;
    setBusy(true);
    setNote(null);
    const listing = businesses.find((business) => business.slug === message.source_listing_slug);
    const result = await supabase.from("business_sales_prospects").insert({
      listing_id: listing?.id ?? null,
      contact_message_id: message.id,
      stage: inboundLeadStage(message.status),
      service_interest: inboundLeadInterest(message.service_package),
      contact_channel: "none",
      quote_amount_npr: null,
      paid_amount_npr: 0,
    }).select("*").single();
    setBusy(false);
    if (result.error || !result.data) {
      setNote(result.error?.code === "23505" ? t("salesEnquiryAlreadyLinked") : t("salesConvertError"));
      await load();
      return;
    }
    const logged = await supabase.from("business_sales_activities").insert({
      prospect_id: result.data.id,
      activity_type: "note",
      summary: "Linked an existing inbound SEWA enquiry. Contact details, quotes and payments remain in the original contact message.",
    });
    await load();
    editProspect(result.data);
    setNote(logged.error ? t("salesConvertedHistoryWarning") : t("salesConverted"));
  }

  async function logActivity(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!selected || busy || !activitySummary.trim()) return;
    setBusy(true);
    setNote(null);
    const result = await supabase.from("business_sales_activities").insert({
      prospect_id: selected.id,
      activity_type: activityType,
      summary: activitySummary.trim(),
    });
    if (result.error) {
      setBusy(false);
      setNote(t("salesActivitySaveError"));
      return;
    }
    if (["call", "whatsapp", "email", "meeting"].includes(activityType)) {
      const updated = await supabase.from("business_sales_prospects")
        .update({ last_contacted_at: new Date().toISOString() })
        .eq("id", selected.id);
      if (updated.error) {
        setBusy(false);
        setNote(t("salesSavedHistoryWarning"));
        await load();
        return;
      }
    }
    setBusy(false);
    setActivitySummary("");
    await load();
    setNote(t("salesActivitySaved"));
  }

  async function copyDraft() {
    if (!draft || !outreachBusiness || !isOpenSalesStage(form.stage)) return;
    try {
      if (!navigator.clipboard?.writeText) throw new Error("clipboard_unavailable");
      await navigator.clipboard.writeText(draft);
      setNote(t("salesDraftCopied"));
    } catch {
      setNote(t("salesDraftCopyFailed"));
    }
  }

  const stageLabel = (stage: string) => t((stageKeys[stage as SalesStage] ?? "salesStageIdentified"));
  const interestLabel = (interest: string) => t((interestKeys[interest as SalesInterest] ?? "salesInterestUnsure"));
  const followUpLabel = (prospect: Prospect) => salesFollowUpState(prospect.next_follow_up_at, now);

  if (failed) return (
    <div className="rounded-2xl border border-border bg-card p-4">
      <p className="text-sm text-error">{t("salesLoadError")}</p>
      <button type="button" className="action-btn action-secondary mt-3" onClick={() => void load()}>{t("adRetry")}</button>
    </div>
  );
  if (!prospects) return <p className="text-sm text-muted-foreground">{t("salesLoading")}</p>;

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">{t("salesTitle")}</h2>
        <p className="text-sm leading-relaxed text-muted-foreground">{t("salesIntro")}</p>
        <p className="rounded-xl border border-border bg-muted/40 p-3 text-sm">{t("salesPrivacy")}</p>
        <p className="text-xs leading-relaxed text-muted-foreground">{t("salesCashRule")}</p>
      </div>

      <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          [t("salesOpenProspects"), String(open.length)],
          [t("salesFollowUpsDue"), String(overdue.length + dueSoon.length)],
          [t("salesProposals"), String((prospects ?? []).filter((row) => row.stage === "proposal").length)],
          [t("salesQuotedValue"), "NPR " + npr(quotedValue)],
          [t("salesCashReceived"), "NPR " + npr(receivedCash)],
        ].map(([label, value]) => (
          <section key={label} className="min-w-0 rounded-2xl border border-border bg-card p-3">
            <p className="text-xs text-muted-foreground">{label}</p>
            <p className="mt-1 break-words text-lg font-semibold tabular-nums">{value}</p>
          </section>
        ))}
      </div>

      {unconvertedMessages.length > 0 && (
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{t("salesIncomingEnquiries")}</h3>
            <span className="rounded-lg bg-muted px-2.5 py-1 text-xs font-semibold">{unconvertedMessages.length}</span>
          </div>
          <p className="text-sm text-muted-foreground">{t("salesIncomingIntro")}</p>
          <ul className="grid gap-3 lg:grid-cols-2">
            {unconvertedMessages.map((message) => {
              const listing = businesses.find((business) => business.slug === message.source_listing_slug);
              const serviceLabel = message.service_package ? ({
                launch: "pkg_launch_title", growth: "pkg_growth_title", care: "pkg_care_title", promotion: "pkg_promotion_title",
              } as Record<string, Key>)[message.service_package] ?? "salesInterestUnsure" : null;
              const statusLabel = ({
                new: "adSt_new", contacted: "adSt_contacted", quoted: "adSt_quoted", won: "adSt_won", lost: "adSt_lost",
              } as Record<string, Key>)[message.status] ?? "adSt_new";
              return (
                <li key={message.id} className="min-w-0 rounded-2xl border border-border bg-card p-4">
                  <div className="flex flex-wrap items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="font-semibold">{message.business_name || listing?.name || message.name}</p>
                      <p className="text-xs text-muted-foreground">{message.name} · {dateLabel(message.created_at, lang)}</p>
                    </div>
                    <span className="rounded-lg bg-muted px-2 py-1 text-xs font-semibold">{t(statusLabel)}</span>
                  </div>
                  {message.phone && <p className="mt-2 text-sm">{t("salesEnquiryPhone")}: {message.phone}</p>}
                  {(serviceLabel || message.budget_band) && <p className="mt-1 text-xs text-muted-foreground">{serviceLabel ? t(serviceLabel) : ""}{serviceLabel && message.budget_band ? " · " : ""}{message.budget_band ?? ""}</p>}
                  {message.source_listing_slug && <p className="mt-1 text-xs text-muted-foreground">{listing?.name ?? message.source_listing_slug}</p>}
                  <p className="mt-2 line-clamp-3 whitespace-pre-wrap break-words text-sm text-muted-foreground">{message.message}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs text-muted-foreground">{t("salesEnquiryQuote")}: {message.quote_amount_npr === null ? t("salesNotQuoted") : `NPR ${npr(message.quote_amount_npr)}`} · {t("salesCashReceived")}: NPR {npr(message.paid_amount_npr)}</span>
                    <button type="button" disabled={busy} className="action-btn action-primary min-h-10 disabled:opacity-60" onClick={() => void convertInboundMessage(message)}>{t("salesConvertEnquiry")}</button>
                  </div>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
        <section className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h3 className="font-semibold">{t("salesPipeline")}</h3>
            <button type="button" className="action-btn action-primary min-h-10" onClick={startNew}>{t("salesAddProspect")}</button>
          </div>
          <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto]">
            <input className={field} value={search} onChange={(e) => setSearch(e.target.value)} placeholder={t("salesSearch")} />
            <select className={field} value={filter} onChange={(e) => setFilter(e.target.value)}>
              <option value="all">{t("salesAllStages")}</option>
              {Object.keys(stageKeys).map((stage) => <option key={stage} value={stage}>{stageLabel(stage)}</option>)}
            </select>
          </div>
          <div className="overflow-hidden rounded-2xl border border-border bg-card">
            {visible.length === 0 ? <p className="p-4 text-sm text-muted-foreground">{t("salesNoProspects")}</p> : (
              <ul className="divide-y divide-border">
                {visible.map((prospect) => {
                  const business = prospect.listing_id ? businessById.get(prospect.listing_id) : undefined;
                  const inbound = prospect.contact_message_id ? messageById.get(prospect.contact_message_id) : undefined;
                  const follow = followUpLabel(prospect);
                  const displayName = business?.name ?? inbound?.business_name ?? inbound?.name ?? prospect.listing_id ?? "—";
                  return (
                    <li key={prospect.id}>
                      <button type="button" onClick={() => editProspect(prospect)} className={`w-full p-3 text-left transition-colors hover:bg-muted/50 ${selectedId === prospect.id ? "bg-muted/60" : ""}`}>
                        <div className="flex items-start justify-between gap-2">
                          <span className="min-w-0 font-semibold">{displayName}</span>
                          <span className="shrink-0 rounded-lg bg-muted px-2 py-1 text-xs font-semibold">{stageLabel(prospect.stage)}</span>
                        </div>
                        <div className="mt-1 flex flex-wrap items-center justify-between gap-2 text-xs text-muted-foreground">
                          <span>{business?.area ?? (inbound ? t("salesInboundLead") : "—")} · {interestLabel(prospect.service_interest)}</span>
                          <span className={follow === "overdue" ? "font-semibold text-error" : follow === "due" ? "font-semibold text-warning" : ""}>
                            {follow === "overdue" ? t("salesOverdue") : follow === "due" ? t("salesDueSoon") : dateLabel(prospect.next_follow_up_at, lang)}
                          </span>
                        </div>
                        {cashFor(prospect) > 0 && <p className="mt-1 text-xs font-semibold text-success">NPR {npr(cashFor(prospect))} {t("salesReceived")}</p>}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          <p className="text-xs text-muted-foreground">{t("salesWonCount")}: {wonCount} · {t("salesActivityCount")}: {activities.length}</p>
        </section>

        <section className="space-y-4">
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <h3 className="font-semibold">{t(form.id ? "salesEditProspect" : "salesAddProspect")}</h3>
              {form.id && <button type="button" className="text-sm font-semibold text-muted-foreground underline" onClick={startNew}>{t("salesStartNew")}</button>}
            </div>
            <form className="space-y-3" onSubmit={saveProspect}>
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">{t("salesBusiness")}</span>
                <select className={field} required={!form.contactMessageId} disabled={Boolean(form.id)} value={form.listingId} onChange={(e) => set({ listingId: e.target.value })}>
                  <option value="">{form.contactMessageId && selectedMessage ? `${t("salesInboundLead")}: ${selectedMessage.business_name || selectedMessage.name}` : t("salesSelectBusiness")}</option>
                  {businesses.map((business) => <option key={business.id} value={business.id}>{business.name} · {business.area}</option>)}
                </select>
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{t("salesStage")}</span>
                  <select className={field} value={form.stage} onChange={(e) => set({ stage: e.target.value as SalesStage })}>
                    {Object.keys(stageKeys).map((stage) => <option key={stage} value={stage}>{stageLabel(stage)}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{t("salesInterest")}</span>
                  <select className={field} value={form.interest} onChange={(e) => set({ interest: e.target.value as SalesInterest })}>
                    {Object.keys(interestKeys).map((interest) => <option key={interest} value={interest}>{interestLabel(interest)}</option>)}
                  </select>
                </label>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{t("salesChannel")}</span>
                  <select className={field} value={form.channel} onChange={(e) => set({ channel: e.target.value as SalesChannel })}>
                    {Object.keys(channelKeys).map((channel) => <option key={channel} value={channel}>{t(({
                      whatsapp: "salesChannelWhatsapp",
                      phone: "salesChannelPhone",
                      email: "salesChannelEmail",
                      in_person: "salesChannelInPerson",
                      none: "salesChannelNone",
                    } as Record<string, Key>)[channel] ?? "salesChannelNone")}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{t("salesFollowUp")}</span>
                  <input className={field} type="datetime-local" value={form.nextFollowUpAt} onChange={(e) => set({ nextFollowUpAt: e.target.value })} />
                </label>
              </div>
              {!form.contactMessageId && <div className="grid gap-3 sm:grid-cols-2">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{t("salesQuoteAmount")}</span>
                  <input className={field} type="number" min="1" max="5000000" step="1" inputMode="numeric" placeholder="NPR" value={form.quoteAmount} onChange={(e) => set({ quoteAmount: e.target.value })} />
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-semibold">{t("salesCashReceived")}</span>
                  <input className={field} type="number" min="0" max="5000000" step="1" inputMode="numeric" placeholder="NPR" value={form.paidAmount} onChange={(e) => set({ paidAmount: e.target.value })} />
                </label>
              </div>}
              {form.contactMessageId && <p className="rounded-xl bg-muted/50 p-3 text-sm">{t("salesLinkedFinancials")}</p>}
              <label className="block">
                <span className="mb-1.5 block text-sm font-semibold">{t("salesInternalNotes")}</span>
                <textarea className="field min-h-24 w-full" maxLength={2000} rows={3} value={form.notes} onChange={(e) => set({ notes: e.target.value })} />
              </label>
              {note && <p role="status" className="rounded-xl bg-muted/60 p-3 text-sm">{note}</p>}
              <button type="submit" disabled={busy || (!form.listingId && !form.contactMessageId)} className="action-btn action-primary min-h-11 disabled:opacity-60">{busy ? t("salesSaving") : t("salesSave")}</button>
            </form>
          </div>

          {selected && (selectedBusiness || selectedMessage) && (
            <>
              {selectedMessage && <div className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-semibold">{t("salesOriginalEnquiry")}</h3>
                <p className="mt-1 text-sm">{selectedMessage.name}{selectedMessage.business_name ? ` · ${selectedMessage.business_name}` : ""}</p>
                {selectedMessage.phone && <p className="mt-1 text-sm">{selectedMessage.phone}</p>}
                <p className="mt-2 whitespace-pre-wrap break-words text-sm text-muted-foreground">{selectedMessage.message}</p>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm">
                  <p><span className="text-muted-foreground">{t("salesEnquiryQuote")}: </span>{selectedMessage.quote_amount_npr === null ? t("salesNotQuoted") : `NPR ${npr(selectedMessage.quote_amount_npr)}`}</p>
                  <p><span className="text-muted-foreground">{t("salesCashReceived")}: </span>NPR {npr(selectedMessage.paid_amount_npr)}</p>
                  <p><span className="text-muted-foreground">{t("salesEnquiryPaymentStatus")}: </span>{selectedMessage.payment_status}</p>
                  <p><span className="text-muted-foreground">{t("salesEnquiryStatus")}: </span>{selectedMessage.status}</p>
                </div>
                <p className="mt-2 text-xs text-muted-foreground">{t("salesLinkedFinancials")}</p>
              </div>}
              <div className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-semibold">{t("salesOutreachDraft")}</h3>
                <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("salesOutreachHint")}</p>
                {isOpenSalesStage(form.stage) ? (
                  <>
                    <textarea className="field mt-3 min-h-36 w-full" rows={6} readOnly value={draft} />
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" className="action-btn action-primary min-h-10" onClick={() => void copyDraft()}>{t("salesCopyDraft")}</button>
                      {whatsappUrl && <a className="action-btn action-secondary min-h-10" href={whatsappUrl} target="_blank" rel="noopener noreferrer">{t("salesOpenWhatsapp")}</a>}
                      {phoneUrl && <a className="action-btn action-secondary min-h-10" href={phoneUrl}>{t("salesCallBusiness")}</a>}
                    </div>
                  </>
                ) : <p className="mt-3 rounded-xl bg-muted/50 p-3 text-sm">{t("salesOutreachBlocked")}</p>}
              </div>

              <div className="rounded-2xl border border-border bg-card p-4">
                <h3 className="font-semibold">{t("salesLogActivity")}</h3>
                <form className="mt-3 space-y-3" onSubmit={logActivity}>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">{t("salesActivityType")}</span>
                    <select className={field} value={activityType} onChange={(e) => setActivityType(e.target.value as SalesActivityType)}>
                      {(["call", "whatsapp", "email", "meeting", "follow_up", "proposal", "note"] as const).map((type) => <option key={type} value={type}>{t(activityKeys[type])}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-sm font-semibold">{t("salesActivitySummary")}</span>
                    <textarea className="field min-h-20 w-full" rows={3} maxLength={1500} required value={activitySummary} onChange={(e) => setActivitySummary(e.target.value)} />
                  </label>
                  <button type="submit" disabled={busy || !activitySummary.trim()} className="action-btn action-secondary min-h-10 disabled:opacity-60">{t("salesLogActivity")}</button>
                </form>
                <h4 className="mb-2 mt-5 text-sm font-semibold">{t("salesActivityHistory")}</h4>
                {history.length === 0 ? <p className="text-sm text-muted-foreground">{t("salesNoActivity")}</p> : (
                  <ol className="space-y-3 border-l border-border pl-3">
                    {history.map((activity) => (
                      <li key={activity.id} className="relative">
                        <p className="text-sm font-semibold">{t(activityKeys[activity.activity_type as SalesActivityType] ?? "salesActivityNote")}</p>
                        <p className="mt-0.5 whitespace-pre-wrap text-sm text-muted-foreground">{activity.summary}</p>
                        {activity.amount_npr !== null && <p className="mt-0.5 text-xs font-semibold">NPR {npr(activity.amount_npr)}</p>}
                        <p className="mt-0.5 text-xs text-muted-foreground">{dateLabel(activity.happened_at, lang)}</p>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </>
          )}
        </section>
      </div>
    </div>
  );
}
