import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { Monogram, NotFoundView, Page, pageMeta } from "@/components/site";
import { getArea, getBusiness, getCategory, mapsLink, telLink, websiteStatusSentence, whatsappLink } from "@/data/directory";
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

function ShopPage() {
  const { business: b } = Route.useLoaderData();
  const { t, lang } = useI18n();
  const cat = getCategory(b.category)!;
  const area = getArea(b.area)!;
  return (
    <div>
      <div className="venue-cover">
        <Monogram name={b.name} size="lg" />
      </div>
      <main className="mx-auto max-w-2xl px-4 pb-6">
        <div className="venue-panel">
          <h1 className="font-serif text-3xl leading-tight font-semibold">{b.name}</h1>
          <p className="mt-1 text-sm">
            <Link to="/category/$categorySlug" params={{ categorySlug: cat.slug }} className="text-primary underline">{lang === "ne" ? cat.nameNe : cat.name}</Link>
            {" · "}
            <Link to="/area/$areaSlug" params={{ areaSlug: area.slug }} className="text-primary underline">{area.name}</Link>
          </p>
          {b.phone && <p className="mt-1 text-sm">{b.phone}</p>}
          {b.address && <p className="mt-1 text-sm text-muted-foreground">{b.address}</p>}
        </div>
      {b.description && <p className="mt-4 leading-relaxed">{b.description}</p>}

      <div className="mt-5 grid grid-cols-2 gap-2">
        {b.phone && <a href={telLink(b.phone)} className="action-btn action-primary">{t("call")}</a>}
        {b.website && <a href={b.website} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary">{t("website")}</a>}
        {b.whatsapp && <a href={whatsappLink(b.whatsapp)} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary">{t("whatsapp")}</a>}
        {b.address && <a href={mapsLink(b.address)} target="_blank" rel="noopener noreferrer" className="action-btn action-secondary">{t("directions")}</a>}
      </div>

      {b.services.length > 0 && (
        <section className="mt-6 border-t border-border pt-4">
          <h2 className="section-label">{t("services")}</h2>
          <ul className="divide-y divide-border">
            {b.services.map((s) => (
              <li key={s.name} className="flex items-baseline justify-between gap-4 py-3">
                <span>{s.name}</span>
                {s.price && <span className="font-semibold">{s.price}</span>}
              </li>
            ))}
          </ul>
        </section>
      )}

      <section className="mt-5 border-t border-border pt-4">
        <h2 className="section-label">{t("hours")}</h2>
        {b.hours?.length ? (
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-1">
            {b.hours.map((h) => <div key={h.days} className="contents"><dt>{h.days}</dt><dd>{h.time}</dd></div>)}
          </dl>
        ) : <p className="text-muted-foreground">{t("noHours")}</p>}
      </section>

      <section className="mt-5 border-t border-border pt-4 text-sm leading-relaxed">
        <h2 className="section-label">{t("about")}</h2>
        <p>{websiteStatusSentence(b, lang)}</p>
        <p>{t("source")}: {b.sourceNotes}</p>
        <p>{t(`verif_${b.verification}`)}</p>
      </section>
      </main>
    </div>
  );
}
