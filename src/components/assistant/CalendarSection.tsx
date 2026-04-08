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
  key: string;
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

function parseDateFromHeading(
  heading: string
): Pick<CalendarEvent, "dayStart" | "dayEnd" | "dateLabel"> {
  const h = heading.toLowerCase();

  // Range with month name: "5–8 abril" / "5-8 de abril" / "April 5–8"
  const rangeWithMonth = new RegExp(
    `(\\d{1,2})\\s*[–\\-]\\s*(\\d{1,2})\\s+(?:de\\s+)?(${MONTHS_RE})|` +
    `(${MONTHS_RE})\\s+(\\d{1,2})\\s*[–\\-]\\s*(\\d{1,2})`,
    "i"
  );
  // Single day with month name: "5 de abril" / "April 5"
  const singleWithMonth = new RegExp(
    `(\\d{1,2})\\s+(?:de\\s+)?(${MONTHS_RE})|(${MONTHS_RE})\\s+(\\d{1,2})`,
    "i"
  );
  // Dot separator: "· 5–8" or "· 5"
  const dotRange  = /·\s*(\d{1,2})\s*[–\-]\s*(\d{1,2})/;
  const dotSingle = /·\s*(\d{1,2})(?!\s*[–\-\d])/;

  let m;

  m = h.match(rangeWithMonth);
  if (m) {
    const dayStart = parseInt(m[1] ?? m[5]);
    const dayEnd   = parseInt(m[2] ?? m[6]);
    return { dayStart, dayEnd, dateLabel: extractRawDate(heading) };
  }

  m = h.match(singleWithMonth);
  if (m) {
    const dayStart = parseInt(m[1] ?? m[4]);
    return { dayStart, dayEnd: null, dateLabel: extractRawDate(heading) };
  }

  m = heading.match(dotRange);
  if (m) {
    return {
      dayStart: parseInt(m[1]),
      dayEnd:   parseInt(m[2]),
      dateLabel: `${m[1]}–${m[2]}`,
    };
  }

  m = heading.match(dotSingle);
  if (m) {
    return { dayStart: parseInt(m[1]), dayEnd: null, dateLabel: m[1] };
  }

  return { dayStart: null, dayEnd: null, dateLabel: "" };
}

/** Pull the date portion from the original (non-lowercased) heading */
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

// ── Block parser ──────────────────────────────────────────────────────────────

