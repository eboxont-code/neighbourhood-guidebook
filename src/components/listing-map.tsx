// Browser-only: imports Leaflet. Load through MapView, never import directly from a route.
import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet/dist/leaflet.css";
import "leaflet.markercluster/dist/MarkerCluster.css";
import { getArea, getCategory, hasPin, placeName, type Business } from "@/data/directory";

export interface MapLabels { open: string; attribution: string; lang: "en" | "ne" }

export default function ListingMap({ items, labels, zoom, onReady }: { items: Business[]; labels: MapLabels; zoom?: number; onReady?: () => void }) {
  const el = useRef<HTMLDivElement>(null);
  const ready = useRef(onReady);
  ready.current = onReady;
  useEffect(() => {
    if (!el.current) return;
    const pins = items.filter(hasPin);
    const map = L.map(el.current, { scrollWheelZoom: false, attributionControl: true, tapTolerance: 20 });
    const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
      maxZoom: 19,
      attribution: `${labels.attribution} &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noopener">OpenStreetMap</a> contributors`,
    });
    tiles.once("load", () => ready.current?.());
    tiles.addTo(map);
    // 44px invisible hit area around a visible 24px dot.
    const icon = L.divIcon({ className: "map-pin", html: "<span></span>", iconSize: [44, 44], iconAnchor: [22, 22], popupAnchor: [0, -14] });
    const group = L.markerClusterGroup({
      showCoverageOnHover: false,
      spiderfyOnMaxZoom: true,
      maxClusterRadius: 36,
      spiderfyDistanceMultiplier: 1.8,
      iconCreateFunction: (c) => L.divIcon({ className: "map-cluster", html: `<span>${c.getChildCount()}</span>`, iconSize: [48, 48] }),
    });
    for (const b of pins) {
      const cat = getCategory(b.category);
      const box = document.createElement("div");
      const name = document.createElement("p");
      name.className = "map-pop-name"; name.textContent = b.name;
      const meta = document.createElement("p");
      meta.className = "map-pop-meta";
      meta.textContent = [labels.lang === "ne" ? cat?.nameNe : cat?.name, placeName(getArea(b.area), labels.lang)].filter(Boolean).join(" · ");
      const a = document.createElement("a");
      a.href = `/s/${b.slug}`; a.textContent = labels.open; a.className = "map-pop-link";
      box.append(name, meta, a);
      group.addLayer(L.marker([b.lat!, b.lng!], { icon, title: b.name, alt: b.name, keyboard: true }).bindPopup(box));
    }
    map.addLayer(group);
    if (pins.length === 1) map.setView([pins[0]!.lat!, pins[0]!.lng!], zoom ?? 16);
    else if (pins.length) map.fitBounds(L.latLngBounds(pins.map((b) => [b.lat!, b.lng!] as [number, number])), { padding: [36, 36], maxZoom: 16 });
    else map.setView([27.7172, 85.324], 13);
    return () => { map.remove(); };
  }, [items, labels, zoom]);
  return <div ref={el} className="h-full w-full" />;
}
