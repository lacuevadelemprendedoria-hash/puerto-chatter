export function TypingIndicator() {
  return (
    <div className="flex justify-start animate-fade-in">
      <div className="chat-bubble-assistant flex items-center gap-1 px-4 py-3">
        <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "0ms" }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "200ms" }} />
        <span className="w-2 h-2 rounded-full bg-primary animate-typing" style={{ animationDelay: "400ms" }} />
      </div>
    </div>
  );
}
