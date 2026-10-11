// Browser-only: imports Leaflet. Load through MapView, never import directly from a route.
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { getCategory, hasPin, type Business } from "@/data/directory";

export interface MapLabels { open: string; attribution: string; lang: "en" | "ne" }

export default function ListingMap({ items, labels, zoom }: { items: Business[]; labels: MapLabels; zoom?: number }) {
  const el = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!el.current) return;
    const pins = items.filter(hasPin);
    const map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true });
    L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: `${labels.attribution} &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors`,
    }).addTo(map);
    const icon = L.divIcon({ className: "map-pin", html: "<span></span>", iconSize: [22, 22], iconAnchor: [11, 11], popupAnchor: [0, -10] });
    for (const b of pins) {
      const cat = getCategory(b.category);
      const box = document.createElement("div");
      const name = document.createElement("p");
      name.className = "map-pop-name"; name.textContent = b.name;
      const meta = document.createElement("p");
      meta.className = "map-pop-meta"; meta.textContent = (labels.lang === "ne" ? cat?.nameNe : cat?.name) ?? "";
      const a = document.createElement("a");
      a.href = `/s/${b.slug}`; a.textContent = labels.open; a.className = "map-pop-link";
      box.append(name, meta, a);
      L.marker([b.lat!, b.lng!], { icon, title: b.name, alt: b.name }).addTo(map).bindPopup(box);
    }
    if (pins.length === 1) map.setView([pins[0]!.lat!, pins[0]!.lng!], zoom ?? 16);
    else if (pins.length) map.fitBounds(L.latLngBounds(pins.map((b) => [b.lat!, b.lng!] as [number, number])), { padding: [32, 32], maxZoom: 16 });
    else map.setView([27.7172, 85.324], 13);
    return () => { map.remove(); };
  }, [items, labels, zoom]);
  return <div ref={el} className="h-full w-full" />;
}
