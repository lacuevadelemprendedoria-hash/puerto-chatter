import { cn } from "@/lib/utils";
import { ChatMessage as ChatMessageType } from "@/hooks/useChat";

interface ChatMessageProps {
  message: ChatMessageType;
}

// Simple markdown-like formatting for better readability
function formatContent(content: string): React.ReactNode[] {
  const lines = content.split('\n');
  const elements: React.ReactNode[] = [];
  
  lines.forEach((line, index) => {
    const trimmedLine = line.trim();
    
    // Skip empty lines but add spacing
    if (!trimmedLine) {
      elements.push(<div key={index} className="h-2" />);
      return;
    }
    
    // Headers (lines starting with emoji or ** at start)
    if (trimmedLine.match(/^(\*\*|#{1,3}|🏠|📍|🕐|✅|📋|🎫|🚌|🌴|ℹ️|💡|⚠️|📞|📧|🔑|🛏️|🍳|👕)/)) {
      const formattedLine = trimmedLine
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/^#+\s*/, '');
      
      elements.push(
        <p 
          key={index} 
          className="font-semibold text-base mt-3 first:mt-0"
          dangerouslySetInnerHTML={{ __html: formattedLine }}
        />
      );
      return;
    }
    
    // Bullet points
    if (trimmedLine.startsWith('- ') || trimmedLine.startsWith('• ') || trimmedLine.match(/^\d+\./)) {
      const bulletContent = trimmedLine
        .replace(/^[-•]\s*/, '')
        .replace(/^\d+\.\s*/, '')
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      
      elements.push(
        <div key={index} className="flex gap-2 pl-1 mt-1">
          <span className="text-primary shrink-0">•</span>
          <span dangerouslySetInnerHTML={{ __html: bulletContent }} />
        </div>
      );
      return;
    }
    
    // Regular text with bold support
    const formattedLine = trimmedLine.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
    elements.push(
      <p 
        key={index} 
        className="mt-1 first:mt-0"
        dangerouslySetInnerHTML={{ __html: formattedLine }}
      />
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
