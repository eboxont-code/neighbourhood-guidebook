import { createFileRoute } from "@tanstack/react-router";
import { EmptyState, Page, SearchBox, pageMeta } from "@/components/site";
import { Directory } from "@/components/directory";
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
    <Page wide>
      <div className="app-hero -mx-4 -mt-6 px-4 pt-5 pb-6 sm:rounded-b-3xl"><div className="mx-auto max-w-2xl"><h1 className="mb-3 text-2xl font-extrabold">{t("navSearch")}</h1><SearchBox initial={q} autoFocus /></div></div>
      <div className="mt-6">
        {!q.trim() ? <Directory items={businesses} />
          : results.length === 0 ? (
            <EmptyState title={t("noResultsTitle")} body={`${t("noResults")} ${t("tryOther")}`} />
          ) : (<><h2 className="section-title">{t("resultsFor")} “{q}”</h2><Directory key={q} items={results} /></>)}
      </div>
    </Page>
  );
}
