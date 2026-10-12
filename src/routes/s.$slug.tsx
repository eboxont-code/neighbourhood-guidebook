import { createFileRoute, Link, notFound, redirect, useRouter } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Globe, MapPin, Navigation, Phone, Share2 } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { NotFoundView, HoursLine, pageMeta, useNow } from "@/components/site";
import { CatIcon } from "@/components/cover";
import { SectionHead } from "@/components/blocks";
import { HeartButton, VenueRow } from "@/components/venue";
import { MapView } from "@/components/map-view";
import { businesses, dayLabel, placeName, timeLabel, getCity, hasPin, whatsappLink, directionsLink, slugRedirects, showWebsite, socialLinks, websiteButton, getArea, getBusiness, getCategory, telLink, websiteStatusSentence, kathmanduNow, type Business } from "@/data/directory";
import { useI18n, type Key } from "@/lib/i18n";
import { businessJsonLd, breadcrumbJsonLd } from "@/lib/seo";
import { distanceTo, formatDistance, sortByDistance, useLocation } from "@/lib/geo";
import { statusDetail, weekTable } from "@/lib/venue";

export const Route = createFileRoute("/s/$slug")({
  loader: ({ params }) => {
    const moved = slugRedirects[params.slug];
    if (moved) throw redirect({ to: "/s/$slug", params: { slug: moved }, statusCode: 301 });
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }, { name: "robots", content: "noindex" }] };
    const b = loaderData.business;
    const area = getArea(b.area)?.name ?? "";
    const cat = getCategory(b.category)?.name.replace(/s$/, "").toLowerCase() ?? "business";
    const bits = [b.phone ? `phone ${b.phone}` : "", b.hours?.length ? "opening hours" : "", "website check"].filter(Boolean).join(", ");
    const head = pageMeta(`${b.name}, ${area}`, `${b.name} is a ${cat} in ${area}, ${getCity(getArea(b.area)?.city ?? "")?.name ?? ""}. See the ${bits}, and where each detail came from.`, `/s/${b.slug}`, { type: "business.business", ...(b.cover ? { image: b.cover.url } : {}) });
    return { ...head, scripts: [{ type: "application/ld+json", children: JSON.stringify(businessJsonLd(b)) }, { type: "application/ld+json", children: JSON.stringify(breadcrumbJsonLd(b)) }] };
  },
  notFoundComponent: NotFoundView,
  component: ShopPage,
});

function Row({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="fact-row">
      <dt className="text-sm text-muted-foreground">{label}</dt>
      <dd className="min-w-0 break-words">{children}</dd>
    </div>
  );
}

