import { useState, useEffect } from "react";
import { ChevronDown, ChevronUp, ExternalLink } from "lucide-react";
import { Language } from "@/lib/i18n";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

interface FeedItem {
  id: string;
  type: "event" | "restaurant" | "hostel_activity" | "banner" | "curiosity" | "calendar";
  emoji: string;
  title_en: string;
  title_es: string;
  subtitle_en: string;
  subtitle_es: string;
  description_en: string;
  description_es: string;
  cta_label_en: string;
  cta_label_es: string;
  cta_action: string;
  sort_order: number;
  day_of_week: number | null;
  month: number | null;
}

interface ActivityFeedProps {
  language: Language;
  onOpenChat: (query?: string) => void;
}

function getText(item: FeedItem, field: "title" | "subtitle" | "description" | "cta_label", lang: Language): string {
  return lang === "es" ? item[`${field}_es`] : item[`${field}_en`];
}

export function ActivityFeed({ language, onOpenChat }: ActivityFeedProps) {
  const [items, setItems] = useState<FeedItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    const fetchItems = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("feed_items")
        .select("*")
        .order("sort_order");

      if (!error && data) {
        setItems(data as FeedItem[]);
        const regular = data.filter((d: any) => d.type !== "curiosity");
        if (regular.length > 0) setExpanded(regular[0].id);
      }
      setLoading(false);
    };

    fetchItems();
  }, []);

  const toggle = (id: string) => setExpanded((prev) => (prev === id ? null : id));

  const handleCta = (item: FeedItem) => {
    const action = item.cta_action?.trim();
    if (!action) { onOpenChat(); return; }
    if (action.startsWith("http")) {
      window.open(action, "_blank", "noopener,noreferrer");
      return;
    }
    const title = getText(item, "title", language);
    const query = language === "es"
      ? `Cuéntame más sobre "${title}"`
      : `Tell me more about "${title}"`;
    onOpenChat(query);
  };

  const feedTitle = language === "es" ? "Hoy en el Hostel" : "Today at the Hostel";

  // Split items
  const regularItems = items.filter((i) => i.type !== "curiosity" && i.type !== "calendar");
  const todayDow = new Date().getDay();
  const currentMonth = new Date().getMonth() + 1;
  const todayCuriosity = items.find((i) => i.type === "curiosity" && i.day_of_week === todayDow);
  const calendarItem = items.find((i) => i.type === "calendar" && i.month === currentMonth);

  if (loading) {
    return (
      <div className="px-4 pb-24">
        <h2 className="text-lg font-bold text-foreground mb-3">{feedTitle}</h2>
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-20 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  const curiosityTitle = language === "es" ? "¿Sabías que...? 🌴" : "Did you know? 🌴";
  const badgeText = language === "es" ? "Dato del día" : "Daily tip";
  const calendarTitle = language === "es" ? "📅 Este mes en Tenerife" : "📅 This month in Tenerife";
  const calendarBadge = language === "es" ? "Este mes" : "This month";

  return (
    <div className="px-4 pb-24">
      {/* Regular feed */}
      {regularItems.length > 0 && (
        <>
          <h2 className="text-lg font-bold text-foreground mb-3">{feedTitle}</h2>
          <div className="space-y-3">
            {regularItems.map((item) => {
              const isOpen = expanded === item.id;
              const title = getText(item, "title", language);
              const subtitle = getText(item, "subtitle", language);
              const description = getText(item, "description", language);
              const ctaLabel = getText(item, "cta_label", language);

              return (
                <div
                  key={item.id}
                  className={cn(
                    "bg-card border rounded-2xl overflow-hidden shadow-sm transition-all duration-200",
                    isOpen ? "border-primary/30 shadow-md" : "border-border"
                  )}
                >
                  <button
                    onClick={() => toggle(item.id)}
                    className="w-full flex items-center gap-3 p-4 text-left"
                  >
                    <span className="text-2xl">{item.emoji}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-foreground truncate">{title}</span>
                        {item.type === "event" && (
                          <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 font-heading"
                            style={{background: '#53CED1', color: '#fff'}}>
                            {language === "es" ? "HOY" : "TODAY"}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                        {subtitle || description.split("\n")[0]}
                      </p>
                    </div>
                    {isOpen
                      ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                      : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                    }
                  </button>

                  {isOpen && (
                    <div className="px-4 pb-4 border-t border-border/50 animate-fade-in">
                      <div className="pt-3 space-y-1">
                        {description.split("\n").map((line, i) => (
                          <p key={i} className="text-sm text-muted-foreground">{line}</p>
                        ))}
                      </div>
                      {ctaLabel && (
                        <button
                          onClick={() => handleCta(item)}
                          className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all font-heading"
                          style={{background: 'linear-gradient(to right, #53CED1, #0D6F82)'}}
                        >
                          {ctaLabel}
                          {item.cta_action?.startsWith("http") && <ExternalLink className="w-4 h-4" />}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Curiosity section */}
      {todayCuriosity && (() => {
        const item = todayCuriosity;
        const isOpen = expanded === item.id;
        const title = getText(item, "title", language);
        const subtitle = getText(item, "subtitle", language);
        const description = getText(item, "description", language);
        const ctaLabel = getText(item, "cta_label", language);

        return (
          <div className={cn(regularItems.length > 0 && "mt-6")}>
            <h2 className="text-lg font-bold text-foreground mb-3">{curiosityTitle}</h2>
            <div
              className={cn(
                "border rounded-2xl overflow-hidden shadow-sm transition-all duration-200",
                isOpen ? "shadow-md" : ""
              )}
              style={{ background: '#FEF3EA', borderColor: isOpen ? '#E37C25' : undefined }}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground truncate">{title}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 font-heading text-white"
                      style={{ background: '#E37C25' }}>
                      {badgeText}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {subtitle || description.split("\n")[0]}
                  </p>
                </div>
                {isOpen
                  ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                }
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t animate-fade-in" style={{ borderColor: '#E37C25' + '33' }}>
                  <div className="pt-3 space-y-1">
                    {description.split("\n").map((line, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{line}</p>
                    ))}
                  </div>
                  {ctaLabel && (
                    <button
                      onClick={() => handleCta(item)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all font-heading"
                      style={{ background: '#E37C25' }}
                    >
                      {ctaLabel}
                      {item.cta_action?.startsWith("http") && <ExternalLink className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {/* Calendar section */}
      {calendarItem && (() => {
        const item = calendarItem;
        const isOpen = expanded === item.id;
        const title = getText(item, "title", language);
        const subtitle = getText(item, "subtitle", language);
        const description = getText(item, "description", language);
        const ctaLabel = getText(item, "cta_label", language);

        return (
          <div className={cn((regularItems.length > 0 || todayCuriosity) && "mt-6")}>
            <h2 className="text-lg font-bold text-foreground mb-3">{calendarTitle}</h2>
            <div
              className={cn(
                "border rounded-2xl overflow-hidden shadow-sm transition-all duration-200",
                isOpen ? "shadow-md" : ""
              )}
              style={{ background: '#E6F1FB', borderColor: isOpen ? '#2563EB' : undefined }}
            >
              <button
                onClick={() => toggle(item.id)}
                className="w-full flex items-center gap-3 p-4 text-left"
              >
                <span className="text-2xl">{item.emoji}</span>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground truncate">{title}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0 font-heading text-white"
                      style={{ background: '#2563EB' }}>
                      {calendarBadge}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                    {subtitle || description.split("\n")[0]}
                  </p>
                </div>
                {isOpen
                  ? <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                  : <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                }
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t animate-fade-in" style={{ borderColor: '#2563EB33' }}>
                  <div className="pt-3 space-y-1">
                    {description.split("\n").map((line, i) => (
                      <p key={i} className="text-sm text-muted-foreground">{line}</p>
                    ))}
                  </div>
                  {ctaLabel && (
                    <button
                      onClick={() => handleCta(item)}
                      className="mt-4 w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-white font-semibold text-sm active:scale-95 transition-all font-heading"
                      style={{ background: 'linear-gradient(to right, #2563EB, #1D4ED8)' }}
                    >
                      {ctaLabel}
                      {item.cta_action?.startsWith("http") && <ExternalLink className="w-4 h-4" />}
                    </button>
                  )}
                </div>
              )}
            </div>
          </div>
        );
      })()}

      {regularItems.length === 0 && !todayCuriosity && !calendarItem && (
        <div>
          <h2 className="text-lg font-bold text-foreground mb-3">{feedTitle}</h2>
          <p className="text-sm text-muted-foreground text-center py-8">
            {language === "es" ? "No hay novedades hoy." : "Nothing new today."}
          </p>
        </div>
      )}
    </div>
  );
}
