import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { NotFoundView, pageMeta } from "@/components/site";
import { CatIcon, Cover } from "@/components/cover";
import { Globe, MessageCircle, Phone } from "lucide-react";
import type { ReactNode } from "react";
import { MapView } from "@/components/map-view";
import { dayLabel, placeName, timeLabel, getCity, hasPin, whatsappLink, directionsLink, slugRedirects, showWebsite, socialLinks, websiteButton, getArea, getBusiness, getCategory, telLink, websiteStatusSentence, type Business } from "@/data/directory";
import { useI18n } from "@/lib/i18n";
import { businessJsonLd } from "@/lib/seo";

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
    return { ...head, scripts: [{ type: "application/ld+json", children: JSON.stringify(businessJsonLd(b)) }] };
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

function ShopPage() {
  const { business: b } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const cat = getCategory(b.category)!;
  const area = getArea(b.area)!;
  return (
    <div>
      <Cover cover={b.cover} name={b.name} category={b.category} />
      <main className="venue-layout mx-auto max-w-2xl px-4 pb-6 lg:max-w-6xl">
        <div style={{ gridArea: "panel" }} className={`venue-panel page-enter ${b.cover ? "" : "venue-panel-overlap"}`}>
          <h1 className="text-[1.875rem] leading-tight font-extrabold break-words sm:text-4xl">{b.name}</h1>
          <div className="mt-2 flex flex-wrap gap-2 text-sm">
            <Link to="/$city/$section" params={{ city: area.city, section: cat.slug }} className={`chip cat-${cat.slug} !border-transparent !bg-[var(--ph-bg)] !text-[var(--ph-ink)]`}><CatIcon category={cat.slug} className="h-4 w-4" />{lang === "ne" ? cat.nameNe : cat.name}</Link>
            <Link to="/$city/$section" params={{ city: area.city, section: area.slug }} className="chip">{placeName(area, lang)}</Link>
          </div>
          {b.phone && <p className="mt-3 text-lg font-bold tabular-nums">{b.phone}</p>}
        </div>

        <div style={{ gridArea: "aside" }} className="lg:sticky lg:top-20 lg:mt-4">
          {(b.phone || websiteButton(b)) && (
            <div className="hidden gap-2 rounded-3xl bg-card p-4 shadow-[var(--shadow-card)] lg:flex lg:flex-col">
              {b.phone && <a href={telLink(b.phone)} className="action-btn action-primary flex-1"><Phone aria-hidden className="h-5 w-5" />{t("call")}</a>}
              {websiteButton(b) && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1"><Globe aria-hidden className="h-5 w-5" />{t("website")}</a>}
              {b.whatsapp && <a href={whatsappLink(b.whatsapp)} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1"><MessageCircle aria-hidden className="h-5 w-5" />{t("whatsapp")}</a>}
            </div>
          )}
          {hasPin(b) && (
            <div className="mt-6 hidden lg:block">
              <h2 className="section-title">{t("whereIsIt")}</h2>
              <MapView items={[b]} className="h-64" note={false} />
            </div>
          )}
        </div>

        <div style={{ gridArea: "details" }} className="min-w-0">
        <dl className="info-card mt-5 divide-y divide-border">
          <Row label={t("hours")}>
            {b.hours?.length ? (
              <>
                {b.hours.map((h, i) => <div key={i}><span className="mr-2">{dayLabel(h.days, lang)}</span>{timeLabel(h.time, lang)}</div>)}
                {b.hoursSource && (
                  <p className={`mt-1 text-sm ${b.hoursVerified ? "text-muted-foreground" : "text-unverified"}`}>
                    {b.hoursVerified ? t("hoursFrom") : t("hoursUnverified")} {b.hoursSource}
                  </p>
                )}
              </>
            ) : <span className="text-muted-foreground">{t("noHours")}</span>}
          </Row>
          <Row label={t("websiteStatus")}>
            {showWebsite(b) && (
              <a href={b.website} target="_blank" rel="noopener noreferrer" className="block break-all text-primary underline">
                {b.website!.replace(/^https?:\/\/(www\.)?/, "").replace(/\/$/, "")}
              </a>
            )}
            <span className={showWebsite(b) ? "text-sm text-muted-foreground" : ""}>{websiteStatusSentence(b, lang)}</span>
          </Row>
          {b.otherPhones?.length ? (
            <Row label={t("otherPhones")}>
              {b.otherPhones.map((p) => (
                <div key={p.number}>
                  <a href={telLink(p.number)} className="text-primary underline">{p.number}</a>
                  {p.note && <span className="text-muted-foreground"> · {t(p.note)}</span>}
                </div>
              ))}
            </Row>
          ) : null}
          {b.whatsapp && (
            <Row label={t("whatsapp")}>
              <a href={whatsappLink(b.whatsapp)} target="_blank" rel="noopener noreferrer" className="text-primary underline">{b.whatsapp}</a>
            </Row>
          )}
          {b.address && <Row label={t("address")}>{b.address}</Row>}
          {directionsLink(b) && (
            <Row label={t("directions")}>
              <a href={directionsLink(b)} target="_blank" rel="noopener noreferrer" className="text-primary underline">{t("openMaps")}</a>
            </Row>
          )}
          {socialLinks(b).length > 0 && (
            <Row label={t("social")}>
              {socialLinks(b).map((x) => (
                <a key={x.url} href={x.url} target="_blank" rel="noopener noreferrer" className="block break-all text-primary underline">
                  {x.platform} {x.handle}
                </a>
              ))}
            </Row>
          )}
          <Row label={t("source")}>
            {b.sourceNotes}
            {b.sourceUrl && <a href={b.sourceUrl} target="_blank" rel="noopener noreferrer" className="mt-1 block text-sm text-primary underline">{t("viewSource")}</a>}
          </Row>
          {b.description && <Row label={t("note")}>{b.description}</Row>}
        </dl>

        {hasPin(b) && (
          <div className="mt-6 lg:hidden">
            <h2 className="section-label">{t("whereIsIt")}</h2>
            <MapView items={[b]} className="h-56" note={false} />
          </div>
        )}

        <OwnerPanel b={b} />

        <p className="mt-5 text-sm">
          <span className="text-muted-foreground">{t("spotMistake")} </span>
          <Link to="/suggest-correction" search={{ listing: b.slug }} className="text-primary underline">{t("suggestThis")}</Link>
        </p>
        </div>
      </main>
      {(b.phone || websiteButton(b) || b.whatsapp) && (
        <div className="bottom-nav lg:hidden" role="group" aria-label={t("quickActions")}>
          <div className="mx-auto flex max-w-2xl gap-2 px-4 py-2.5">
            {b.phone && <a href={telLink(b.phone)} className="action-btn action-primary flex-[2] px-3"><Phone aria-hidden className="h-5 w-5" />{t("call")}</a>}
            {websiteButton(b) && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1 px-3 text-sm whitespace-nowrap"><Globe aria-hidden className="h-5 w-5" />{t("website")}</a>}
            {b.whatsapp && <a href={whatsappLink(b.whatsapp)} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1 px-3" aria-label={t("whatsapp")}><MessageCircle aria-hidden className="h-5 w-5" /></a>}
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
    <aside aria-labelledby="owner-note" className="owner-note mt-8">
      <p className="mb-1 inline-flex rounded-full bg-brand-accent px-2.5 py-0.5 text-xs font-bold text-brand-accent-foreground">{t("ownerKicker")}</p>
      <h2 id="owner-note" className="text-lg font-extrabold">{noSite ? t("ownerNoSiteTitle") : t("ownerTitle")}</h2>
      <p className="mt-1 text-sm leading-relaxed">{t(`owner_${b.websiteStatus}`)}</p>
      <div className="mt-3 flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:gap-5">
        <Link to="/contact" search={{ business: b.name, listing: b.slug }} className="action-btn action-primary min-h-11 text-sm">{noSite ? t("ownerClaimSite") : t("ownerContact")}</Link>
        <Link to="/for-businesses" className="inline-flex min-h-11 items-center text-primary underline">{t("ownerMore")}</Link>
      </div>
    </aside>
  );
}
