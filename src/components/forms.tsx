import { track } from "@/lib/track";
import { useState, type FormEvent, type ReactNode } from "react";
import { z } from "zod";
import { CheckCircle2, Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { businesses, categories, areas, placeName } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";
import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { contactTopics, correctionTypes, type ContactTopic } from "@/lib/form-options";
import { SERVICE_BUDGET_BANDS, SERVICE_PACKAGE_IDS, type ServiceBudgetBand, type ServicePackageId } from "@/lib/commerce";

const opt = (max: number) => z.string().trim().max(max, "errTooLong").optional().transform((v) => (v ? v : null));

export const contactSchema = z.object({
  name: z.string().trim().min(1, "errName").max(100, "errTooLong"),
  business_name: opt(150),
  phone: opt(30),
  message: z.string().trim().min(1, "errMessage").max(2000, "errTooLong"),
  source_listing_slug: opt(100),
  topic: z.enum(contactTopics).nullable().optional(),
  service_package: z.enum(SERVICE_PACKAGE_IDS).nullable().default(null),
  budget_band: z.enum(SERVICE_BUDGET_BANDS).nullable().default(null),
});

export const correctionSchema = z.object({
  listing_slug: z.string().trim().min(1, "errListing").max(100).refine((s) => businesses.some((b) => b.slug === s), "errListing"),
  whats_wrong: z.string().trim().min(1, "errWrong").max(2000, "errTooLong"),
  contact: opt(150),
  correction_type: z.enum(correctionTypes, { message: "errChoice" }),
});

type Status = "idle" | "sending" | "done" | "error" | "limited";

/** A per-tab key the database uses, with the IP, to limit repeat sends. Never stored with the message. */
export function clientKey() {
  try {
    let k = sessionStorage.getItem("form-key");
    if (!k) { k = crypto.randomUUID(); sessionStorage.setItem("form-key", k); }
    return k;
  } catch { return null; }
}

/** True when the hidden field was filled, which real people never do. */
export const isBot = (honeypot: string) => honeypot.trim().length > 0;

export const statusFromError = (error: { message?: string } | null): Status =>
  !error ? "done" : /rate_limited/.test(error.message ?? "") ? "limited" : "error";

export function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useI18n();
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor="company_website">{t("hpLabel")}</label>
      <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

export function SendStatus({ status }: { status: Status }) {
  const { t } = useI18n();
  if (status === "error") return <p className="rounded-2xl bg-error-soft p-3 font-semibold text-error" role="alert">{t("sendError")}</p>;
  if (status === "limited") return <p className="rounded-2xl bg-warning-soft p-3 font-semibold text-warning" role="alert">{t("rateLimited")}</p>;
  return null;
}

export function Field({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string | undefined; error?: string | undefined; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div>
      <label htmlFor={id} className="mb-1.5 block font-bold">
        {label} <span className="text-sm font-normal text-muted-foreground">({t(required ? "fRequired" : "fOptional")})</span>
      </label>
      {children}
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      {error && <p id={`${id}-error`} className="mt-1.5 text-sm font-semibold text-error" role="alert">{error}</p>}
    </div>
  );
}

export function Done({ text }: { text: string }) {
  const { t } = useI18n();
  return (
    <div className="page-enter text-center" role="status">
      <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success-soft text-success"><CheckCircle2 aria-hidden className="h-9 w-9" /></span>
      <p className="mt-4 text-2xl font-semibold">{t("thanksTitle")}</p>
      <p className="mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

export function errorsFrom(issues: z.ZodIssue[], t: (k: Key) => string) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0]);
    if (!out[k]) out[k] = t(i.message as Key) ?? i.message;
  }
  return out;
}

