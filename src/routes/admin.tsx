import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";
import type { Tables } from "@/integrations/supabase/types";
import { areas, categories, placeName, type Business, type WebsiteStatus, type Verification } from "@/data/directory";
import { rowToBusiness } from "@/lib/listings.functions";
import { expireListings } from "@/lib/listings";
import { hoursToWeek, normalizePhone, osmLink, slugify, validSlug, validUrl, weekToHours, type DayValue } from "@/lib/admin-listing";
import { useI18n, type Key } from "@/lib/i18n";

export const Route = createFileRoute("/admin")({
  ssr: false,
  head: () => ({ meta: [{ title: "Admin" }, { name: "robots", content: "noindex, nofollow" }, { name: "description", content: "Private admin area." }, { property: "og:title", content: "Admin" }, { property: "og:description", content: "Private admin area." }] }),
  component: AdminPage,
});

type Row = { id: string; slug: string; name: string; city: string; area: string; category: string; status: string; sort_order: number; data: unknown };
const card = "rounded-2xl border border-border bg-card p-4 sm:p-5";

function Field({ label, hint, error, children }: { label: string; hint?: string | undefined; error?: string | undefined; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-semibold">{label}</span>
      {children}
      {hint && <span className="mt-1 block text-sm text-muted-foreground">{hint}</span>}
      {error && <span role="alert" className="mt-1 block text-sm font-semibold text-error">{error}</span>}
    </label>
  );
}

function AdminPage() {
  const { t } = useI18n();
  const [session, setSession] = useState<Session | null | undefined>(undefined);
  const [isAdmin, setIsAdmin] = useState<boolean | null>(null);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSession(data.session));
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  useEffect(() => {
    setIsAdmin(null);
    if (!session) return;
    supabase.rpc("has_role", { _user_id: session.user.id, _role: "admin" }).then(({ data }) => setIsAdmin(data === true));
  }, [session?.user.id]);

  let body: ReactNode;
  if (session === undefined || (session && isAdmin === null)) body = <p className="text-muted-foreground">{t("adLoading")}</p>;
  else if (!session) body = <SignIn />;
  else if (!isAdmin) body = (
    <div className={card}>
      <h2 className="text-lg font-semibold">{t("adNoAccessTitle")}</h2>
      <p className="mt-2 text-muted-foreground">{t("adNoAccessBody")}</p>
      <p className="mt-2 text-sm text-muted-foreground">{t("adSignedInAs").replace("{e}", session.user.email ?? "")}</p>
      <button type="button" className="action-btn action-primary mt-4" onClick={() => supabase.auth.signOut()}>{t("adSignOut")}</button>
    </div>
  );
  else body = <Dashboard email={session.user.email ?? ""} />;
  return (
    <main className="mx-auto max-w-4xl px-5 py-6 pb-28 lg:py-10">
      <h1 className="mb-5 text-2xl font-semibold tracking-tight">{t("adTitle")}</h1>
      {body}
    </main>
  );
}

function SignIn() {
  const { t } = useI18n();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState<Key | null>(null);
  async function submit(e: React.FormEvent) {
    e.preventDefault(); setBusy(true); setErr(null);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    setBusy(false);
    if (error) setErr(error.status === 400 || /invalid/i.test(error.message) ? "adBadLogin" : "adLoginError");
  }
  return (
    <form onSubmit={submit} className={`${card} max-w-md space-y-4`}>
      <h2 className="text-lg font-semibold">{t("adSignInTitle")}</h2>
      <Field label={t("adEmail")}><input className="field" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
      <Field label={t("adPassword")}><input className="field" type="password" autoComplete="current-password" required value={password} onChange={(e) => setPassword(e.target.value)} /></Field>
      {err && <p role="alert" className="rounded-2xl bg-error-soft p-3 text-sm font-semibold text-error">{t(err)}</p>}
      <button type="submit" disabled={busy} className="action-btn action-primary w-full disabled:opacity-60">{busy ? t("adSigningIn") : t("adSignIn")}</button>
    </form>
  );
}

