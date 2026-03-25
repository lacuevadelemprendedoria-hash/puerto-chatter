import { useState } from "react";
import { ChevronLeft, X, MessageCircle } from "lucide-react";
import { Drawer, DrawerContent } from "@/components/ui/drawer";
import { FlowId, getResultKey, getCategoryQuery } from "@/lib/flows";
import { Translations, Language } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface ResultItem {
  icon: string;
  title: string;
  desc: string;
  action: string;
}

type FlowOption = {
  readonly label: string;
  readonly value: string;
};

type FlowStep = {
  readonly question: string;
  readonly options: readonly FlowOption[];
};

interface GuidedFlowProps {
  open: boolean;
  flowId: FlowId | null;
  language: Language;
  t: Translations;
  onClose: () => void;
  onOpenChat: (query?: string) => void;
}

function getSteps(flowId: FlowId, t: Translations): readonly FlowStep[] {
  switch (flowId) {
    case "planDay":
      return [t.flows.planDay.step1, t.flows.planDay.step2];
    case "hostelInfo":
      return [t.flows.hostelInfo.step1];
    case "transport":
      return [t.flows.transport.step1, t.flows.transport.step2];
    case "eatOut":
      return [t.flows.eatOut.step1, t.flows.eatOut.step2];
    case "needHelp":
      return [t.flows.needHelp.step1];
    case "events":
      return [];
    default:
      return [];
  }
}

function getTitle(flowId: FlowId, t: Translations): string {
  switch (flowId) {
    case "planDay": return t.flows.planDay.title;
    case "hostelInfo": return t.flows.hostelInfo.title;
    case "events": return t.flows.events.title;
    case "transport": return t.flows.transport.title;
    case "eatOut": return t.flows.eatOut.title;
    case "needHelp": return t.flows.needHelp.title;
    default: return "";
  }
}

export function GuidedFlow({ open, flowId, language, t, onClose, onOpenChat }: GuidedFlowProps) {
  const [step, setStep] = useState(0);
  const [selections, setSelections] = useState<Record<string, string>>({});
  const [showResults, setShowResults] = useState(false);

  const handleClose = () => {
    setStep(0);
    setSelections({});
    setShowResults(false);
    onClose();
  };

  const handleSelect = (value: string) => {
    const newSelections = { ...selections, [`step${step + 1}`]: value };
    setSelections(newSelections);

    if (!flowId) return;

    // hostelInfo goes directly to chat
    if (flowId === "hostelInfo") {
      const query = getCategoryQuery(value, language as "en" | "es");
      handleClose();
      onOpenChat(query);
      return;
    }

    const steps = getSteps(flowId, t);
    if (step + 1 < steps.length) {
      setStep(step + 1);
    } else {
      setShowResults(true);
    }
  };

  const handleBack = () => {
    if (showResults) {
      setShowResults(false);
    } else if (step > 0) {
      setStep(step - 1);
    } else {
      handleClose();
    }
  };

  if (!flowId) return null;

  const steps = getSteps(flowId, t);
  const title = getTitle(flowId, t);
  const currentStep = steps[step];

  // Get results from translations
  let results: ResultItem[] = [];
  if (showResults) {
    const key = getResultKey(flowId, selections);
    const allResults = t.results as unknown as Record<string, ResultItem[]>;
    results = allResults[key] || [];
  }

  const isEventsFlow = flowId === "events";

  return (
    <Drawer open={open} onOpenChange={(o) => !o && handleClose()}>
      <DrawerContent className="max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center gap-3 px-4 py-4 border-b border-border shrink-0">
          <button
            onClick={handleBack}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <ChevronLeft className="w-5 h-5 text-muted-foreground" />
          </button>
          <h2 className="flex-1 font-bold text-lg text-foreground">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-xl hover:bg-muted transition-colors"
          >
            <X className="w-5 h-5 text-muted-foreground" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-4 py-5">
          {isEventsFlow ? (
            <EventsContent t={t} language={language} onOpenChat={onOpenChat} onClose={handleClose} />
          ) : showResults ? (
            <ResultsContent
              results={results}
              t={t}
              onOpenChat={onOpenChat}
              onClose={handleClose}
              language={language}
            />
          ) : currentStep ? (
            <StepContent
              step={currentStep}
              onSelect={handleSelect}
              stepIndex={step}
              totalSteps={steps.length}
            />
          ) : null}
        </div>
      </DrawerContent>
    </Drawer>
  );
}