export function ContactForm({ business, listing, page, message = "", doneText, submitLabel, topicPicker = false, initialTopic = "", serviceOptions = false, initialServicePackage = "" }: { business: string; listing: string; page?: string; message?: string; doneText?: string; submitLabel?: string; topicPicker?: boolean; initialTopic?: ContactTopic | ""; serviceOptions?: boolean; initialServicePackage?: ServicePackageId | "" }) {
  const { t } = useI18n();
  const [topic, setTopic] = useState<ContactTopic | "">(initialTopic);
  const [servicePackage, setServicePackage] = useState<ServicePackageId | "">(initialServicePackage);
  const [budgetBand, setBudgetBand] = useState<ServiceBudgetBand | "">("");
  const [v, setV] = useState({ name: "", business_name: business, phone: "", message });
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [hp, setHp] = useState("");
  if (status === "done") return <Done text={doneText ?? t("thanksContact")} />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    if (topicPicker && !topic) { setErrors({ topic: t("errChoice") }); document.getElementById("topic")?.focus(); return; }
    if (topic === "add") return;
    const parsed = contactSchema.safeParse({ ...v, source_listing_slug: listing, topic: topic || null, service_package: servicePackage || null, budget_band: budgetBand || null });
    if (!parsed.success) {
      const errs = errorsFrom(parsed.error.issues, t);
      setErrors(errs);
      const first = ["name", "business_name", "phone", "message"].find((k) => errs[k]);
      const ids: Record<string, string> = { name: "name", business_name: "business", phone: "phone", message: "message" };
      const firstId = first ? ids[first] : undefined;
      if (firstId) document.getElementById(firstId)?.focus();
      return;
    }
    setErrors({});
    if (isBot(hp)) return setStatus("done");
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, topic: parsed.data.topic ?? null, page: page ?? (listing ? "listing" : "contact"), client_key: clientKey() });
    const st = statusFromError(error);
    if (st === "done" && serviceOptions) {
      track("service_quote_submit", {
        ...(listing ? { slug: listing } : {}),
        query: parsed.data.service_package ?? "custom",
      });
    }
    if (st === "done" && (topic === "website" || page === "for-businesses" || page === "preview")) {
      track("enquiry_submit", listing ? { slug: listing } : {});
    }
    setStatus(st);
  }

  return (
    <form onSubmit={submit} noValidate className="relative space-y-5">
      {topicPicker && <Field id="topic" label={t("contactTopic")} required error={errors["topic"]}><select id="topic" className="field min-h-11 text-base" required aria-invalid={!!errors["topic"]} aria-describedby={errors["topic"] ? "topic-error" : undefined} value={topic} onChange={(e) => { setTopic(e.target.value as ContactTopic | ""); setErrors({}); }}><option value="">{t("chooseOption")}</option>{contactTopics.map((x) => <option key={x} value={x}>{t(`topic_${x}`)}</option>)}</select></Field>}
      {topic === "add" ? <div><p className="text-muted-foreground">{t("contactAddHint")}</p><Link to="/add-a-business" className="inline-flex min-h-11 items-center text-primary underline">{t("footAdd")}</Link></div> : <>
      <Field id="name" label={t("fName")} required error={errors["name"]}>
        <input id="name" aria-invalid={!!errors["name"]} aria-describedby={errors["name"] ? "name-error" : undefined} className="field" type="text" autoComplete="name" autoCapitalize="words" enterKeyHint="next" required maxLength={100} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
      </Field>
      <Field id="business" label={t("fBusiness")} hint={t("fBusinessHint")} error={errors["business_name"]}>
        <input id="business" aria-invalid={!!errors["business_name"]} aria-describedby={errors["business_name"] ? "business-error" : undefined} className="field" type="text" autoComplete="organization" autoCapitalize="words" enterKeyHint="next" maxLength={150} value={v.business_name} onChange={(e) => setV({ ...v, business_name: e.target.value })} />
      </Field>
      {serviceOptions && (
        <>
          <Field id="service-package" label={t("servicePackageLabel")}>
            <select id="service-package" className="field min-h-11 text-base" value={servicePackage} onChange={(e) => {
              const value = e.target.value as ServicePackageId | "";
              setServicePackage(value);
              if (value) track("service_package_select", { ...(listing ? { slug: listing } : {}), query: value });
            }}>
              <option value="">{t("servicePackageCustom")}</option>
              {SERVICE_PACKAGE_IDS.map((id) => <option key={id} value={id}>{t(`pkg_${id}_title` as Key)}</option>)}
            </select>
          </Field>
          <Field id="service-budget" label={t("serviceBudgetLabel")}>
            <select id="service-budget" className="field min-h-11 text-base" value={budgetBand} onChange={(e) => setBudgetBand(e.target.value as ServiceBudgetBand | "")}>
              <option value="">{t("chooseOption")}</option>
              {SERVICE_BUDGET_BANDS.map((band) => <option key={band} value={band}>{t(`budget_${band}` as Key)}</option>)}
            </select>
          </Field>
        </>
      )}
      <Field id="phone" label={t("fPhone")} hint={t("fPhoneHint")} error={errors["phone"]}>
        <input id="phone" aria-invalid={!!errors["phone"]} aria-describedby={errors["phone"] ? "phone-error" : undefined} className="field" type="tel" enterKeyHint="next" inputMode="tel" autoComplete="tel" maxLength={30} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />
      </Field>
      <Field id="message" label={t("fMessage")} required error={errors["message"]}>
        <textarea id="message" aria-invalid={!!errors["message"]} aria-describedby={errors["message"] ? "message-error" : undefined} className="field min-h-36" enterKeyHint="send" required maxLength={2000} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
      </Field>
      <Honeypot value={hp} onChange={setHp} />
      <SendStatus status={status} />
      <button type="submit" disabled={status === "sending"} aria-busy={status === "sending"} className="action-btn action-primary min-h-12 w-full gap-2 px-6 disabled:opacity-70 sm:w-auto">
        {status === "sending" && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}
        {status === "sending" ? t("sending") : submitLabel ?? t("send")}
      </button>
      </>}
    </form>
  );
}

