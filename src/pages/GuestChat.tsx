import { useRef, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Settings, Ticket, Building, Palmtree, Bus, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { HeroSection } from "@/components/chat/HeroSection";
import { ActionCard } from "@/components/chat/ActionCard";
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
        title: "Error",
        description: error,
      });
    }
  }, [error, toast]);

  const handleCardClick = (topic: string) => {
    sendMessage(topic);
  };

  const handleSendMessage = (content: string) => {
    sendMessage(content);
  };

  const hasMessages = messages.length > 0;

  return (
    <div className="flex flex-col h-screen max-h-screen bg-background">
      {/* Top bar with language and settings */}
      <header className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-4 py-3">
        <LanguageToggle
          language={language}
          onToggle={toggleLanguage}
          label={t.language.toggle}
        />
        <Link to="/admin">
          <Button variant="ghost" size="icon" className="text-primary-foreground/80 hover:text-primary-foreground hover:bg-white/10">
            <Settings className="w-5 h-5" />
          </Button>
        </Link>
      </header>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {/* Hero Section */}
        <HeroSection
          title={t.welcome.title}
          subtitle={t.welcome.subtitle}
          description={t.welcome.description}
        />

        {/* Main content */}
        <div className="px-4 py-6 space-y-6">
          {/* Action Cards - Show when no messages */}
          {!hasMessages && (
            <div className="grid grid-cols-2 gap-3 max-w-md mx-auto">
              <ActionCard
                icon={Ticket}
                title={t.actionCards.nestPass.title}
                description={t.actionCards.nestPass.description}
                highlighted
                onClick={() => handleCardClick(language === "en" 
                  ? "Tell me about the Nest Pass" 
                  : "Cuéntame sobre el Nest Pass"
                )}
              />
              <ActionCard
                icon={PartyPopper}
                title={t.actionCards.carnival.title}
                description={t.actionCards.carnival.description}
                highlighted
                onClick={() => handleCardClick(language === "en" 
                  ? "Tell me about Carnival festivities and events" 
                  : "Cuéntame sobre las fiestas y eventos del Carnaval"
                )}
              />
              <ActionCard
                icon={Building}
                title={t.actionCards.hostelInfo.title}
                description={t.actionCards.hostelInfo.description}
                onClick={() => handleCardClick(language === "en" 
                  ? "Tell me about check-in and house rules" 
                  : "Cuéntame sobre el check-in y las reglas"
                )}
              />
              <ActionCard
                icon={Palmtree}
                title={t.actionCards.excursions.title}
                description={t.actionCards.excursions.description}
                onClick={() => handleCardClick(language === "en" 
                  ? "What excursions and activities are available?" 
                  : "¿Qué excursiones y actividades hay disponibles?"
                )}
              />
              <ActionCard
                icon={Bus}
                title={t.actionCards.transport.title}
                description={t.actionCards.transport.description}
                onClick={() => handleCardClick(language === "en" 
                  ? "How can I get to the airport or bus station?" 
                  : "¿Cómo puedo llegar al aeropuerto o estación de buses?"
                )}
              />
            </div>
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
      </div>

      {/* Input */}
      <ChatInput
        onSend={handleSendMessage}
        isLoading={isLoading}
        placeholder={t.chat.placeholder}
        sendLabel={t.chat.send}
      />
    </div>
  );
}
