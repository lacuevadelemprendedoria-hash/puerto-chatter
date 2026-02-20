import { useState, useEffect } from "react";

interface WeatherData {
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

function getWeatherFromCode(code: number): { emoji: string; description: string } {
  if (code === 0) return { emoji: "☀️", description: "Clear sky" };
  if (code <= 3) return { emoji: "🌤️", description: "Partly cloudy" };
  if (code <= 48) return { emoji: "🌫️", description: "Foggy" };
  if (code <= 67) return { emoji: "🌧️", description: "Rainy" };
  if (code <= 77) return { emoji: "🌨️", description: "Snowy" };
  if (code <= 82) return { emoji: "🌦️", description: "Showers" };
  return { emoji: "⛈️", description: "Thunderstorm" };
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

export function useWeather(): WeatherState {
  const [state, setState] = useState<WeatherState>({ data: null, loading: true, error: false });

  useEffect(() => {
    const cached = getCachedWeather();
    if (cached) {
      setState({ data: cached, loading: false, error: false });
      return;
    }

    fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=28.4127&longitude=-16.5496&current=temperature_2m,weathercode"
    )
      .then((res) => res.json())
      .then((json) => {
        const temperature = Math.round(json.current.temperature_2m);
        const { emoji, description } = getWeatherFromCode(json.current.weathercode);
        const data: WeatherData = { temperature, emoji, description };
        setCachedWeather(data);
        setState({ data, loading: false, error: false });
      })
      .catch(() => {
        setState({ data: null, loading: false, error: true });
      });
  }, []);

  return state;
}