function Crumbs({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const area = getArea(b.area)!;
  const city = getCity(area.city)!;
  const cat = getCategory(b.category)!;
  const link = "inline-flex min-h-11 items-center hover:text-foreground hover:underline";
  const sep = <ChevronRight aria-hidden className="h-3.5 w-3.5 shrink-0" />;
  return (
    <nav aria-label={t("breadcrumb")} className="-mt-1 overflow-x-auto [scrollbar-width:none]">
      <ol className="flex items-center gap-1 text-[13px] whitespace-nowrap text-muted-foreground">
        <li><Link to="/" className={link}>{t("home")}</Link></li>{sep}
        <li><Link to="/$city" params={{ city: city.slug }} className={link}>{placeName(city, lang)}</Link></li>{sep}
        <li><Link to="/$city/$section" params={{ city: city.slug, section: area.slug }} className={link}>{placeName(area, lang)}</Link></li>{sep}
        <li><Link to="/$city/$section" params={{ city: city.slug, section: cat.slug }} search={{ area: area.slug }} className={link}>{lang === "ne" ? cat.nameNe : cat.name}</Link></li>{sep}
        <li aria-current="page" className="max-w-[10rem] truncate text-foreground">{b.name}</li>
      </ol>
    </nav>
  );
}

function StatusLine({ b }: { b: Business }) {
  const { t } = useI18n();
  const now = useNow();
  const d = now ? statusDetail(b.hours, now) : null;
  if (!d) return <HoursLine b={b} />;
  if (d.kind === "open") return <span className="font-semibold text-success">{t("openCloses").replace("{t}", d.closes)}</span>;
  return <span className="font-semibold text-error">{d.opens ? t(d.tomorrow ? "closedOpensTomorrow" : "closedOpens").replace("{t}", d.opens) : t("closedNow")}</span>;
}

function OpeningTimes({ b }: { b: Business }) {
  const { t, lang } = useI18n();
  const now = useNow();
  if (!b.hours?.length) return <p className="text-muted-foreground">{t("noHours")}</p>;
  const week = weekTable(b.hours);
  const today = now ? kathmanduNow(now).day : -1;
  const order = [1, 2, 3, 4, 5, 6, 0];
  return (
    <div>
      {week ? (
        <ul>
          {order.map((d) => {
            const w = week[d];
            return (
              <li key={d} className={`day-row ${d === today ? "font-semibold" : ""}`}>
                <span aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${w?.open ? "bg-success" : "bg-muted-foreground/40"}`} />
                <span className="flex-1">{t(`day${d}` as Key)}</span>
                <span className="text-right tabular-nums">{w ? timeLabel(w.time, lang) : <span className="text-muted-foreground">{t("hoursNotListed")}</span>}</span>
              </li>
            );
          })}
        </ul>
      ) : b.hours.map((h, i) => <p key={i}><span className="mr-2">{dayLabel(h.days, lang)}</span>{timeLabel(h.time, lang)}</p>)}
      {b.hoursSource && (
        <p className={`mt-2 text-sm ${b.hoursVerified ? "text-muted-foreground" : "text-unverified"}`}>{b.hoursVerified ? t("hoursFrom") : t("hoursUnverified")} {b.hoursSource}</p>
      )}
    </div>
  );
}

function useToast() {
  const [msg, setMsg] = useState("");
  useEffect(() => { if (!msg) return; const id = setTimeout(() => setMsg(""), 2200); return () => clearTimeout(id); }, [msg]);
  return { msg, show: setMsg };
}

function ShopPage() {
  const { business: b } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const router = useRouter();
  const cat = getCategory(b.category)!;
  const area = getArea(b.area)!;
  const { here } = useLocation();
  const dist = distanceTo(b, here);
  const toast = useToast();
  const headRef = useRef<HTMLDivElement>(null);
  const [stuck, setStuck] = useState(false);
  const [spy, setSpy] = useState("about");
  const dir = directionsLink(b);
  const tabs = [
    { id: "about", label: t("tabAbout") },
    { id: "hours", label: t("tabHours") },
    { id: "location", label: t("tabLocation") },
    { id: "owner", label: t("tabOwner") },
  ].filter((x) => x.id !== "location" || hasPin(b) || b.address || dir);

  useEffect(() => {
    const el = headRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setStuck(!e!.isIntersecting), { rootMargin: "-56px 0px 0px 0px" });
    io.observe(el);
    const spyIo = new IntersectionObserver((es) => { for (const e of es) if (e.isIntersecting) setSpy(e.target.id); }, { rootMargin: "-120px 0px -60% 0px" });
    tabs.forEach((x) => { const s = document.getElementById(x.id); if (s) spyIo.observe(s); });
    return () => { io.disconnect(); spyIo.disconnect(); };
  }, [b.slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) { await navigator.share({ title: b.name, url }); return; }
      await navigator.clipboard.writeText(url);
      toast.show(t("linkCopied"));
    } catch { /* cancelled */ }
  };
  const back = () => { if (window.history.length > 1) router.history.back(); else router.navigate({ to: "/$city/$section", params: { city: area.city, section: area.slug } }); };
  const nearby = here && hasPin(b)
    ? sortByDistance(businesses.filter((x) => x.id !== b.id && hasPin(x)), { lat: b.lat!, lng: b.lng! }).slice(0, 10)
    : businesses.filter((x) => x.area === b.area && x.id !== b.id);
  const nearbyByPin = hasPin(b) ? sortByDistance(businesses.filter((x) => x.id !== b.id), { lat: b.lat!, lng: b.lng! }).filter(hasPin).slice(0, 10) : nearby;
  const near = hasPin(b) ? nearbyByPin : nearby;
  const goTab = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div>
      {/* Sticky name bar and scroll-spy tabs after the header scrolls away */}
      <div aria-hidden={!stuck} className={`fixed inset-x-0 top-0 z-[955] border-b border-border bg-card/95 backdrop-blur-md transition-transform duration-200 ${stuck ? "translate-y-0" : "-translate-y-full"}`}>
        <div className="mx-auto max-w-6xl px-5">
          <p className="truncate pt-2.5 text-[15px] font-semibold">{b.name}</p>
          <nav aria-label={t("sections")} className="-mx-1 flex gap-1 overflow-x-auto [scrollbar-width:none]">
            {tabs.map((x) => (
              <button key={x.id} type="button" tabIndex={stuck ? 0 : -1} onClick={() => goTab(x.id)} aria-current={spy === x.id ? "true" : undefined}
                className={`min-h-11 shrink-0 border-b-2 px-3 text-sm font-medium transition-colors ${spy === x.id ? "border-foreground text-foreground" : "border-transparent text-muted-foreground"}`}>{x.label}</button>
            ))}
          </nav>
        </div>
      </div>

      <div ref={headRef} className="relative">
        {b.cover ? (
          <figure className="relative">
            <div className="venue-cover"><img src={b.cover.url} alt="" className="h-full w-full object-cover" /></div>
            <figcaption className="cover-credit">{t("photo")}: {b.cover.credit}</figcaption>
          </figure>
        ) : (
          <div className={`venue-thumb cat-${b.category} h-[200px] !rounded-none md:h-[260px]`} aria-hidden>
            <span className="venue-mono !h-20 !w-20 !text-[2rem]">{b.name.charAt(0)}<span className="venue-mono-icon !h-7 !w-7"><CatIcon category={b.category} className="h-3.5 w-3.5" /></span></span>
          </div>
        )}
        <div className="absolute inset-x-0 top-0 mx-auto flex max-w-6xl items-center justify-between px-4 pt-3">
          <button type="button" onClick={back} aria-label={t("back")} className="round-btn"><ArrowLeft aria-hidden className="h-[18px] w-[18px]" /></button>
          <div className="flex gap-2">
            <button type="button" onClick={share} aria-label={t("share")} className="round-btn"><Share2 aria-hidden className="h-[18px] w-[18px]" /></button>
            <HeartButton slug={b.slug} name={b.name} />
          </div>
        </div>
      </div>

      <div className="sheet">
        <main className="mx-auto max-w-2xl px-5 pt-4 pb-6 lg:grid lg:max-w-6xl lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-10 lg:pt-6">
          <div className="min-w-0">
            <Crumbs b={b} />
            <h1 className="mt-1 text-[1.625rem] leading-tight font-semibold tracking-tight break-words sm:text-3xl">{b.name}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{lang === "ne" ? cat.nameNe : cat.name} · {placeName(area, lang)}{dist !== null && <> · <span className="whitespace-nowrap">{formatDistance(dist, lang)}</span></>}</p>
            <p className="mt-2 text-[15px]" aria-label={t("keyFacts")}><StatusLine b={b} /></p>
            {b.phone && <p className="mt-1 text-base font-semibold tabular-nums">{b.phone}</p>}
            {(b.address || dir) && (
              <div className="mt-4 flex items-center gap-3 rounded-full bg-muted py-1 pr-1 pl-4">
                <MapPin aria-hidden className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="min-w-0 flex-1 truncate text-sm">{b.address ?? placeName(area, lang)}</span>
                {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary min-h-11 shrink-0 !border-0 px-3.5 text-[13px]"><Navigation aria-hidden className="h-3.5 w-3.5" />{t("directions")}</a>}
              </div>
            )}

            <section id="about" className="scroll-mt-28 pt-8">
              <h2 className="section-title">{t("tabAbout")}</h2>
              <dl className="divide-y divide-border">
                <Row label={t("websiteStatus")}>
                  {showWebsite(b) && (
                    <a href={b.website} target="_blank" rel="noopener noreferrer" className="block break-all text-primary underline">{b.website!.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}</a>
                  )}
                  <span className={showWebsite(b) ? "text-sm text-muted-foreground" : ""}>{websiteStatusSentence(b, lang)}</span>
                </Row>
                {b.otherPhones?.length ? (
                  <Row label={t("otherPhones")}>
                    {b.otherPhones.map((p) => (
                      <div key={p.number}><a href={telLink(p.number)} className="inline-flex min-h-11 items-center text-primary underline">{p.number}</a>{p.note && <span className="text-muted-foreground"> · {t(p.note)}</span>}</div>
                    ))}
                  </Row>
                ) : null}
                {b.whatsapp && <Row label={t("whatsapp")}><a href={whatsappLink(b.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-primary underline">{b.whatsapp}</a></Row>}
                {socialLinks(b).length > 0 && (
                  <Row label={t("social")}>
                    {socialLinks(b).map((x) => <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="block break-all text-primary underline">{x.platform} {x.handle}</a>)}
                  </Row>
                )}
                <Row label={t("source")}>
                  {b.sourceNotes}
                  {b.sourceUrl && <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-primary underline">{t("viewSource")}</a>}
                </Row>
                {b.description && <Row label={t("note")}>{b.description}</Row>}
              </dl>
            </section>

            <section id="hours" className="scroll-mt-28 pt-8">
              <h2 className="section-title">{t("openingTimes")}</h2>
              <OpeningTimes b={b} />
            </section>

            {tabs.some((x) => x.id === "location") && (
              <section id="location" className="scroll-mt-28 pt-8">
                <h2 className="section-title">{t("tabLocation")}</h2>
                {hasPin(b) ? (
                  <div className="relative">
                    <MapView items={[b]} className="h-56 lg:h-64" note={false} />
                    {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="action-btn action-dark absolute right-3 bottom-3 z-[600] min-h-11 px-4 text-sm"><Navigation aria-hidden className="h-4 w-4" />{t("directions")}</a>}
                  </div>
                ) : (
                  <div className="rounded-2xl bg-muted p-4">
                    {b.address && <p>{b.address}</p>}
                    {dir && <a href={dir} target="_blank" rel="noopener noreferrer" className="mt-1 inline-flex min-h-11 items-center font-semibold text-primary underline">{t("openMaps")}</a>}
                  </div>
                )}
              </section>
            )}

            <section id="owner" className="scroll-mt-28 pt-8">
              <OwnerPanel b={b} />
              <p className="mt-4 text-sm">
                <span className="text-muted-foreground">{t("spotMistake")} </span>
                <Link to="/suggest-correction" search={{ listing: b.slug }} className="text-primary underline">{t("suggestThis")}</Link>
              </p>
            </section>
          </div>

          <aside className="hidden lg:block">
            {(b.phone || websiteButton(b)) && (
              <div className="sticky top-24 flex flex-col gap-2 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)]">
                {b.phone && <a href={telLink(b.phone)} className="action-btn action-dark min-h-12"><Phone aria-hidden className="h-5 w-5" />{t("call")} {b.phone}</a>}
                {websiteButton(b) && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary min-h-12"><Globe aria-hidden className="h-5 w-5" />{t("website")}</a>}
              </div>
            )}
          </aside>
        </main>

        {near.length > 0 && (
          <section className="band band-alt">
            <div className="mx-auto max-w-6xl px-5">
              <SectionHead title={t("placesNearby")} />
              <VenueRow items={near} label={t("placesNearby")} />
            </div>
          </section>
        )}
      </div>

      {toast.msg && <div role="status" className="toast">{toast.msg}</div>}

      {(b.phone || websiteButton(b)) && (
        <div className="bottom-nav lg:hidden" role="group" aria-label={t("quickActions")}>
          <div className="mx-auto flex max-w-2xl gap-2 px-4 py-2.5">
            {b.phone && <a href={telLink(b.phone)} className="action-btn action-dark flex-1 px-3"><Phone aria-hidden className="h-5 w-5" />{t("call")}</a>}
            {websiteButton(b) && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1 px-3 text-sm whitespace-nowrap"><Globe aria-hidden className="h-5 w-5" />{t("website")}</a>}
          </div>
        </div>
      )}
    </div>
  );
}

function OwnerPanel({ b }: { b: Business }) {
  const { t } = useI18n();
  const noSite = b.websiteStatus === "none_found" || b.websiteStatus === "owner_no_site" || b.websiteStatus === "failed";
  return (
    <aside aria-labelledby="owner-note" className="owner-note">
      <p className="mb-1 inline-flex rounded-full bg-brand-accent px-2.5 py-0.5 text-xs font-bold text-brand-accent-foreground">{t("ownerKicker")}</p>
      <h2 id="owner-note" className="text-lg font-semibold">{noSite ? t("ownerNoSiteTitle") : t("ownerTitle")}</h2>
      <p className="mt-1 text-sm leading-relaxed">{t(`owner_${b.websiteStatus}`)}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-5">
        <Link to="/contact" search={{ business: b.name, listing: b.slug }} className="action-btn action-dark min-h-11 text-sm">{noSite ? t("ownerClaimSite") : t("ownerContact")}</Link>
        <Link to="/for-businesses" className="inline-flex min-h-11 items-center text-primary underline">{t("ownerMore")}</Link>
      </div>
    </aside>
  );
}
