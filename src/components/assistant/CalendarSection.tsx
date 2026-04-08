import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

// ── Types ─────────────────────────────────────────────────────────────────────

interface FeedItem {
  id: string;
  emoji: string;
  title_en: string;
  title_es: string;
  description_en: string;
  description_es: string;
  cta_label_en?: string;
  cta_label_es?: string;
  cta_action?: string;
  month: number | null;
}

interface CalendarEvent {
  heading: string;
  details: string[];
  dayStart: number | null;
  dayEnd: number | null;
  dateLabel: string;
}

type EventStatus = "past" | "current" | "upcoming" | "unknown";

// ── Date parser ───────────────────────────────────────────────────────────────

const ES_MONTHS = [
  "enero","febrero","marzo","abril","mayo","junio",
  "julio","agosto","septiembre","octubre","noviembre","diciembre",
];
const EN_MONTHS = [
  "january","february","march","april","may","june",
  "july","august","september","october","november","december",
];
const MONTHS_RE = [...ES_MONTHS, ...EN_MONTHS].join("|");

function parseDateFromHeading(heading: string): Pick<CalendarEvent, "dayStart" | "dayEnd" | "dateLabel"> {
  const h = heading.toLowerCase();

  const rangeWithMonth = new RegExp(
    `(\\d{1,2})\\s*[–\\-]\\s*(\\d{1,2})\\s+(?:de\\s+)?(${MONTHS_RE})|` +
    `(${MONTHS_RE})\\s+(\\d{1,2})\\s*[–\\-]\\s*(\\d{1,2})`,
    "i"
  );
  const singleWithMonth = new RegExp(
    `(\\d{1,2})\\s+(?:de\\s+)?(${MONTHS_RE})|(${MONTHS_RE})\\s+(\\d{1,2})`,
    "i"
  );
  const dotRange  = /·\s*(\d{1,2})\s*[–\-]\s*(\d{1,2})/;
  const dotSingle = /·\s*(\d{1,2})(?!\s*[–\-\d])/;

  let m: RegExpMatchArray | null;

  m = h.match(rangeWithMonth);
  if (m) {
    return { dayStart: parseInt(m[1] ?? m[5]), dayEnd: parseInt(m[2] ?? m[6]), dateLabel: extractRawDate(heading) };
  }
  m = h.match(singleWithMonth);
  if (m) {
    return { dayStart: parseInt(m[1] ?? m[4]), dayEnd: null, dateLabel: extractRawDate(heading) };
  }
  m = heading.match(dotRange);
  if (m) {
    return { dayStart: parseInt(m[1]), dayEnd: parseInt(m[2]), dateLabel: `${m[1]}–${m[2]}` };
  }
  m = heading.match(dotSingle);
  if (m) {
    return { dayStart: parseInt(m[1]), dayEnd: null, dateLabel: m[1] };
  }
  return { dayStart: null, dayEnd: null, dateLabel: "" };
}

function extractRawDate(heading: string): string {
  const m = heading.match(
    new RegExp(
      `(\\d{1,2}\\s*[–\\-]\\s*\\d{1,2}\\s+(?:de\\s+)?(?:${MONTHS_RE})|` +
      `\\d{1,2}\\s+(?:de\\s+)?(?:${MONTHS_RE})|` +
      `(?:${MONTHS_RE})\\s+\\d{1,2}(?:\\s*[–\\-]\\s*\\d{1,2})?)`,
      "i"
    )
  );
  return m ? m[0].trim() : "";
}

function parseBlocks(description: string): CalendarEvent[] {
  return description
    .split(/\n{2,}/)
    .map((block) => {
      const lines   = block.split("\n").filter(Boolean);
      const heading = lines[0] ?? "";
      const details = lines.slice(1);
      return { heading, details, ...parseDateFromHeading(heading) };
    })
    .filter((e) => e.heading.trim().length > 0);
}

function getStatus(event: CalendarEvent, month: number | null): EventStatus {
  if (event.dayStart === null || month === null) return "unknown";
  const today = new Date();
  if (today.getMonth() + 1 !== month) return "upcoming";
  const day    = today.getDate();
  const endDay = event.dayEnd ?? event.dayStart;
  if (endDay < day)               return "past";
  if (event.dayStart <= day)      return "current";
  return "upcoming";
}

