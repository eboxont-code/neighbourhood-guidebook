import { useEffect, useRef, useState } from "react";
import { BedDouble, Coffee, Dumbbell, Leaf, Scissors, Stethoscope, Store, UtensilsCrossed } from "lucide-react";
import { useI18n } from "@/lib/i18n";

function RazorIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d="M3 8.5 13.5 5l1.5 4.5L4.5 13z" />
      <path d="m15 9.5 2.2 1.1a2 2 0 0 1 1 1.2L21 20" />
      <path d="M7 7.6 8 10.6" />
    </svg>
  );
}

export const ICONS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  salons: (p) => <Scissors {...p} aria-hidden />,
  cafes: (p) => <Coffee {...p} aria-hidden />,
  restaurants: (p) => <UtensilsCrossed {...p} aria-hidden />,
  gyms: (p) => <Dumbbell {...p} aria-hidden />,
  hotels: (p) => <BedDouble {...p} aria-hidden />,
  barbers: (p) => <RazorIcon {...p} />,
  spas: (p) => <Leaf {...p} aria-hidden />,
  clinics: (p) => <Stethoscope {...p} aria-hidden />,
};

export function CatIcon({ category, className }: { category: string; className?: string }) {
  const Icon = ICONS[category] ?? ((p: { className?: string }) => <Store {...p} aria-hidden />);
  return <Icon {...(className ? { className } : {})} />;
}

export function Cover({ cover, name, category }: { cover?: { url: string; credit: string } | undefined; name: string; category: string }) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // An image can fail before hydration attaches onError; check once mounted.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);

  if (!cover || failed) {
    return (
      <div className={`venue-placeholder cat-${category}`} aria-hidden>
        <div className="mx-auto flex h-full max-w-2xl items-center gap-3 px-5 pb-7 lg:max-w-6xl">
          <span className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-current/15 bg-panel text-[1.75rem] leading-none font-semibold shadow-[var(--shadow-card)] md:h-[4.5rem] md:w-[4.5rem]">{name.charAt(0)}<span className="absolute -right-1.5 -bottom-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-panel bg-[var(--ph-ink)] text-panel"><CatIcon category={category} className="h-3.5 w-3.5" /></span></span>
        </div>
      </div>
    );
  }
  return (
    <figure className="relative">
      <div className="venue-cover">
        <img ref={img} src={cover.url} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" />
      </div>
      <figcaption className="cover-credit">{t("photo")}: {cover.credit}</figcaption>
    </figure>
  );
}