export function CorrectionForm({ listing }: { listing: string }) {
  const { t } = useI18n();
  const [v, setV] = useState({ listing_slug: businesses.some((b) => b.slug === listing) ? listing : "", whats_wrong: "", contact: "", correction_type: "" });
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [hp, setHp] = useState("");
  if (status === "done") return <Done text={t("thanksCorrection")} />;

  async function submit(e: FormEvent) {
    e.preventDefault();
    const parsed = correctionSchema.safeParse(v);
    if (!parsed.success) return setErrors(errorsFrom(parsed.error.issues, t));
    setErrors({});
    if (isBot(hp)) return setStatus("done");
    setStatus("sending");
    const { error } = await supabase.from("correction_reports").insert({ ...parsed.data, client_key: clientKey() });
    setStatus(statusFromError(error));
  }

  const sorted = [...businesses].sort((a, b) => a.name.localeCompare(b.name));
  return (
    <form onSubmit={submit} noValidate className="relative space-y-5">
      <Field id="listing" label={t("fListing")} required error={errors["listing_slug"]}>
        <select id="listing" className="field" value={v.listing_slug} onChange={(e) => setV({ ...v, listing_slug: e.target.value })}>
          <option value="">{t("fChoose")}</option>
          {sorted.map((b) => <option key={b.slug} value={b.slug}>{b.name}</option>)}
        </select>
      </Field>
      <Field id="correction-type" label={t("correctionType")} required error={errors["correction_type"]}><select id="correction-type" className="field min-h-11 text-base" aria-invalid={!!errors["correction_type"]} aria-describedby={errors["correction_type"] ? "correction-type-error" : undefined} value={v.correction_type} onChange={(e) => setV({ ...v, correction_type: e.target.value })}><option value="">{t("chooseOption")}</option>{correctionTypes.map((x) => <option key={x} value={x}>{t(`correction_${x}`)}</option>)}</select></Field>
      <Field id="wrong" label={t("correctionDetails")} required hint={t("fWrongHint")} error={errors["whats_wrong"]}>
        <textarea id="wrong" aria-invalid={!!errors["whats_wrong"]} aria-describedby={errors["whats_wrong"] ? "wrong-error" : undefined} className="field min-h-36" maxLength={2000} value={v.whats_wrong} onChange={(e) => setV({ ...v, whats_wrong: e.target.value })} />
      </Field>
      <Field id="contact" label={t("fContact")} hint={t("fContactHint")} error={errors["contact"]}>
        <input id="contact" className="field" maxLength={150} value={v.contact} onChange={(e) => setV({ ...v, contact: e.target.value })} />
      </Field>
      <Honeypot value={hp} onChange={setHp} />
      <SendStatus status={status} />
      <button type="submit" disabled={status === "sending"} className="action-btn action-primary w-full px-6 disabled:opacity-60 sm:w-auto">
        {t(status === "sending" ? "sending" : "send")}
      </button>
    </form>
  );
}

