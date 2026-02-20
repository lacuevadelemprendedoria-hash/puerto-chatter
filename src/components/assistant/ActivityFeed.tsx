import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { Translations } from "@/lib/i18n";
import { NestPassSimulator } from "./NestPassSimulator";
import { cn } from "@/lib/utils";
import { Language } from "@/lib/i18n";

interface ActivityFeedProps {
  t: Translations;
  language: Language;
  onOpenChat: (query?: string) => void;
}

type FeedItem = {
  id: string;
  title: string;
  subtitle: string;
  preview: string;
  content: React.ReactNode;
};

export function ActivityFeed({ t, language, onOpenChat }: ActivityFeedProps) {
  const [expanded, setExpanded] = useState<string | null>("carnival");

  const toggle = (id: string) => {
    setExpanded((prev) => (prev === id ? null : id));
  };

  const items: FeedItem[] = [
    {
      id: "carnival",
      title: t.feed.carnival.title,
      subtitle: t.feed.carnival.subtitle,
      preview: t.feed.carnival.preview,
      content: (
        <div className="space-y-4 pt-2">
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="font-bold text-foreground mb-1">{t.feed.carnival.santaCruz}</p>
            <p className="text-sm text-muted-foreground">{t.feed.carnival.santaCruzDesc}</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-3">
            <p className="font-bold text-foreground mb-1">{t.feed.carnival.puertoCruz}</p>
            <p className="text-sm text-muted-foreground">{t.feed.carnival.puertoCruzDesc}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => onOpenChat(
                language === "en"
                  ? "Tell me about Carnival: 🎭🎉 Santa Cruz de Tenerife and 🎭🎉 Puerto de la Cruz"
                  : "Cuéntame sobre el Carnaval: 🎭🎉 Santa Cruz de Tenerife y 🎭🎉 Puerto de la Cruz"
              )}
              className="flex-1 py-2 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
            >
              {t.feed.carnival.moreInfo}
            </button>
            <button
              onClick={() => onOpenChat(
                language === "en"
                  ? "How can I get a shuttle to the Santa Cruz Carnival?"
                  : "¿Cómo puedo coger el shuttle al Carnaval de Santa Cruz?"
              )}
              className="flex-1 py-2 px-3 rounded-xl bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
            >
              {t.feed.carnival.shuttle}
            </button>
          </div>
        </div>
      ),
    },
    {
      id: "nestpass",
      title: t.feed.nestPass.title,
      subtitle: t.feed.nestPass.subtitle,
      preview: t.feed.nestPass.preview,
      content: (
        <div className="pt-2 space-y-3">
          <p className="text-sm text-muted-foreground">{t.feed.nestPass.description}</p>
          <NestPassSimulator t={t} />
          <button
            onClick={() => onOpenChat(
              language === "en"
                ? "Tell me about the Nest Pass and how to get it"
                : "Cuéntame sobre el Nest Pass y cómo conseguirlo"
            )}
            className="w-full py-2.5 px-4 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {t.nestPassSimulator.cta}
          </button>
        </div>
      ),
    },
    {
      id: "hostel",
      title: t.feed.hostelToday.title,
      subtitle: t.feed.hostelToday.subtitle,
      preview: t.feed.hostelToday.preview,
      content: (
        <div className="pt-2 space-y-2">
          {[
            { emoji: "☀️", text: language === "en" ? "Reception open 14:00–21:00" : "Recepción abierta 14:00–21:00" },
            { emoji: "🍳", text: language === "en" ? "Kitchen available 08:00–22:30" : "Cocina disponible 08:00–22:30" },
            { emoji: "🌙", text: language === "en" ? "Quiet hours 23:00–08:00" : "Silencio nocturno 23:00–08:00" },
          ].map((item, i) => (
            <div key={i} className="flex items-start gap-2 text-sm">
              <span>{item.emoji}</span>
              <span className="text-muted-foreground">{item.text}</span>
            </div>
          ))}
          <button
            onClick={() => onOpenChat(
              language === "en" ? "What are the house rules?" : "¿Cuáles son las reglas de la casa?"
            )}
            className="mt-2 w-full py-2 px-3 rounded-xl bg-muted text-foreground font-semibold text-sm hover:bg-muted/80 transition-colors"
          >
            {language === "en" ? "See all house rules" : "Ver todas las reglas"}
          </button>
        </div>
      ),
    },
    {
      id: "eat",
      title: t.feed.eatRecommended.title,
      subtitle: t.feed.eatRecommended.subtitle,
      preview: t.feed.eatRecommended.preview,
      content: (
        <div className="pt-2 space-y-3">
          {[
            { emoji: "🍽️", desc: language === "en" ? "Canarian tapas · short walk" : "Tapas canarias · poca distancia" },
            { emoji: "☕", desc: language === "en" ? "Local cafés · old town area" : "Cafeterías locales · casco viejo" },
            { emoji: "🐟", desc: language === "en" ? "Fresh fish & seafood · ask us for today's pick" : "Pescado y marisco fresco · pregúntanos" },
          ].map((place, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="text-xl">{place.emoji}</span>
              <p className="text-sm text-muted-foreground">{place.desc}</p>
            </div>
          ))}
          <button
            onClick={() => onOpenChat(
              language === "en" ? "Where can I eat nearby?" : "¿Dónde puedo comer cerca?"
            )}
            className="mt-1 w-full py-2 px-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
          >
            {language === "en" ? "Ask assistant for recommendations" : "Pedir recomendaciones al asistente"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="px-4 pb-24">
      <h2 className="text-lg font-bold text-foreground mb-3">{t.feed.title}</h2>
      <div className="space-y-3">
        {items.map((item) => {
          const isOpen = expanded === item.id;
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
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-foreground">{item.title}</span>
                    {item.id === "carnival" && (
                      <span className="bg-accent text-accent-foreground text-xs font-bold px-2 py-0.5 rounded-full">
                        LIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {isOpen ? item.subtitle : item.preview}
                  </p>
                </div>
                {isOpen ? (
                  <ChevronUp className="w-5 h-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-muted-foreground shrink-0" />
                )}
              </button>

              {isOpen && (
                <div className="px-4 pb-4 border-t border-border/50 animate-fade-in">
                  {item.content}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
