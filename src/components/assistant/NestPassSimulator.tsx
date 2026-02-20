import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Translations } from "@/lib/i18n";

const STANDARD_PRICE_PER_NIGHT = 40; // EUR without pass

function getPassPricePerNight(nights: number): number {
  if (nights >= 28) return 25;
  return 29;
}

interface NestPassSimulatorProps {
  t: Translations;
}

export function NestPassSimulator({ t }: NestPassSimulatorProps) {
  const [nights, setNights] = useState(7);

  const pricePerNight = getPassPricePerNight(nights);
  const withPass = nights * pricePerNight;
  const standard = nights * STANDARD_PRICE_PER_NIGHT;
  const savings = standard - withPass;

  const decrement = () => setNights((n) => Math.max(7, n - 1));
  const increment = () => setNights((n) => Math.min(60, n + 1));

  return (
    <div className="bg-muted/50 rounded-xl p-4 space-y-4">
      <p className="text-sm font-medium text-muted-foreground">{t.nestPassSimulator.description}</p>

      {/* Night selector */}
      <div className="flex items-center justify-center gap-4">
        <button
          onClick={decrement}
          disabled={nights <= 7}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted active:scale-95 transition-all disabled:opacity-40"
        >
          <Minus className="w-4 h-4" />
        </button>
        <div className="text-center min-w-[80px]">
          <span className="text-3xl font-bold text-foreground">{nights}</span>
          <p className="text-xs text-muted-foreground">{t.nestPassSimulator.nights}</p>
        </div>
        <button
          onClick={increment}
          disabled={nights >= 30}
          className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center hover:bg-muted active:scale-95 transition-all disabled:opacity-40"
        >
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* Tier badge */}
      <div className="flex justify-center">
        <span className={`text-xs font-bold px-3 py-1 rounded-full ${nights >= 28 ? "bg-accent text-accent-foreground" : "bg-primary/10 text-primary"}`}>
          {nights >= 28 ? "🔥 Long Stay — €25/night" : "€29/night"}
        </span>
      </div>

      {/* Price breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">{t.nestPassSimulator.standardPrice}</span>
          <span className="text-sm line-through text-muted-foreground">€{standard}</span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-foreground">{t.nestPassSimulator.withPass}</span>
          <div className="text-right">
            <span className="text-sm font-bold text-primary">€{withPass}</span>
            <span className="text-xs text-muted-foreground ml-1">(€{pricePerNight}/noche)</span>
          </div>
        </div>
        <div className="flex justify-between items-center border-t border-border pt-2">
          <span className="text-sm font-bold text-foreground">{t.nestPassSimulator.youSave}</span>
          <span className="text-base font-extrabold text-accent">€{savings} 🎉</span>
        </div>
      </div>
    </div>
  );
}
