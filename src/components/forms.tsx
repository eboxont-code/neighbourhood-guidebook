import { useState, type ReactNode } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { businesses } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";

const opt = (max: number) => z.string().trim().max(max, "errTooLong").optional().transform((v) => (v ? v : null));

export const contactSchema = z.object({
  name: z.string().trim().min(1, "errName").max(100, "errTooLong"),
  business_name: opt(150),
  phone: opt(30),
  message: z.string().trim().min(1, "errMessage").max(2000, "errTooLong"),
  source_listing_slug: opt(100),
});

export const correctionSchema = z.object({
  listing_slug: z.string().trim().min(1, "errListing").max(100).refine((s) => businesses.some((b) => b.slug === s), "errListing"),
  whats_wrong: z.string().trim().min(1, "errWrong").max(2000, "errTooLong"),
  contact: opt(150),
});

type Status = "idle" | "sending" | "done" | "error" | "limited";

/** A per-tab key the database uses, with the IP, to limit repeat sends. Never stored with the message. */
function clientKey() {
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

function Honeypot({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const { t } = useI18n();
  return (
    <div aria-hidden="true" style={{ position: "absolute", left: "-10000px", width: 1, height: 1, overflow: "hidden" }}>
      <label htmlFor="company_website">{t("hpLabel")}</label>
      <input id="company_website" name="company_website" type="text" tabIndex={-1} autoComplete="off" value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  );
}

function SendStatus({ status }: { status: Status }) {
  const { t } = useI18n();
  if (status === "error") return <p className="text-destructive" role="alert">{t("sendError")}</p>;
  if (status === "limited") return <p className="text-unverified" role="alert">{t("rateLimited")}</p>;
  return null;
}

function Field({ id, label, required, hint, error, children }: { id: string; label: string; required?: boolean; hint?: string | undefined; error?: string | undefined; children: ReactNode }) {
  const { t } = useI18n();
  return (
    <div>
      <label htmlFor={id} className="mb-1 block font-medium">
        {label} <span className="text-sm font-normal text-muted-foreground">({t(required ? "fRequired" : "fOptional")})</span>
      </label>
      {children}
      {hint && <p className="mt-1 text-sm text-muted-foreground">{hint}</p>}
      {error && <p className="mt-1 text-sm text-destructive" role="alert">{error}</p>}
    </div>
  );
}

function Done({ text }: { text: string }) {
  const { t } = useI18n();
  return (
    <div className="rounded-lg border border-border bg-card p-5" role="status">
      <p className="font-serif text-xl font-semibold">{t("thanksTitle")}</p>
      <p className="mt-2 leading-relaxed">{text}</p>
    </div>
  );
}

function errorsFrom(issues: z.ZodIssue[], t: (k: Key) => string) {
  const out: Record<string, string> = {};
  for (const i of issues) {
    const k = String(i.path[0]);
    if (!out[k]) out[k] = t(i.message as Key) ?? i.message;
  }
  return out;
}

export function ContactForm({ business, listing }: { business: string; listing: string }) {
  const { t } = useI18n();
  const [v, setV] = useState({ name: "", business_name: business, phone: "", message: "" });
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [hp, setHp] = useState("");
  if (status === "done") return <Done text={t("thanksContact")} />;

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const parsed = contactSchema.safeParse({ ...v, source_listing_slug: listing });
    if (!parsed.success) return setErrors(errorsFrom(parsed.error.issues, t));
    setErrors({});
    if (isBot(hp)) return setStatus("done");
    setStatus("sending");
    const { error } = await supabase.from("contact_messages").insert({ ...parsed.data, page: listing ? "listing" : "contact", client_key: clientKey() });
    setStatus(statusFromError(error));
  }

  return (
    <form onSubmit={submit} noValidate className="relative space-y-5">
      <Field id="name" label={t("fName")} required error={errors["name"]}>
        <input id="name" className="field" autoComplete="name" maxLength={100} value={v.name} onChange={(e) => setV({ ...v, name: e.target.value })} />
      </Field>
      <Field id="business" label={t("fBusiness")} hint={t("fBusinessHint")} error={errors["business_name"]}>
        <input id="business" className="field" maxLength={150} value={v.business_name} onChange={(e) => setV({ ...v, business_name: e.target.value })} />
      </Field>
      <Field id="phone" label={t("fPhone")} hint={t("fPhoneHint")} error={errors["phone"]}>
        <input id="phone" className="field" type="tel" inputMode="tel" autoComplete="tel" maxLength={30} value={v.phone} onChange={(e) => setV({ ...v, phone: e.target.value })} />
      </Field>
      <Field id="message" label={t("fMessage")} required error={errors["message"]}>
        <textarea id="message" className="field min-h-36" maxLength={2000} value={v.message} onChange={(e) => setV({ ...v, message: e.target.value })} />
      </Field>
      <Honeypot value={hp} onChange={setHp} />
      <SendStatus status={status} />
      <button type="submit" disabled={status === "sending"} className="action-btn action-primary w-full px-6 disabled:opacity-60 sm:w-auto">
        {t(status === "sending" ? "sending" : "send")}
      </button>
    </form>
  );
}

export function CorrectionForm({ listing }: { listing: string }) {
  const { t } = useI18n();
  const [v, setV] = useState({ listing_slug: businesses.some((b) => b.slug === listing) ? listing : "", whats_wrong: "", contact: "" });
  const [errors, setErrors] = useState<{ [k: string]: string | undefined }>({});
  const [status, setStatus] = useState<Status>("idle");
  const [hp, setHp] = useState("");
  if (status === "done") return <Done text={t("thanksCorrection")} />;

  async function submit(e: React.FormEvent) {
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
      <Field id="wrong" label={t("fWrong")} required hint={t("fWrongHint")} error={errors["whats_wrong"]}>
        <textarea id="wrong" className="field min-h-36" maxLength={2000} value={v.whats_wrong} onChange={(e) => setV({ ...v, whats_wrong: e.target.value })} />
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
