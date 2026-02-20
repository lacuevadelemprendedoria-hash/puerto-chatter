import { Zap } from "lucide-react";
import { Translations } from "@/lib/i18n";

interface GuestStatusPanelProps {
  t: Translations;
  onQuickHelp: () => void;
}

function getGreeting(t: Translations): string {
  const hour = new Date().getHours();
  if (hour < 12) return t.greeting.morning;
  if (hour < 20) return t.greeting.afternoon;
  return t.greeting.evening;
}

export function GuestStatusPanel({ t, onQuickHelp }: GuestStatusPanelProps) {
  const greeting = getGreeting(t);

  return (
    <div className="welcome-gradient text-primary-foreground px-4 pt-20 pb-6">
      <div className="max-w-md mx-auto">
        <p className="text-sm font-medium opacity-80 mb-1">{greeting} 👋</p>
        <h1 className="text-2xl font-bold mb-3">Puerto Nest Assistant</h1>

        {/* Status row */}
        <div className="flex items-center gap-3 mb-4">
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
            <span className="text-sm">☀️</span>
            <span className="text-sm font-medium">{t.statusPanel.weather}</span>
          </div>
          <div className="flex items-center gap-1.5 bg-white/15 rounded-full px-3 py-1.5">
            <span className="text-sm font-medium">{t.statusPanel.eventToday}</span>
          </div>
        </div>

        {/* Quick help button */}
        <button
          onClick={onQuickHelp}
          className="flex items-center gap-2 bg-white/20 hover:bg-white/30 active:bg-white/40 transition-colors rounded-xl px-4 py-2.5 text-sm font-semibold"
        >
          <Zap className="w-4 h-4" />
          {t.statusPanel.quickHelp}
        </button>
      </div>
    </div>
  );
}
