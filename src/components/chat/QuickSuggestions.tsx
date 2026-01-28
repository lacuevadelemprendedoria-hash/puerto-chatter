import { Button } from "@/components/ui/button";

interface QuickSuggestionsProps {
  title: string;
  suggestions: readonly string[];
  onSelect: (suggestion: string) => void;
  disabled?: boolean;
}

export function QuickSuggestions({ title, suggestions, onSelect, disabled }: QuickSuggestionsProps) {
  return (
    <div className="animate-fade-in">
      <p className="text-sm text-muted-foreground mb-2">{title}</p>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => (
          <Button
            key={index}
            variant="outline"
            size="sm"
            onClick={() => onSelect(suggestion)}
            disabled={disabled}
            className="text-sm rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
          >
            {suggestion}
          </Button>
        ))}
      </div>
    </div>
  );
}
