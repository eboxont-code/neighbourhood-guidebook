import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Monogram, NotFoundView, Page, pageMeta } from "@/components/site";
import { getArea, getBusiness, getCategory, telLink, websiteStatusSentence } from "@/data/directory";
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

function Row({ label, children }: { label: string; children: React.ReactNode }) {
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
        <div className={`venue-panel ${b.cover ? "" : ""}`}>
          <h1 className="font-serif text-3xl leading-tight font-semibold break-words">{b.name}</h1>
          <p className="mt-1 text-sm">
            <Link to="/c/$categorySlug" params={{ categorySlug: cat.slug }} className="text-primary underline">{lang === "ne" ? cat.nameNe : cat.name}</Link>
            {" · "}
            <Link to="/a/$areaSlug" params={{ areaSlug: area.slug }} className="text-primary underline">{area.name}</Link>
          </p>
          {b.phone && <p className="mt-1">{b.phone}</p>}
        </div>

        {(b.phone || b.website) && (
          <div className="mt-4 flex gap-2">
            {b.phone && <a href={telLink(b.phone)} className="action-btn action-primary flex-1">{t("call")}</a>}
            {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary flex-1">{t("website")}</a>}
          </div>
        )}

        <dl className="mt-6 divide-y divide-border border-y border-border">
          <Row label={t("hours")}>
            {b.hours?.length ? b.hours.map((h) => <div key={h.days}>{h.days} {h.time}</div>) : <span className="text-muted-foreground">{t("noHours")}</span>}
          </Row>
          <Row label={t("websiteStatus")}>
            {websiteStatusSentence(b, lang)}
          </Row>
          {b.address && <Row label={t("address")}>{b.address}</Row>}
          <Row label={t("source")}>{b.sourceNotes}</Row>
          {b.description && <Row label={t("note")}>{b.description}</Row>}
        </dl>
      </main>
    </div>
  );
}
