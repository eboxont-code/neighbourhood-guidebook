import { useEffect, useRef, useState } from "react";
import { Leaf, Scissors, Stethoscope, Store } from "lucide-react";
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

const ICONS: Record<string, (p: { className?: string }) => React.ReactElement> = {
  salons: (p) => <Scissors {...p} aria-hidden />,
  barbers: (p) => <RazorIcon {...p} />,
  spas: (p) => <Leaf {...p} aria-hidden />,
  clinics: (p) => <Stethoscope {...p} aria-hidden />,
};

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
    const Icon = ICONS[category] ?? ((p) => <Store {...p} aria-hidden />);
    return (
      <div className={`venue-placeholder cat-${category}`} aria-hidden>
        <div className="mx-auto flex h-full max-w-2xl items-center justify-between px-6">
          <span className="font-serif text-7xl leading-none font-semibold">{name.charAt(0)}</span>
          <Icon className="h-10 w-10 opacity-70" />
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
