import { useState } from "react";
import { ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { Language } from "@/lib/i18n";

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
  month: number | null;
}

interface CalendarEvent {
  heading: string;
  details: string[];
  dayStart: number | null;
  dayEnd: number | null;
  dateLabel: string;
  allMonth: boolean;
}

type EventStatus = "past" | "current" | "upcoming" | "unknown";

// ── Date parser ───────────────────────────────────────────────────────────────
// Handles the real data format: "📅 2 Apr — Title" and "📅 11–20 Apr — Title"
// Also supports full month names in EN/ES for future-proofing.

const ABBR_MONTHS_EN = "jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec";
const ABBR_MONTHS_ES = "ene|feb|mar|abr|may|jun|jul|ago|sep|oct|nov|dic";
const FULL_MONTHS_EN = "january|february|march|april|may|june|july|august|september|october|november|december";
const FULL_MONTHS_ES = "enero|febrero|marzo|abril|mayo|junio|julio|agosto|septiembre|octubre|noviembre|diciembre";
const ALL_MONTHS = [ABBR_MONTHS_EN, ABBR_MONTHS_ES, FULL_MONTHS_EN, FULL_MONTHS_ES].join("|");

// Regex: "DD–DD Mmm" or "DD Mmm" (abbreviated or full month, EN or ES)
const RANGE_RE = new RegExp(`(\\d{1,2})\\s*[–\\-]\\s*(\\d{1,2})\\s+(${ALL_MONTHS})\\b`, "i");
const SINGLE_RE = new RegExp(`(\\d{1,2})\\s+(${ALL_MONTHS})\\b`, "i");
// Dot separator fallback: "· 5–8" or "· 5"
const DOT_RANGE_RE  = /·\s*(\d{1,2})\s*[–\-]\s*(\d{1,2})/;
const DOT_SINGLE_RE = /·\s*(\d{1,2})(?!\s*[–\-\d])/;

function parseDateFromHeading(heading: string): Pick<CalendarEvent, "dayStart"|"dayEnd"|"dateLabel"|"allMonth"> {
  // "All month" / "Todo abril" / "Todo el mes"
  if (/all month|todo\s+\w*\s*mes|todo abril/i.test(heading)) {
    return { dayStart: 1, dayEnd: 31, dateLabel: "", allMonth: true };
  }

  let m: RegExpMatchArray | null;

  m = heading.match(RANGE_RE);
  if (m) {
    return {
      dayStart: parseInt(m[1]), dayEnd: parseInt(m[2]),
      dateLabel: `${m[1]}–${m[2]} ${m[3]}`, allMonth: false,
    };
  }
  m = heading.match(SINGLE_RE);
  if (m) {
    return { dayStart: parseInt(m[1]), dayEnd: null, dateLabel: `${m[1]} ${m[2]}`, allMonth: false };
  }
  m = heading.match(DOT_RANGE_RE);
  if (m) {
    return { dayStart: parseInt(m[1]), dayEnd: parseInt(m[2]), dateLabel: `${m[1]}–${m[2]}`, allMonth: false };
  }
  m = heading.match(DOT_SINGLE_RE);
  if (m) {
    return { dayStart: parseInt(m[1]), dayEnd: null, dateLabel: m[1], allMonth: false };
  }
  return { dayStart: null, dayEnd: null, dateLabel: "", allMonth: false };
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
  if (event.allMonth)             return "current";
  if (endDay < day)               return "past";
  if (event.dayStart <= day)      return "current";
  return "upcoming";
}

