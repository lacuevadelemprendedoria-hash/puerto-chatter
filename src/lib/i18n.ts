export type Language = "en" | "es";

export const translations = {
  en: {
    welcome: {
      title: "Puerto Nest Assistant",
      subtitle: "Your virtual hostel assistant",
      description: "Ask me anything about the hostel, WiFi, check-in, excursions and more",
    },
    greeting: {
      morning: "Good morning",
      afternoon: "Good afternoon",
      evening: "Good evening",
    },
    statusPanel: {
      weather: "22°C · Sunny",
      eventToday: "Carnival Week 🎭",
      quickHelp: "Quick Help",
      nightsLeft: (n: number) => n === 1 ? "1 night left" : `${n} nights left`,
    },
    quickActions: {
      planDay: "Plan My Day",
      hostelInfo: "Hostel Info",
      eventsToday: "Events Today",
      transport: "Transport",
      eatOut: "Eat & Go Out",
      needHelp: "I Need Help",
    },
    feed: {
      title: "Today at the Hostel",
      carnival: {
        title: "🎭 Carnival 2025",
        subtitle: "Santa Cruz & Puerto de la Cruz",
        preview: "Two great carnivals happening now",
        santaCruz: "🎭🎉 Santa Cruz de Tenerife",
        santaCruzDesc: "The biggest carnival in Spain — parades, costumes, and street parties every night.",
        puertoCruz: "🎭🎉 Puerto de la Cruz",
        puertoCruzDesc: "Charming local carnival with traditional music, rondallas, and neighborhood celebrations.",
        shuttle: "Shuttle to Santa Cruz",
        moreInfo: "More Info",
      },
      nestPass: {
        title: "🏷️ Nest Pass",
        subtitle: "Save up to 30%",
        preview: "Stay across multiple Nest Hostels",
        description: "Move between Nest Hostels in Tenerife and Gran Canaria at a special price. Minimum 7 nights.",
        simulate: "Calculate My Savings",
        learnMore: "Learn More",
      },
      hostelToday: {
        title: "🏠 Hostel Today",
        subtitle: "Activities & info",
        preview: "See what's on today",
      },
      eatRecommended: {
        title: "🍽️ Where to Eat",
        subtitle: "Staff picks nearby",
        preview: "Our favorite spots",
      },
    },
    flows: {
      planDay: {
        title: "Plan My Day",
        step1: {
          question: "What are you in the mood for?",
          options: [
            { label: "🌴 Relax", value: "relax" },
            { label: "🏔️ Nature", value: "nature" },
            { label: "🎉 Social", value: "social" },
            { label: "🗺️ Explore", value: "explore" },
            { label: "🧗 Nest Experiences", value: "nest" },
          ],
        },
        step2: {
          question: "How much time do you have?",
          options: [
            { label: "⚡ 2 hours", value: "2h" },
            { label: "🌅 Half day", value: "half" },
            { label: "☀️ Full day", value: "full" },
          ],
        },
      },
      hostelInfo: {
        title: "Hostel Info",
        step1: {
          question: "What do you need?",
          options: [
            { label: "🕐 Check-in / Check-out", value: "check_in_out" },
            { label: "📋 House Rules", value: "house_rules" },
            { label: "📶 WiFi", value: "wifi" },
            { label: "🍳 Kitchen", value: "kitchen" },
            { label: "👕 Laundry", value: "laundry" },
          ],
        },
      },
      events: {
        title: "Events Today",
      },
      transport: {
        title: "Transport",
        step1: {
          question: "Where do you want to go?",
          options: [
            { label: "✈️ Airport (TFN/TFS)", value: "airport" },
            { label: "🌆 Santa Cruz", value: "santa_cruz" },
            { label: "🏖️ Beaches", value: "beaches" },
          ],
        },
        step2: {
          question: "How do you prefer to travel?",
          options: [
            { label: "🚌 Bus", value: "bus" },
            { label: "🚕 Taxi / Uber", value: "taxi" },
          ],
        },
      },
      eatOut: {
        title: "Eat & Go Out",
        step1: {
          question: "What are you looking for?",
          options: [
            { label: "🍽️ Sit-down dinner", value: "dinner" },
            { label: "🍕 Quick & casual", value: "casual" },
            { label: "🍺 Drinks & bar", value: "bar" },
            { label: "🌅 Breakfast / Brunch", value: "breakfast" },
          ],
        },
        step2: {
          question: "How far are you willing to walk?",
          options: [
            { label: "🚶 5 min", value: "5min" },
            { label: "🚶‍♂️ 15 min", value: "15min" },
            { label: "🚌 Take a bus", value: "bus" },
          ],
        },
      },
      needHelp: {
        title: "I Need Help",
        step1: {
          question: "What do you need help with?",
          options: [
            { label: "🔑 Lost key / room access", value: "key" },
            { label: "🏥 Medical / Emergency", value: "medical" },
            { label: "💼 Luggage storage", value: "luggage" },
            { label: "🔇 Noise complaint", value: "noise" },
            { label: "💬 Speak to staff", value: "staff" },
          ],
        },
      },
    },
    nestPassSimulator: {
      title: "Nest Pass Savings Calculator",
      description: "How many nights are you planning to stay across Nest Hostels?",
      nights: "Nights",
      standardPrice: "Standard price",
      withPass: "With Nest Pass",
      youSave: "You save",
      cta: "Ask about Nest Pass",
    },
    results: {
      relax_2h: [
        { icon: "🌊", title: "Playa Jardín", desc: "5 min walk · Black sand volcanic beach", action: "Ask assistant" },
        { icon: "☕", title: "Cafés in La Ranilla", desc: "10 min walk · Local coffee spots in the old town", action: "Ask assistant" },
      ],
      relax_half: [
        { icon: "🌊", title: "Playa Jardín", desc: "5 min walk · Relax all morning", action: "Ask assistant" },
        { icon: "🌿", title: "Jardín Botánico", desc: "15 min bus · Beautiful gardens", action: "Ask assistant" },
        { icon: "☕", title: "La Ranilla Quarter", desc: "Explore the old town at your pace", action: "Ask assistant" },
      ],
      relax_full: [
        { icon: "🌊", title: "Playa Jardín", desc: "Morning swim", action: "Ask assistant" },
        { icon: "🌿", title: "Jardín Botánico", desc: "Afternoon stroll", action: "Ask assistant" },
        { icon: "🌅", title: "Sunset at the pier", desc: "Evening walk along the waterfront", action: "Ask assistant" },
      ],
      nature_2h: [
        { icon: "🌊", title: "Playa Bollullo", desc: "30 min bus · Secluded natural beach", action: "Ask assistant" },
        { icon: "🦎", title: "Coastal trail", desc: "Walk along the volcanic coastline", action: "Ask assistant" },
      ],
      nature_half: [
        { icon: "🏔️", title: "La Orotava Valley", desc: "45 min bus · Stunning views", action: "Ask assistant" },
        { icon: "🌲", title: "Corona Forestal", desc: "Laurel forest hiking", action: "Ask assistant" },
      ],
      nature_full: [
        { icon: "🌋", title: "Mount Teide", desc: "Full day trip · Cable car ticket required — ask us for details", action: "Ask assistant" },
        { icon: "🐋", title: "Whale watching", desc: "South coast · Afternoon tours available — ask us how to get there", action: "Ask assistant" },
      ],
      social_2h: [
        { icon: "🎭", title: "Carnival at the Plaza", desc: "Start at Plaza del Charco", action: "Ask assistant" },
        { icon: "🍻", title: "Bars in La Ranilla", desc: "Old town · Lively atmosphere in the evenings", action: "Ask assistant" },
      ],
      social_half: [
        { icon: "🎭", title: "Carnival Parade", desc: "Rúa parade route · Ask us for today's schedule", action: "Ask assistant" },
        { icon: "🍻", title: "Bars in La Ranilla", desc: "Best bars in the old town", action: "Ask assistant" },
      ],
      social_full: [
        { icon: "🎭", title: "Santa Cruz Carnival", desc: "Full day trip · Best carnival in Spain", action: "Ask assistant" },
        { icon: "🍻", title: "Bars in La Ranilla", desc: "Lively evening scene in the old town", action: "Ask assistant" },
      ],
      explore_2h: [
        { icon: "🏘️", title: "La Ranilla", desc: "Old town quarter · 10 min walk", action: "Ask assistant" },
        { icon: "🖼️", title: "Plaza del Charco", desc: "Main square & harbor", action: "Ask assistant" },
      ],
      explore_half: [
        { icon: "🏘️", title: "Puerto de la Cruz old town", desc: "La Ranilla, markets, churches", action: "Ask assistant" },
        { icon: "🌺", title: "Loro Parque", desc: "Famous animal & plant park — ask us for directions", action: "Ask assistant" },
      ],
      explore_full: [
        { icon: "🌺", title: "Loro Parque", desc: "Famous animal & plant park — ask us for directions", action: "Ask assistant" },
        { icon: "🏘️", title: "La Orotava", desc: "Nearby historic town", action: "Ask assistant" },
        { icon: "🌊", title: "Los Gigantes cliffs", desc: "Dramatic cliffs — ask us how to get there", action: "Ask assistant" },
      ],
      nest_2h: [
        { icon: "🧗", title: "Rock Climbing", desc: "No experience needed · Contact +34613356187 to book", action: "Book now" },
      ],
      nest_half: [
        { icon: "🧗", title: "Rock Climbing", desc: "No experience needed · Contact +34613356187 to book", action: "Book now" },
        { icon: "🌊", title: "Malpaís de Güímar", desc: "Volcanic lava fields · Half day · 20€ · Pickup from Las Eras · Contact Alessio +393391886061", action: "Book now" },
      ],
      nest_full: [
        { icon: "🌌", title: "Stargazing on Teide", desc: "One of the world's best stargazing spots · Souvenir photo included · Pickup: Ashavana, Medano, Los Amigos, Duque Nest · Contact Claudio +393294096754", action: "Book now" },
        { icon: "🌋", title: "Teide National Park", desc: "Every Wednesday · See the real volcano that built Tenerife · Canarian coffee, hiking & 2000m sunset · Free pickup at the hostel · Contact Claudio +393294096754", action: "Book now" },
        { icon: "🌿", title: "Anaga Full Day", desc: "Guided hike through laurel forest & ocean viewpoints · Easy/medium · Pickup included · Contact Alessio +393391886061", action: "Book now" },
        { icon: "🌊", title: "Malpaís de Güímar", desc: "Volcanic cones & lava fields where lava meets the ocean · Half day · 20€ · Pickup from Las Eras · Contact Alessio +393391886061", action: "Book now" },
        { icon: "🧗", title: "Rock Climbing", desc: "No experience needed · Contact +34613356187 to book", action: "Book now" },
      ],
      airport_bus: [
        { icon: "🚌", title: "Bus 343 to TFS", desc: "From Intercambiador · ~2h · ~€15", action: "Ask assistant" },
        { icon: "🚌", title: "Bus 102 to TFN", desc: "Via Santa Cruz · ~1.5h · ~€9", action: "Ask assistant" },
      ],
      airport_taxi: [
        { icon: "🚕", title: "Taxi to TFS", desc: "~45 min · ~€60-80 · Book in advance", action: "Ask assistant" },
        { icon: "🚕", title: "Taxi to TFN", desc: "~35 min · ~€35-45", action: "Ask assistant" },
      ],
      santa_cruz_bus: [
        { icon: "🚌", title: "Bus 101/103", desc: "From Intercambiador · Every 30 min · ~€4", action: "Ask assistant" },
      ],
      santa_cruz_taxi: [
        { icon: "🚕", title: "Taxi to Santa Cruz", desc: "~30 min · ~€25-35", action: "Ask assistant" },
      ],
      beaches_bus: [
        { icon: "🚌", title: "Bus to Playa Bollullo", desc: "Bus 101 + 10 min walk · ~€2", action: "Ask assistant" },
        { icon: "🚌", title: "Bus to Los Teresitas", desc: "Via Santa Cruz · ~€4", action: "Ask assistant" },
      ],
      dinner_5min: [
        { icon: "🍽️", title: "Canarian tapas nearby", desc: "Traditional local cuisine · short walk", action: "Ask assistant" },
        { icon: "🍽️", title: "Casual dining options", desc: "Several spots within 5 min · Ask us for current picks", action: "Ask assistant" },
      ],
      dinner_15min: [
        { icon: "🍽️", title: "Restaurants in La Ranilla", desc: "Historic quarter · variety of cuisines", action: "Ask assistant" },
        { icon: "🐟", title: "Fresh fish & seafood", desc: "Local catch · Ask reception for today's recommendations", action: "Ask assistant" },
      ],
      casual_5min: [
        { icon: "🍕", title: "Quick bites nearby", desc: "Sandwiches, bocadillos & casual meals · 5 min walk", action: "Ask assistant" },
      ],
      bar_5min: [
        { icon: "🍺", title: "Bars around the plaza", desc: "Local spots for drinks · lively atmosphere", action: "Ask assistant" },
        { icon: "🍹", title: "Cocktail bars nearby", desc: "Ask us for current staff recommendations", action: "Ask assistant" },
      ],
      breakfast_5min: [
        { icon: "☕", title: "Local cafés nearby", desc: "Coffee & breakfast · several options within 5 min", action: "Ask assistant" },
      ],
      key: [
        { icon: "🔑", title: "Contact reception", desc: "We'll sort it immediately", action: "Call now" },
        { icon: "📍", title: "Reception desk", desc: "Ground floor · 24h service", action: "Map" },
      ],
      medical: [
        { icon: "🏥", title: "Hospital Universitario", desc: "Closest emergency · 10 min taxi", action: "Call taxi" },
        { icon: "💊", title: "Farmacia Central", desc: "5 min walk · Until 22:00", action: "Location" },
        { icon: "🚨", title: "Emergency: 112", desc: "Spain emergency number", action: "Call 112" },
      ],
      luggage: [
        { icon: "💼", title: "Luggage storage", desc: "Leave bags at reception · Free", action: "Confirm with staff" },
      ],
      noise: [
        { icon: "🔇", title: "Quiet hours", desc: "22:00–08:00 · Please keep noise down", action: "Understood" },
        { icon: "📞", title: "Report to reception", desc: "We'll handle it", action: "Call reception" },
      ],
      staff: [
        { icon: "📞", title: "Call reception", desc: "Available 24/7", action: "Call now" },
        { icon: "💬", title: "Chat with us", desc: "Use the chat button", action: "Open chat" },
      ],
    },
    chat: {
      placeholder: "Type your question...",
      send: "Send",
      typing: "Thinking...",
      title: "Chat with Reception",
      open: "Chat",
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
    common: {
      back: "Back",
      close: "Close",
      moreInfo: "More Info",
      getDirections: "Get Directions",
      save: "Save",
      askAssistant: "Ask Assistant",
    },
  },
  es: {
    welcome: {
      title: "Puerto Nest Assistant",
      subtitle: "Tu asistente virtual del hostel",
      description: "Pregúntame sobre el hostel, WiFi, check-in, excursiones y más",
    },
    greeting: {
      morning: "Buenos días",
      afternoon: "Buenas tardes",
      evening: "Buenas noches",
    },
    statusPanel: {
      weather: "22°C · Soleado",
      eventToday: "Semana de Carnaval 🎭",
      quickHelp: "Ayuda Rápida",
      nightsLeft: (n: number) => n === 1 ? "1 noche restante" : `${n} noches restantes`,
    },
    quickActions: {
      planDay: "Planear mi Día",
      hostelInfo: "Info del Hostel",
      eventsToday: "Eventos Hoy",
      transport: "Transporte",
      eatOut: "Comer y Salir",
      needHelp: "Necesito Ayuda",
    },
    feed: {
      title: "Hoy en el Hostel",
      carnival: {
        title: "🎭 Carnaval 2025",
        subtitle: "Santa Cruz y Puerto de la Cruz",
        preview: "Dos grandes carnavales en marcha",
        santaCruz: "🎭🎉 Santa Cruz de Tenerife",
        santaCruzDesc: "El carnaval más grande de España — desfiles, disfraces y fiestas callejeras cada noche.",
        puertoCruz: "🎭🎉 Puerto de la Cruz",
        puertoCruzDesc: "Carnaval local encantador con música tradicional, rondallas y celebraciones de barrio.",
        shuttle: "Shuttle a Santa Cruz",
        moreInfo: "Más Info",
      },
      nestPass: {
        title: "🏷️ Nest Pass",
        subtitle: "Ahorra hasta un 30%",
        preview: "Quédate en varios Nest Hostels",
        description: "Muévete entre Nest Hostels en Tenerife y Gran Canaria a precio especial. Mínimo 7 noches.",
        simulate: "Calcular mi Ahorro",
        learnMore: "Saber Más",
      },
      hostelToday: {
        title: "🏠 Hostel Hoy",
        subtitle: "Actividades e info",
        preview: "Ver qué hay hoy",
      },
      eatRecommended: {
        title: "🍽️ Dónde Comer",
        subtitle: "Favoritos del equipo",
        preview: "Nuestros sitios favoritos",
      },
    },
    flows: {
      planDay: {
        title: "Planear mi Día",
        step1: {
          question: "¿Qué te apetece hoy?",
          options: [
            { label: "🌴 Relax", value: "relax" },
            { label: "🏔️ Naturaleza", value: "nature" },
            { label: "🎉 Social", value: "social" },
            { label: "🗺️ Explorar", value: "explore" },
            { label: "🧗 Nest Experiences", value: "nest" },
          ],
        },
        step2: {
          question: "¿Cuánto tiempo tienes?",
          options: [
            { label: "⚡ 2 horas", value: "2h" },
            { label: "🌅 Medio día", value: "half" },
            { label: "☀️ Día completo", value: "full" },
          ],
        },
      },
      hostelInfo: {
        title: "Info del Hostel",
        step1: {
          question: "¿Qué necesitas saber?",
          options: [
            { label: "🕐 Check-in / Check-out", value: "check_in_out" },
            { label: "📋 Reglas de la Casa", value: "house_rules" },
            { label: "📶 WiFi", value: "wifi" },
            { label: "🍳 Cocina", value: "kitchen" },
            { label: "👕 Lavandería", value: "laundry" },
          ],
        },
      },
      events: {
        title: "Eventos Hoy",
      },
      transport: {
        title: "Transporte",
        step1: {
          question: "¿A dónde quieres ir?",
          options: [
            { label: "✈️ Aeropuerto (TFN/TFS)", value: "airport" },
            { label: "🌆 Santa Cruz", value: "santa_cruz" },
            { label: "🏖️ Playas", value: "beaches" },
          ],
        },
        step2: {
          question: "¿Cómo prefieres viajar?",
          options: [
            { label: "🚌 Bus", value: "bus" },
            { label: "🚕 Taxi / Uber", value: "taxi" },
          ],
        },
      },
      eatOut: {
        title: "Comer y Salir",
        step1: {
          question: "¿Qué estás buscando?",
          options: [
            { label: "🍽️ Cena sentado", value: "dinner" },
            { label: "🍕 Rápido y casual", value: "casual" },
            { label: "🍺 Bares y copas", value: "bar" },
            { label: "🌅 Desayuno / Brunch", value: "breakfast" },
          ],
        },
        step2: {
          question: "¿Cuánto estás dispuesto a caminar?",
          options: [
            { label: "🚶 5 min", value: "5min" },
            { label: "🚶‍♂️ 15 min", value: "15min" },
            { label: "🚌 Coger bus", value: "bus" },
          ],
        },
      },
      needHelp: {
        title: "Necesito Ayuda",
        step1: {
          question: "¿Con qué necesitas ayuda?",
          options: [
            { label: "🔑 Llave perdida / acceso", value: "key" },
            { label: "🏥 Médico / Emergencia", value: "medical" },
            { label: "💼 Guardar equipaje", value: "luggage" },
            { label: "🔇 Queja de ruido", value: "noise" },
            { label: "💬 Hablar con recepción", value: "staff" },
          ],
        },
      },
    },
    nestPassSimulator: {
      title: "Calculadora de Ahorro Nest Pass",
      description: "¿Cuántas noches planeas quedarte en los Nest Hostels?",
      nights: "Noches",
      standardPrice: "Precio estándar",
      withPass: "Con Nest Pass",
      youSave: "Ahorras",
      cta: "Preguntar sobre el Nest Pass",
    },
    results: {
      relax_2h: [
        { icon: "🌊", title: "Playa Jardín", desc: "5 min andando · Playa de arena negra volcánica", action: "Preguntar al asistente" },
        { icon: "☕", title: "Cafés en La Ranilla", desc: "10 min andando · Cafeterías locales en el casco viejo", action: "Preguntar al asistente" },
      ],
      relax_half: [
        { icon: "🌊", title: "Playa Jardín", desc: "5 min andando · Relax toda la mañana", action: "Preguntar al asistente" },
        { icon: "🌿", title: "Jardín Botánico", desc: "15 min en bus · Jardines preciosos", action: "Preguntar al asistente" },
        { icon: "☕", title: "Barrio La Ranilla", desc: "Explora el casco viejo a tu ritmo", action: "Preguntar al asistente" },
      ],
      relax_full: [
        { icon: "🌊", title: "Playa Jardín", desc: "Baño por la mañana", action: "Preguntar al asistente" },
        { icon: "🌿", title: "Jardín Botánico", desc: "Paseo por la tarde", action: "Preguntar al asistente" },
        { icon: "🌅", title: "Atardecer en el muelle", desc: "Paseo al atardecer por el paseo marítimo", action: "Preguntar al asistente" },
      ],
      nature_2h: [
        { icon: "🌊", title: "Playa Bollullo", desc: "30 min en bus · Playa natural apartada", action: "Preguntar al asistente" },
        { icon: "🦎", title: "Sendero costero", desc: "Paseo por la costa volcánica", action: "Preguntar al asistente" },
      ],
      nature_half: [
        { icon: "🏔️", title: "Valle de La Orotava", desc: "45 min en bus · Vistas espectaculares", action: "Preguntar al asistente" },
        { icon: "🌲", title: "Corona Forestal", desc: "Senderismo en laurisilva", action: "Preguntar al asistente" },
      ],
      nature_full: [
        { icon: "🌋", title: "El Teide", desc: "Excursión de día completo · Se necesita entrada para el teleférico — pregúntanos", action: "Preguntar al asistente" },
        { icon: "🐋", title: "Avistamiento de ballenas", desc: "Costa sur · Tours disponibles por la tarde — pregúntanos cómo llegar", action: "Preguntar al asistente" },
      ],
      social_2h: [
        { icon: "🎭", title: "Carnaval en la plaza", desc: "Empieza en la Plaza del Charco", action: "Preguntar al asistente" },
        { icon: "🍻", title: "Bares de La Ranilla", desc: "Casco viejo · Ambiente animado por las noches", action: "Preguntar al asistente" },
      ],
      social_half: [
        { icon: "🎭", title: "Desfile de Carnaval", desc: "Ruta de la Rúa · Pregúntanos el horario de hoy", action: "Preguntar al asistente" },
        { icon: "🍻", title: "Bares de La Ranilla", desc: "Los mejores bares del casco viejo", action: "Preguntar al asistente" },
      ],
      social_full: [
        { icon: "🎭", title: "Carnaval de Santa Cruz", desc: "Excursión de día · El mejor carnaval de España", action: "Preguntar al asistente" },
        { icon: "🍻", title: "Bares de La Ranilla", desc: "Ambiente animado por las noches en el casco viejo", action: "Preguntar al asistente" },
      ],
      explore_2h: [
        { icon: "🏘️", title: "La Ranilla", desc: "Barrio histórico · 10 min andando", action: "Preguntar al asistente" },
        { icon: "🖼️", title: "Plaza del Charco", desc: "Plaza principal y puerto", action: "Preguntar al asistente" },
      ],
      explore_half: [
        { icon: "🏘️", title: "Casco viejo de Puerto Cruz", desc: "La Ranilla, mercados, iglesias", action: "Preguntar al asistente" },
        { icon: "🌺", title: "Loro Parque", desc: "Parque de animales y plantas — pregúntanos cómo llegar", action: "Preguntar al asistente" },
      ],
      explore_full: [
        { icon: "🌺", title: "Loro Parque", desc: "Parque de animales y plantas — pregúntanos cómo llegar", action: "Preguntar al asistente" },
        { icon: "🏘️", title: "La Orotava", desc: "Pueblo histórico cercano", action: "Preguntar al asistente" },
        { icon: "🌊", title: "Acantilados de Los Gigantes", desc: "Acantilados dramáticos — pregúntanos cómo llegar", action: "Preguntar al asistente" },
      ],
      nest_2h: [
        { icon: "🧗", title: "Rock Climbing", desc: "Sin experiencia necesaria · Contacta +34613356187 para reservar", action: "Reservar" },
      ],
      nest_half: [
        { icon: "🧗", title: "Rock Climbing", desc: "Sin experiencia necesaria · Contacta +34613356187 para reservar", action: "Reservar" },
        { icon: "🌊", title: "Malpaís de Güímar", desc: "Campos de lava volcánica · Medio día · 20€ · Recogida desde Las Eras · Contacta Alessio +393391886061", action: "Reservar" },
      ],
      nest_full: [
        { icon: "🌌", title: "Stargazing en el Teide", desc: "Uno de los mejores cielos del mundo · Foto souvenir incluida · Recogida: Ashavana, Medano, Los Amigos, Duque Nest · Contacta Claudio +393294096754", action: "Reservar" },
        { icon: "🌋", title: "Parque Nacional del Teide", desc: "Cada miércoles · Descubre el volcán real que construyó Tenerife · Café canario, senderismo y atardecer a 2.000m · Recogida gratis en el hostel · Contacta Claudio +393294096754", action: "Reservar" },
        { icon: "🌿", title: "Anaga Día Completo", desc: "Senderismo guiado por laurisilva y miradores al océano · Fácil/media · Recogida incluida · Contacta Alessio +393391886061", action: "Reservar" },
        { icon: "🌊", title: "Malpaís de Güímar", desc: "Conos volcánicos donde la lava se encuentra con el mar · Medio día · 20€ · Recogida desde Las Eras · Contacta Alessio +393391886061", action: "Reservar" },
        { icon: "🧗", title: "Rock Climbing", desc: "Sin experiencia necesaria · Contacta +34613356187 para reservar", action: "Reservar" },
      ],
      airport_bus: [
        { icon: "🚌", title: "Bus 343 a TFS", desc: "Desde el Intercambiador · ~2h · ~€15", action: "Preguntar al asistente" },
        { icon: "🚌", title: "Bus 102 a TFN", desc: "Por Santa Cruz · ~1.5h · ~€9", action: "Preguntar al asistente" },
      ],
      airport_taxi: [
        { icon: "🚕", title: "Taxi a TFS", desc: "~45 min · ~€60-80 · Reservar con antelación", action: "Preguntar al asistente" },
        { icon: "🚕", title: "Taxi a TFN", desc: "~35 min · ~€35-45", action: "Preguntar al asistente" },
      ],
      santa_cruz_bus: [
        { icon: "🚌", title: "Bus 101/103", desc: "Desde el Intercambiador · Cada 30 min · ~€4", action: "Preguntar al asistente" },
      ],
      santa_cruz_taxi: [
        { icon: "🚕", title: "Taxi a Santa Cruz", desc: "~30 min · ~€25-35", action: "Preguntar al asistente" },
      ],
      beaches_bus: [
        { icon: "🚌", title: "Bus a Playa Bollullo", desc: "Bus 101 + 10 min andando · ~€2", action: "Preguntar al asistente" },
        { icon: "🚌", title: "Bus a Los Teresitas", desc: "Por Santa Cruz · ~€4", action: "Preguntar al asistente" },
      ],
      dinner_5min: [
        { icon: "🍽️", title: "Tapas canarias cerca", desc: "Cocina local tradicional · varios sitios a poca distancia", action: "Preguntar al asistente" },
        { icon: "🍽️", title: "Opciones de cena cercanas", desc: "Varios restaurantes a 5 min · Pregunta en recepción por los favoritos de hoy", action: "Preguntar al asistente" },
      ],
      dinner_15min: [
        { icon: "🍽️", title: "Restaurantes en La Ranilla", desc: "Barrio histórico · variedad de cocinas", action: "Preguntar al asistente" },
        { icon: "🐟", title: "Pescado y marisco fresco", desc: "Producto local · Pregunta en recepción por recomendaciones de hoy", action: "Preguntar al asistente" },
      ],
      casual_5min: [
        { icon: "🍕", title: "Comida rápida cerca", desc: "Bocadillos y comidas casuales · 5 min andando", action: "Preguntar al asistente" },
      ],
      bar_5min: [
        { icon: "🍺", title: "Bares alrededor de la plaza", desc: "Sitios locales para tomar algo · buen ambiente", action: "Preguntar al asistente" },
        { icon: "🍹", title: "Bares de cócteles cerca", desc: "Pregunta a recepción por las recomendaciones actuales", action: "Preguntar al asistente" },
      ],
      breakfast_5min: [
        { icon: "☕", title: "Cafeterías locales cerca", desc: "Café y desayuno · varias opciones a 5 min andando", action: "Preguntar al asistente" },
      ],
      key: [
        { icon: "🔑", title: "Contactar recepción", desc: "Lo solucionamos enseguida", action: "Llamar ahora" },
        { icon: "📍", title: "Mostrador de recepción", desc: "Planta baja · Servicio 24h", action: "Mapa" },
      ],
      medical: [
        { icon: "🏥", title: "Hospital Universitario", desc: "Urgencias más cercanas · 10 min en taxi", action: "Llamar taxi" },
        { icon: "💊", title: "Farmacia Central", desc: "5 min andando · Hasta las 22:00", action: "Ubicación" },
        { icon: "🚨", title: "Emergencias: 112", desc: "Número de emergencias España", action: "Llamar 112" },
      ],
      luggage: [
        { icon: "💼", title: "Consigna de equipaje", desc: "Deja las maletas en recepción · Gratis", action: "Confirmar con staff" },
      ],
      noise: [
        { icon: "🔇", title: "Horario de silencio", desc: "22:00–08:00 · Por favor mantén el silencio", action: "Entendido" },
        { icon: "📞", title: "Avisar a recepción", desc: "Nos encargamos", action: "Llamar recepción" },
      ],
      staff: [
        { icon: "📞", title: "Llamar a recepción", desc: "Disponible 24/7", action: "Llamar ahora" },
        { icon: "💬", title: "Chatear con nosotros", desc: "Usa el botón de chat", action: "Abrir chat" },
      ],
    },
    chat: {
      placeholder: "Escribe tu pregunta...",
      send: "Enviar",
      typing: "Pensando...",
      title: "Chat con Recepción",
      open: "Chat",
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
    common: {
      back: "Atrás",
      close: "Cerrar",
      moreInfo: "Más Info",
      getDirections: "Cómo Llegar",
      save: "Guardar",
      askAssistant: "Preguntar al Asistente",
    },
  },
} as const;

export type Translations = typeof translations.en;

export function useTranslations(language: Language) {
  return translations[language] as unknown as Translations;
}
