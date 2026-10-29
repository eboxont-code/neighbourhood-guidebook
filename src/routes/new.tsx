import { createFileRoute, Link } from "@tanstack/react-router";
import { NotFoundView, Page, pageMeta, useNow } from "@/components/site";
import { areasInUse, businesses, citiesInUse, getArea, getCategory, placeName } from "@/data/directory";
import { formatDate } from "@/lib/venue";
import { checkedDate, checkedDaysAgo, recentlyVerified } from "@/lib/verification";
import { useI18n } from "@/lib/i18n";
import { SITE_NAME } from "@/config";

export const Route = createFileRoute("/new")({
  head: () => pageMeta(`Recently verified on ${SITE_NAME}`, `Business listings on ${SITE_NAME}, sorted by their latest recorded check date. Listings without a check date appear last.`, "/new"),
  notFoundComponent: NotFoundView,
  component: NewPage,
});

function NewPage() {
  const { t, lang } = useI18n();
  const now = useNow();
  const groups = new Map<string, typeof businesses>();
  for (const b of recentlyVerified(businesses)) {
    const date = checkedDate(b) ?? '';
    groups.set(date, [...(groups.get(date) ?? []), b]);
  }
  const city = citiesInUse()[0];
  return <Page>
    <div className="mb-6"><h1 className="text-lg font-semibold sm:text-xl">{t("newPageTitle")}</h1><p className="mt-0.5 text-sm text-muted-foreground">{t("newPageSub")}</p></div>
    {!groups.size ? <div className="py-6 text-center"><h2 className="text-base font-semibold">{t("newEmptyTitle")}</h2><p className="mt-1 text-sm text-muted-foreground">{t("newEmptyBody")}</p><div className="mt-4 flex flex-wrap justify-center gap-2">{city && areasInUse(city.slug).map((a) => <Link key={a.slug} to="/$city/$section" params={{ city: city.slug, section: a.slug }} className="inline-flex min-h-11 items-center px-3 text-sm text-primary underline">{placeName(a, lang)}</Link>)}</div></div>
      : <ol className="space-y-8">{[...groups].map(([date, list]) => <li key={date}>
        <div className="flex items-center gap-3"><span aria-hidden className="h-2 w-2 shrink-0 rounded-full bg-brand-accent" /><h2 className="text-sm font-semibold text-muted-foreground">{date ? formatDate(date, lang) : t('notYetChecked')}</h2><span aria-hidden className="h-px flex-1 bg-border" /></div>
        <ul className="mt-3 divide-y divide-border">{list.map((b) => {
          const cat = getCategory(b.category), area = getArea(b.area);
          const days = now ? checkedDaysAgo(b, now) : null;
          return <li key={b.id} className="py-3"><Link to="/s/$slug" params={{ slug: b.slug }} className="flex min-h-11 items-center text-[15px] font-semibold break-words underline-offset-4 hover:underline">{b.name}</Link><p className="text-[13px] text-muted-foreground">{lang === 'ne' ? cat?.nameNe : cat?.name} · {placeName(area, lang)}</p>{days !== null && <p className="mt-1 text-[13px] text-muted-foreground">{t('checkedDays').replace('{n}', new Intl.NumberFormat(lang === 'ne' ? 'ne-NP' : 'en').format(days))}</p>}{b.sourceNotes && <p className="mt-1 text-[13px] leading-relaxed text-muted-foreground">{t('source')}: {b.sourceNotes}</p>}</li>;
        })}</ul>
      </li>)}</ol>}
  </Page>;
}
