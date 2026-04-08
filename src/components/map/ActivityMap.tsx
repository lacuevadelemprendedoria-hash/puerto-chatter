import { useEffect, useRef, useState } from "react";
import { X, MapPin } from "lucide-react";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { Language } from "@/lib/i18n";
import {
  MAP_POINTS,
  CATEGORY_COLORS,
  CATEGORY_LABELS,
  Category,
} from "@/lib/mapPoints";

// Leaflet is loaded dynamically to avoid SSR/bundle issues
let L: typeof import("leaflet") | null = null;

function getLabel(key: string, lang: Language) {
  const labels: Record<string, { en: string; es: string; [k: string]: string }> = {
    title:    { en: "Explore the Area", es: "Explorar la zona" },
    all:      { en: "All",              es: "Todo"             },
    askAbout: { en: "Ask about this",   es: "Pregúntame esto"  },
    walk:     { en: "min walk",         es: "min caminando"    },
    close:    { en: "Close",            es: "Cerrar"           },
  };
  const l = lang === "es" ? "es" : "en";
  return labels[key]?.[l] ?? labels[key]?.["en"] ?? key;
}

const ALL_CATEGORIES: Category[] = [
  "hostel", "beach", "culture", "food", "nature", "activity",
];

function createEmojiMarker(emoji: string, color: string, isHostel = false) {
  const size = isHostel ? 40 : 34;
  const fontSize = isHostel ? 20 : 17;
  return L!.divIcon({
    html: `<div style="
      background:${color};
      border:2.5px solid white;
      border-radius:50%;
      width:${size}px;height:${size}px;
      display:flex;align-items:center;justify-content:center;
      font-size:${fontSize}px;
      box-shadow:0 2px 8px rgba(0,0,0,0.35);
      cursor:pointer;
    ">${emoji}</div>`,
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
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
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<import("leaflet").Map | null>(null);
  const markersRef = useRef<import("leaflet").Marker[]>([]);
  const [activeCategories, setActiveCategories] = useState<Set<Category>>(
    new Set(ALL_CATEGORIES)
  );
  const [leafletReady, setLeafletReady] = useState(false);

  // Dynamically load Leaflet + CSS once
  useEffect(() => {
    if (L) { setLeafletReady(true); return; }
    import("leaflet").then((mod) => {
      L = mod.default ?? (mod as unknown as typeof import("leaflet"));
      // Inject Leaflet CSS if not already present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }
      setLeafletReady(true);
    });
  }, []);

  // Init / destroy map when sheet opens/closes
  useEffect(() => {
    if (!open || !leafletReady || !mapRef.current) return;

    // Tiny delay so the sheet animation finishes before Leaflet measures the container
    const timer = setTimeout(() => {
      if (!mapRef.current || mapInstanceRef.current) return;

      const map = L!.map(mapRef.current, {
        center: [28.413, -16.549],
        zoom: 14,
        zoomControl: true,
        attributionControl: false,
      });

      L!.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
      rebuildMarkers(map, activeCategories);
    }, 300);

    return () => clearTimeout(timer);
  }, [open, leafletReady]); // eslint-disable-line react-hooks/exhaustive-deps

  // Update markers when filter changes
  useEffect(() => {
    if (!mapInstanceRef.current) return;
    rebuildMarkers(mapInstanceRef.current, activeCategories);
  }, [activeCategories]); // eslint-disable-line react-hooks/exhaustive-deps

  // Destroy map on close
  useEffect(() => {
    if (!open && mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
      markersRef.current = [];
    }
  }, [open]);

  function rebuildMarkers(
    map: import("leaflet").Map,
    categories: Set<Category>
  ) {
    // Clear old markers
    markersRef.current.forEach((m) => m.remove());
    markersRef.current = [];

    MAP_POINTS.filter((p) => categories.has(p.category)).forEach((point) => {
      const name = language === "es" ? point.name_es : point.name_en;
      const desc = language === "es" ? point.desc_es : point.desc_en;
      const isHostel = point.category === "hostel";
      const icon = createEmojiMarker(
        point.emoji,
        CATEGORY_COLORS[point.category],
        isHostel
      );

      const askLabel = getLabel("askAbout", language);
      const queryText =
        language === "es"
          ? `Cuéntame sobre "${name}"`
          : `Tell me about "${name}"`;

      const popupHtml = `
        <div style="font-family:sans-serif;min-width:200px;max-width:240px">
          <p style="font-weight:700;font-size:14px;margin:0 0 4px">${point.emoji} ${name}</p>
          <p style="font-size:12px;color:#555;margin:0 0 10px;line-height:1.4">${desc}</p>
          ${
            !isHostel
              ? `<button id="ask-${point.id}"
                  style="
                    width:100%;background:linear-gradient(to right,#53CED1,#0D6F82);
                    color:white;border:none;border-radius:10px;
                    padding:8px 12px;font-size:12px;font-weight:600;
                    cursor:pointer;
                  ">${askLabel}</button>`
              : ""
          }
        </div>`;

      const marker = L!.marker([point.lat, point.lng], { icon })
        .addTo(map)
        .bindPopup(popupHtml, { closeButton: false, maxWidth: 260 });

      marker.on("popupopen", () => {
        const btn = document.getElementById(`ask-${point.id}`);
        if (btn) {
          btn.addEventListener("click", () => {
            onOpenChat(queryText);
            onClose();
          });
        }
      });

      markersRef.current.push(marker);
    });
  }

  function toggleCategory(cat: Category) {
    setActiveCategories((prev) => {
      const next = new Set(prev);
      if (cat === "hostel") return next; // hostel always visible
      if (next.has(cat)) {
        if (next.size <= 2) return next; // keep at least hostel + 1
        next.delete(cat);
      } else {
        next.add(cat);
      }
      return next;
    });
  }

  return (
    <Sheet open={open} onOpenChange={(v) => !v && onClose()}>
      <SheetContent
        side="bottom"
        className="p-0 rounded-t-2xl overflow-hidden"
        style={{ height: "88vh" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3 border-b border-border bg-card z-10">
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
        <div className="flex gap-2 px-4 py-3 overflow-x-auto scrollbar-hide bg-card border-b border-border">
          {ALL_CATEGORIES.map((cat) => {
            const isActive = activeCategories.has(cat);
            const label =
              language === "es"
                ? CATEGORY_LABELS[cat].es
                : CATEGORY_LABELS[cat].en;
            return (
              <button
                key={cat}
                onClick={() => toggleCategory(cat)}
                className="shrink-0 flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border transition-all active:scale-95 font-body"
                style={{
                  background: isActive ? CATEGORY_COLORS[cat] : "transparent",
                  color: isActive ? "#fff" : CATEGORY_COLORS[cat],
                  borderColor: CATEGORY_COLORS[cat],
                  opacity: cat === "hostel" ? 1 : undefined,
                }}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* Map */}
        <div ref={mapRef} className="w-full" style={{ height: "calc(88vh - 112px)" }} />

        {!leafletReady && (
          <div
            className="absolute inset-0 flex items-center justify-center bg-muted"
            style={{ top: 112 }}
          >
            <div className="w-8 h-8 rounded-full border-4 border-[#53CED1] border-t-transparent animate-spin" />
          </div>
        )}
      </SheetContent>
    </Sheet>
  );
}
