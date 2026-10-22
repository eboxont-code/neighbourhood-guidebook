import { createFileRoute, Link } from "@tanstack/react-router";
import { getBusiness } from "@/data/directory";
import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowLeft, Check, Clock, Image, MapPin, Phone, Plus, RefreshCw, Scissors, Smartphone, Sparkles, MessageCircle, X } from "lucide-react";
import { Page, pageMeta } from "@/components/site";
import { ContactForm } from "@/components/forms";
import { dict, useI18n, type Key } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/config";

type Search = { from?: "preview"; listing?: string; business?: string };

export const Route = createFileRoute("/for-businesses")({
  // ?from=preview&listing=<slug>&business=<name> comes from "Make this my website" on a free preview.
  validateSearch: (s: Record<string, unknown>): Search => ({
    ...(s["from"] === "preview" ? { from: "preview" as const } : {}),
    ...(typeof s["listing"] === "string" ? { listing: s["listing"].slice(0, 100) } : {}),
    ...(typeof s["business"] === "string" ? { business: s["business"].slice(0, 150) } : {}),
  }),
  head: () => {
    const head = pageMeta(
      "Website design in Kathmandu for salons, spas and clinics",
      "Website design in Kathmandu for small businesses: simple, mobile-friendly sites for salons, barbers, spas and clinics with services, hours, one-tap call and map. Your directory listing stays free.",
      "/for-businesses",
    );
    const en = dict.en;
    const faqKeys = [1, 2, 3, 4, 5] as const;
    const service = {
      "@context": "https://schema.org", "@type": "Service", name: "Website design in Kathmandu",
      serviceType: "Website design", url: `${SITE_URL}/for-businesses`,
      areaServed: { "@type": "City", name: "Kathmandu" },
      provider: { "@type": "Organization", name: SITE_NAME, url: SITE_URL },
      description: "Simple, mobile-friendly websites for salons, barbers, spas and clinics in Kathmandu.",
    };
    const faqLd = {
      "@context": "https://schema.org", "@type": "FAQPage",
      mainEntity: faqKeys.map((n) => ({ "@type": "Question", name: en[`fbQ${n}`], acceptedAnswer: { "@type": "Answer", text: en[`fbA${n}`] } })),
    };
    return { ...head, scripts: [{ type: "application/ld+json", children: JSON.stringify(service) }, { type: "application/ld+json", children: JSON.stringify(faqLd) }] };
  },
  component: ForBusinesses,
});

const LEAD_ID = "quote";

function toLead() {
  const el = document.getElementById(LEAD_ID);
  if (!el) return;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  el.scrollIntoView({ behavior: reduce ? "auto" : "smooth", block: "start" });
  window.setTimeout(() => (document.getElementById("name") as HTMLInputElement | null)?.focus({ preventScroll: true }), reduce ? 0 : 600);
}

function Kicker({ children }: { children: string }) {
  return <p className="text-[13px] font-semibold tracking-wide text-muted-foreground uppercase"><span aria-hidden className="mr-2 inline-block h-1.5 w-1.5 -translate-y-0.5 rounded-full bg-brand-accent" />{children}</p>;
}