const STATUS_BAR: Record<EventStatus, string> = {
  past:     "#CBD5E1",
  current:  "#53CED1",
  upcoming: "#3B82F6",
  unknown:  "#3B82F6",
};
const STATUS_CHIP: Record<EventStatus, { bg: string; text: string }> = {
  past:     { bg: "#F1F5F9", text: "#94A3B8" },
  current:  { bg: "#EFF9FA", text: "#0D6F82" },
  upcoming: { bg: "#EFF6FF", text: "#1D4ED8" },
  unknown:  { bg: "#EFF6FF", text: "#1D4ED8" },
};

// ── Component ─────────────────────────────────────────────────────────────────

interface CalendarSectionProps {
  item: FeedItem;
  language: Language;
  onOpenChat: (query?: string) => void;
}

export function CalendarSection({ item, language, onOpenChat }: CalendarSectionProps) {
  const [isOpen, setIsOpen] = useState(false);

  const description = language === "es" ? item.description_es : item.description_en;
  const title       = language === "es" ? item.title_es       : item.title_en;
  const ctaLabel    = language === "es" ? item.cta_label_es   : item.cta_label_en;
  const events      = parseBlocks(description);

  const sectionTitle = language === "es" ? "📅 Este mes en Tenerife" : "📅 This month in Tenerife";
  const badgeLabel   = language === "es" ? "Este mes"                : "This month";
  const askLabel     = language === "es" ? "Pregúntame sobre este mes" : "Ask me about this month";
  const nowBadge     = language === "es" ? "Ahora"                   : "Now";

  // First non-past event heading as preview
  const today = new Date();
  const previewEvent = events.find((e) => getStatus(e, item.month) !== "past");
  const previewText  = previewEvent
    ? previewEvent.heading
    : (language === "es" ? "Ver todos los eventos" : "See all events");

  const askQuery = language === "es"
    ? `¿Qué eventos hay este mes en Tenerife?`
    : `What events are happening in Tenerife this month?`;

  return (
    <div className="mt-6">
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">{sectionTitle}</h2>
        <span className="text-xs font-bold px-2.5 py-1 rounded-full font-heading text-white"
          style={{ background: "#2563EB" }}>
          {badgeLabel}
        </span>
      </div>

      {/* Single accordion card */}
      <div
        className={cn(
          "border rounded-2xl overflow-hidden shadow-sm transition-all duration-200",
          isOpen ? "shadow-md" : ""
        )}
        style={{ background: "#E6F1FB", borderColor: isOpen ? "#2563EB" : undefined }}
      >
        {/* Header row */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          <span className="text-2xl">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <span className="font-bold text-foreground block truncate">{title}</span>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{previewText}</p>
          </div>
          {isOpen
            ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
            : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
          }
        </button>

        {/* Expanded: all events */}
        {isOpen && (
          <div className="border-t animate-fade-in" style={{ borderColor: "#2563EB33" }}>
            <div className="px-4 pt-3 space-y-4">
              {events.map((event, i) => {
                const status   = getStatus(event, item.month);
                const isPast   = status === "past";
                const isCurrent = status === "current";
                const chipStyle = STATUS_CHIP[status];

                return (
                  <div key={i} className="flex gap-3">
                    {/* Left color bar */}
                    <div
                      className="shrink-0 w-1 rounded-full mt-1"
                      style={{ background: STATUS_BAR[status], minHeight: 20, alignSelf: "stretch" }}
                    />

                    <div className="flex-1 min-w-0">
                      {/* Date chip + "Ahora" badge */}
                      {(event.dateLabel || isCurrent) && (
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {event.dateLabel && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full font-heading"
                              style={{ background: chipStyle.bg, color: chipStyle.text }}
                            >
                              {event.dateLabel}
                            </span>
                          )}
                          {isCurrent && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full font-heading text-white"
                              style={{ background: "#53CED1" }}>
                              {nowBadge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Heading */}
                      <p
                        className={cn("text-sm font-semibold leading-snug font-body", isPast && "line-through")}
                        style={{ color: isPast ? "#94A3B8" : "#1E293B" }}
                      >
                        {event.heading}
                      </p>

                      {/* Detail lines */}
                      {event.details.map((line, j) => (
                        <p key={j} className="text-xs mt-0.5 leading-relaxed"
                          style={{ color: isPast ? "#94A3B8" : "#555" }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Divider + CTA */}
            <div className="px-4 py-4">
              <div className="border-t mb-4" style={{ borderColor: "#2563EB33" }} />
              <button
                onClick={() => onOpenChat(ctaLabel ? undefined : askQuery)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all font-heading"
                style={{ background: "linear-gradient(to right, #2563EB, #1D4ED8)" }}
              >
                <MessageCircle className="w-4 h-4" />
                {ctaLabel || askLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
