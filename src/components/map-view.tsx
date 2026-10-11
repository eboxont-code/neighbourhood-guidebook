import { lazy, Suspense, useEffect, useMemo, useState } from "react";
import { hasPin, type Business } from "@/data/directory";
import { useI18n } from "@/lib/i18n";

// Leaflet touches window, so its module loads only in the browser, after hydration.
const ListingMap = lazy(() => import("./listing-map"));

export function MapView({ items, className = "h-[60vh] lg:h-[70vh]", zoom, note = true }: { items: Business[]; className?: string; zoom?: number; note?: boolean }) {
  const { t, lang } = useI18n();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  const labels = useMemo(() => ({ open: t("mapOpen"), attribution: t("mapAttribution"), lang }), [t, lang]);
  const pins = items.filter(hasPin);
  if (!pins.length) return <p className="rounded-lg border border-border bg-card p-4 text-muted-foreground">{t("mapNoPins")}</p>;
  return (
    <div>
      <div role="region" aria-label={t("mapLabel")} className={`map-frame ${className}`}>
        {mounted && <Suspense fallback={null}><ListingMap items={pins} labels={labels} {...(zoom ? { zoom } : {})} /></Suspense>}
      </div>
      {note && <p className="mt-2 text-xs text-muted-foreground">{t("mapPinsNote")}</p>}
    </div>
  );
}
