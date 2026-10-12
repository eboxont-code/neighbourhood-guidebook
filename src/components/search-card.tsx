import { useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Clock, MapPin, Search } from "lucide-react";
import { areasInUse, placeName } from "@/data/directory";
import { requestLocation, useLocation } from "@/lib/geo";
import { useI18n } from "@/lib/i18n";

/** Stacked pill fields: what, where, when, then one Search button. Submits to /search with URL params. */
export function SearchCard() {
  const { t, lang } = useI18n();
  const navigate = useNavigate();
  const loc = useLocation();
  const [q, setQ] = useState("");
  const [where, setWhere] = useState("");
  const [when, setWhen] = useState("");
  return (
    <form role="search" className="space-y-2 rounded-[1.25rem] bg-card p-2.5 shadow-[var(--shadow-lift)]"
      onSubmit={(e) => {
        e.preventDefault();
        navigate({ to: "/search", search: { q: q.trim(), ...(where && where !== "near" ? { area: where } : {}), ...(where === "near" ? { near: true } : {}), ...(when ? { open: true } : {}) } });
      }}>
      <label className="pill-field">
        <Search aria-hidden className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        <span className="sr-only">{t("fWhat")}</span>
        <input value={q} onChange={(e) => setQ(e.target.value)} name="q" type="search" placeholder={t("fWhatPh")} className="placeholder:text-muted-foreground" />
      </label>
      <label className="pill-field">
        <MapPin aria-hidden className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        <span className="sr-only">{t("fWhere")}</span>
        <select value={where} onChange={(e) => { setWhere(e.target.value); if (e.target.value === "near" && loc.state.status === "idle") requestLocation(); }}>
          <option value="">{t("fWhereAny")}</option>
          <option value="near">{t("fWhereNear")}</option>
          {areasInUse().map((a) => <option key={a.slug} value={a.slug}>{placeName(a, lang)}</option>)}
        </select>
      </label>
      <label className="pill-field">
        <Clock aria-hidden className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
        <span className="sr-only">{t("fWhen")}</span>
        <select value={when} onChange={(e) => setWhen(e.target.value)}>
          <option value="">{t("fWhenAny")}</option>
          <option value="open">{t("openNow")}</option>
        </select>
      </label>
      <button type="submit" className="action-btn action-dark min-h-12 w-full text-[15px]">{t("search")}</button>
    </form>
  );
}
