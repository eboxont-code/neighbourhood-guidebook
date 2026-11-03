import { createFileRoute, Link } from "@tanstack/react-router";
import { businesses, getArea, getBusiness, getCategory, placeName } from "@/data/directory";
import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Check, Clock, Image, MapPin, Phone, Plus, RefreshCw, Scissors, Sparkles, X } from "lucide-react";
import { Page, pageMeta } from "@/components/site";
import { ContactForm } from "@/components/forms";
import { dict, useI18n, type Key } from "@/lib/i18n";
import { SITE_NAME, SITE_URL } from "@/config";
import { Thumb } from "@/components/venue";
import { previewExamples } from "@/lib/preview";
import type { ServicePackageId } from "@/lib/commerce";

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
const PACKAGE_IDS: ServicePackageId[] = ["launch", "growth", "care"];

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
  const [selectedPackage, setSelectedPackage] = useState<ServicePackageId | "">("");
  const [leadVisible, setLeadVisible] = useState(false);
  const leadRef = useRef<HTMLElement>(null);
  const pillHidden = leadVisible;

  function choosePackage(id: ServicePackageId) {
    setSelectedPackage(id);
    setMsg(t(`quotePrefill_${id}` as Key));
    toLead();
  }

  useEffect(() => {
    const el = leadRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setLeadVisible(!!e?.isIntersecting), { rootMargin: "0px 0px 140px 0px" });
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

  const how: Key[] = ["fbOwnerStep1", "fbOwnerStep2", "fbOwnerStep3"];
  const faq: [Key, Key][] = [["fbQ1", "fbA1"], ["fbQ2", "fbA2"], ["fbQ5", "fbA5"]];
  const inc: [Key, typeof Phone][] = [["fb2Inc1", Scissors], ["fb2Inc2", Clock], ["fb2Inc3", Phone], ["fb2Inc4", MapPin], ["fb2Inc5", Image], ["fb2Inc6", RefreshCw]];

  return (
    <div className="overflow-x-clip bg-background">
      {/* Hero: owner-facing, light, not the directory's navy band */}
      <section className="border-b border-border bg-card">
        <div className="page-enter mx-auto max-w-5xl px-5 pt-8 pb-8 lg:pt-16 lg:pb-14">
          <div>
            <Kicker>{t("fbKicker")}</Kicker>
            <h1 className="mt-3 text-[1.75rem] leading-[1.15] font-bold tracking-tight sm:text-[2.5rem]">{t("fbHeroTitle")}</h1>
            <p className="mt-3 max-w-xl text-[16px] leading-relaxed text-muted-foreground">{t("fbOwnerIntro")}</p>
          </div>
        </div>
      </section>

      {/* Clear website-service packages make the existing business enquiry actionable. */}
      <section className="bg-muted/50 py-10 lg:py-14" aria-labelledby="pricing">
        <div className="mx-auto max-w-5xl px-5">
          <div className="max-w-2xl">
            <Kicker>{t("fbPricingKicker")}</Kicker>
            <h2 id="pricing" className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{t("fbPricingTitle")}</h2>
            <p className="mt-2 leading-relaxed text-muted-foreground">{t("fbPricingBody")}</p>
          </div>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            {PACKAGE_IDS.map((id) => (
              <article key={id} className={`flex flex-col rounded-2xl border bg-card p-4 shadow-[var(--shadow-card)] ${id === "growth" ? "border-primary ring-1 ring-primary/20" : "border-border"}`}>
                <h3 className="text-base font-bold">{t(`pkg_${id}_title` as Key)}</h3>
                <p className="mt-3 text-2xl font-bold tracking-tight">{t(`pkg_${id}_price` as Key)}</p>
                <p className="text-sm text-muted-foreground">{t(`pkg_${id}_billing` as Key)}</p>
                <p className="mt-3 min-h-12 text-sm leading-relaxed text-muted-foreground">{t(`pkg_${id}_body` as Key)}</p>
                <ul className="mt-3 flex-1 space-y-2 text-sm">
                  {[1, 2, 3, 4].map((n) => (
                    <li key={n} className="flex items-start gap-2">
                      <Check aria-hidden className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                      <span>{t(`pkg_${id}_feature_${n}` as Key)}</span>
                    </li>
                  ))}
                </ul>
                <button type="button" onClick={() => choosePackage(id)} className="action-btn action-primary mt-5 min-h-11 w-full text-sm">
                  {t("fbChoosePackage")}
                </button>
              </article>
            ))}
          </div>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">{t("fbPricingNote")}</p>
        </div>
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
            <ul className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
              {inc.map(([k, Icon]) => (
                <li key={k} className="flex min-h-12 items-center gap-2.5 rounded-xl border border-border bg-card px-3 text-[14px] font-semibold">
                  <Icon aria-hidden className="h-4 w-4 shrink-0 text-primary" strokeWidth={1.75} />{t(k)}
                </li>
              ))}
            </ul>
          </section>

          <PreviewExamples />

          {/* How it works */}
          <section className="mt-10">
            <h2 className="text-xl font-bold tracking-tight sm:text-2xl">{t("fbHowTitle")}</h2>
            <ol className="mt-5 grid gap-3 sm:grid-cols-3">
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
            <h2 id="lead-title" className="mt-2 text-xl font-bold tracking-tight sm:text-2xl">{t("fb2LeadTitle")}</h2>
            <p className="mt-2 mb-5 leading-relaxed text-muted-foreground">{t("fbOwnerFormBody")}</p>
            {pv && (
              <div className="mb-4 flex flex-wrap items-center justify-between gap-x-4 gap-y-1 rounded-2xl border border-border bg-accent px-4 py-3">
                <p className="inline-flex items-center gap-2 text-[14px] font-semibold text-accent-foreground"><Sparkles aria-hidden className="h-4 w-4 shrink-0" />{t("pvFromPreview").replace("{name}", pvName)}</p>
                <Link to="/s/$slug/website-preview" params={{ slug: pv.slug }} className="inline-flex min-h-11 items-center gap-1.5 text-[14px] font-semibold text-primary underline"><ArrowLeft aria-hidden className="h-4 w-4" />{t("pvBackPreview")}</Link>
              </div>
            )}
            <p className="mb-4 text-sm leading-relaxed text-muted-foreground">{t("fbOwnerFindIntro")} <Link to="/search" search={{ q: "" }} className="inline-flex min-h-11 items-center text-primary underline underline-offset-4">{t("fbOwnerFindLink")}</Link></p>
            <div className="form-card">
              <ContactForm key={`${msg}|${selectedPackage}|${pv?.slug ?? ""}`} business={pvName} listing={pv ? pv.slug : ""} page={pv ? "preview" : "for-businesses"} message={msg} serviceOptions initialServicePackage={selectedPackage} doneText={t("fb2Thanks")} submitLabel={t("fbOwnerSend")} />
            </div>
          </section>
        </div>
      </Page>

      {/* Sticky quote bar, phones only, centred above the bottom nav with a clear gap */}
      <div aria-hidden={pillHidden} className={`fixed inset-x-4 mx-auto max-w-md z-[970] transition-all duration-200 lg:hidden ${pillHidden ? "pointer-events-none translate-y-3 opacity-0" : "opacity-100"}`} style={{ bottom: "calc(var(--bottom-nav-h) + env(safe-area-inset-bottom) + var(--pill-gap))" }}>
        <button type="button" tabIndex={pillHidden ? -1 : 0} onClick={toLead} className="flex min-h-[var(--pill-h)] w-full items-center justify-center gap-3 rounded-full bg-primary px-5 text-primary-foreground shadow-[var(--shadow-lift)]">
          <span className="text-[15px] font-semibold">{t("fb2Sticky")}</span>
        </button>
      </div>
      <div className="lg:hidden" style={{ height: "calc(var(--pill-h) + var(--pill-gap) + 1rem)" }} aria-hidden />
    </div>
  );
}

