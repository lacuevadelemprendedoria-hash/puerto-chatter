/**
 * NEST HOSTEL CONFIGURATION
 * ─────────────────────────────────────────────────────────────────
 * To deploy this app for a DIFFERENT Nest Hostel:
 * 1. Change the values below
 * 2. Replace src/assets/puerto-nest-logo.png with the new logo
 * 3. Update VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY in .env
 * 4. Deploy!
 * ─────────────────────────────────────────────────────────────────
 */

export const HOSTEL_CONFIG = {
  // ── Identity ──────────────────────────────────────────────────
  name: "Puerto Nest Hostel",
  shortName: "Puerto Nest",
  city: "Puerto de la Cruz",
  island: "Tenerife",
  country: "Spain",

  // ── Coordinates (for weather widget) ─────────────────────────
  latitude: 28.4127,
  longitude: -16.5496,

  // ── Contact ───────────────────────────────────────────────────
  receptionPhone: "+34 XXX XXX XXX",
  whatsapp: "+34 XXX XXX XXX",
  email: "reception@puertones.com",

  // ── Brand colors (must match tailwind.config.ts) ─────────────
  primaryColor: "#1a6b5a",
  accentColor: "#f59e0b",

  // ── Nest Pass ─────────────────────────────────────────────────
  nestPass: {
    enabled: true,
    standardPricePerNight: 25,
    passDiscountPercent: 30,
    minNights: 7,
  },

  // ── Admin ─────────────────────────────────────────────────────
  adminTitle: "Puerto Nest Admin",

  // ── Other Nest locations (for Nest Pass cross-promotion) ─────
  otherNests: [
    { name: "Las Eras Nest", city: "Güímar, Tenerife" },
    { name: "Duque Nest", city: "Costa Adeje, Tenerife" },
    { name: "Medano Nest", city: "El Médano, Tenerife" },
    { name: "Gran Canaria Nest", city: "Las Palmas, Gran Canaria" },
  ],
} as const;

export type HostelConfig = typeof HOSTEL_CONFIG;
