
import { FlowId } from "@/lib/flows";
import { Translations } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface QuickAction {
  id: FlowId;
  emoji: string;
  bgColor: string;
  textColor: string;
}

// All using Nests brand palette
const ACTIONS: QuickAction[] = [
  { id: "planDay",    emoji: "🗓️", bgColor: "bg-[#53CED1]/15", textColor: "text-[#0D6F82]" },
  { id: "hostelInfo", emoji: "🏠", bgColor: "bg-[#53D195]/15", textColor: "text-[#0D6F82]" },
  { id: "events",     emoji: "🎉", bgColor: "bg-[#E5B853]/15", textColor: "text-[#0D6F82]" },
  { id: "transport",  emoji: "🚌", bgColor: "bg-[#E37C25]/15", textColor: "text-[#0D6F82]" },
  { id: "eatOut",     emoji: "🍽️", bgColor: "bg-[#CED153]/15", textColor: "text-[#0D6F82]" },
  { id: "needHelp",   emoji: "🆘", bgColor: "bg-[#D15653]/15", textColor: "text-[#0D6F82]" },
];

const ACTION_LABEL_KEYS: Record<FlowId, keyof Translations["quickActions"]> = {
  planDay: "planDay", hostelInfo: "hostelInfo", events: "eventsToday",
  transport: "transport", eatOut: "eatOut", needHelp: "needHelp",
};

interface QuickActionsBarProps {
  t: Translations;
  onAction: (flowId: FlowId) => void;
}

export function QuickActionsBar({ t, onAction }: QuickActionsBarProps) {
  return (
    <div className="px-4 py-5">
      <div className="grid grid-cols-3 gap-3">
        {ACTIONS.map((action) => {
          const label = t.quickActions[ACTION_LABEL_KEYS[action.id]];
          return (
            <button
              key={action.id}
              onClick={() => onAction(action.id)}
              className={cn(
                "flex flex-col items-center gap-2 rounded-2xl p-4",
                "active:scale-95 transition-all duration-150",
                "border border-border bg-card",
                "hover:border-[#53CED1]/50 hover:shadow-sm"
              )}
            >
              <div className={cn("rounded-xl p-2.5 text-xl", action.bgColor)}>
                <span>{action.emoji}</span>
              </div>
              <span className={cn("text-xs font-semibold text-center leading-tight font-body", action.textColor)}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
