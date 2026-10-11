import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { NotFoundView, pageMeta } from "@/components/site";
import { Cover } from "@/components/cover";
import type { ReactNode } from "react";
import { directionsLink, showWebsite, socialLinks, websiteButton, getArea, getBusiness, getCategory, telLink, websiteStatusSentence } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/s/$slug")({
  loader: ({ params }) => {
    const business = getBusiness(params.slug);
    if (!business) throw notFound();
    return { business };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Not found" }] };
    const b = loaderData.business;
    const area = getArea(b.area)?.name ?? "";
    return pageMeta(b.name, `${b.name}, ${getCategory(b.category)?.name} in ${area}. Listing.`);
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
      <Cover cover={b.cover} />
      <main className="mx-auto max-w-2xl px-4 pb-6">
        <div className="venue-panel">
          <h1 className="font-serif text-3xl leading-tight font-semibold break-words">{b.name}</h1>
          <p className="mt-1 text-sm">
            <Link to="/c/$categorySlug" params={{ categorySlug: cat.slug }} className="text-primary underline">{lang === "ne" ? cat.nameNe : cat.name}</Link>
            {" · "}
            <Link to="/a/$areaSlug" params={{ areaSlug: area.slug }} className="text-primary underline">{area.name}</Link>
          </p>
          {b.phone && <p className="mt-1">{b.phone}</p>}
        </div>

        {(b.phone || websiteButton(b)) && (
          <div className="mt-4 flex gap-2">
            {b.phone && <a href={telLink(b.phone)} className="action-btn action-primary flex-1">{t("call")}</a>}
            {websiteButton(b) && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1">{t("website")}</a>}
          </div>
        )}

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
          {b.otherPhones?.length ? <Row label={t("otherPhones")}>{b.otherPhones.map((p) => <div key={p}>{p}</div>)}</Row> : null}
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
          <Row label={t("source")}>{b.sourceNotes}</Row>
          {b.description && <Row label={t("note")}>{b.description}</Row>}
        </dl>
      </main>
    </div>
  );
}
