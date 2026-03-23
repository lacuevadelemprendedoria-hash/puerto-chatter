import { useRef, useEffect, useState } from "react";
import { X, MessageCircle } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { StarRating } from "@/components/chat/StarRating";
import { Translations, Language } from "@/lib/i18n";
import { ChatMessage as ChatMessageType } from "@/hooks/useChat";

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSend: (msg: string) => void;
  t: Translations;
  language: Language;
}

const quickSuggestions: Record<string, string[]> = {
  en: ["📶 WiFi password?", "🕐 Check-out time?", "🚌 Bus to Santa Cruz?", "🍽️ Where to eat?"],
  es: ["📶 ¿Contraseña WiFi?", "🕐 ¿Hora de check-out?", "🚌 ¿Bus a Santa Cruz?", "🍽️ ¿Dónde comer?"],
  de: ["📶 WLAN-Passwort?", "🕐 Check-out Zeit?", "🚌 Bus nach Santa Cruz?", "🍽️ Wo essen?"],
  it: ["📶 Password WiFi?", "🕐 Orario check-out?", "🚌 Bus per Santa Cruz?", "🍽️ Dove mangiare?"],
  zh: ["📶 WiFi密码？", "🕐 退房时间？", "🚌 去圣克鲁斯的公交？", "🍽️ 去哪吃饭？"],
};

export function ChatPanel({ open, onClose, messages, isLoading, onSend, t, language }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [ratedIds, setRatedIds] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (open) {
      setTimeout(() => messagesEndRef.current?.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [messages, open]);

  const statusLabel = language === "es" ? "En línea" : "Online";
  const suggestionsTitle = language === "es" ? "Preguntas frecuentes:" : "Quick questions:";
  const suggestions = quickSuggestions[language] ?? quickSuggestions.en;

  // Show rating only after the last assistant message (when not loading)
  const lastAssistantMsg = !isLoading
    ? [...messages].reverse().find((m) => m.role === "assistant" && m.content.trim().length > 0)
    : null;
  const showRating = lastAssistantMsg && !ratedIds.has(lastAssistantMsg.id);

  const handleRate = (msgId: string, stars: number) => {
    setRatedIds((prev) => new Set([...prev, msgId]));
    console.log(`Rating: ${stars} stars for message ${msgId}`);
    // Future: save to Supabase analytics
  };

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm font-heading">{t.chat.title}</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">{statusLabel}</span>
              </div>
            </div>
          </div>
          <button onClick={onClose} className="p-2 rounded-xl hover:bg-muted transition-colors">
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="py-6 space-y-5">
              <div className="text-center">
                <span className="text-4xl">🏠</span>
                <h3 className="mt-2 font-bold text-foreground">{t.chat.title}</h3>
                <p className="mt-1 text-sm text-muted-foreground max-w-[260px] mx-auto">
                  {t.welcome.description}
                </p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-semibold text-muted-foreground px-1">{suggestionsTitle}</p>
                <div className="flex flex-wrap gap-2">
                  {suggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => onSend(suggestion.replace(/^[^\s]+\s/, ""))}
                      disabled={isLoading}
                      className="text-xs px-3 py-2 rounded-full border border-border bg-card hover:border-primary hover:bg-primary/5 hover:text-primary transition-colors font-medium disabled:opacity-50"
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <div key={msg.id}>
              <ChatMessage message={msg} />
              {msg.role === "assistant" && msg.id === lastAssistantMsg?.id && showRating && (
                <StarRating
                  promptText={t.chat.ratingPrompt}
                  thanksText={t.chat.ratingThanks}
                  onRate={(stars) => handleRate(msg.id, stars)}
                />
              )}
            </div>
          ))}

          {isLoading && messages[messages.length - 1]?.role === "user" && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="shrink-0">
          <ChatInput
            onSend={onSend}
            isLoading={isLoading}
            placeholder={t.chat.placeholder}
            sendLabel={t.chat.send}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
