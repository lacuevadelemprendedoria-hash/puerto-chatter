import { Translations } from "@/lib/i18n";

interface NestPassSimulatorProps {
  t: Translations;
  onOpenChat: (query?: string) => void;
  onClose: () => void;
}

const otherNests = [
  { name: "Las Eras Nest", city: "Güímar, Tenerife", emoji: "🌋" },
  { name: "Duque Nest", city: "Costa Adeje, Tenerife", emoji: "🏖️" },
  { name: "El Médano Nest", city: "El Médano, Tenerife", emoji: "🪁" },
  { name: "Gran Canaria Nest", city: "Las Palmas, Gran Canaria", emoji: "🌊" },
];

export function NestPassSimulator({ t, onOpenChat, onClose }: NestPassSimulatorProps) {
  return (
    <div className="animate-fade-in space-y-4">
      <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
        <p className="text-sm text-foreground leading-relaxed">{t.nestPassSimulator.description}</p>
      </div>

      <div className="space-y-2">
        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">
          Nest Hostels network
        </p>
        {otherNests.map((nest) => (
          <div key={nest.name} className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
            <span className="text-xl">{nest.emoji}</span>
            <div>
              <p className="font-semibold text-sm text-foreground">{nest.name}</p>
              <p className="text-xs text-muted-foreground">{nest.city}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={() => {
          onClose();
          onOpenChat("Tell me about the Nest Pass discount for staying at multiple hostels");
        }}
        className="w-full py-3 px-4 rounded-2xl bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        {t.nestPassSimulator.cta}
      </button>
    </div>
  );
}
