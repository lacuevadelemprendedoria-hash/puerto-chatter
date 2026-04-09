import { ExternalLink } from "lucide-react";
import { Language } from "@/lib/i18n";

interface MapLocation {
  id: string;
  emoji: string;
  en: string;
  es: string;
  distanceEn: string;
  distanceEs: string;
  lat: number;
  lng: number;
  isHostel?: boolean;
}

// Verified coordinates for Puerto de la Cruz, Tenerife
const LOCATIONS: MapLocation[] = [
  {
    id: "hostel",
    emoji: "🏠",
    en: "Puerto Nest Hostel",
    es: "Puerto Nest Hostel",
    distanceEn: "You are here",
    distanceEs: "Estás aquí",
    lat: 28.4168,
    lng: -16.5558,
    isHostel: true,
  },
  {
    id: "playa_jardin",
    emoji: "🏖️",
    en: "Playa Jardín",
    es: "Playa Jardín",
    distanceEn: "5 min walk",
    distanceEs: "5 min a pie",
    lat: 28.4161,
    lng: -16.5509,
  },
  {
    id: "piscinas",
    emoji: "💦",
    en: "Piscinas Martiánez",
    es: "Piscinas Martiánez",
    distanceEn: "10 min walk",
    distanceEs: "10 min a pie",
    lat: 28.4140,
    lng: -16.5452,
  },
  {
    id: "loro_parque",
    emoji: "🦜",
    en: "Loro Parque",
    es: "Loro Parque",
    distanceEn: "25 min walk",
    distanceEs: "25 min a pie",
    lat: 28.4084,
    lng: -16.5642,
  },
  {
    id: "plaza_charco",
    emoji: "⛵",
    en: "Plaza del Charco",
    es: "Plaza del Charco",
    distanceEn: "10 min walk",
    distanceEs: "10 min a pie",
    lat: 28.4127,
    lng: -16.5474,
  },
  {
    id: "jardin_botanico",
    emoji: "🌿",
    en: "Jardín Botánico",
    es: "Jardín Botánico",
    distanceEn: "15 min bus",
    distanceEs: "15 min en bus",
    lat: 28.4030,
    lng: -16.5376,
  },
];

// OSM iframe centred on Puerto de la Cruz, marker on hostel
const MAP_EMBED_URL =
  "https://www.openstreetmap.org/export/embed.html" +
  "?bbox=-16.5780%2C28.3950%2C-16.5200%2C28.4280" +
  "&layer=mapnik" +
  "&marker=28.4168%2C-16.5558";

interface NeighborhoodMapProps {
  language: Language;
}

export function NeighborhoodMap({ language }: NeighborhoodMapProps) {
  const isEs = language === "es";

  const openInMaps = (loc: MapLocation) => {
    window.open(
      `https://www.google.com/maps?q=${loc.lat},${loc.lng}`,
      "_blank",
      "noopener,noreferrer"
    );
  };

  return (
    <div className="px-4 mb-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">
          {isEs ? "Mapa del Barrio" : "Neighbourhood Map"}
        </h2>
        <a
          href="https://www.openstreetmap.org/#map=15/28.4168/-16.5558"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-1 text-xs font-semibold text-primary"
        >
          {isEs ? "Ver mapa" : "Open map"}
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Embedded map */}
      <div className="rounded-2xl overflow-hidden border border-border mb-3 h-44">
        <iframe
          src={MAP_EMBED_URL}
          className="w-full h-full"
          title={isEs ? "Mapa de Puerto de la Cruz" : "Puerto de la Cruz map"}
          loading="lazy"
        />
      </div>

      {/* Scrollable location chips */}
      <div className="flex gap-2.5 overflow-x-auto scrollbar-hide pb-1">
        {LOCATIONS.map((loc) => (
          <button
            key={loc.id}
            onClick={() => openInMaps(loc)}
            className="flex-none flex flex-col items-center gap-1.5 bg-card border border-border rounded-2xl p-3 w-[86px] active:scale-95 transition-all hover:border-primary/40 hover:shadow-sm text-center"
          >
            <div
              className={`w-10 h-10 rounded-full flex items-center justify-center ${
                loc.isHostel
                  ? "bg-primary/15 ring-2 ring-primary/30"
                  : "bg-muted"
              }`}
            >
              <span className="text-xl">{loc.emoji}</span>
            </div>
            <p className="text-[11px] font-semibold text-foreground leading-tight line-clamp-2">
              {isEs ? loc.es : loc.en}
            </p>
            <p className="text-[10px] text-muted-foreground leading-tight">
              {isEs ? loc.distanceEs : loc.distanceEn}
            </p>
          </button>
        ))}
      </div>
    </div>
  );
}