/** Real listings with no website, each linking to its own free preview. The cards are the only links here. */
function PreviewExamples() {
  const { t, lang } = useI18n();
  const items = previewExamples(businesses);
  if (!items.length) return null;
  return (
    <section className="mt-10" aria-labelledby="examples-title">
      <h2 id="examples-title" className="text-xl font-bold tracking-tight sm:text-2xl">{t("fbExTitle")}</h2>
      <p className="mt-2 leading-relaxed text-muted-foreground">{t("fbExBody")}</p>
      <ul aria-label={t("fbExLabel")} className="mt-4 grid gap-2.5 sm:grid-cols-3 sm:gap-3">
        {items.map((b) => {
          const cat = getCategory(b.category);
          return (
            <li key={b.slug} className="relative flex items-center gap-3 rounded-2xl border border-border bg-card p-2.5 shadow-[var(--shadow-card)] transition-colors hover:border-primary/40 sm:flex-col sm:items-stretch sm:gap-0 sm:p-2">
              <Thumb b={b} className="h-[4.5rem] w-[4.5rem] shrink-0 sm:aspect-[16/10] sm:h-auto sm:w-full" />
              <div className="min-w-0 flex-1 sm:px-1 sm:pt-2.5 sm:pb-1">
                <Link to="/s/$slug/website-preview" params={{ slug: b.slug }} className="stretched line-clamp-2 text-[15px] leading-snug font-semibold">{b.name}</Link>
                <p className="mt-0.5 truncate text-[13px] text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name} · {placeName(getArea(b.area), lang)}</p>
              </div>
            </li>
          );
        })}
      </ul>
    </section>
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
