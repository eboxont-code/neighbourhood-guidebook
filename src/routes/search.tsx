import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Clock, Search as SearchIcon } from "lucide-react";
import { EmptyState, Page, SearchBox, pageMeta } from "@/components/site";
import { RowList, SectionHead } from "@/components/blocks";
import { categoriesIn, searchBusinesses } from "@/data/directory";
import { suggestedSearches } from "@/lib/filters";
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

const KEY = "recent-searches";
const readRecent = (): string[] => { try { const v = JSON.parse(localStorage.getItem(KEY) ?? "[]"); return Array.isArray(v) ? v.filter((x) => typeof x === "string").slice(0, 6) : []; } catch { return []; } };

function SearchPage() {
  const { q } = Route.useSearch();
  const { t, lang } = useI18n();
  const results = searchBusinesses(q);
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(readRecent()), []);
  // Remember a query on this device once the person has paused on it and it found something.
  useEffect(() => {
    const v = q.trim();
    if (v.length < 2 || !results.length) return;
    const id = setTimeout(() => {
      const next = [v, ...readRecent().filter((x) => x.toLowerCase() !== v.toLowerCase())].slice(0, 6);
      try { localStorage.setItem(KEY, JSON.stringify(next)); } catch { /* storage may be off */ }
      setRecent(next);
    }, 1500);
    return () => clearTimeout(id);
  }, [q, results.length]);
  const clear = () => { try { localStorage.removeItem(KEY); } catch { /* ignore */ } setRecent([]); };
  const pill = "chip !min-h-11 !text-[13px]";

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-2xl px-4 pt-4 pb-4">
          <h1 className="sr-only">{t("navSearch")}</h1>
          <SearchBox initial={q} autoFocus />
        </div>
      </div>
      <Page>
        {!q.trim() ? (
          <div className="space-y-8">
            {recent.length > 0 && (
              <section>
                <SectionHead title={t("recentSearches")} sub={t("recentNote")} action={<button type="button" onClick={clear} className="-my-2 min-h-11 px-2 text-sm font-semibold text-primary">{t("clearRecent")}</button>} />
                <ul className="divide-y divide-border overflow-hidden rounded-2xl border border-border bg-card">
                  {recent.map((r) => (
                    <li key={r}><Link to="/search" search={{ q: r }} className="flex min-h-12 items-center gap-3 px-4 hover:bg-muted/60"><Clock aria-hidden className="h-4 w-4 text-muted-foreground" />{r}</Link></li>
                  ))}
                </ul>
              </section>
            )}
            <section>
              <SectionHead title={t("trySearching")} />
              <div className="flex flex-wrap gap-2">
                {suggestedSearches(lang, t("catInArea")).map((s) => (
                  <Link key={s} to="/search" search={{ q: s }} className={pill}><SearchIcon aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />{s}</Link>
                ))}
              </div>
            </section>
          </div>
        ) : results.length === 0 ? (
          <EmptyState title={t("noResultsTitle")} body={`${t("noResults")} ${t("tryOther")}`} />
        ) : (
          <div className="space-y-7">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-semibold text-foreground">{results.length === 1 ? t("resultsOne") : t("resultsN").replace("{n}", String(results.length))}</span> · {t("resultsFor")} “{q}”
            </p>
            {categoriesIn(results).map((c) => (
              <section key={c.slug}>
                <h2 className="section-label">{lang === "ne" ? c.nameNe : c.name}</h2>
                <RowList items={results.filter((b) => b.category === c.slug)} />
              </section>
            ))}
          </div>
        )}
      </Page>
    </>
  );
}