function Dashboard({ email }: { email: string }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<"listings" | "messages" | "account">("listings");
  const tabs = [["listings", "adTabListings"], ["messages", "adTabMessages"], ["account", "adTabAccount"]] as const;
  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <div className="chip-row" role="tablist">
          {tabs.map(([k, l]) => <button key={k} role="tab" type="button" aria-selected={tab === k} onClick={() => setTab(k)} className={`chip min-h-11 ${tab === k ? "chip-on" : ""}`}>{t(l)}</button>)}
        </div>
        <button type="button" className="min-h-11 rounded-full px-3 text-sm font-semibold text-muted-foreground hover:bg-muted" onClick={() => supabase.auth.signOut()}>{t("adSignOut")}</button>
      </div>
      {tab === "listings" && <Listings />}
      {tab === "messages" && <Messages />}
      {tab === "account" && <Account email={email} />}
    </div>
  );
}

function Listings() {
  const { t, lang } = useI18n();
  const [rows, setRows] = useState<Row[] | null>(null);
  const [failed, setFailed] = useState(false);
  const [editing, setEditing] = useState<Row | "new" | null>(null);
  const [f, setF] = useState({ q: "", area: "", cat: "", status: "" });
  const [note, setNote] = useState<string | null>(null);
  async function load() {
    setFailed(false);
    const { data, error } = await supabase.from("listings").select("*").order("sort_order").order("id");
    if (error) setFailed(true); else setRows(data as Row[]);
  }
  useEffect(() => { load(); }, []);
  const shown = useMemo(() => (rows ?? []).filter((r) => {
    const q = f.q.trim().toLowerCase();
    return (!q || `${r.name} ${r.slug} ${String((r.data as { phone?: string })?.phone ?? "")}`.toLowerCase().includes(q))
      && (!f.area || r.area === f.area) && (!f.cat || r.category === f.cat) && (!f.status || r.status === f.status);
  }), [rows, f]);

  async function toggle(r: Row) {
    const status = r.status === "published" ? "hidden" : "published";
    const { error } = await supabase.from("listings").update({ status }).eq("id", r.id);
    if (error) { setNote(t("adSaveError")); return; }
    expireListings();
    setRows((rs) => rs?.map((x) => (x.id === r.id ? { ...x, status } : x)) ?? null);
  }

  if (failed) return <div className={card}><p>{t("adLoadError")}</p><button type="button" className="action-btn action-secondary mt-3" onClick={load}>{t("adRetry")}</button></div>;
  if (!rows) return <p className="text-muted-foreground">{t("adLoading")}</p>;
  if (editing) return <Editor row={editing === "new" ? null : editing} all={rows} onDone={(msg) => { setEditing(null); setNote(msg); load(); }} onCancel={() => setEditing(null)} />;

  const sel = "field min-h-11";
  return (
    <div className="space-y-4">
      {note && <p role="status" className="rounded-2xl bg-success-soft p-3 text-sm font-semibold text-success">{note}</p>}
      <div className={`${card} grid gap-3 sm:grid-cols-2`}>
        <input className="field sm:col-span-2" type="search" aria-label={t("adSearch")} placeholder={t("adSearch")} value={f.q} onChange={(e) => setF({ ...f, q: e.target.value })} />
        <select className={sel} aria-label={t("adArea")} value={f.area} onChange={(e) => setF({ ...f, area: e.target.value })}>
          <option value="">{t("adAllAreas")}</option>{areas.map((a) => <option key={a.slug} value={a.slug}>{placeName(a, lang)}</option>)}
        </select>
        <select className={sel} aria-label={t("adCategory")} value={f.cat} onChange={(e) => setF({ ...f, cat: e.target.value })}>
          <option value="">{t("adAllCats")}</option>{categories.map((c) => <option key={c.slug} value={c.slug}>{placeName(c, lang)}</option>)}
        </select>
        <select className={sel} aria-label={t("adStatus")} value={f.status} onChange={(e) => setF({ ...f, status: e.target.value })}>
          <option value="">{t("adAllStatus")}</option><option value="published">{t("adPublished")}</option><option value="hidden">{t("adHidden")}</option>
        </select>
        <button type="button" className="action-btn action-primary" onClick={() => { setNote(null); setEditing("new"); }}>{t("adAdd")}</button>
      </div>
      <p className="text-sm font-semibold text-muted-foreground" aria-live="polite">{t("adCountN").replace("{n}", String(shown.length)).replace("{t}", String(rows.length))}</p>
      {shown.length === 0 ? <p className={card}>{t("adNoMatch")}</p> : (
        <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
          {shown.map((r) => (
            <li key={r.id} className="flex flex-wrap items-center gap-3 p-4">
              <div className="min-w-0 flex-1">
                <p className="truncate font-semibold">{r.name}</p>
                <p className="text-sm text-muted-foreground">{placeName(areas.find((a) => a.slug === r.area), lang)} · {placeName(categories.find((c) => c.slug === r.category), lang)}</p>
              </div>
              <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${r.status === "published" ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>{t(r.status === "published" ? "adPublished" : "adHidden")}</span>
              <div className="flex gap-2">
                <button type="button" className="action-btn action-secondary min-h-11 px-4" onClick={() => toggle(r)}>{t(r.status === "published" ? "adHide" : "adUnhide")}</button>
                <button type="button" className="action-btn action-primary min-h-11 px-4" onClick={() => { setNote(null); setEditing(r); }}>{t("adEdit")}</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const STATUSES: WebsiteStatus[] = ["working", "failed", "owner_no_site", "none_found", "not_checked"];
const VERIFS: Verification[] = ["not_verified", "source_checked", "business_confirmed"];
const lines = (s: string) => s.split("\n").map((x) => x.trim()).filter(Boolean);

function Editor({ row, all, onDone, onCancel }: { row: Row | null; all: Row[]; onDone: (msg: string) => void; onCancel: () => void }) {
  const { t, lang } = useI18n();
  const b: Business | null = row ? rowToBusiness(row) : null;
  const [v, setV] = useState({
    name: b?.name ?? "", slug: b?.slug ?? "", area: b?.area ?? areas[0]!.slug, category: b?.category ?? categories[0]!.slug, status: row?.status ?? "published",
    address: b?.address ?? "", phone: b?.phone ?? "", otherPhones: (b?.otherPhones ?? []).map((p) => p.number).join("\n"), whatsapp: b?.whatsapp ?? "",
    website: b?.website ?? "", websiteStatus: b?.websiteStatus ?? "not_checked", lastChecked: b?.lastChecked ?? "", description: b?.description ?? "",
    social: (b?.social ?? []).join("\n"), directions: b?.directions ?? "", lat: b?.lat?.toString() ?? "", lng: b?.lng?.toString() ?? "",
    coverUrl: b?.cover?.url ?? "", coverCredit: b?.cover?.credit ?? "", sourceNotes: b?.sourceNotes ?? "", sourceUrl: b?.sourceUrl ?? "",
    verification: b?.verification ?? "source_checked", hoursSource: b?.hoursSource ?? "", hoursVerified: b?.hoursVerified ?? false,
  });
  const [slugTouched, setSlugTouched] = useState(Boolean(row));
  const initialWeek = hoursToWeek(b?.hours);
  const [week, setWeek] = useState<DayValue[] | null>(initialWeek ?? (b?.hours?.length ? null : Array.from({ length: 7 }, () => ({ kind: "unknown" }))));
  const [errors, setErrors] = useState<Record<string, Key>>({});
  const [busy, setBusy] = useState(false);
  const [fail, setFail] = useState<Key | null>(null);
  const [confirmDel, setConfirmDel] = useState(false);
  const set = (k: keyof typeof v, x: string | boolean) => setV((p) => ({ ...p, [k]: x, ...(k === "name" && !slugTouched ? { slug: slugify(String(x)) } : {}) }));

  async function save(e: React.FormEvent) {
    e.preventDefault(); setFail(null);
    const er: Record<string, Key> = {};
    if (!v.name.trim()) er["name"] = "erName";
    if (!validSlug(v.slug)) er["slug"] = "erSlug";
    const phone = v.phone.trim() ? normalizePhone(v.phone) : "";
    if (phone === null) er["phone"] = "erPhone";
    const others = lines(v.otherPhones).map(normalizePhone);
    if (others.includes(null)) er["otherPhones"] = "erPhone";
    const wa = v.whatsapp.trim() ? normalizePhone(v.whatsapp) : "";
    if (wa === null) er["whatsapp"] = "erPhone";
    for (const k of ["website", "directions", "coverUrl", "sourceUrl"] as const) if (v[k].trim() && !validUrl(v[k].trim())) er[k] = "erUrl";
    const lat = v.lat.trim() ? Number(v.lat) : undefined, lng = v.lng.trim() ? Number(v.lng) : undefined;
    if ((lat === undefined) !== (lng === undefined) || (lat !== undefined && !(Math.abs(lat) <= 90 && Math.abs(lng!) <= 180))) er["lat"] = "erCoord";
    if (week?.some((d) => d.kind === "open" && (!d.from || !d.to))) er["hours"] = "erTime";
    setErrors(er);
    if (Object.keys(er).length) { setFail("adFixErrors"); return; }
    const hours = week ? weekToHours(week) : b?.hours ?? [];
    const opt = (s: string) => s.trim() || undefined;
    const data: { [K in keyof Business]?: Business[K] | undefined } = {
      ...(b ? (({ id, slug, name, area, category, ...rest }) => rest)(b) : { services: [], demo: false, addedOn: new Date().toISOString().slice(0, 10) }),
      address: opt(v.address), phone: phone || undefined, otherPhones: others.length ? others.map((n) => ({ number: n! })) : undefined, whatsapp: wa || undefined,
      website: opt(v.website), websiteStatus: v.websiteStatus as WebsiteStatus, lastChecked: opt(v.lastChecked), description: opt(v.description),
      social: lines(v.social).length ? lines(v.social) : undefined, directions: opt(v.directions), lat, lng,
      cover: v.coverUrl.trim() ? { url: v.coverUrl.trim(), credit: v.coverCredit.trim() } : undefined,
      sourceNotes: v.sourceNotes.trim(), sourceUrl: opt(v.sourceUrl), verification: v.verification as Verification,
      hours: hours.length ? hours : undefined, hoursSource: opt(v.hoursSource), hoursVerified: v.hoursVerified || undefined,
    };
    const clean = JSON.parse(JSON.stringify(data));
    const city = areas.find((a) => a.slug === v.area)?.city ?? "kathmandu";
    const cols = { slug: v.slug, name: v.name.trim(), city, area: v.area, category: v.category, status: v.status, data: clean };
    setBusy(true);
    const nextId = `b${Math.max(0, ...all.map((r) => Number(r.id.replace(/\D/g, "")) || 0)) + 1}`;
    const res = row
      ? await supabase.from("listings").update(cols).eq("id", row.id)
      : await supabase.from("listings").insert({ ...cols, id: nextId, sort_order: Math.max(0, ...all.map((r) => r.sort_order)) + 10 });
    setBusy(false);
    if (res.error) { setFail(res.error.code === "23505" ? "adSlugTaken" : "adSaveError"); return; }
    expireListings();
    onDone(t(v.status === "published" ? "adSaved" : "adSavedHidden"));
  }

  async function remove(hideInstead: boolean) {
    if (!row) return;
    setBusy(true);
    const res = hideInstead ? await supabase.from("listings").update({ status: "hidden" }).eq("id", row.id) : await supabase.from("listings").delete().eq("id", row.id);
    setBusy(false);
    if (res.error) { setFail("adSaveError"); setConfirmDel(false); return; }
    expireListings();
    onDone(t(hideInstead ? "adSavedHidden" : "adRemoved"));
  }

  const inp = (k: keyof typeof v, extra: React.InputHTMLAttributes<HTMLInputElement> = {}) => <input className="field" value={String(v[k])} onChange={(e) => set(k, e.target.value)} {...extra} />;
  const area = (k: keyof typeof v) => <textarea className="field min-h-24" value={String(v[k])} onChange={(e) => set(k, e.target.value)} />;
  const err = (k: string) => (errors[k] ? t(errors[k]!) : undefined);
  const latN = Number(v.lat), lngN = Number(v.lng);

  return (
    <form onSubmit={save} noValidate className="space-y-4">
      <button type="button" onClick={onCancel} className="min-h-11 text-sm font-semibold text-muted-foreground hover:text-foreground">‹ {t("adBack")}</button>
      <h2 className="text-xl font-semibold">{t(row ? "adEditTitle" : "adNewTitle")}</h2>

      <section className={`${card} space-y-4`}>
        <h3 className="section-label">{t("adSecBasics")}</h3>
        <Field label={t("adName")} error={err("name")}>{inp("name", { maxLength: 150 })}</Field>
        <Field label={t("adSlug")} hint={t("adSlugHint")} error={err("slug")}>
          <input className="field" value={v.slug} maxLength={100} onChange={(e) => { setSlugTouched(true); set("slug", e.target.value.toLowerCase()); }} />
        </Field>
        {row && v.slug !== row.slug && <p role="status" className="rounded-2xl bg-warning-soft p-3 text-sm font-semibold text-warning">{t("adSlugWarn")}</p>}
        <div className="grid gap-4 sm:grid-cols-3">
          <Field label={t("adArea")}><select className="field" value={v.area} onChange={(e) => set("area", e.target.value)}>{areas.map((a) => <option key={a.slug} value={a.slug}>{placeName(a, lang)}</option>)}</select></Field>
          <Field label={t("adCategory")}><select className="field" value={v.category} onChange={(e) => set("category", e.target.value)}>{categories.map((c) => <option key={c.slug} value={c.slug}>{placeName(c, lang)}</option>)}</select></Field>
          <Field label={t("adStatus")}><select className="field" value={v.status} onChange={(e) => set("status", e.target.value)}><option value="published">{t("adPublished")}</option><option value="hidden">{t("adHidden")}</option></select></Field>
        </div>
        <Field label={t("adDescription")}>{area("description")}</Field>
      </section>

      <section className={`${card} space-y-4`}>
        <h3 className="section-label">{t("adSecContact")}</h3>
        <Field label={t("adPhone")} hint={t("adPhoneHint")} error={err("phone")}>{inp("phone", { type: "tel", inputMode: "tel" })}</Field>
        <Field label={t("adOtherPhones")} hint={t("adOneLine")} error={err("otherPhones")}>{area("otherPhones")}</Field>
        <Field label={t("adWhatsapp")} hint={t("adPhoneHint")} error={err("whatsapp")}>{inp("whatsapp", { type: "tel", inputMode: "tel" })}</Field>
        <Field label={t("adWebsite")} hint={t("adWebsiteHint")} error={err("website")}>{inp("website", { type: "url", inputMode: "url" })}</Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label={t("adWebStatus")}><select className="field" value={v.websiteStatus} onChange={(e) => set("websiteStatus", e.target.value)}>{STATUSES.map((s) => <option key={s} value={s}>{t(`ws_${s}` as Key)}</option>)}</select></Field>
          <Field label={t("adLastChecked")}>{inp("lastChecked", { type: "date" })}</Field>
        </div>
        <Field label={t("adSocial")} hint={t("adSocialHint")}>{area("social")}</Field>
      </section>

      <section className={`${card} space-y-3`}>
        <h3 className="section-label">{t("adSecHours")}</h3>
        {!week ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">{t("adHoursText")}</p>
            <ul className="text-sm">{b?.hours?.map((h, i) => <li key={i}>{h.days}: {h.time}</li>)}</ul>
            <button type="button" className="action-btn action-secondary" onClick={() => setWeek(Array.from({ length: 7 }, () => ({ kind: "unknown" })))}>{t("adHoursSwitch")}</button>
          </div>
        ) : week.map((d, i) => (
          <div key={i} className="grid gap-2 border-b border-border pb-3 last:border-0 sm:grid-cols-[7rem_10rem_1fr] sm:items-center">
            <span className="font-semibold">{t(`day${i}` as Key)}</span>
            <select className="field min-h-11" aria-label={t(`day${i}` as Key)} value={d.kind} onChange={(e) => setWeek(week.map((x, j) => (j !== i ? x : e.target.value === "open" ? { kind: "open", from: "10:00", to: "19:00" } : { kind: e.target.value as "closed" | "unknown" })))}>
              <option value="open">{t("adDayOpen")}</option><option value="closed">{t("adDayClosed")}</option><option value="unknown">{t("adDayUnknown")}</option>
            </select>
            {d.kind === "open" && (
              <div className="flex gap-2">
                <input type="time" className="field min-h-11" aria-label={t("adFrom")} value={d.from} onChange={(e) => setWeek(week.map((x, j) => (j === i ? { ...d, from: e.target.value } : x)))} />
                <input type="time" className="field min-h-11" aria-label={t("adTo")} value={d.to} onChange={(e) => setWeek(week.map((x, j) => (j === i ? { ...d, to: e.target.value } : x)))} />
              </div>
            )}
          </div>
        ))}
        {errors["hours"] && <p role="alert" className="text-sm font-semibold text-error">{t(errors["hours"])}</p>}
        <Field label={t("adHoursSource")}>{inp("hoursSource")}</Field>
        <label className="flex min-h-11 items-center gap-3"><input type="checkbox" className="h-5 w-5" checked={v.hoursVerified} onChange={(e) => set("hoursVerified", e.target.checked)} />{t("adHoursVerified")}</label>
      </section>

      <section className={`${card} space-y-4`}>
        <h3 className="section-label">{t("adSecLocation")}</h3>
        <Field label={t("adAddress")}>{inp("address")}</Field>
        <Field label={t("adDirections")} error={err("directions")}>{inp("directions", { type: "url" })}</Field>
        <div className="grid grid-cols-2 gap-4">
          <Field label={t("adLat")}>{inp("lat", { inputMode: "decimal" })}</Field>
          <Field label={t("adLng")}>{inp("lng", { inputMode: "decimal" })}</Field>
        </div>
        <p className="text-sm text-muted-foreground">{t("adCoordHint")}</p>
        {err("lat") && <p role="alert" className="text-sm font-semibold text-error">{err("lat")}</p>}
        {v.lat.trim() && v.lng.trim() && Number.isFinite(latN) && Number.isFinite(lngN) && (
          <a href={osmLink(latN, lngN)} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{t("adCheckMap")} ↗</a>
        )}
      </section>

      <section className={`${card} space-y-4`}>
        <h3 className="section-label">{t("adSecPhoto")}</h3>
        <Field label={t("adCoverUrl")} hint={t("adCoverHint")} error={err("coverUrl")}>{inp("coverUrl", { type: "url" })}</Field>
        <Field label={t("adCoverCredit")}>{inp("coverCredit")}</Field>
      </section>

      <section className={`${card} space-y-4`}>
        <h3 className="section-label">{t("adSecSource")}</h3>
        <Field label={t("adSourceNotes")}>{inp("sourceNotes")}</Field>
        <Field label={t("adSourceUrl")} error={err("sourceUrl")}>{inp("sourceUrl", { type: "url" })}</Field>
        <Field label={t("adVerification")}><select className="field" value={v.verification} onChange={(e) => set("verification", e.target.value)}>{VERIFS.map((x) => <option key={x} value={x}>{t(`verif_${x}` as Key)}</option>)}</select></Field>
      </section>

      {fail && <p role="alert" className="rounded-2xl bg-error-soft p-3 text-sm font-semibold text-error">{t(fail)}</p>}
      <div className="flex flex-wrap items-center gap-3">
        <button type="submit" disabled={busy} className="action-btn action-primary px-8 disabled:opacity-60">{busy ? t("adSaving") : t("adSave")}</button>
        {row?.status === "published" && <Link to="/s/$slug" params={{ slug: row.slug }} target="_blank" className="action-btn action-secondary">{t("adViewOnSite")}</Link>}
        {row && <button type="button" className="ml-auto min-h-11 rounded-full px-4 text-sm font-semibold text-error hover:bg-error-soft" onClick={() => setConfirmDel(true)}>{t("adRemove")}</button>}
      </div>
      {confirmDel && (
        <div role="alertdialog" aria-labelledby="del-title" className={`${card} border-error/40`}>
          <h3 id="del-title" className="font-semibold">{t("adRemoveTitle")}</h3>
          <p className="mt-2 text-muted-foreground">{t("adRemoveBody")}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" disabled={busy} className="action-btn action-primary" onClick={() => remove(true)}>{t("adHideInstead")}</button>
            <button type="button" disabled={busy} className="action-btn action-secondary !text-error" onClick={() => remove(false)}>{t("adRemoveConfirm")}</button>
            <button type="button" className="min-h-11 px-4 text-sm font-semibold text-muted-foreground" onClick={() => setConfirmDel(false)}>{t("adCancel")}</button>
          </div>
        </div>
      )}
    </form>
  );
}

function Messages() {
  const { t } = useI18n();
  const [data, setData] = useState<{ c: Tables<"contact_messages">[]; r: Tables<"correction_reports">[] } | null>(null);
  const [failed, setFailed] = useState(false);
  async function load() {
    setFailed(false);
    const [c, r] = await Promise.all([
      supabase.from("contact_messages").select("*").order("created_at", { ascending: false }).limit(200),
      supabase.from("correction_reports").select("*").order("created_at", { ascending: false }).limit(200),
    ]);
    if (c.error || r.error) setFailed(true); else setData({ c: c.data, r: r.data });
  }
  useEffect(() => { load(); }, []);
  if (failed) return <div className={card}><p>{t("adLoadError")}</p><button type="button" className="action-btn action-secondary mt-3" onClick={load}>{t("adRetry")}</button></div>;
  if (!data) return <p className="text-muted-foreground">{t("adLoading")}</p>;
  const when = (s: string | null) => (s ? new Date(s).toLocaleString("en-GB", { timeZone: "Asia/Kathmandu", dateStyle: "medium", timeStyle: "short" }) : "");
  const meta = (label: string, val: string | null) => (val ? <p className="text-sm"><span className="text-muted-foreground">{label}: </span>{val}</p> : null);
  return (
    <div className="space-y-8">
      <section>
        <h2 className="mb-3 text-lg font-semibold">{t("adMsgContact")}</h2>
        {data.c.length === 0 ? <p className={card}>{t("adMsgEmpty")}</p> : <ul className="space-y-3">{data.c.map((m) => (
          <li key={m.id} className={card}>
            <div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{m.name}</p><p className="text-sm text-muted-foreground">{when(m.created_at)}</p></div>
            {meta(t("fBusiness"), m.business_name)}{meta(t("adPhone"), m.phone)}{meta(t("adMsgListing"), m.source_listing_slug)}{meta(t("adMsgPage"), m.page)}
            <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed">{m.message}</p>
          </li>))}</ul>}
      </section>
      <section>
        <h2 className="mb-3 text-lg font-semibold">{t("adMsgCorrections")}</h2>
        {data.r.length === 0 ? <p className={card}>{t("adMsgEmpty")}</p> : <ul className="space-y-3">{data.r.map((m) => (
          <li key={m.id} className={card}>
            <div className="flex flex-wrap justify-between gap-2"><p className="font-semibold">{m.listing_slug}</p><p className="text-sm text-muted-foreground">{when(m.created_at)}</p></div>
            {meta(t("adMsgReply"), m.contact)}
            <p className="mt-2 whitespace-pre-wrap break-words leading-relaxed">{m.whats_wrong}</p>
          </li>))}</ul>}
      </section>
    </div>
  );
}

function Account({ email }: { email: string }) {
  const { t } = useI18n();
  const [v, setV] = useState({ cur: "", next: "", again: "" });
  const [msg, setMsg] = useState<{ ok: boolean; k: Key } | null>(null);
  const [busy, setBusy] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (v.next.length < 8) return setMsg({ ok: false, k: "adPwShort" });
    if (v.next !== v.again) return setMsg({ ok: false, k: "adPwMismatch" });
    setBusy(true);
    const check = await supabase.auth.signInWithPassword({ email, password: v.cur });
    const res = check.error ? check : await supabase.auth.updateUser({ password: v.next, current_password: v.cur } as never);
    setBusy(false);
    if (res.error) setMsg({ ok: false, k: "adPwError" }); else { setMsg({ ok: true, k: "adPwDone" }); setV({ cur: "", next: "", again: "" }); }
  }
  return (
    <form onSubmit={submit} className={`${card} max-w-md space-y-4`}>
      <h2 className="text-lg font-semibold">{t("adPwTitle")}</h2>
      <p className="text-sm text-muted-foreground">{t("adSignedInAs").replace("{e}", email)}</p>
      <Field label={t("adPwCurrent")}><input className="field" type="password" autoComplete="current-password" value={v.cur} onChange={(e) => setV({ ...v, cur: e.target.value })} /></Field>
      <Field label={t("adPwNew")} hint={t("adPwHint")}><input className="field" type="password" autoComplete="new-password" value={v.next} onChange={(e) => setV({ ...v, next: e.target.value })} /></Field>
      <Field label={t("adPwRepeat")}><input className="field" type="password" autoComplete="new-password" value={v.again} onChange={(e) => setV({ ...v, again: e.target.value })} /></Field>
      {msg && <p role={msg.ok ? "status" : "alert"} className={`rounded-2xl p-3 text-sm font-semibold ${msg.ok ? "bg-success-soft text-success" : "bg-error-soft text-error"}`}>{t(msg.k)}</p>}
      <button type="submit" disabled={busy} className="action-btn action-primary w-full disabled:opacity-60">{busy ? t("adSaving") : t("adPwTitle")}</button>
    </form>
  );
}
