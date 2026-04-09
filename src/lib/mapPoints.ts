export type Category = "hostel" | "beach" | "culture" | "food" | "nature" | "activity";

export interface MapPoint {
  id: string;
  category: Category;
  emoji: string;
  name_en: string;
  name_es: string;
  desc_en: string;
  desc_es: string;
  lat: number;
  lng: number;
  walkMin?: number;
}

export const CATEGORY_COLORS: Record<Category, string> = {
  hostel:   "#0D6F82",
  beach:    "#53CED1",
  culture:  "#E5B853",
  food:     "#53D195",
  nature:   "#5BAD6F",
  activity: "#E37C25",
};

export const CATEGORY_LABELS: Record<Category, { en: string; es: string }> = {
  hostel:   { en: "Hostel",      es: "Hostel"      },
  beach:    { en: "Beaches",     es: "Playas"       },
  culture:  { en: "Culture",     es: "Cultura"      },
  food:     { en: "Food",        es: "Comida"       },
  nature:   { en: "Nature",      es: "Naturaleza"   },
  activity: { en: "Activities",  es: "Actividades"  },
};

export const MAP_POINTS: MapPoint[] = [
  // ── Hostel ──────────────────────────────────────────────────
  {
    id: "hostel",
    category: "hostel",
    emoji: "🏨",
    name_en: "Puerto Nest Hostel",
    name_es: "Puerto Nest Hostel",
    desc_en: "You are here! Check-in 14:00 · Check-out 11:00",
    desc_es: "¡Estás aquí! Check-in 14:00 · Check-out 11:00",
    lat: 28.4168,
    lng: -16.5558,
  },

  // ── Beaches ─────────────────────────────────────────────────
  {
    id: "playa_jardin",
    category: "beach",
    emoji: "🏖️",
    name_en: "Playa Jardín",
    name_es: "Playa Jardín",
    desc_en: "Black volcanic sand beach surrounded by lush gardens. ~10 min walk.",
    desc_es: "Playa de arena volcánica negra rodeada de jardines. ~10 min caminando.",
    lat: 28.4149,
    lng: -16.5547,
    walkMin: 10,
  },
  {
    id: "playa_martianez",
    category: "beach",
    emoji: "🏖️",
    name_en: "Playa de Martiánez",
    name_es: "Playa de Martiánez",
    desc_en: "Popular beach right next to the Lago Martiánez pools. ~8 min walk.",
    desc_es: "Playa popular junto a los lagos de Martiánez. ~8 min caminando.",
    lat: 28.4139,
    lng: -16.5440,
    walkMin: 8,
  },
  {
    id: "playa_bollullo",
    category: "beach",
    emoji: "🏖️",
    name_en: "Playa del Bollullo",
    name_es: "Playa del Bollullo",
    desc_en: "Wild black sand beach off the beaten path. ~30 min by bus.",
    desc_es: "Playa virgen de arena negra, fuera de las rutas turísticas. ~30 min en bus.",
    lat: 28.4025,
    lng: -16.5155,
  },

  // ── Culture ─────────────────────────────────────────────────
  {
    id: "plaza_charco",
    category: "culture",
    emoji: "🌳",
    name_en: "Plaza del Charco",
    name_es: "Plaza del Charco",
    desc_en: "The beating heart of Puerto de la Cruz. Great for coffee and people-watching. ~3 min walk.",
    desc_es: "El corazón de Puerto de la Cruz. Ideal para tomar un café. ~3 min caminando.",
    lat: 28.4132,
    lng: -16.5479,
    walkMin: 3,
  },
  {
    id: "lago_martianez",
    category: "culture",
    emoji: "💦",
    name_en: "Lago Martiánez",
    name_es: "Lago Martiánez",
    desc_en: "Stunning seawater lido designed by artist César Manrique. ~7 min walk.",
    desc_es: "Espectacular piscina de agua salada diseñada por César Manrique. ~7 min caminando.",
    lat: 28.4135,
    lng: -16.5443,
    walkMin: 7,
  },
  {
    id: "jardin_botanico",
    category: "culture",
    emoji: "🌺",
    name_en: "Jardín Botánico",
    name_es: "Jardín Botánico",
    desc_en: "Historic botanical garden founded in 1788, full of exotic plants. ~20 min by bus.",
    desc_es: "Jardín botánico histórico fundado en 1788, lleno de plantas exóticas. ~20 min en bus.",
    lat: 28.4021,
    lng: -16.5373,
  },
  {
    id: "castillo_san_felipe",
    category: "culture",
    emoji: "🏰",
    name_en: "Castillo San Felipe",
    name_es: "Castillo San Felipe",
    desc_en: "17th-century coastal fortress with dramatic ocean views. ~12 min walk.",
    desc_es: "Fortaleza costera del siglo XVII con vistas impresionantes. ~12 min caminando.",
    lat: 28.4143,
    lng: -16.5582,
    walkMin: 12,
  },

  // ── Food ────────────────────────────────────────────────────
  {
    id: "mercado_municipal",
    category: "food",
    emoji: "🛒",
    name_en: "Mercado Municipal",
    name_es: "Mercado Municipal",
    desc_en: "Local market with fresh tropical fruit, Canarian cheese and mojo. ~4 min walk.",
    desc_es: "Mercado local con fruta tropical, queso canario y mojo. ~4 min caminando.",
    lat: 28.4138,
    lng: -16.5462,
    walkMin: 4,
  },
  {
    id: "la_ranilla",
    category: "food",
    emoji: "🍷",
    name_en: "La Ranilla",
    name_es: "La Ranilla",
    desc_en: "Charming fishing quarter packed with tapas bars and local restaurants. ~5 min walk.",
    desc_es: "Encantador barrio pesquero lleno de bares de tapas y restaurantes locales. ~5 min caminando.",
    lat: 28.4142,
    lng: -16.5470,
    walkMin: 5,
  },

  // ── Nature ──────────────────────────────────────────────────
  {
    id: "parque_taoro",
    category: "nature",
    emoji: "🌿",
    name_en: "Parque Taoro",
    name_es: "Parque Taoro",
    desc_en: "Lush hillside park with panoramic views over the sea and town. ~12 min walk uphill.",
    desc_es: "Parque exuberante en la ladera con vistas panorámicas. ~12 min subiendo.",
    lat: 28.4165,
    lng: -16.5510,
    walkMin: 12,
  },
  {
    id: "rambla_castro",
    category: "nature",
    emoji: "🌊",
    name_en: "Rambla de Castro",
    name_es: "Rambla de Castro",
    desc_en: "Scenic coastal trail through banana plantations and volcanic cliffs. ~35 min walk.",
    desc_es: "Sendero costero entre plataneras y acantilados volcánicos. ~35 min caminando.",
    lat: 28.3950,
    lng: -16.5700,
    walkMin: 35,
  },

  // ── Activities ──────────────────────────────────────────────
  {
    id: "loro_parque",
    category: "activity",
    emoji: "🦜",
    name_en: "Loro Parque",
    name_es: "Loro Parque",
    desc_en: "World-famous zoo: orcas, gorillas, tigers and 3,000 parrots. ~15 min by bus.",
    desc_es: "Zoo de fama mundial: orcas, gorilas, tigres y 3.000 loros. ~15 min en bus.",
    lat: 28.4084,
    lng: -16.5642,
  },
  {
    id: "siam_park",
    category: "activity",
    emoji: "🎢",
    name_en: "Siam Park",
    name_es: "Siam Park",
    desc_en: "Voted the world's best water park. Thai-themed. ~45 min by bus.",
    desc_es: "Elegido el mejor parque acuático del mundo. ~45 min en bus.",
    lat: 28.0705,
    lng: -16.7310,
  },
  {
    id: "teide",
    category: "activity",
    emoji: "🌋",
    name_en: "Teide National Park",
    name_es: "Parque Nacional del Teide",
    desc_en: "Spain's highest peak at 3,715 m. Volcanic landscape + cable car. ~1h by bus.",
    desc_es: "El pico más alto de España con 3.715 m. Paisaje volcánico + teleférico. ~1h en bus.",
    lat: 28.2725,
    lng: -16.6420,
  },
];
