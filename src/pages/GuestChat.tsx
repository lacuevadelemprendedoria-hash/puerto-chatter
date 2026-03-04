import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Settings, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LanguageToggle } from "@/components/chat/LanguageToggle";
import { GuestStatusPanel } from "@/components/assistant/GuestStatusPanel";
import { QuickActionsBar } from "@/components/assistant/QuickActionsBar";
import { GuidedFlow } from "@/components/assistant/GuidedFlow";
import { ActivityFeed } from "@/components/assistant/ActivityFeed";
import { ChatPanel } from "@/components/assistant/ChatPanel";
import { useChat } from "@/hooks/useChat";
import { Language, useTranslations } from "@/lib/i18n";
import { FlowId } from "@/lib/flows";
import logoSrc from "@/assets/puerto-nest-logo.png";

export default function GuestChat() {
  const [language, setLanguage] = useState<Language>("en");
  const t = useTranslations(language);

  const { messages, isLoading, sendMessage, clearMessages } = useChat(language);

  const [activeFlow, setActiveFlow] = useState<FlowId | null>(null);
  const [chatOpen, setChatOpen] = useState(false);
  const [pendingQuery, setPendingQuery] = useState<string | null>(null);

  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    clearMessages();
  };

  const handleOpenFlow = (flowId: FlowId) => {
    setActiveFlow(flowId);
  };

  const handleOpenChat = useCallback((query?: string) => {
    setChatOpen(true);
    if (query) {
      setPendingQuery(query);
    }
  }, []);

  // Send pending query once chat opens
  useEffect(() => {
    if (chatOpen && pendingQuery) {
      sendMessage(pendingQuery);
      setPendingQuery(null);
    }
  }, [chatOpen, pendingQuery, sendMessage]);

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      {/* Persistent header */}
      <header className="absolute top-0 left-0 right-0 z-20 flex items-center justify-between px-4 py-3">
        <img
          src={logoSrc}
          alt="Puerto Nest Hostel"
          className="h-8 w-auto object-contain drop-shadow"
        />
        <div className="flex items-center gap-1">
          <LanguageToggle
            language={language}
            onToggle={toggleLanguage}
            label={t.language.toggle}
          />
          <Link to="/admin">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10"
            >
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Scrollable main content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Status panel with gradient header */}
        <GuestStatusPanel
          t={t}
          language={language}
          onQuickHelp={() => handleOpenFlow("needHelp")}
        />

        {/* Quick actions horizontal scroll */}
        <QuickActionsBar t={t} onAction={handleOpenFlow} />

        {/* Activity feed */}
        <ActivityFeed language={language} onOpenChat={handleOpenChat} />
      </div>

      {/* Floating chat button */}
      <button
        onClick={() => handleOpenChat()}
        className="fixed bottom-6 right-4 z-30 flex items-center gap-2 bg-primary text-primary-foreground font-bold py-3 px-5 rounded-full shadow-lg hover:bg-primary/90 active:scale-95 transition-all"
      >
        <MessageCircle className="w-5 h-5" />
        <span className="text-sm">{t.chat.open}</span>
      </button>

      {/* Guided flow drawer */}
      <GuidedFlow
        open={activeFlow !== null}
        flowId={activeFlow}
        language={language}
        t={t}
        onClose={() => setActiveFlow(null)}
        onOpenChat={handleOpenChat}
      />

      {/* Chat panel drawer */}
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
