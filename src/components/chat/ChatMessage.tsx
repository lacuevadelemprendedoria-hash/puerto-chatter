import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/hooks/useChat";

interface ChatMessageProps {
  message: ChatMessageType;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={cn(
        "flex w-full animate-fade-in",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[85%] sm:max-w-[75%]",
          isUser ? "chat-bubble-user" : "chat-bubble-assistant"
        )}
      >
        <p className="text-chat whitespace-pre-wrap break-words">
          {message.content}
        </p>
      </div>
    </div>
  );
}
