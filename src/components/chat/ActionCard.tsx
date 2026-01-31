import { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ActionCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  highlighted?: boolean;
  onClick?: () => void;
}

export function ActionCard({ icon: Icon, title, description, highlighted, onClick }: ActionCardProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center justify-center p-4 rounded-2xl bg-card border border-border",
        "text-center transition-all duration-200 hover:scale-[1.02] active:scale-[0.98]",
        "min-h-[120px] w-full",
        highlighted && "ring-2 ring-accent ring-offset-2 ring-offset-background"
      )}
    >
      <div className={cn(
        "w-12 h-12 rounded-full flex items-center justify-center mb-3",
        highlighted ? "bg-accent/20" : "bg-primary/10"
      )}>
        <Icon className={cn(
          "w-6 h-6",
          highlighted ? "text-accent" : "text-primary"
        )} />
      </div>
      <h3 className="font-semibold text-foreground text-sm mb-1">{title}</h3>
      <p className="text-xs text-muted-foreground leading-tight">{description}</p>
    </button>
  );
}
