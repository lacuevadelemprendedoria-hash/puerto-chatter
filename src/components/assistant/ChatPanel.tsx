import { useRef, useEffect } from "react";
import { X, MessageCircle } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { ChatMessage } from "@/components/chat/ChatMessage";
import { ChatInput } from "@/components/chat/ChatInput";
import { TypingIndicator } from "@/components/chat/TypingIndicator";
import { Translations } from "@/lib/i18n";
import { ChatMessage as ChatMessageType } from "@/hooks/useChat";

interface ChatPanelProps {
  open: boolean;
  onClose: () => void;
  messages: ChatMessageType[];
  isLoading: boolean;
  onSend: (msg: string) => void;
  t: Translations;
}

export function ChatPanel({ open, onClose, messages, isLoading, onSend, t }: ChatPanelProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [messages, open]);

  return (
    <Drawer open={open} onOpenChange={(o) => !o && onClose()}>
      <DrawerContent className="h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-2 flex-1">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground">
              <MessageCircle className="w-4 h-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-bold text-foreground text-sm">{t.chat.title}</h2>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-green-500" />
                <span className="text-xs text-muted-foreground">Online</span>
              </div>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
          {messages.length === 0 && (
            <div className="text-center py-8">
              <span className="text-4xl">💬</span>
              <p className="mt-3 text-sm text-muted-foreground">
                {t.chat.title}
              </p>
            </div>
          )}
          {messages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} />
          ))}
          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <TypingIndicator />
          )}
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
