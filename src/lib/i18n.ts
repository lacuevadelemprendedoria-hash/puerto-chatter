export type Language = "en" | "es";

export const translations = {
  en: {
    welcome: {
      title: "Puerto Nest Assistant",
      subtitle: "Your virtual hostel assistant",
      description: "Ask me anything about the hostel, WiFi, check-in, excursions and more",
    },
    actionCards: {
      nestPass: {
        title: "Nest Pass",
        description: "Move between Nest Hostels at a special price",
      },
      carnival: {
        title: "Carnival",
        description: "Festivities, parades, events",
      },
      hostelInfo: {
        title: "Hostel Info & Bookings",
        description: "Check-in, house rules, reservations",
      },
      excursions: {
        title: "Excursions & Things to Do",
        description: "Tours, beaches, activities",
      },
      transport: {
        title: "Transport",
        description: "Airports, buses, taxis",
      },
    },
    chat: {
      placeholder: "Type your question...",
      send: "Send",
      typing: "Thinking...",
    },
    suggestions: {
      title: "Quick questions:",
      items: [
        "What time is check-in?",
        "What's the WiFi password?",
        "Where can I eat nearby?",
        "Are there any excursions?",
      ],
    },
    language: {
      toggle: "Español",
      current: "EN",
    },
    admin: {
      login: "Staff Login",
      logout: "Logout",
      dashboard: "Dashboard",
      content: "Content",
      categories: {
        check_in_out: "Check-in & Check-out",
        house_rules: "House Rules",
        wifi: "WiFi",
        kitchen: "Kitchen",
        laundry: "Laundry",
        transport: "Transport",
        excursions: "Excursions",
        where_to_eat_go_out: "Where to Eat & Go Out",
      },
      addContent: "Add Content",
      editContent: "Edit Content",
      deleteContent: "Delete",
      save: "Save",
      cancel: "Cancel",
      title: "Title",
      contentLabel: "Content",
      noContent: "No content yet. Add your first entry!",
      confirmDelete: "Are you sure you want to delete this?",
      email: "Email",
      password: "Password",
      signIn: "Sign In",
      invalidCredentials: "Invalid email or password",
    },
    errors: {
      generic: "Something went wrong. Please try again.",
      network: "Unable to connect. Please check your connection.",
    },
  },
  es: {
    welcome: {
      title: "Puerto Nest Assistant",
      subtitle: "Tu asistente virtual del hostel",
      description: "Pregúntame sobre el hostel, WiFi, check-in, excursiones y más",
    },
    actionCards: {
      nestPass: {
        title: "Nest Pass",
        description: "Viaja entre Nest Hostels a precio especial",
      },
      carnival: {
        title: "Carnaval",
        description: "Fiestas, desfiles, eventos",
      },
      hostelInfo: {
        title: "Info del Hostel",
        description: "Check-in, reglas, reservas",
      },
      excursions: {
        title: "Excursiones y Actividades",
        description: "Tours, playas, actividades",
      },
      transport: {
        title: "Transporte",
        description: "Aeropuertos, buses, taxis",
      },
    },
    chat: {
      placeholder: "Escribe tu pregunta...",
      send: "Enviar",
      typing: "Pensando...",
    },
    suggestions: {
      title: "Preguntas rápidas:",
      items: [
        "¿A qué hora es el check-in?",
        "¿Cuál es la contraseña del WiFi?",
        "¿Dónde puedo comer cerca?",
        "¿Hay excursiones disponibles?",
      ],
    },
    language: {
      toggle: "English",
      current: "ES",
    },
    admin: {
      login: "Acceso Staff",
      logout: "Cerrar Sesión",
      dashboard: "Panel",
      content: "Contenido",
      categories: {
        check_in_out: "Check-in y Check-out",
        house_rules: "Reglas de la Casa",
        wifi: "WiFi",
        kitchen: "Cocina",
        laundry: "Lavandería",
        transport: "Transporte",
        excursions: "Excursiones",
        where_to_eat_go_out: "Dónde Comer y Salir",
      },
      addContent: "Agregar Contenido",
      editContent: "Editar Contenido",
      deleteContent: "Eliminar",
      save: "Guardar",
      cancel: "Cancelar",
      title: "Título",
      contentLabel: "Contenido",
      noContent: "Sin contenido aún. ¡Agrega tu primera entrada!",
      confirmDelete: "¿Estás seguro de que quieres eliminar esto?",
      email: "Correo electrónico",
      password: "Contraseña",
      signIn: "Iniciar Sesión",
      invalidCredentials: "Correo o contraseña inválidos",
    },
    errors: {
      generic: "Algo salió mal. Por favor, intenta de nuevo.",
      network: "No se puede conectar. Verifica tu conexión.",
    },
  },
} as const;

export function useTranslations(language: Language) {
  return translations[language];
}