function ForBusinesses() {
  const { t } = useI18n();
  const search = Route.useSearch();
  // Only a real listing counts as a preview lead; anything else falls back to the plain form.
  const pv = search.from === "preview" && search.listing ? getBusiness(search.listing) : undefined;
  const pvName = pv ? pv.name : "";
  const [msg, setMsg] = useState(pv ? t("pvLeadMsg").replace("{name}", pvName) : "");
  const [leadVisible, setLeadVisible] = useState(false);
  const [heroCtaVisible, setHeroCtaVisible] = useState(true);
  const leadRef = useRef<HTMLElement>(null);
  const heroCtaRef = useRef<HTMLButtonElement>(null);
  // The pill only shows between the hero button and the quote form, so the same ask is never on screen twice.
  const pillHidden = leadVisible || heroCtaVisible;

  useEffect(() => {
    const el = leadRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setLeadVisible(!!e?.isIntersecting), { rootMargin: "0px 0px -120px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    const el = heroCtaRef.current;
    if (!el || typeof IntersectionObserver === "undefined") { setHeroCtaVisible(false); return; }
    const io = new IntersectionObserver(([e]) => setHeroCtaVisible(!!e?.isIntersecting), { rootMargin: "-56px 0px -140px 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Arriving from a preview: go straight to the quote form, with the message in the current language.
  useEffect(() => {
    if (!pv) return;
    setMsg(t("pvLeadMsg").replace("{name}", pvName));
    const id = window.setTimeout(() => document.getElementById(LEAD_ID)?.scrollIntoView({ block: "start" }), 50);
    return () => window.clearTimeout(id);
  }, [pv?.slug, t("pvLeadMsg")]); // eslint-disable-line react-hooks/exhaustive-deps

  const how: Key[] = ["fb2How1", "fbHow2", "fbHow3", "fbHow4"];
  const faq: [Key, Key][] = [["fbQ1", "fbA1"], ["fbQ2", "fbA2"], ["fbQ3", "fbA3"], ["fbQ4", "fbA4"], ["fbQ5", "fbA5"]];
  const inc: [Key, typeof Phone][] = [["fb2Inc1", Scissors], ["fb2Inc2", Clock], ["fb2Inc3", Phone], ["fb2Inc4", MapPin], ["fb2Inc5", Image], ["fb2Inc6", RefreshCw]];
  const proof: [Key, typeof Phone][] = [["fb2Proof2", Smartphone], ["fb2Proof3", MessageCircle]];

  return (
    <div className="overflow-x-clip bg-background">
      {/* Hero: owner-facing, light, not the directory's navy band */}
      <section className="border-b border-border bg-card">
        <div className="page-enter mx-auto max-w-5xl px-5 pt-8 pb-8 lg:grid lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-12 lg:pt-16 lg:pb-14">
          <div>
            <Kicker>{t("fbKicker")}</Kicker>
            <h1 className="mt-3 text-[1.75rem] leading-[1.15] font-bold tracking-tight sm:text-[2.5rem]">{t("fbHeroTitle")}</h1>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted-foreground">{t("fbIntro")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <button ref={heroCtaRef} type="button" onClick={toLead} className="action-btn action-primary inline-flex w-full px-7 sm:w-auto">{t("fbCta")}<ArrowDown aria-hidden className="h-5 w-5" /></button>
              <Link to="/contact" className="inline-flex min-h-11 items-center justify-center px-2 text-[15px] font-semibold underline decoration-brand-accent decoration-2 underline-offset-4">{t("fb2Claim")}</Link>
            </div>
          </div>
          <div className="hidden lg:block"><PhoneFrame good /></div>
        </div>
        <ul className="mx-auto grid max-w-5xl grid-cols-2 gap-2 px-5 pb-6">
          {proof.map(([k, Icon]) => (
            <li key={k} className="flex flex-col items-center gap-1.5 rounded-xl bg-muted/60 px-2 py-3 text-center text-[13px] leading-snug font-semibold sm:flex-row sm:justify-center sm:text-sm">
              <Icon aria-hidden className="h-[18px] w-[18px] shrink-0 text-primary" strokeWidth={1.75} />{t(k)}
            </li>
          ))}
        </ul>
      </section>

      {/* Demo */}
      <section className="bg-muted/50 py-10 lg:py-14" aria-labelledby="demo">
        <div className="mx-auto max-w-5xl px-5">
          <h2 id="demo" className="text-xl font-bold tracking-tight sm:text-2xl">{t("fb2DemoTitle")}</h2>
          <div className="mt-5 grid grid-cols-2 gap-3 sm:gap-8 md:mx-auto md:max-w-2xl">
            <PhoneFrame good={false} />
            <PhoneFrame good />
          </div>
          <p className="mt-3 text-center text-[13px] text-muted-foreground">{t("fbExampleNote")}</p>
        </div>
      </section>

      <Page wide>
        <div className="mx-auto max-w-3xl">
          {/* Offer */}
          <section>
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t("fb2OfferTitle")}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{t("fbWhatBody")}</p>
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {inc.map(([k, Icon]) => (
                <li key={k} className="flex min-h-12 items-center gap-2.5 rounded-xl border border-border bg-card px-3 text-[14px] font-semibold">
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />{t(k)}
                </li>
              ))}
            </ul>
            <p className="mt-3 text-[14px] text-muted-foreground">{t("fb2BookingLater")}</p>
          </section>

          {/* Free trial */}
          <section className="app-hero mt-10 rounded-2xl p-6 sm:p-8">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-card/15 px-3 py-1 text-[13px] font-semibold"><Sparkles aria-hidden className="h-3.5 w-3.5" />{t("fb2TrialKicker")}</p>
            <h2 className="mt-3 text-xl font-bold tracking-tight sm:text-2xl">{t("fb2TrialTitle")}</h2>
            <p className="mt-2 leading-relaxed text-[var(--hero-muted)]">{t("fb2TrialBody")}</p>
            <button type="button" onClick={() => { setMsg(t("fb2TrialMsg")); toLead(); }} className="action-btn action-accent mt-5 inline-flex w-full px-7 sm:w-auto">{t("fb2TrialCta")}</button>
          </section>

          {/* How it works */}
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t("fbHowTitle")}</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-4">
              {how.map((k, i) => (
                <li key={k} className="flex gap-3 sm:flex-col">
                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground">{i + 1}</span>
                  <span className="pt-1 text-[15px] leading-relaxed sm:pt-0">{t(k)}</span>
                </li>
              ))}
            </ol>
          </section>

          {/* FAQ */}
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t("fbFaqTitle")}</h2>
            <div className="mt-4 divide-y divide-border rounded-2xl border border-border bg-card">
              {faq.map(([q, a]) => (
                <details key={q} className="group">
                  <summary className="flex min-h-12 cursor-pointer list-none rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-ring [&::-webkit-details-marker]:hidden items-center justify-between gap-3 px-4 py-2.5 text-[15px] font-semibold">
                    {t(q)}<Plus aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-200 group-open:rotate-45" />
                  </summary>
                  <p className="px-4 pb-4 text-[15px] leading-relaxed text-muted-foreground">{t(a)}</p>
                </details>
              ))}
            </div>
          </section>

          {/* Lead */}
          <section id={LEAD_ID} ref={leadRef} className="mt-10 scroll-mt-20" aria-labelledby="lead-title">
            <Kicker>{t("fb2LeadKicker")}</Kicker>
            <h2 id="lead-title" className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{t("fb2LeadTitle")}</h2>
            <p className="mt-2 mb-5 leading-relaxed text-muted-foreground">{t("fb2LeadBody")}</p>
            {pv && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl border border-border bg-accent px-4 py-3">
                <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-accent-foreground"><Sparkles aria-hidden className="h-4 w-4 shrink-0" />{t("pvFromPreview").replace("{name}", pvName)}</p>
                <Link to="/s/$slug/website-preview" params={{ slug: pv.slug }} className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-primary underline"><ArrowLeft aria-hidden className="h-4 w-4" />{t("pvBackPreview")}</Link>
              </div>
            )}
            <div className="form-card">
              <ContactForm key={`${msg}|${pv?.slug ?? ""}`} business={pvName} listing={pv ? pv.slug : ""} page={pv ? "preview" : "for-businesses"} message={msg} doneText={t("fb2Thanks")} />
            </div>
          </section>
        </div>
      </Page>

      {/* Sticky quote bar, phones only, centred above the bottom nav with a clear gap */}
      <div aria-hidden={pillHidden} className={`fixed inset-x-4 mx-auto max-w-md z-[970] transition-all duration-200 lg:hidden ${pillHidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`} style={{ bottom: "calc(var(--bottom-nav-h) + env(safe-area-inset-bottom) + var(--pill-gap))" }}>
        <button type="button" tabIndex={pillHidden ? -1 : 0} onClick={toLead} className="flex min-h-[var(--pill-h)] w-full items-center justify-center gap-3 rounded-full bg-primary px-5 text-primary-foreground shadow-[var(--shadow-lift)]">
          <span className="shrink-0 text-[15px] font-semibold">{t("fb2Sticky")}</span>
        </button>
      </div>
      <div className="lg:hidden" style={{ height: "calc(var(--pill-h) + var(--pill-gap) + 1rem)" }} aria-hidden />
    </div>
  );
}

/** A made-up example in a phone frame, never a real business from the directory. */
function PhoneFrame({ good }: { good: boolean }) {
  const { t } = useI18n();
  const rows: Key[] = good ? ["fbAfter1", "fbAfter2", "fbAfter3"] : ["fbBefore1", "fbBefore2", "fbBefore3"];
  const name = t("fbExampleName");
  return (
    <figure className="mx-auto w-full max-w-[260px]">
      <figcaption className={`mb-2 flex justify-center`}><span className={`status-chip ${good ? "status-success" : "status-neutral"}`}>{t(good ? "fbAfterLabel" : "fbBeforeLabel")}</span></figcaption>
      <div className={`rounded-[1.75rem] border-[5px] p-1.5 shadow-[var(--shadow-lift)] ${good ? "border-primary bg-card" : "border-muted-foreground/30 bg-card"}`}>
        <div aria-hidden className="mx-auto mb-1.5 h-1.5 w-10 rounded-full bg-muted" />
        <div className="overflow-hidden rounded-[1.1rem] bg-background">
          <div className={`flex h-16 items-end p-2.5 sm:h-24 ${good ? "cat-salons" : "bg-muted"}`}>
            <span className={`monogram h-8 w-8 text-sm ${good ? "bg-card" : "cat-salons opacity-60"}`}>{name.charAt(0)}</span>
          </div>
          <div className="p-2.5">
            <p className={`text-[13px] font-bold ${good ? "" : "text-muted-foreground"}`}>{name}</p>
            <ul className="mt-2 space-y-1.5">
              {rows.map((k) => (
                <li key={k} className="flex items-start gap-1.5 text-[12px] leading-snug">
                  <span className={`mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${good ? "bg-success-soft text-success" : "bg-muted text-muted-foreground"}`}>
                    {good ? <Check className="h-2.5 w-2.5" /> : <X className="h-2.5 w-2.5" />}
                  </span>{t(k)}
                </li>
              ))}
            </ul>
            <div className={`mt-2.5 flex h-7 items-center justify-center gap-1 rounded-full text-[11px] font-semibold ${good ? "bg-primary text-primary-foreground" : "border border-dashed border-border text-muted-foreground"}`}>
              <Phone aria-hidden className="h-3 w-3" />{good ? t("callShort") : "?"}
            </div>
          </div>
        </div>
      </div>
    </figure>
  );
}
