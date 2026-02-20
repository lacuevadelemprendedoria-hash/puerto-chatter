import { Calendar, Home, PartyPopper, Bus, UtensilsCrossed, LifeBuoy } from "lucide-react";
import { FlowId } from "@/lib/flows";
import { Translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: FlowId;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  color: string;
  bgColor: string;
}

const ACTIONS: QuickAction[] = [
  { id: "planDay", icon: Calendar, emoji: "🗓️", color: "text-primary", bgColor: "bg-primary/10" },
  { id: "hostelInfo", icon: Home, emoji: "🏠", color: "text-blue-600", bgColor: "bg-blue-50" },
  { id: "events", icon: PartyPopper, emoji: "🎉", color: "text-purple-600", bgColor: "bg-purple-50" },
  { id: "transport", icon: Bus, emoji: "🚌", color: "text-orange-600", bgColor: "bg-orange-50" },
  { id: "eatOut", icon: UtensilsCrossed, emoji: "🍽️", color: "text-rose-600", bgColor: "bg-rose-50" },
  { id: "needHelp", icon: LifeBuoy, emoji: "🆘", color: "text-red-600", bgColor: "bg-red-50" },
];

interface QuickActionsBarProps {
  t: Translations;
  onAction: (flowId: FlowId) => void;
}

const ACTION_LABEL_KEYS: Record<FlowId, keyof Translations["quickActions"]> = {
  planDay: "planDay",
  hostelInfo: "hostelInfo",
  events: "eventsToday",
  transport: "transport",
  eatOut: "eatOut",
  needHelp: "needHelp",
};

export function QuickActionsBar({ t, onAction }: QuickActionsBarProps) {
  return (
    <div className="px-4 py-5">
      <div className="overflow-x-auto scrollbar-hide -mx-4 px-4">
        <div className="flex gap-3 w-max">
          {ACTIONS.map((action) => {
            const label = t.quickActions[ACTION_LABEL_KEYS[action.id]];
            return (
              <button
                key={action.id}
                onClick={() => onAction(action.id)}
                className={cn(
                  "flex flex-col items-center gap-2 rounded-2xl p-4 min-w-[88px]",
                  "active:scale-95 transition-transform duration-150",
                  "border border-border shadow-sm bg-card",
                  "hover:border-primary/30 hover:shadow-md"
                )}
              >
                <div className={cn("rounded-xl p-2.5 text-xl", action.bgColor)}>
                  <span>{action.emoji}</span>
                </div>
                <span className="text-xs font-semibold text-foreground text-center leading-tight max-w-[72px]">
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
