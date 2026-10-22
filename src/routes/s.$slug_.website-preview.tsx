import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { ArrowRight, Clock, Facebook, Instagram, MapPin, MessageCircle, Music2, Navigation, Phone, Sparkles, Youtube } from "lucide-react";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { NotFoundView, useNow } from "@/components/site";
import { CatIcon } from "@/components/cover";
import { MapView } from "@/components/map-view";
import { SITE_NAME } from "@/config";
import { dayLabel, directionsLink, getArea, getBusiness, getCategory, getCity, hasPin, kathmanduNow, liveSlugRedirects, placeName, slugRedirects, socialLinks, telLink, timeLabel, whatsappLink, type Business } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";
import { pageMeta } from "@/lib/seo";
import { statusDetail, weekTable } from "@/lib/venue";

/**
 * One shared template: a free one-page website preview built only from the listing's own
 * recorded fields. It is a sales demo for the owner, so it is noindex and kept out of the sitemap.
 */
export const Route = createFileRoute("/s/$slug_/website-preview")({
  loader: ({ params }) => {
    const moved = getBusiness(params.slug) ? undefined : slugRedirects[params.slug] ?? liveSlugRedirects[params.slug];
    if (moved) throw redirect({ to: "/s/$slug/website-preview", params: { slug: moved }, statusCode: 301 });
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    const robots = { name: "robots", content: "noindex, nofollow" };
    if (!loaderData) return { meta: [{ title: "Not found" }, robots] };
    const b = loaderData.business;
    const head = pageMeta(`Website preview: ${b.name}`, `A free one-page website preview for ${b.name}, made by Sewa from its public listing.`);
    return { ...head, meta: [...head.meta, robots] };
  },
  notFoundComponent: NotFoundView,
  component: PreviewPage,
});

/** Hue per category, so each preview gets its own colour without any made-up branding. */
const HUE: Record<string, number> = { salons: 10, barbers: 245, spas: 165, clinics: 210, cafes: 60, restaurants: 38, gyms: 295, hotels: 120 };
const ORDER = [1, 2, 3, 4, 5, 6, 0];
const SOCIAL_ICON: Record<string, typeof Instagram> = { Instagram, Facebook, YouTube: Youtube, TikTok: Music2 };

function fill(s: string, v: Record<string, string>) {
  return s.replace(/\{(\w+)\}/g, (m, k: string) => v[k] ?? m);
}

function Status({ b, light = false }: { b: Business; light?: boolean }) {
  const { t } = useI18n();
  const now = useNow();
  const d = now ? statusDetail(b.hours, now) : null;
  if (!d) return null;
  const open = d.kind === "open";
  const text = open ? t("openCloses").replace("{t}", d.closes) : d.opens ? t(d.tomorrow ? "closedOpensTomorrow" : "closedOpens").replace("{t}", d.opens) : t("closedNow");
  return (
    <span className={`inline-flex items-center gap-2 text-[14px] font-semibold ${light ? "" : open ? "text-success" : "text-muted-foreground"}`}>
      <span aria-hidden className={`h-2 w-2 rounded-full ${open ? "bg-[oklch(0.78_0.15_150)]" : "bg-current opacity-60"}`} />{text}
    </span>
  );
}

