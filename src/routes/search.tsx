import { createFileRoute, Link } from "@tanstack/react-router";
import { CardList, Page, SearchBox, pageMeta } from "@/components/site";
import { businesses, searchBusinesses } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>) => ({ q: typeof s["q"] === "string" ? s["q"] : "" }),
  head: () => pageMeta("Search", "Search local businesses by name, category, area or service."),
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
            <div className="rounded-md border border-dashed border-border p-6 text-center">
              <p className="font-semibold">{t("noResults")} “{q}”.</p>
              <p className="mt-1 text-sm text-muted-foreground">{t("tryOther")}</p>
              <Link to="/" className="mt-3 inline-block text-primary underline">{t("home")}</Link>
            </div>
          ) : (<><h1 className="section-label">{t("resultsFor")} “{q}”</h1><CardList items={results} /></>)}
      </div>
    </Page>
  );
}
