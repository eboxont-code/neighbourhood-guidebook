import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { hasPin, type Business } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

// Leaflet touches window, so its module loads only in the browser, after hydration.
const ListingMap = lazy(() => import("./listing-map"));

export function MapView({ items, className = "h-[60vh] lg:h-[70vh]", zoom, note = true }: { items: Business[]; className?: string; zoom?: number; note?: boolean }) {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => setMounted(true), []);
  const labels = useMemo(() => ({ open: t("mapOpen"), attribution: t("mapAttribution"), lang }), [lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const pins = items.filter(hasPin);
  if (!pins.length) return <p className="rounded-lg border border-border bg-card p-4 text-muted-foreground">{t("mapNoPins")}</p>;
  return (
    <div>
      <div role="region" aria-label={t("mapLabel")} className={`map-frame ${className}`}>
        {mounted && <Suspense fallback={null}><ListingMap items={pins} labels={labels} onReady={() => setLoaded(true)} {...(zoom ? { zoom } : {})} /></Suspense>}
        {!loaded && (
          <div className="map-loading" aria-live="polite">
            <span className="map-loading-dot" aria-hidden />
            <span>{t("mapLoading")}</span>
          </div>
        )}
      </div>
      {note && <p className="mt-2 text-sm text-muted-foreground">{(pins.length === items.length ? t("mapCountAll") : t("mapCount")).replace("{n}", String(pins.length)).replace("{m}", String(items.length))}</p>}
    </div>
  );
}
