import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useRef, useState } from "react";
import { X, MapPin } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { Language } from "@/lib/i18n";
import {
  MAP_POINTS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  Category,
} from "@/lib/mapPoints";

const ALL_CATEGORIES: Category[] = [
  "hostel", "beach", "culture", "food", "nature", "activity",
];

// Height breakdown: vaul drag handle (~32px) + header (56px) + filters (56px) = ~144px
const MAP_HEIGHT = "calc(88vh - 144px)";

function getLabel(key: string, lang: Language): string {
  const labels: Record<string, { en: string; es: string }> = {
    title:    { en: "Explore the Area",  es: "Explorar la zona"  },
    askAbout: { en: "Ask about this",    es: "Pregúntame esto"   },
    close:    { en: "Close",             es: "Cerrar"            },
  };
  return labels[key]?.[lang === "es" ? "es" : "en"] ?? key;
}

function createEmojiMarker(emoji: string, color: string, large = false) {
  const size = large ? 40 : 34;
  const fs   = large ? 20 : 17;
  return L.divIcon({
    html: `<div style="
      background:${color};border:2.5px solid white;border-radius:50%;
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      font-size:${fs}px;box-shadow:0 2px 8px rgba(0,0,0,.35);cursor:pointer;
    ">${emoji}</div>`,
    className: "",
    iconSize:    [size, size],
    iconAnchor:  [size / 2, size / 2],
    popupAnchor: [0, -(size / 2 + 4)],
  });
}

interface ActivityMapProps {
  open: boolean;
  onClose: () => void;
  language: Language;
  onOpenChat: (query?: string) => void;
}

export function ActivityMap({ open, onClose, language, onOpenChat }: ActivityMapProps) {
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstance    = useRef<L.Map | null>(null);
  const markersRef     = useRef<L.Marker[]>([]);
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES)
  );

  // Init map after sheet opens (wait for animation to finish)
  useEffect(() => {
    if (!open) return;
    const timer = setTimeout(() => {
      if (!mapRef.current || mapInstance.current) return;
      const map = L.map(mapRef.current, {
        center: [28.4138, -16.5497],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);
      mapInstance.current = map;
      buildMarkers(map, activeCategories);
    }, 350);
    return () => clearTimeout(timer);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  // Rebuild markers when filter changes
  useEffect(() => {
    if (mapInstance.current) buildMarkers(mapInstance.current, activeCategories);
  }, [activeCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Destroy map when sheet closes
  useEffect(() => {
    if (!open && mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
      markersRef.current  = [];
    }
  }, [open]);

  function buildMarkers(map: L.Map, categories: Set<Category>) {
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    MAP_POINTS.filter((p) => categories.has(p.category)).forEach((point) => {
      const name      = language === "es" ? point.name_es : point.name_en;
      const desc      = language === "es" ? point.desc_es : point.desc_en;
      const isHostel  = point.category === "hostel";
      const icon      = createEmojiMarker(point.emoji, CATEGORY_COLORS[point.category], isHostel);
      const askLabel  = getLabel("askAbout", language);
      const query     = language === "es" ? `Cuéntame sobre "${name}"` : `Tell me about "${name}"`;

      const popup = `
        <div style="font-family:sans-serif;min-width:190px;max-width:240px">
          <p style="font-weight:700;font-size:14px;margin:0 0 4px">${point.emoji} ${name}</p>
          <p style="font-size:12px;color:#555;margin:0 0 10px;line-height:1.4">${desc}</p>
          ${!isHostel ? `
            <button id="map-ask-${point.id}" style="
              width:100%;background:linear-gradient(to right,#53CED1,#0D6F82);
              color:white;border:none;border-radius:10px;padding:8px 12px;
              font-size:12px;font-weight:600;cursor:pointer;
            ">${askLabel}</button>` : ""}
        </div>`;

      const marker = L.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(popup, { closeButton: false, maxWidth: 260 });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`map-ask-${point.id}`);
        btn?.addEventListener("click", () => { onOpenChat(query); onClose(); });
      });

      markersRef.current.push(marker);
    });
  }

  function toggleCategory(cat: Category) {
    if (cat === "hostel") return; // always visible
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (next.has(cat)) {
        if (next.size <= 2) return prev; // keep at least hostel + 1
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  return (
    <Drawer open={open} onOpenChange={(v) => !v && onClose()}>
      <DrawerContent className="h-[88vh] flex flex-col p-0">
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border shrink-0">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-[#0D6F82]" />
            <span className="font-bold text-base font-heading text-foreground">
              {getLabel("title", language)}
            </span>
          </div>
          <button
            onClick={onClose}
            className="rounded-full p-1.5 hover:bg-muted transition-colors"
            aria-label={getLabel("close", language)}
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Category filter chips */}
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide border-b border-border shrink-0">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategories.has(cat);
            const label    = CATEGORY_LABELS[cat][language === "es" ? "es" : "en"];
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="shrink-0 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all active:scale-95 font-body"
                style={{
                  background:  isActive ? CATEGORY_COLORS[cat] : "transparent",
                  color:       isActive ? "#fff" : CATEGORY_COLORS[cat],
                  borderColor: CATEGORY_COLORS[cat],
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Map — data-vaul-no-drag prevents vaul from intercepting Leaflet pan gestures */}
        <div
          ref={mapRef}
          data-vaul-no-drag
          className="w-full"
          style={{ height: MAP_HEIGHT }}
        />
      </DrawerContent>
    </Drawer>
  );
}
