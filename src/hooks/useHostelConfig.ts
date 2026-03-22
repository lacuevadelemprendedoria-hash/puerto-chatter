import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { HOSTEL_CONFIG } from "@/lib/hostel.config";
import type { Language } from "@/lib/i18n";

export interface HostelConfigData {
  hostelName: string;
  hostelCity: string;
  hostelIsland: string;
  receptionPhone: string;
  whatsapp: string;
  eventTodayEn: string;
  eventTodayEs: string;
}

const DEFAULT_CONFIG: HostelConfigData = {
  hostelName: HOSTEL_CONFIG.name,
  hostelCity: HOSTEL_CONFIG.city,
  hostelIsland: HOSTEL_CONFIG.island,
  receptionPhone: HOSTEL_CONFIG.receptionPhone,
  whatsapp: HOSTEL_CONFIG.whatsapp,
  eventTodayEn: "Today at the Hostel 🏠",
  eventTodayEs: "Hoy en el Hostel 🏠",
};

const CACHE_KEY = "nest_hostel_config";
const CACHE_DURATION_MS = 5 * 60 * 1000;

function getCachedConfig(): HostelConfigData | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const { data, timestamp } = JSON.parse(raw);
    if (Date.now() - timestamp > CACHE_DURATION_MS) return null;
    return data;
  } catch {
    return null;
  }
}

function setCachedConfig(data: HostelConfigData) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch { /* ignore */ }
}

export function useHostelConfig() {
  const [config, setConfig] = useState<HostelConfigData>(
    getCachedConfig() ?? DEFAULT_CONFIG
  );
  const [loading, setLoading] = useState(!getCachedConfig());

  useEffect(() => {
    if (getCachedConfig()) return;

    const fetchConfig = async () => {
      try {
        const { data, error } = await supabase
          .from("hostel_config")
          .select("key, value");

        if (error || !data) return;

        const kv: Record<string, string> = {};
        for (const row of data) {
          kv[row.key] = row.value;
        }

        const result: HostelConfigData = {
          hostelName: kv["hostel_name"] ?? DEFAULT_CONFIG.hostelName,
          hostelCity: kv["hostel_city"] ?? DEFAULT_CONFIG.hostelCity,
          hostelIsland: kv["hostel_island"] ?? DEFAULT_CONFIG.hostelIsland,
          receptionPhone: kv["reception_phone"] ?? DEFAULT_CONFIG.receptionPhone,
          whatsapp: kv["whatsapp"] ?? DEFAULT_CONFIG.whatsapp,
          eventTodayEn: kv["event_today_en"] ?? DEFAULT_CONFIG.eventTodayEn,
          eventTodayEs: kv["event_today_es"] ?? DEFAULT_CONFIG.eventTodayEs,
        };

        setCachedConfig(result);
        setConfig(result);
      } catch {
        // Use defaults on error
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  const getEventToday = (language: Language) =>
    language === "es" ? config.eventTodayEs : config.eventTodayEn;

  return { config, loading, getEventToday };
}