function parseBlocks(description: string, month: number | null): CalendarEvent[] {
  return description
    .split(/\n{2,}/)
    .map((block, i) => {
      const lines   = block.split("\n").filter(Boolean);
      const heading = lines[0] ?? "";
      const details = lines.slice(1);
      const { dayStart, dayEnd, dateLabel } = parseDateFromHeading(heading);
      return { key: `${i}`, heading, details, dayStart, dayEnd, dateLabel };
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

// ── Style tokens ──────────────────────────────────────────────────────────────

const STATUS_STYLE: Record<EventStatus, {
  bar: string; badgeBg: string; badgeText: string; cardBg: string; border: string; titleColor: string;
}> = {
  past: {
    bar: "#CBD5E1", badgeBg: "#F1F5F9", badgeText: "#94A3B8",
    cardBg: "#F8FAFC", border: "#E2E8F0", titleColor: "#94A3B8",
  },
  current: {
    bar: "#53CED1", badgeBg: "#EFF9FA", badgeText: "#0D6F82",
    cardBg: "#F0FAFB", border: "#53CED1", titleColor: "#0D6F82",
  },
  upcoming: {
    bar: "#3B82F6", badgeBg: "#EFF6FF", badgeText: "#1D4ED8",
    cardBg: "#F5F9FF", border: "#BFDBFE", titleColor: "#1D4ED8",
  },
  unknown: {
    bar: "#3B82F6", badgeBg: "#EFF6FF", badgeText: "#1D4ED8",
    cardBg: "#F5F9FF", border: "#BFDBFE", titleColor: "#1D4ED8",
  },
};

// ── Labels ────────────────────────────────────────────────────────────────────

const LABELS = {
  sectionTitle: { en: "📅 This month in Tenerife", es: "📅 Este mes en Tenerife" },
  badge:        { en: "This month",               es: "Este mes"               },
  past:         { en: "Past",                      es: "Pasado"                 },
  current:      { en: "Now",                       es: "Ahora"                  },
  upcoming:     { en: "Upcoming",                  es: "Próximo"                },
  ask:          { en: "Ask me about this",         es: "Pregúntame esto"        },
};
function t(key: keyof typeof LABELS, lang: Language) {
  return LABELS[key][lang === "es" ? "es" : "en"];
}

const STATUS_BADGE_LABELS: Record<EventStatus, keyof typeof LABELS> = {
  past: "past", current: "current", upcoming: "upcoming", unknown: "upcoming",
};

// ── Main component ────────────────────────────────────────────────────────────

interface CalendarSectionProps {
  item: FeedItem;
  language: Language;
  onOpenChat: (query?: string) => void;
  className?: string;
}

export function CalendarSection({ item, language, onOpenChat, className }: CalendarSectionProps) {
  const description = language === "es" ? item.description_es : item.description_en;
  const events      = parseBlocks(description, item.month);
  const [expanded, setExpanded] = useState<string | null>(null);

  // Count by status for header summary
  const today    = new Date();
  const isCurMon = item.month === today.getMonth() + 1;
  const upcoming = isCurMon
    ? events.filter((e) => getStatus(e, item.month) !== "past").length
    : events.length;

  const monthTitle  = t("sectionTitle", language);
  const badgeLabel  = t("badge", language);

  return (
    <div className={cn("mt-6", className)}>
      {/* Section header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-bold text-foreground">{monthTitle}</h2>
        <span
          className="text-xs font-bold px-2.5 py-1 rounded-full font-heading text-white"
          style={{ background: "#2563EB" }}
        >
          {badgeLabel}
        </span>
      </div>

      {/* Upcoming counter */}
      {isCurMon && upcoming > 0 && (
        <p className="text-xs text-muted-foreground mb-3 font-body">
          {language === "es"
            ? `${upcoming} evento${upcoming > 1 ? "s" : ""} pendiente${upcoming > 1 ? "s" : ""} este mes`
            : `${upcoming} event${upcoming > 1 ? "s" : ""} remaining this month`}
        </p>
      )}

      {/* Event cards */}
      <div className="space-y-2">
        {events.map((event) => {
          const status    = getStatus(event, item.month);
          const style     = STATUS_STYLE[status];
          const isOpen    = expanded === event.key;
          const isPast    = status === "past";
          const askQuery  = language === "es"
            ? `Cuéntame sobre este evento: "${event.heading}"`
            : `Tell me about this event: "${event.heading}"`;

          return (
            <div
              key={event.key}
              className="rounded-2xl overflow-hidden shadow-sm"
              style={{
                background:  style.cardBg,
                border:      `1px solid ${isOpen ? style.bar : style.border}`,
                opacity:     isPast ? 0.65 : 1,
              }}
            >
              <button
                onClick={() => setExpanded((p) => (p === event.key ? null : event.key))}
                className="w-full flex items-center gap-3 p-3 text-left"
              >
                {/* Colored left bar */}
                <div
                  className="shrink-0 w-1 self-stretch rounded-full"
                  style={{ background: style.bar, minHeight: 36 }}
                />

                <div className="flex-1 min-w-0">
                  {/* Date chip + status */}
                  <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                    {event.dateLabel ? (
                      <span
                        className="text-xs font-bold px-2 py-0.5 rounded-full font-heading"
                        style={{ background: style.badgeBg, color: style.badgeText }}
                      >
                        {event.dateLabel}
                      </span>
                    ) : null}
                    {status === "current" && (
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full font-heading text-white"
                        style={{ background: "#53CED1" }}>
                        {t("current", language)}
                      </span>
                    )}
                  </div>
                  <p
                    className={cn(
                      "text-sm font-semibold leading-snug line-clamp-2 font-body",
                      isPast && "line-through"
                    )}
                    style={{ color: isPast ? "#94A3B8" : style.titleColor }}
                  >
                    {event.heading}
                  </p>
                </div>

                {isOpen
                  ? <ChevronUp className="w-4 h-4 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-4 h-4 text-muted-foreground shrink-0" />
                }
              </button>

              {isOpen && (
                <div
                  className="px-4 pb-4 border-t animate-fade-in"
                  style={{ borderColor: style.border }}
                >
                  {event.details.length > 0 && (
                    <div className="pt-3 space-y-1">
                      {event.details.map((line, i) => (
                        <p key={i} className="text-sm text-muted-foreground leading-relaxed">
                          {line}
                        </p>
                      ))}
                    </div>
                  )}
                  {!isPast && (
                    <button
                      onClick={() => onOpenChat(askQuery)}
                      className="mt-3 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white text-sm font-semibold active:scale-95 transition-all font-heading"
                      style={{ background: "linear-gradient(to right, #53CED1, #0D6F82)" }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      {t("ask", language)}
                    </button>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