function TodayHours({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const now = useNow();
  if (!b.hours?.length) return <span className="text-muted-foreground">{t("hoursNotListed")}</span>;
  const week = weekTable(b.hours);
  if (now && week) {
    const w = week[kathmanduNow(now).day];
    return <span className="tabular-nums">{w ? timeLabel(w.time, lang) : t("hoursNotListed")}</span>;
  }
  return <span className="tabular-nums">{b.hours.map((h) => `${dayLabel(h.days, lang)} ${timeLabel(h.time, lang)}`.trim()).join(", ")}</span>;
}

function Week({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const now = useNow();
  if (!b.hours?.length) return <p className="py-3 text-[15px] text-muted-foreground">{t("noHours")}</p>;
  const week = weekTable(b.hours);
  const today = now ? kathmanduNow(now).day : -1;
  return (
    <div>
      {week ? (
        <ul className="divide-y divide-[var(--pv-line)]">
          {ORDER.map((d) => {
            const w = week[d];
            const isToday = d === today;
            return (
              <li key={d} className={`flex min-h-12 items-center gap-3 px-1 text-[15px] ${isToday ? "font-semibold" : ""}`}>
                <span className="flex-1">{t(`day${d}` as Key)}{isToday && <span className="ml-2 rounded-full bg-[var(--pv-tint)] px-2 py-0.5 text-[11px] font-bold text-[var(--pv-ink)]">{t("pvFactToday")}</span>}</span>
                <span className={`text-right tabular-nums ${w?.open === false ? "text-muted-foreground" : ""}`}>{w ? timeLabel(w.time, lang) : <span className="text-muted-foreground">{t("hoursNotListed")}</span>}</span>
              </li>
            );
          })}
        </ul>
      ) : (
        <ul className="divide-y divide-[var(--pv-line)]">
          {b.hours.map((h, i) => <li key={i} className="flex min-h-12 items-center justify-between gap-3 px-1 text-[15px]"><span>{dayLabel(h.days, lang)}</span><span className="text-right tabular-nums">{timeLabel(h.time, lang)}</span></li>)}
        </ul>
      )}
      {b.hoursSource && !b.hoursVerified && <p className="mt-3 text-[13px] text-muted-foreground">{t("hoursUnverified")} {b.hoursSource}</p>}
    </div>
  );
}

function Section({ id, kicker, title, children, tint = false }: { id: string; kicker: string; title: string; children: ReactNode; tint?: boolean }) {
  return (
    <section id={id} className={`scroll-mt-4 py-14 lg:scroll-mt-16 lg:py-20 ${tint ? "bg-[var(--pv-tint)]" : ""}`}>
      <div className="mx-auto max-w-5xl px-6">
        <p className="pv-kicker">{kicker}</p>
        <h2 className="mt-3 text-[1.75rem] leading-[1.15] font-bold tracking-tight break-words sm:text-[2.25rem]">{title}</h2>
        <div className="mt-6">{children}</div>
      </div>
    </section>
  );
}

function PreviewPage() {
  const { business: b } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const area = getArea(b.area);
  const city = getCity(area?.city ?? "");
  const cat = getCategory(b.category);
  const catOne = cat ? t(`pvCat_${cat.slug}` as Key) || cat.name : "";
  const vars = { name: b.name, area: placeName(area, lang), city: placeName(city, lang), cat: catOne };
  const dir = directionsLink(b);
  const socials = socialLinks(b);
  const style = { "--pv-h": HUE[b.category] ?? 262 } as CSSProperties;
  const nav: [string, Key][] = [["about", "tabAbout"], ["hours", "tabHours"], ["visit", "pvNavVisit"], ["contact", "pvNavContact"]];
  // Only photos the business published; if one fails to load, the code-made hero art is used instead.
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  useEffect(() => {
    setFailed(false);
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, [b.slug]);
  const photo = b.cover && !failed ? b.cover : undefined;
  const ownerLink = { to: "/for-businesses" as const, search: { from: "preview" as const, listing: b.slug, business: b.name }, hash: "quote" };
  // The phone bar steps aside while the owner section's own button is on screen.
  const ownerRef = useRef<HTMLElement>(null);
  const [ownerVisible, setOwnerVisible] = useState(false);
  useEffect(() => {
    const el = ownerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => setOwnerVisible(Boolean(e?.isIntersecting)), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const steps: [Key, Key][] = [["pvNext1Title", "pvNext1Body"], ["pvNext2Title", "pvNext2Body"], ["pvNext3Title", "pvNext3Body"]];

  return (
    <div className="pv-site pv-site-pad" style={style}>
      {/* Sewa bar: fixed at the bottom on phones, a slim strip on top on desktop. */}
      <div className="pv-bar" role="region" aria-label={t("pvBarText")} data-hidden={ownerVisible ? "true" : "false"} aria-hidden={ownerVisible || undefined}>
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-2.5 lg:px-6 lg:py-2">
          <span aria-hidden className="hidden h-8 w-8 shrink-0 sm:flex items-center justify-center rounded-lg bg-[var(--hero-foreground)] text-[15px] font-bold text-[var(--hero)]">
            {SITE_NAME.charAt(0)}<span className="mb-1.5 ml-px h-1.5 w-1.5 self-end rounded-full bg-brand-accent" />
          </span>
          <p className="min-w-0 flex-1 leading-tight">
            <span className="block truncate text-[13px] font-semibold sm:text-sm"><span className="sm:hidden">{t("pvBarShort")}</span><span className="hidden sm:inline">{t("pvBarText")}</span></span>
            <span className="block truncate text-[11.5px] text-[var(--hero-muted)] sm:text-[12.5px]"><span className="sm:hidden">{t("pvBarNoteShort")}</span><span className="hidden sm:inline">{t("pvBarNote")}</span></span>
          </p>
          <Link {...ownerLink} className="action-btn shrink-0 !min-h-11 bg-brand-accent !px-3.5 text-[13.5px] font-bold sm:!px-5 sm:text-[14px] text-brand-accent-foreground hover:brightness-105">{t("pvBarCta")}</Link>
        </div>
      </div>

      {/* Hero */}
      <header className="pv-hero">
        {photo && (
          <>
            <img ref={img} src={photo.url} alt="" onError={() => setFailed(true)} className="absolute inset-0 -z-20 h-full w-full object-cover" />
            <span className="pv-hero-shade" aria-hidden />
          </>
        )}
        {!photo && (
          <span aria-hidden className="pointer-events-none absolute -right-16 -bottom-10 -z-10 text-[var(--pv-glow)] opacity-[0.13] sm:right-0">
            <CatIcon category={b.category} className="h-[22rem] w-[22rem] stroke-[0.6]" />
          </span>
        )}
        <div className="mx-auto max-w-5xl px-6">
          <nav className="flex items-center justify-between gap-3 py-4" aria-label={t("sections")}>
            <span className="flex min-w-0 items-center gap-2.5">
              <span aria-hidden className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-white/25 bg-white/10 text-base font-bold backdrop-blur">{b.name.charAt(0)}</span>
              <span className="truncate text-[15px] font-semibold">{b.name}</span>
            </span>
            <span className="hidden items-center gap-1 lg:flex">
              {nav.map(([id, k]) => <a key={id} href={`#${id}`} className="inline-flex min-h-11 items-center rounded-full px-3.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">{t(k)}</a>)}
            </span>
            {b.phone && <a href={telLink(b.phone)} aria-label={`${t("call")} ${b.phone}`} className="action-btn pv-btn-ghost !min-h-11 shrink-0 !px-3.5 text-sm"><Phone aria-hidden className="h-4 w-4" /><span className="hidden sm:inline">{b.phone}</span></a>}
          </nav>

          <div className="flex min-h-[23rem] flex-col justify-end pt-8 pb-16 sm:min-h-[28rem] lg:min-h-[30rem] lg:pb-24">
            <p className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[13px] font-semibold backdrop-blur">
              <CatIcon category={b.category} className="h-3.5 w-3.5" />{fill(t("pvHeroIn"), vars)}
            </p>
            <h1 className="mt-4 max-w-3xl text-[2.375rem] leading-[1.05] font-extrabold tracking-tight break-words sm:text-[3.25rem] lg:text-[4rem]">{b.name}</h1>
            {b.description && <p className="mt-4 max-w-xl text-[16px] leading-relaxed text-white/80 sm:text-[17px]">{b.description}</p>}
            <p className="mt-4 text-white/90"><Status b={b} light /></p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              {b.phone && <a href={telLink(b.phone)} className="action-btn pv-btn-light min-h-12 px-7 text-[15px]"><Phone aria-hidden className="h-[18px] w-[18px]" />{t("pvCallNow")}</a>}
              {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="action-btn pv-btn-ghost min-h-12 px-7 text-[15px]"><Navigation aria-hidden className="h-[18px] w-[18px]" />{t("directions")}</a>}
            </div>
          </div>
        </div>
        {photo && <p className="absolute right-3 bottom-3 rounded-full bg-black/45 px-2.5 py-0.5 text-[11px] text-white/85 backdrop-blur">{t("photo")}: {photo.credit}</p>}
      </header>

      {/* Quick facts */}
      <div className="relative z-10 mx-auto -mt-8 max-w-5xl px-4 sm:px-6">
        <dl className="pv-card grid divide-y divide-[var(--pv-line)] sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <Fact icon={Clock} label={t("pvFactToday")}><TodayHours b={b} /></Fact>
          <Fact icon={MapPin} label={t("pvFactWhere")}>{b.address ?? fill("{area}, {city}", vars)}</Fact>
          <Fact icon={Phone} label={t("pvFactPhone")}>{b.phone ? <a href={telLink(b.phone)} className="tabular-nums underline decoration-[var(--pv-line)] decoration-2 underline-offset-4">{b.phone}</a> : <span className="text-muted-foreground">{t("noneListed")}</span>}</Fact>
        </dl>
      </div>

      <Section id="about" kicker={t("tabAbout")} title={fill(t("pvWelcome"), vars)}>
        <div className="grid gap-8 lg:grid-cols-[1.3fr_1fr] lg:items-start">
          <div className="space-y-4 text-[17px] leading-relaxed text-foreground/85">
            <p>{fill(t("pvAboutFallback"), vars)}</p>
          </div>
          {b.services.length > 0 && (
            <div className="pv-card p-5">
              <h3 className="text-base font-semibold">{t("services")}</h3>
              <ul className="mt-3 divide-y divide-[var(--pv-line)]">
                {b.services.map((s) => <li key={s.name} className="flex min-h-11 items-center justify-between gap-3 text-[15px]"><span>{s.name}</span>{s.price && <span className="tabular-nums text-muted-foreground">{s.price}</span>}</li>)}
              </ul>
            </div>
          )}
        </div>
      </Section>

      <Section id="hours" kicker={t("tabHours")} title={t("openingTimes")} tint>
        <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr] lg:items-start">
          <div>
            {b.hours?.length ? <p className="text-[17px] leading-relaxed text-foreground/85"><Status b={b} /></p> : null}
            {b.phone && <a href={telLink(b.phone)} className={`action-btn pv-btn-deep min-h-12 px-6 lg:inline-flex ${b.hours?.length ? "mt-5 hidden" : "inline-flex w-full sm:w-auto lg:mt-0"}`}><Phone aria-hidden className="h-4 w-4" />{t("pvCallNow")}</a>}
          </div>
          <div className="pv-card px-4 py-2 sm:px-6 sm:py-3"><Week b={b} /></div>
        </div>
      </Section>

      {(hasPin(b) || b.address || dir) && (
        <Section id="visit" kicker={t("pvNavVisit")} title={t("pvVisitTitle")}>
          <div className="grid gap-6 lg:grid-cols-[1fr_1.4fr] lg:items-start">
            <div>
              <p className="flex gap-3 text-[17px] leading-relaxed"><MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-[var(--pv-ink)]" /><span>{b.address ?? fill("{area}, {city}", vars)}</span></p>
              {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="action-btn pv-btn-deep mt-5 min-h-12 w-full px-6 sm:w-auto"><Navigation aria-hidden className="h-4 w-4" />{t("directions")}</a>}
            </div>
            {hasPin(b) ? (
              <MapView items={[b]} className="h-64 lg:h-80" note={false} />
            ) : (
              <div aria-hidden className="pv-hero relative hidden h-56 items-center justify-center rounded-[1.25rem] sm:flex lg:h-72">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-white/12 ring-8 ring-white/5"><MapPin className="h-7 w-7" /></span>
                <span className="absolute bottom-4 left-5 text-[13px] font-semibold text-white/80">{fill("{area}, {city}", vars)}</span>
              </div>
            )}
          </div>
        </Section>
      )}

      {/* Contact */}
      <section id="contact" className="pv-hero scroll-mt-4 py-14 lg:scroll-mt-16 lg:py-20">
        <div className="mx-auto max-w-5xl px-6">
          <p className="pv-kicker !text-[var(--pv-glow)]">{t("pvNavContact")}</p>
          <h2 className="mt-3 text-[1.75rem] leading-[1.15] font-bold tracking-tight sm:text-[2.25rem]">{t("pvContactTitle")}</h2>
          <p className="mt-2 text-[16px] text-white/75">{t("pvContactBody")}</p>
          {b.phone && <a href={telLink(b.phone)} className="mt-6 block w-fit text-[2rem] leading-none font-bold tracking-tight tabular-nums sm:text-[2.5rem]">{b.phone}</a>}
          <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
            {b.phone && <a href={telLink(b.phone)} className="action-btn pv-btn-light min-h-12 px-6"><Phone aria-hidden className="h-[18px] w-[18px]" />{t("call")}</a>}
            {b.whatsapp && <a href={whatsappLink(b.whatsapp)} target="_blank" rel="noopener noreferrer" className="action-btn pv-btn-ghost min-h-12 px-6"><MessageCircle aria-hidden className="h-[18px] w-[18px]" />{t("whatsapp")}</a>}
            {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="action-btn pv-btn-ghost min-h-12 px-6"><Navigation aria-hidden className="h-[18px] w-[18px]" />{t("directions")}</a>}
          </div>
          {socials.length > 0 && (
            <div className="mt-8">
              <p className="text-[13px] font-semibold tracking-wide text-white/60 uppercase">{t("pvSocialTitle")}</p>
              <ul className="mt-3 flex flex-wrap gap-2">
                {socials.map((s) => {
                  const Icon = SOCIAL_ICON[s.platform ?? ""] ?? ArrowRight;
                  return <li key={s.url}><a href={s.url} target="_blank" rel="noopener noreferrer" className="action-btn pv-btn-ghost min-h-11 px-4 text-sm"><Icon aria-hidden className="h-4 w-4" />{s.platform}</a></li>;
                })}
              </ul>
            </div>
          )}
        </div>
      </section>

      {/* For the owner */}
      <section id="owner" ref={ownerRef} aria-labelledby="pv-owner" className="scroll-mt-4 bg-background py-14 lg:py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <div className="owner-note p-6 sm:p-10">
            <p className="inline-flex items-center gap-1.5 rounded-full bg-brand-accent px-3 py-1 text-xs font-bold text-brand-accent-foreground"><Sparkles aria-hidden className="h-3.5 w-3.5" />{t("pvOwnerKicker")}</p>
            <h2 id="pv-owner" className="mt-3 max-w-2xl text-[1.5rem] leading-tight font-bold tracking-tight sm:text-[2rem]">{t("pvOwnerTitle")}</h2>
            <p className="mt-3 max-w-2xl text-[16px] leading-relaxed text-foreground/80">{t("pvOwnerBody")}</p>
            <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center">
              <Link {...ownerLink} className="action-btn action-primary min-h-12 px-7 text-[15px]">{t("pvBarCta")}<ArrowRight aria-hidden className="h-[18px] w-[18px]" /></Link>
              <Link to="/for-businesses" className="inline-flex min-h-11 items-center justify-center px-2 text-[15px] font-semibold underline decoration-brand-accent decoration-2 underline-offset-4">{t("pvOwnerSecondary")}</Link>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-base font-semibold">{t("pvNextTitle")}</h3>
            <ol className="mt-4 grid gap-3 sm:grid-cols-3">
              {steps.map(([title, body], i) => (
                <li key={title} className="flex gap-3.5 rounded-2xl border border-border bg-card p-4">
                  <span aria-hidden className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-semibold text-primary-foreground tabular-nums">{i + 1}</span>
                  <div className="min-w-0">
                    <p className="text-[15px] font-semibold">{t(title)}</p>
                    <p className="mt-0.5 text-[14px] leading-relaxed text-muted-foreground">{t(body)}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </section>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 px-6 py-8 text-sm sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="font-semibold">{b.name}</p>
            <p className="text-muted-foreground">{fill("{area}, {city}", vars)}</p>
          </div>
          <div className="text-muted-foreground sm:text-right">
            <p>{t("pvFooterNote")}</p>
            <p className="mt-1 flex flex-wrap gap-x-4 sm:justify-end">
              <Link to="/s/$slug" params={{ slug: b.slug }} className="inline-flex min-h-11 items-center text-primary underline">{t("pvViewListing")}</Link>
              <Link to="/suggest-correction" search={{ listing: b.slug }} className="inline-flex min-h-11 items-center text-primary underline">{t("suggestThis")}</Link>
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function Fact({ icon: Icon, label, children }: { icon: typeof Clock; label: string; children: ReactNode }) {
  return (
    <div className="flex items-start gap-3.5 px-5 py-4">
      <span aria-hidden className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[var(--pv-tint)] text-[var(--pv-ink)]"><Icon className="h-4 w-4" /></span>
      <div className="min-w-0">
        <dt className="text-[12px] font-semibold tracking-wide text-muted-foreground uppercase">{label}</dt>
        <dd className="mt-0.5 text-[15px] leading-snug font-medium break-words">{children}</dd>
      </div>
    </div>
  );
}
