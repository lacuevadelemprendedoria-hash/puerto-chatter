import { useState, useEffect } from "react";
import { Language } from "@/lib/i18n";

export interface WeatherData {
  temperature: number;
  emoji: string;
  description: string;
}

interface WeatherState {
  data: WeatherData | null;
  loading: boolean;
  error: boolean;
}

const CACHE_KEY = "puerto_nest_weather";
const CACHE_DURATION_MS = 30 * 60 * 1000; // 30 minutes

const weatherDescriptions: Record<string, { en: string; es: string }> = {
  clear:        { en: "Clear sky",           es: "Cielo despejado" },
  partlyCloudy: { en: "Partly cloudy",       es: "Parcialmente nublado" },
  foggy:        { en: "Foggy",               es: "Niebla" },
  rainy:        { en: "Rainy",               es: "Lluvioso" },
  snowy:        { en: "Snowy",               es: "Nevando" },
  showers:      { en: "Showers",             es: "Chubascos" },
  storm:        { en: "Thunderstorm",        es: "Tormenta" },
};

function getWeatherFromCode(code: number, language: Language = "en"): { emoji: string; description: string } {
  const lang = language === "es" ? "es" : "en";
  if (code === 0) return { emoji: "☀️", description: weatherDescriptions.clear[lang] };
  if (code <= 3)  return { emoji: "🌤️", description: weatherDescriptions.partlyCloudy[lang] };
  if (code <= 48) return { emoji: "🌫️", description: weatherDescriptions.foggy[lang] };
  if (code <= 67) return { emoji: "🌧️", description: weatherDescriptions.rainy[lang] };
  if (code <= 77) return { emoji: "🌨️", description: weatherDescriptions.snowy[lang] };
  if (code <= 82) return { emoji: "🌦️", description: weatherDescriptions.showers[lang] };
  return { emoji: "⛈️", description: weatherDescriptions.storm[lang] };
}

function getCachedWeather(): WeatherData | null {
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

function setCachedWeather(data: WeatherData) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ data, timestamp: Date.now() }));
  } catch {
    // ignore storage errors
  }
}

export function useWeather(language: Language = "en"): WeatherState {
  const [state, setState] = useState<WeatherState>({ data: null, loading: true, error: false });

  useEffect(() => {
    const cached = getCachedWeather();
    if (cached) {
      const recoded = cached as WeatherData & { code?: number };
      if (recoded.code !== undefined) {
        const { emoji, description } = getWeatherFromCode(recoded.code, language);
        setState({ data: { ...cached, emoji, description }, loading: false, error: false });
      } else {
        setState({ data: cached, loading: false, error: false });
      }
      return;
    }

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=28.4127&longitude=-16.5496&current=temperature_2m,weathercode"
    )
      .then((res) => res.json())
      .then((json) => {
        const temperature = Math.round(json.current.temperature_2m);
        const code: number = json.current.weathercode;
        const { emoji, description } = getWeatherFromCode(code, language);
        const data: WeatherData = { temperature, emoji, description };
        setCachedWeather({ ...data, code } as WeatherData);
        setState({ data, loading: false, error: false });
      })
      .catch(() => {
        setState({ data: null, loading: false, error: true });
      });
  }, [language]);

  return state;
}
