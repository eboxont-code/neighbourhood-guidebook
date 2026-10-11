import { useEffect, useRef, useState } from "react";
import { useI18n } from "@/lib/i18n";

export function Cover({ cover }: { cover?: { url: string; credit: string } | undefined }) {
  const { t } = useI18n();
  const [failed, setFailed] = useState(false);
  const img = useRef<HTMLImageElement>(null);
  // An image can fail before hydration attaches onError; check once mounted.
  useEffect(() => {
    const el = img.current;
    if (el && el.complete && el.naturalWidth === 0) setFailed(true);
  }, []);
  const show = cover && !failed;
  return (
    <figure>
      <div className="venue-cover">
        {show && <img ref={img} src={cover.url} alt="" onError={() => setFailed(true)} className="h-full w-full object-cover" />}
      </div>
      {show && <figcaption className="mx-auto max-w-2xl px-4 pt-1 text-right text-xs text-muted-foreground">{t("photo")}: {cover.credit}</figcaption>}
    </figure>
  );
}
