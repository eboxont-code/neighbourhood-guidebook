import { track } from "@/lib/track";
import { VerificationBadge } from "@/components/verification-badge";
import { Link } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { Heart, LocateFixed, MapPinOff } from "lucide-react";
import { CatIcon } from "@/components/cover";
import { EmptyState, useNow } from "@/components/site";
import { getArea, getCategory, placeName, citiesInUse, type Business } from "@/data/directory";
import { badgesFor, statusBadge, type Badge } from "@/lib/venue";

/** At most one status chip, then the New badge if there is room. */
function cardBadges(b: Business, now: Date | null): Badge[] {
  const st = statusBadge(b, now);
  return [...(st ? [st] : []), ...badgesFor(b, now, false).filter((x) => x === "newOnSewa")].slice(0, 2);
}
import { dismissLocation, distanceTo, formatDistance, requestLocation, useLocation } from "@/lib/geo";
import { useFavourites } from "@/lib/favourites";
import { useI18n, type Key } from "@/lib/i18n";

const BADGE_KEY: Record<Badge, Key> = { open: "openNow", closesSoon: "closesSoon", open24: "open24", openSunday: "openSunday", trustWeb: "badgeTrustWeb", trustSocial: "badgeTrustSocial", newOnSewa: "badgeNew" };

export function Badges({ list }: { list: Badge[] }) {
  const { t } = useI18n();
  if (!list.length) return null;
  return (
    <div className="pointer-events-none absolute top-2.5 left-2.5 flex max-w-[calc(100%-4rem)] flex-wrap gap-1.5">
      {list.map((b) => (
        <span key={b} className="venue-badge">{(b === "open" || b === "open24") && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-success" />}{b === "closesSoon" && <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-warning" />}{t(BADGE_KEY[b])}</span>
      ))}
    </div>
  );
}

export function HeartButton({ slug, name, className = "" }: { slug: string; name: string; className?: string }) {
  const { t } = useI18n();
  const fav = useFavourites();
  const on = fav.has(slug);
  return (
    <button type="button" aria-pressed={on} aria-label={`${on ? t("unsave") : t("save")}: ${name}`} onClick={(e) => { e.preventDefault(); if (!on) track("save", { slug }); fav.toggle(slug); }}
      className={`round-btn z-10 ${className || "relative"}`}>
      <Heart aria-hidden className={`h-[18px] w-[18px] transition-transform ${on ? "scale-110 fill-current text-primary" : ""}`} strokeWidth={1.9} />
    </button>
  );
}

export function Thumb({ b, className = "" }: { b: Business; className?: string }) {
  const [failed, setFailed] = useState(false);
  return (
    <div className={`venue-thumb cat-${b.category} ${className}`}>
      {b.cover && !failed ? <img src={b.cover.url} alt="" loading="lazy" onError={() => setFailed(true)} className="h-full w-full object-cover" />
        : (
          <span aria-hidden className="venue-mono">{b.name.charAt(0)}<span className="venue-mono-icon"><CatIcon category={b.category} className="h-3 w-3" /></span></span>
        )}
    </div>
  );
}

/** Image-first card: own photo or monogram, at most two real badges, a heart that saves on this device. */
export function VenueCard({ b, wide = false }: { b: Business; wide?: boolean }) {
  const { lang } = useI18n();
  const now = useNow();
  const { here } = useLocation();
  const d = distanceTo(b, here);
  const cat = getCategory(b.category);
  return (
    <li className={`venue-card ${wide ? "" : "w-[16.5rem] shrink-0 snap-start"}`}>
      <div className="relative">
        <Thumb b={b} className="aspect-[16/10]" />
        <Badges list={cardBadges(b, now)} />
        <span className="absolute top-1.5 right-1.5 z-10"><HeartButton slug={b.slug} name={b.name} /></span>
      </div>
      <div className="px-1 pt-2.5 pb-1">
        <Link to="/s/$slug" params={{ slug: b.slug }} className="stretched line-clamp-2 text-[15px] leading-snug font-semibold">{b.name}</Link>
        <p className="mt-0.5 text-[13px] text-muted-foreground">{placeName(getArea(b.area), lang)}{d !== null && <> · <span className="whitespace-nowrap">{formatDistance(d, lang)}</span></>}</p>
        <p className="text-[13px] text-muted-foreground">{lang === "ne" ? cat?.nameNe : cat?.name}</p>
        <VerificationBadge b={b} />
      </div>
    </li>
  );
}

export function VenueRow({ items, label }: { items: Business[]; label: string }) {
  return (
    <ul aria-label={label} className="-mx-5 flex snap-x snap-mandatory scroll-px-5 gap-3.5 overflow-x-auto px-5 pt-1 pb-3 [scrollbar-width:none] lg:mx-0 lg:px-0">
      {items.map((b) => <VenueCard key={b.id} b={b} />)}
    </ul>
  );
}

export function VenueGrid({ items, extra }: { items: Business[]; extra?: (b: Business) => ReactNode }) {
  return (
    <ul className="grid gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((b) => <div key={b.id} className="contents">{extra ? extra(b) : <VenueCard b={b} wide />}</div>)}
    </ul>
  );
}

/** Friendly pre-permission card; the browser prompt appears only after "Use my location". */
export function LocationCard() {
  const { t } = useI18n();
  const { state, dismissed } = useLocation();
  if (state.status === "outside") {
    const city = citiesInUse()[0]!;
    return (
      <EmptyState icon={MapPinOff} title={t("outsideTitle")} body={t("outsideBody")}
        action={<Link to="/$city" params={{ city: city.slug }} className="action-btn action-primary">{t("outsideCta")}</Link>} />
    );
  }
  if (dismissed || state.status === "nepal" || state.status === "denied") return null;
  return (
    <div className="flex flex-col gap-3 rounded-2xl bg-card p-4 shadow-[var(--shadow-card)] sm:flex-row sm:items-center sm:gap-4 sm:p-5">
      <div className="flex min-w-0 flex-1 items-start gap-3">
        <span aria-hidden className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-primary"><LocateFixed className="h-5 w-5" /></span>
        <div className="min-w-0">
          <p className="font-semibold">{t("locTitle")}</p>
          <p className="text-sm leading-snug text-muted-foreground">{t("locBody")}</p>
        </div>
      </div>
      <div className="flex shrink-0 gap-2">
        <button type="button" onClick={requestLocation} disabled={state.status === "asking"} className="action-btn action-primary flex-1 text-sm sm:flex-none">{state.status === "asking" ? t("locAsking") : t("locUse")}</button>
        <button type="button" onClick={dismissLocation} className="action-btn action-secondary flex-1 text-sm sm:flex-none">{t("locNotNow")}</button>
      </div>
    </div>
  );
}
