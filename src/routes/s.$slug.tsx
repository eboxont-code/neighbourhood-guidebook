import { createFileRoute, Link, notFound, redirect } from "@tanstack/react-router";
import { NotFoundView, pageMeta } from "@/components/site";
import { Cover } from "@/components/cover";
import type { ReactNode } from "react";
import { MapView } from "@/components/map-view";
import { getCity, hasPin, whatsappLink, directionsLink, slugRedirects, showWebsite, socialLinks, websiteButton, getArea, getBusiness, getCategory, telLink, websiteStatusSentence, type Business } from "@/data/directory";
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
        <div style={{ gridArea: "panel" }} className={`venue-panel ${b.cover ? "" : "venue-panel-overlap"}`}>
          <h1 className="font-serif text-3xl leading-tight font-semibold break-words">{b.name}</h1>
          <p className="mt-1 text-sm">
            <Link to="/$city/$section" params={{ city: area.city, section: cat.slug }} className="text-primary underline">{lang === "ne" ? cat.nameNe : cat.name}</Link>
            {" · "}
            <Link to="/$city/$section" params={{ city: area.city, section: area.slug }} className="text-primary underline">{area.name}</Link>
          </p>
          {b.phone && <p className="mt-1">{b.phone}</p>}
        </div>

        <div style={{ gridArea: "aside" }} className="lg:sticky lg:top-4 lg:mt-4">
          {(b.phone || websiteButton(b)) && (
            <div className="mt-4 flex gap-2 lg:mt-0 lg:flex-col">
              {b.phone && <a href={telLink(b.phone)} className="action-btn action-primary flex-1">{t("call")}</a>}
              {websiteButton(b) && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1">{t("website")}</a>}
            </div>
          )}
          {hasPin(b) && (
            <div className="mt-6 hidden lg:block">
              <h2 className="section-label">{t("whereIsIt")}</h2>
              <MapView items={[b]} className="h-64" note={false} />
            </div>
          )}
        </div>

        <div style={{ gridArea: "details" }} className="min-w-0">
        <dl className="mt-6 divide-y divide-border border-y border-border">
          <Row label={t("hours")}>
            {b.hours?.length ? (
              <>
                {b.hours.map((h, i) => <div key={i}>{h.days && <span className="mr-2">{h.days}</span>}{h.time}</div>)}
                {b.hoursSource && (
                  <p className={`mt-1 text-xs ${b.hoursVerified ? "text-muted-foreground" : "text-unverified"}`}>
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
    </div>
  );
}

function OwnerPanel({ b }: { b: Business }) {
  const { t } = useI18n();
  return (
    <aside aria-labelledby="owner-note" className="owner-note mt-8">
      <p className="section-label mb-1">{t("ownerKicker")}</p>
      <h2 id="owner-note" className="font-serif text-lg font-semibold">{t("ownerTitle")}</h2>
      <p className="mt-1 text-sm leading-relaxed">{t(`owner_${b.websiteStatus}`)}</p>
      <div className="mt-2 flex flex-col text-sm sm:flex-row sm:gap-5">
        <Link to="/contact" search={{ business: b.name, listing: b.slug }} className="inline-flex min-h-11 items-center text-primary underline">{t("ownerContact")}</Link>
        <Link to="/for-businesses" className="inline-flex min-h-11 items-center text-primary underline">{t("ownerMore")}</Link>
      </div>
    </aside>
  );
}