const reach = z.string().trim().max(150, 'errTooLong').refine((s) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(s) || (/^\+?[\d ()-]+$/.test(s) && s.replace(/\D/g, '').length >= 7 && s.replace(/\D/g, '').length <= 15), 'errReach');
export const submissionSchema = z.object({
 business_name: z.string().trim().min(1,'errBusiness').max(150,'errTooLong'),
 category: z.string().refine((s) => categories.some((c) => c.slug === s),'errChoice'),
 area: z.string().refine((s) => s === 'other' || areas.some((a) => a.slug === s),'errChoice'),
 address: opt(500), phone: opt(30),
 website: opt(500).refine((s) => !s || /^https?:\/\/[^\s]+$/i.test(s), 'erUrl'),
 opening_hours: opt(1000), is_owner: z.enum(['yes','no'],{message:'errChoice'}).transform((s) => s === 'yes'),
 name: opt(100), contact: reach, note: opt(2000),
});
export function BusinessSubmissionForm({ initialName = '' }: { initialName?: string }) {
 const {t,lang} = useI18n();
 const [v,setV] = useState({business_name:initialName,category:'',area:'',address:'',phone:'',website:'',opening_hours:'',is_owner:'',name:'',contact:'',note:''});
 const [errors,setErrors] = useState<Record<string,string>>({});
 const [status,setStatus] = useState<Status>('idle'); const [hp,setHp] = useState('');
 if (status === 'done') return <Done text={t('addThanks')} />;
 const change = (key: keyof typeof v, value: string) => setV((old) => ({...old,[key]:value}));
 async function submit(e: FormEvent) {
  e.preventDefault(); if (status === 'sending') return;
  const parsed = submissionSchema.safeParse(v);
  if (!parsed.success) { const errs = errorsFrom(parsed.error.issues,t); setErrors(errs); const first = Object.keys(errs)[0]; if (first) document.getElementById(`sub-${first}`)?.focus(); return; }
  setErrors({}); if (isBot(hp)) { setStatus('done'); return; } setStatus('sending');
  try { const {error} = await supabase.from('business_submissions').insert({...parsed.data,client_key:clientKey()}); setStatus(statusFromError(error)); } catch { setStatus('error'); }
 }
 const input = (key: keyof typeof v, label: Key, max: number, required=false, type='text', autocomplete?: string) => <Field id={`sub-${key}`} label={t(label)} required={required} error={errors[key]}><input id={`sub-${key}`} className="field min-h-11 text-base" type={type} autoComplete={autocomplete} inputMode={type === 'tel' ? 'tel' : undefined} enterKeyHint="next" maxLength={max} required={required} aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `sub-${key}-error` : undefined} value={v[key]} onChange={(e) => change(key,e.target.value)} /></Field>;
 const select = (key: 'category'|'area'|'is_owner', label: Key, options: {value:string;label:string}[]) => <Field id={`sub-${key}`} label={t(label)} required error={errors[key]}><select id={`sub-${key}`} className="field min-h-11 text-base" required aria-invalid={!!errors[key]} aria-describedby={errors[key] ? `sub-${key}-error` : undefined} value={v[key]} onChange={(e) => change(key,e.target.value)}><option value="">{t('chooseOption')}</option>{options.map((x) => <option key={x.value} value={x.value}>{x.label}</option>)}</select></Field>;
 return <form onSubmit={submit} noValidate className="relative space-y-5">
 {input('business_name','fBusiness',150,true,'text','organization')}
 {select('category','adCategory',categories.map((c) => ({value:c.slug,label:placeName(c,lang)})))}
 {select('area','adArea',[...areas.map((a) => ({value:a.slug,label:placeName(a,lang)})),{value:'other',label:t('otherArea')}])}
 {input('address','subAddress',500,false,'text','street-address')}{input('phone','adPhone',30,false,'tel','tel')}{input('website','subWebsite',500,false,'url','url')}
 <Field id="sub-opening_hours" label={t('subHours')} error={errors['opening_hours']}><textarea id="sub-opening_hours" className="field text-base" maxLength={1000} value={v.opening_hours} onChange={(e) => change('opening_hours',e.target.value)} /></Field>
 {select('is_owner','subOwner',[{value:'yes',label:t('choiceYes')},{value:'no',label:t('choiceNo')}])}
 {input('name','fName',100,false,'text','name')}{input('contact','subContact',150,true)}
 <Field id="sub-note" label={t('subNote')} error={errors['note']}><textarea id="sub-note" className="field min-h-24 text-base" maxLength={2000} value={v.note} onChange={(e) => change('note',e.target.value)} /></Field>
 <Honeypot value={hp} onChange={setHp} /><SendStatus status={status} />
 <Button type="submit" disabled={status === 'sending'} aria-busy={status === 'sending'} className="action-btn action-primary min-h-12 h-auto w-full whitespace-normal px-6 sm:w-auto">{status === 'sending' && <Loader2 aria-hidden className="h-4 w-4 animate-spin" />}{t(status === 'sending' ? 'sending' : 'send')}</Button>
 </form>;
}
