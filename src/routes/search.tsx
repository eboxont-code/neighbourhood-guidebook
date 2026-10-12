import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useState } from "react";
import { Clock, Map as MapIcon, Search as SearchIcon, SlidersHorizontal } from "lucide-react";
import { EmptyState, Page, SearchBox, pageMeta, useNow } from "@/components/site";
import { RowList, SectionHead } from "@/components/blocks";
import { FullMap } from "@/components/map-view";
import { areasInUse, businesses, categoriesIn, getArea, hasPin, placeName, searchBusinesses } from "@/data/directory";
import { applyCatFilters, parseSearchParams, suggestedSearches, type SearchState } from "@/lib/filters";
import { requestLocation, useLocation } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/search")({
  validateSearch: (s: Record<string, unknown>): SearchState => parseSearchParams(s),
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
  const s = Route.useSearch();
  const { q } = s;
  const navigate = useNavigate({ from: Route.fullPath });
  const { t, lang } = useI18n();
  const now = useNow();
  const loc = useLocation();
  const [panel, setPanel] = useState(false);
  const filtered = !!(s.area || s.open || s.near);
  const base = q.trim() ? searchBusinesses(q) : filtered ? businesses : [];
  const results = applyCatFilters(base, { ...(s.area ? { area: s.area } : {}), ...(s.open ? { open: true } : {}), ...(s.near ? { sort: "near" as const } : {}) }, now, loc.here);
  const active = q.trim() || filtered;
  const [recent, setRecent] = useState<string[]>([]);
  useEffect(() => setRecent(readRecent()), []);
  useEffect(() => { if (s.near && loc.state.status === "idle") requestLocation(); }, [s.near]); // eslint-disable-line react-hooks/exhaustive-deps
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
  const set = (patch: Partial<SearchState>) => navigate({ search: (prev: SearchState) => { const n: Record<string, unknown> = { ...prev, ...patch }; Object.keys(n).forEach((k) => { if (k !== "q" && !n[k]) delete n[k]; }); return n as SearchState; }, replace: true });
  const closeMap = useCallback(() => set({ view: undefined }), []); // eslint-disable-line react-hooks/exhaustive-deps
  const pill = (on: boolean) => `chip !min-h-11 !text-[13px] ${on ? "chip-on" : ""}`;
  const summary = [q.trim(), s.area ? placeName(getArea(s.area), lang) : "", s.near ? t("sortNear") : "", s.open ? t("openNow") : ""].filter(Boolean).join(" · ");
  const pins = results.filter(hasPin).length;
  const nearOk = loc.state.status === "nepal";

  return (
    <>
      <div className="border-b border-border bg-card">
        <div className="mx-auto max-w-3xl px-5 pt-4 pb-4">
          <h1 className="sr-only">{t("navSearch")}</h1>
          <SearchBox initial={q} autoFocus={!active} />
          {active && (
            <div className="mt-3 flex items-center gap-2">
              <p className="flex min-h-11 min-w-0 flex-1 items-center rounded-full bg-muted px-4 text-sm font-semibold"><span className="truncate">{summary || t("navSearch")}</span></p>
              <button type="button" aria-expanded={panel} aria-label={t("filters")} onClick={() => setPanel((v) => !v)} className={`round-btn !shadow-none ${panel || filtered ? "!bg-foreground !text-panel" : "!bg-muted"}`}><SlidersHorizontal aria-hidden className="h-[18px] w-[18px]" /></button>
              <button type="button" aria-pressed={s.view === "map"} aria-label={t("viewMap")} onClick={() => set({ view: s.view === "map" ? undefined : "map" })} className={`round-btn !shadow-none ${s.view === "map" ? "!bg-foreground !text-panel" : "!bg-muted"}`}><MapIcon aria-hidden className="h-[18px] w-[18px]" /></button>
            </div>
          )}
          {active && panel && (
            <div className="page-enter mt-3 flex flex-wrap gap-2" role="group" aria-label={t("filterBy")}>
              <button type="button" aria-pressed={!!s.open} onClick={() => set({ open: !s.open || undefined })} className={pill(!!s.open)}><span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />{t("openNow")}</button>
              <button type="button" aria-pressed={!!s.near} onClick={() => { if (!s.near && loc.state.status === "idle") requestLocation(); set({ near: !s.near || undefined }); }} className={pill(!!s.near)}>{t("sortNear")}</button>
              <span aria-hidden className="w-px self-stretch bg-border" />
              {areasInUse().map((a) => <button key={a.slug} type="button" aria-pressed={s.area === a.slug} onClick={() => set({ area: s.area === a.slug ? undefined : a.slug })} className={pill(s.area === a.slug)}>{placeName(a, lang)}</button>)}
            </div>
          )}
        </div>
      </div>
      <Page>
        {!active ? (
          <div className="space-y-8">
            {recent.length > 0 && (
              <section>
                <SectionHead title={t("recentSearches")} sub={t("recentNote")} action={<button type="button" onClick={clear} className="-my-2 min-h-11 px-2 text-sm font-semibold text-foreground">{t("clearRecent")}</button>} />
                <ul className="divide-y divide-border overflow-hidden rounded-2xl bg-card shadow-[var(--shadow-card)]">
                  {recent.map((r) => (
                    <li key={r}><Link to="/search" search={{ q: r }} className="flex min-h-12 items-center gap-3 px-4 hover:bg-muted/60"><Clock aria-hidden className="h-4 w-4 text-muted-foreground" />{r}</Link></li>
                  ))}
                </ul>
              </section>
            )}
            <section>
              <SectionHead title={t("trySearching")} />
              <div className="flex flex-wrap gap-2">
                {suggestedSearches(lang, t("catInArea")).map((x) => (
                  <Link key={x} to="/search" search={{ q: x }} className={pill(false)}><SearchIcon aria-hidden className="h-3.5 w-3.5 text-muted-foreground" />{x}</Link>
                ))}
              </div>
            </section>
          </div>
        ) : results.length === 0 ? (
          <EmptyState title={filtered ? t("noFilterTitle") : t("noResultsTitle")} body={filtered ? t("noFilterBody") : t("tryOther")}
            action={filtered ? <button type="button" onClick={() => set({ area: undefined, open: undefined, near: undefined })} className="action-btn action-dark">{t("clearFilters")}</button> : <Link to="/search" search={{ q: "" }} className="action-btn action-dark">{t("trySearching")}</Link>} />
        ) : s.view === "map" ? (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground" aria-live="polite">{(pins === 1 ? t("countMapOne") : t("countMap")).replace("{n}", String(pins))}</p>
            <FullMap items={results} onClose={closeMap} closeLabel={t("showList")} />
          </div>
        ) : (
          <div className="space-y-7">
            <p className="text-sm text-muted-foreground" aria-live="polite">
              <span className="font-semibold text-foreground">{results.length === 1 ? t("placesOne") : t("placesN").replace("{n}", String(results.length))}</span>{q.trim() && <> · {t("resultsFor")} “{q}”</>}
            </p>
            {s.near && nearOk ? <RowList items={results} /> : categoriesIn(results).map((c) => (
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