function StepContent({
  step,
  onSelect,
  stepIndex,
  totalSteps,
}: {
  step: FlowStep;
  onSelect: (value: string) => void;
  stepIndex: number;
  totalSteps: number;
}) {
  return (
    <div className="animate-fade-in">
      {totalSteps > 1 && (
        <div className="flex gap-1.5 mb-4">
          {Array.from({ length: totalSteps }).map((_, i) => (
            <div
              key={i}
              className={cn(
                "h-1 rounded-full flex-1 transition-colors",
                i <= stepIndex ? "bg-primary" : "bg-muted"
              )}
            />
          ))}
        </div>
      )}
      <p className="text-xl font-bold text-foreground mb-5">{step.question}</p>
      <div className="grid grid-cols-2 gap-3">
        {step.options.map((opt) => {
          const parts = opt.label.split(" ");
          const emoji = parts[0];
          const text = parts.slice(1).join(" ");
          return (
            <button
              key={opt.value}
              onClick={() => onSelect(opt.value)}
              className={cn(
                "flex flex-col items-start gap-1 p-4 rounded-2xl border-2 border-border bg-card",
                "hover:border-primary hover:bg-primary/5 active:scale-95",
                "transition-all duration-150 text-left"
              )}
            >
              <span className="text-2xl">{emoji}</span>
              <span className="text-sm font-semibold text-foreground leading-tight">
                {text}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

function ResultsContent({
  results,
  t,
  onOpenChat,
  onClose,
  language,
}: {
  results: ResultItem[];
  t: Translations;
  onOpenChat: (query?: string) => void;
  onClose: () => void;
  language: Language;
}) {
  const handleCardAction = (action: string, title: string) => {
    if (action.toLowerCase().includes("chat") || action.toLowerCase().includes("abrir")) {
      onClose();
      onOpenChat();
      return;
    }
    // "Book now" / "Reservar" — open chat with booking query
    if (action.toLowerCase().includes("book") || action.toLowerCase() === "reservar") {
      const query = language === "en"
        ? `I want to join the "${title}" experience, how do I book?`
        : `Quiero unirme a la experiencia "${title}", ¿cómo reservo?`;
      onClose();
      onOpenChat(query);
      return;
    }
    const query = language === "en"
      ? `Tell me more about "${title}"`
      : `Cuéntame más sobre "${title}"`;
    onClose();
    onOpenChat(query);
  };

  return (
    <div className="animate-fade-in space-y-3">
      <p className="text-sm font-medium text-muted-foreground mb-2">
        ✨ {language === "en" ? "Here are our suggestions:" : "Aquí tienes nuestras sugerencias:"}
      </p>
      {results.map((item, i) => (
        <div key={i} className="bg-card border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-start gap-3">
            <span className="text-2xl shrink-0">{item.icon}</span>
            <div className="flex-1 min-w-0">
              <h3 className="font-bold text-foreground">{item.title}</h3>
              <p className="text-sm text-muted-foreground mt-0.5">{item.desc}</p>
            </div>
          </div>
          <button
            onClick={() => handleCardAction(item.action, item.title)}
            className="mt-3 w-full py-2 px-4 rounded-xl bg-primary/10 text-primary font-semibold text-sm hover:bg-primary/20 active:bg-primary/30 transition-colors"
          >
            {item.action}
          </button>
        </div>
      ))}

      <button
        onClick={() => { onClose(); onOpenChat(); }}
        className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-2xl border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary transition-colors mt-2"
      >
        <MessageCircle className="w-4 h-4" />
        <span className="text-sm font-medium">{t.common.askAssistant}</span>
      </button>
    </div>
  );
}

function EventsContent({
  t,
  language,
  onOpenChat,
  onClose,
}: {
  t: Translations;
  language: Language;
  onOpenChat: (query?: string) => void;
  onClose: () => void;
}) {
  return (
    <div className="animate-fade-in space-y-3">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
        <span className="text-4xl mb-3 block">📋</span>
        <h3 className="font-bold text-foreground text-lg">
          {language === "es" ? "Mira la pizarra de recepción" : "Check the reception board"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {language === "es"
            ? "Los eventos y actividades de hoy están en la pizarra de recepción."
            : "Today's events and activities are on the reception board."}
        </p>
      </div>
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm text-center">
        <span className="text-4xl mb-3 block">📲</span>
        <h3 className="font-bold text-foreground text-lg">
          {language === "es" ? "Escanea el código QR" : "Scan the QR code"}
        </h3>
        <p className="text-sm text-muted-foreground mt-2">
          {language === "es"
            ? "Escanea el QR en recepción para ver las actividades de Puerto Nest, las Nest Experiences y eventos en otros hosteles de Nest."
            : "Scan the QR at reception to see Puerto Nest activities, Nest Experiences, and events at other Nest hostels."}
        </p>
      </div>
    </div>
  );
}
