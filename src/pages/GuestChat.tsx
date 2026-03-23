import { useEffect, useState, useCallback } from "react";

import { MessageCircle, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuestStatusPanel } from "@/components/assistant/GuestStatusPanel";
import { QuickActionsBar } from "@/components/assistant/QuickActionsBar";
import { GuidedFlow } from "@/components/assistant/GuidedFlow";
import { ActivityFeed } from "@/components/assistant/ActivityFeed";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { useChat } from "@/hooks/useChat";
import { Language, useTranslations } from "@/lib/i18n";
import { FlowId } from "@/lib/flows";
import logoSrc from "@/assets/puerto-nest-logo.png";

const LANGUAGES: { code: Language; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "es", label: "Español", flag: "🇪🇸" },
  { code: "de", label: "Deutsch", flag: "🇩🇪" },
  { code: "it", label: "Italiano", flag: "🇮🇹" },
  { code: "zh", label: "中文", flag: "🇨🇳" },
];

export default function GuestChat() {
  const [language, setLanguage] = useState<Language>("en");
  const [showLangMenu, setShowLangMenu] = useState(false);
  const t = useTranslations(language);
  const { messages, isLoading, sendMessage, clearMessages } = useChat(language);
  const [activeFlow, setActiveFlow] = useState<FlowId | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const handleSelectLanguage = (lang: Language) => {
    setLanguage(lang);
    setShowLangMenu(false);
    clearMessages();
  };

  const handleOpenChat = useCallback((query?: string) => {
    setChatOpen(true);
    if (query) setPendingQuery(query);
  }, []);

  useEffect(() => {
    if (chatOpen && pendingQuery) {
      sendMessage(pendingQuery);
      setPendingQuery(null);
    }
  }, [chatOpen, pendingQuery, sendMessage]);

  const currentLang = LANGUAGES.find((l) => l.code === language);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3">
        <img src={logoSrc} alt="Puerto Nest Hostel" className="h-8 w-auto object-contain drop-shadow" style={{ filter: 'brightness(0) invert(1)' }} />
        <div className="flex items-center gap-1">
          {/* Language selector */}
          <div className="relative">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10 gap-1.5 px-2"
            >
              <Globe className="w-4 h-4" />
              <span className="text-xs font-medium">{currentLang?.flag} {language.toUpperCase()}</span>
            </Button>
            {showLangMenu && (
              <div className="absolute right-0 top-full mt-1 bg-card border border-border rounded-xl shadow-lg overflow-hidden z-50 min-w-[140px]">
                {LANGUAGES.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleSelectLanguage(lang.code)}
                    className={`w-full flex items-center gap-2 px-3 py-2.5 text-sm hover:bg-muted transition-colors text-left ${language === lang.code ? "bg-primary/5 text-primary font-medium" : "text-foreground"}`}
                  >
                    <span>{lang.flag}</span>
                    <span>{lang.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Close language menu on outside click */}
      {showLangMenu && (
        <div className="fixed inset-0 z-10" onClick={() => setShowLangMenu(false)} />
      )}

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <GuestStatusPanel t={t} language={language} onQuickHelp={() => setActiveFlow("needHelp")} />
        <QuickActionsBar t={t} onAction={(flowId) => setActiveFlow(flowId)} />
        <ActivityFeed language={language} onOpenChat={handleOpenChat} />
      </div>

      {/* Floating chat button */}
      <button
        onClick={() => handleOpenChat()}
        className="fixed bottom-6 right-4 z-30 flex items-center gap-2 bg-[#53CED1] hover:bg-[#0D6F82] text-white font-bold py-3 px-5 rounded-full shadow-lg active:scale-95 transition-all font-heading"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm">{t.chat.open}</span>
      </button>

      <GuidedFlow
        open={activeFlow !== null}
        flowId={activeFlow}
        language={language}
        t={t}
        onClose={() => setActiveFlow(null)}
        onOpenChat={handleOpenChat}
      />

      <ChatPanel
        open={chatOpen}
        onClose={() => setChatOpen(false)}
        messages={messages}
        isLoading={isLoading}
        onSend={sendMessage}
        t={t}
        language={language}
      />
    </div>
  );
}
