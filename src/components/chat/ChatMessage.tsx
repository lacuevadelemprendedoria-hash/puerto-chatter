import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/hooks/useChat";

interface ChatMessageProps {
  message: ChatMessageType;
}

// SECURITY: Never use dangerouslySetInnerHTML — render as React nodes so
// any HTML/JS in AI output is escaped automatically.
function renderInline(text: string): React.ReactNode[] {
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return <strong key={i}>{part.slice(2, -2)}</strong>;
    }
    return <span key={i}>{part}</span>;
  });
}

function formatContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];

  lines.forEach((line, index) => {
    const trimmedLine = line.trim();

    if (!trimmedLine) {
      elements.push(<div key={index} className="h-2" />);
      return;
    }

    // Headers (lines starting with emoji or ** at start)
    if (trimmedLine.match(/^(\*\*|#{1,3}|🏠|📍|🕐|✅|📋|🎫|🚌|🌴|ℹ️|💡|⚠️|📞|📧|🔑|🛏️|🍳|👕)/)) {
      const cleaned = trimmedLine.replace(/^#+\s*/, '');
      elements.push(
        <p key={index} className="font-semibold text-base mt-3 first:mt-0">
          {renderInline(cleaned)}
        </p>
      );
      return;
    }

    // Bullet points
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ') || trimmedLine.match(/^\d+\./)) {
      const bulletContent = trimmedLine
        .replace(/^[-•]\s*/, '')
        .replace(/^\d+\.\s*/, '');
      elements.push(
        <div key={index} className="flex gap-2 pl-1 mt-1">
          <span className="text-primary shrink-0">•</span>
          <span>{renderInline(bulletContent)}</span>
        </div>
      );
      return;
    }

    elements.push(
      <p key={index} className="mt-1 first:mt-0">
        {renderInline(trimmedLine)}
      </p>
    );
  });

  return elements;
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
          "max-w-[90%] sm:max-w-[80%]",
          isUser ? "chat-bubble-user" : "chat-bubble-assistant"
        )}
      >
        {isUser ? (
          <p className="text-base leading-relaxed">{message.content}</p>
        ) : (
          <div className="text-base leading-relaxed space-y-0">
            {formatContent(message.content)}
          </div>
        )}
      </div>
    </div>
  );
}
