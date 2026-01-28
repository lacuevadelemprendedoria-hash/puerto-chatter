import { Button } from "@/components/ui/button";
import { Globe } from "lucide-react";
import { Language } from "@/lib/i18n";

interface LanguageToggleProps {
  language: Language;
  onToggle: () => void;
  label: string;
}

export function LanguageToggle({ language, onToggle, label }: LanguageToggleProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={onToggle}
      className="gap-2 text-muted-foreground hover:text-foreground"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">{label}</span>
    </Button>
  );
}
