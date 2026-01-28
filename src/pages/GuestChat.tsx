import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { WelcomeCard } from "@/components/chat/WelcomeCard";
import { QuickSuggestions } from "@/components/chat/QuickSuggestions";
import { LanguageToggle } from "@/components/chat/LanguageToggle";
import { useChat } from "@/hooks/useChat";
import { Language, useTranslations } from "@/lib/i18n";
import { useToast } from "@/hooks/use-toast";

export default function GuestChat() {
  const [language, setLanguage] = useState<Language>("en");
  const t = useTranslations(language);
  const { messages, isLoading, error, sendMessage, clearMessages } = useChat(language);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const toggleLanguage = () => {
    const newLang = language === "en" ? "es" : "en";
    setLanguage(newLang);
    clearMessages();
  };

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Show error toast
  useEffect(() => {
    if (error) {
      toast({
        variant: "destructive",
        title: language === "es" ? "Error" : "Error",
        description: error,
      });
    }
  }, [error, toast, language]);

  const handleSuggestionSelect = (suggestion: string) => {
    sendMessage(suggestion);
  };

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      {/* Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full welcome-gradient flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">PN</span>
          </div>
          <span className="font-semibold text-foreground">Puerto Nest</span>
        </div>
        <div className="flex items-center gap-1">
          <LanguageToggle
            language={language}
            onToggle={toggleLanguage}
            label={t.language.toggle}
          />
          <Link to="/admin">
            <Button variant="ghost" size="icon" className="text-muted-foreground">
              <Settings className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </header>

      {/* Messages area */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scrollbar-hide">
        {/* Welcome card - always show */}
        <WelcomeCard
          title={t.welcome.title}
          subtitle={t.welcome.subtitle}
          description={t.welcome.description}
        />

        {/* Quick suggestions - show only when no messages */}
        {messages.length === 0 && (
          <QuickSuggestions
            title={t.suggestions.title}
            suggestions={t.suggestions.items}
            onSelect={handleSuggestionSelect}
            disabled={isLoading}
          />
        )}

        {/* Messages */}
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {/* Typing indicator */}
        {isLoading && messages[messages.length - 1]?.role === "user" && (
          <TypingIndicator />
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <ChatInput
        onSend={sendMessage}
        isLoading={isLoading}
        placeholder={t.chat.placeholder}
        sendLabel={t.chat.send}
      />
    </div>
  );
}
