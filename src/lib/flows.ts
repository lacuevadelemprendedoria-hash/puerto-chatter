export type FlowId = "planDay" | "hostelInfo" | "events" | "transport" | "eatOut" | "needHelp";

export interface FlowOption {
  label: string;
  value: string;
}

export interface FlowStepDefinition {
  question: string;
  options: FlowOption[];
}

export interface ResultItem {
  icon: string;
  title: string;
  desc: string;
  action: string;
}

// Maps user selections to result keys
export function getResultKey(flowId: FlowId, selections: Record<string, string>): string {
  switch (flowId) {
    case "planDay": {
      const mood = selections["step1"] || "relax";
      const time = selections["step2"] || "2h";
      return `${mood}_${time}`;
    }
    case "hostelInfo": {
      return selections["step1"] || "check_in_out";
    }
    case "transport": {
      const destination = selections["step1"] || "santa_cruz";
      const mode = selections["step2"] || "bus";
      // Map destination + mode to result key
      if (destination === "airport") return `airport_${mode}`;
      if (destination === "santa_cruz") return `santa_cruz_${mode}`;
      if (destination === "beaches") return `beaches_${mode}`;
      return `santa_cruz_bus`;
    }
    case "eatOut": {
      const type = selections["step1"] || "dinner";
      const distance = selections["step2"] || "5min";
      return `${type}_${distance}`;
    }
    case "needHelp": {
      return selections["step1"] || "staff";
    }
    default:
      return "";
  }
}

// Maps hostelInfo category to chat query
export function getCategoryQuery(category: string, language: "en" | "es"): string {
  const queries: Record<string, { en: string; es: string }> = {
    check_in_out: {
      en: "What are the check-in and check-out times and procedures?",
      es: "¿Cuáles son los horarios y procedimientos de check-in y check-out?",
    },
    house_rules: {
      en: "What are the house rules?",
      es: "¿Cuáles son las reglas de la casa?",
    },
    wifi: {
      en: "What is the WiFi password and how do I connect?",
      es: "¿Cuál es la contraseña del WiFi y cómo me conecto?",
    },
    kitchen: {
      en: "How can I use the kitchen? What facilities are available?",
      es: "¿Cómo puedo usar la cocina? ¿Qué instalaciones hay disponibles?",
    },
    laundry: {
      en: "How can I do my laundry? What are the costs?",
      es: "¿Cómo puedo hacer la colada? ¿Cuáles son los precios?",
    },
  };
  return queries[category]?.[language] || queries["check_in_out"][language];
}
