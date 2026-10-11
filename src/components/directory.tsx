import { useState, type ReactNode } from "react";
import { areasIn, categoriesIn, type Business } from "@/data/directory";
import { useI18n } from "@/lib/i18n";
import { CardList } from "@/components/site";
import { MapView } from "@/components/map-view";

function FilterGroup({ label, options, value, onChange }: { label: string; options: { slug: string; label: string }[]; value: string; onChange: (v: string) => void }) {
  const { t } = useI18n();
  if (options.length < 2) return null;
  return (
    <div>
      <h2 className="section-label">{label}</h2>
      <div className="flex flex-wrap gap-2 lg:flex-col lg:items-stretch">
        {[{ slug: "", label: t("filterAll") }, ...options].map((o) => (
          <button key={o.slug || "all"} type="button" aria-pressed={value === o.slug} onClick={() => onChange(o.slug)}
            className={`chip min-h-11 lg:justify-start ${value === o.slug ? "chip-on" : ""}`}>{o.label}</button>
        ))}
      </div>
    </div>
  );
}

/** Browsable list of listings: filters beside the list on desktop, and a list or map view. */
export function Directory({ items, filterType = true, filterArea = true, aside }: { items: Business[]; filterType?: boolean; filterArea?: boolean; aside?: ReactNode }) {
  const { t, lang } = useI18n();
  const [cat, setCat] = useState("");
  const [area, setArea] = useState("");
  const [view, setView] = useState<"list" | "map">("list");
  const shown = items.filter((b) => (!cat || b.category === cat) && (!area || b.area === area));
  const types = filterType ? categoriesIn(items).map((c) => ({ slug: c.slug, label: lang === "ne" ? c.nameNe : c.name })) : [];
  const areaOpts = filterArea ? areasIn(items).map((a) => ({ slug: a.slug, label: a.name })) : [];
  const hasFilters = types.length > 1 || areaOpts.length > 1;

  return (
    <div className={`gap-8 ${hasFilters || aside ? "lg:grid lg:grid-cols-[14rem_minmax(0,1fr)]" : ""}`}>
      {(hasFilters || aside) && (
        <aside className="mb-5 space-y-5 lg:sticky lg:top-4 lg:mb-0 lg:self-start" aria-label={t("filterBy")}>
          <FilterGroup label={t("filterType")} options={types} value={cat} onChange={setCat} />
          <FilterGroup label={t("filterArea")} options={areaOpts} value={area} onChange={setArea} />
          {aside}
        </aside>
      )}
      <div className="min-w-0">
        <div className="mb-3 flex items-center justify-between gap-3">
          <p className="text-sm text-muted-foreground" aria-live="polite">{t("showing")} {shown.length} {t("ofTotal")} {items.length} {t("places")}</p>
          <div className="flex rounded-md border border-input bg-card p-0.5" role="group" aria-label={t("viewToggle")}>
            {(["list", "map"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} onClick={() => setView(v)}
                className={`min-h-11 rounded px-4 text-sm font-medium ${view === v ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
                {t(v === "list" ? "viewList" : "viewMap")}
              </button>
            ))}
          </div>
        </div>
        {view === "list" ? <CardList items={shown} /> : <MapView items={shown} />}
      </div>
    </div>
  );
}
