import { createFileRoute } from "@tanstack/react-router";
import { CardList, Page, SearchBox, pageMeta } from "@/components/site";
import { businesses, searchBusinesses } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  head: ({ match }) => {
    const q = (match.search as { q?: string }).q?.trim();
    return q ? pageMeta(`Search: ${q.slice(0, 60)}`, `Kathmandu businesses matching "${q.slice(0, 60)}".`, "/search")
      : pageMeta("Search", "Search Kathmandu salons, barbers, spas and clinics by name, category, area or service.", "/search");
  },
  component: SearchPage,
});

function SearchPage() {
  const { q } = Route.useSearch();
  const { t } = useI18n();
  const results = searchBusinesses(q);
  return (
    <Page>
      <SearchBox initial={q} autoFocus />
      <div className="mt-6">
        {!q.trim() ? <CardList items={businesses} />
          : results.length === 0 ? (
            <p>{t("noResults")}</p>
          ) : (<><h1 className="section-label">{t("resultsFor")} “{q}”</h1><CardList items={results} /></>)}
      </div>
    </Page>
  );
}
