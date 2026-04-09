/**
 * NEST HOSTEL CONFIGURATION
 * ─────────────────────────────────────────────────────────────────
 * To deploy this app for a DIFFERENT Nest Hostel:
 * 1. Change the values below
 * 2. Replace src/assets/puerto-nest-logo.png with the new logo
 * 3. Update VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env
 * 4. Set ANTHROPIC_API_KEY in Supabase Edge Function Secrets
 * 5. Deploy!
 * ─────────────────────────────────────────────────────────────────
 */

export const HOSTEL_CONFIG = {
  // ── Identity ──────────────────────────────────────────────────
  name: "Puerto Nest Hostel",
  shortName: "Puerto Nest",
  city: "Puerto de la Cruz",
  island: "Tenerife",
  country: "Spain",

  // ── Coordinates for weather widget (Puerto de la Cruz) ───────
  latitude: 28.4107,
  longitude: -16.5655,

  // ── Contact ───────────────────────────────────────────────────
  receptionPhone: "+34 656 36 80 39",
  whatsapp: "+34 656 36 80 39",

  // ── WiFi ────────────────────────────────────────────────────
  wifiName: "PuertoNest",
  wifiPassword: "nest2024",

  // ── Schedule ──────────────────────────────────────────────────
  checkInTime: "14:00",
  checkOutTime: "11:00",
  receptionOpen: "13:00",
  receptionClose: "21:00",

  // ── Reception hours ───────────────────────────────────────────
  receptionHours: "Mon–Sun 13:00–21:00",

  // ── Nest Pass ─────────────────────────────────────────────────
  nestPass: {
    enabled: true,
    // No specific prices hardcoded — guests ask reception for current rates
  },

  // ── Admin ─────────────────────────────────────────────────────
  adminTitle: "Puerto Nest Admin",

  // ── Other Nest locations ──────────────────────────────────────
  otherNests: [
    { name: "Las Eras Nest", city: "Güímar, Tenerife" },
    { name: "Duque Nest", city: "Costa Adeje, Tenerife" },
    { name: "El Médano Nest", city: "El Médano, Tenerife" },
    { name: "Gran Canaria Nest", city: "Las Palmas, Gran Canaria" },
  ],
} as const;

export type HostelConfig = typeof HOSTEL_CONFIG;