// ── Style tokens ──────────────────────────────────────────────────────────────

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
  const ctaLabel    = (language === "es" ? item.cta_label_es  : item.cta_label_en) || "";
  const events      = parseBlocks(description);

  const sectionTitle = language === "es" ? "📅 Este mes en Tenerife" : "📅 This month in Tenerife";

  // Preview: first upcoming/current event heading (without leading emoji)
  const nextEvent = events.find((e) => getStatus(e, item.month) !== "past");
  const previewText = nextEvent
    ? nextEvent.heading.replace(/^[\p{Emoji}\s]+/u, "").trim()
    : (language === "es" ? "Ver todos los eventos" : "See all events");

  // Always send a meaningful query to the assistant
  const askQuery = language === "es"
    ? "¿Qué eventos y actividades hay este mes en Tenerife?"
    : "What events and activities are happening in Tenerife this month?";

  const nowBadge = language === "es" ? "Ahora" : "Now";
  const askLabel = ctaLabel || (language === "es" ? "Pregúntame sobre este mes" : "Ask me about this month");

  return (
    <div className="mt-6">
      {/* Section heading — no badge, badge already in card */}
      <h2 className="text-lg font-bold text-foreground mb-3">{sectionTitle}</h2>

      {/* Single accordion card */}
      <div
        className="border rounded-2xl overflow-hidden shadow-sm transition-all duration-200"
        style={{
          background:  "#E6F1FB",
          borderColor: isOpen ? "#2563EB" : undefined,
          boxShadow:   isOpen ? "0 4px 12px rgba(37,99,235,.15)" : undefined,
        }}
      >
        {/* Card header */}
        <button
          onClick={() => setIsOpen((v) => !v)}
          className="w-full flex items-center gap-3 p-4 text-left"
        >
          <span className="text-2xl">{item.emoji}</span>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-bold text-foreground">{title}</span>
              <span className="text-xs font-bold px-2 py-0.5 rounded-full font-heading text-white shrink-0"
                style={{ background: "#2563EB" }}>
                {language === "es" ? "Este mes" : "This month"}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">{previewText}</p>
          </div>
          {isOpen
            ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
            : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
          }
        </button>

        {/* Expanded content */}
        {isOpen && (
          <div className="border-t" style={{ borderColor: "#2563EB33" }}>
            <div className="px-4 pt-3 space-y-4 pb-1">
              {events.map((event, i) => {
                const status    = getStatus(event, item.month);
                const isPast    = status === "past";
                const isCurrent = status === "current";
                const chipStyle = STATUS_CHIP[status];

                return (
                  <div key={i} className="flex gap-3">
                    {/* Colored left bar */}
                    <div
                      className="shrink-0 w-1 rounded-full mt-1"
                      style={{ background: STATUS_BAR[status], minHeight: 20, alignSelf: "stretch" }}
                    />
                    <div className="flex-1 min-w-0">
                      {/* Date chip + Now badge */}
                      {(event.dateLabel || isCurrent) && !event.allMonth && (
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          {event.dateLabel && (
                            <span
                              className="text-xs font-bold px-2 py-0.5 rounded-full font-heading"
                              style={{ background: chipStyle.bg, color: chipStyle.text }}
                            >
                              {event.dateLabel}
                            </span>
                          )}
                          {isCurrent && !event.allMonth && (
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full font-heading text-white"
                              style={{ background: "#53CED1" }}>
                              {nowBadge}
                            </span>
                          )}
                        </div>
                      )}

                      {/* Heading */}
                      <p
                        className="text-sm font-semibold leading-snug font-body"
                        style={{ color: isPast ? "#94A3B8" : "#1E293B",
                                 textDecoration: isPast ? "line-through" : "none" }}
                      >
                        {event.heading}
                      </p>

                      {/* Detail lines */}
                      {event.details.map((line, j) => (
                        <p key={j} className="text-xs mt-0.5 leading-relaxed"
                          style={{ color: isPast ? "#CBD5E1" : "#555" }}>
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* CTA */}
            <div className="px-4 pt-3 pb-4">
              <div className="border-t mb-3" style={{ borderColor: "#2563EB33" }} />
              <button
                onClick={() => onOpenChat(askQuery)}
                className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all font-heading"
                style={{ background: "linear-gradient(to right, #2563EB, #1D4ED8)" }}
              >
                <MessageCircle className="w-4 h-4" />
                {askLabel}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
