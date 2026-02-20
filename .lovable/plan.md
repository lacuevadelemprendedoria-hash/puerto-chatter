
# Clima en tiempo real — Open-Meteo API

## Qué vamos a hacer
Conectar el panel de estado del huésped a la API gratuita de **Open-Meteo** para mostrar la temperatura real y una descripción del clima de Puerto de la Cruz, sin necesitar ninguna API key.

## Cómo funciona Open-Meteo
- API completamente gratuita, sin registro ni API key
- URL de consulta con coordenadas fijas de Puerto de la Cruz:
  `https://api.open-meteo.com/v1/forecast?latitude=28.4127&longitude=-16.5496&current=temperature_2m,weathercode`
- Devuelve temperatura actual y código WMO del tiempo (soleado, nublado, lluvia, etc.)

## Cambios a realizar

### 1. Nuevo hook `src/hooks/useWeather.ts`
Hook personalizado que:
- Hace fetch a Open-Meteo al cargar el componente
- Traduce el código WMO a emoji + descripción (☀️ Sunny, 🌤 Partly cloudy, 🌧 Rainy, etc.)
- Maneja estados: `loading`, `data`, `error`
- Fallback al texto hardcoded si falla la petición
- Cache de 30 minutos en `sessionStorage` para no hacer peticiones repetidas

### 2. Modificar `src/components/assistant/GuestStatusPanel.tsx`
- Importar y usar el hook `useWeather`
- Mostrar skeleton/loading mientras carga
- Mostrar temperatura real + emoji del tiempo
- Si hay error, mantiene el texto del i18n como fallback

## Mapeo de códigos WMO a iconos

| Código | Condición | Emoji |
|--------|-----------|-------|
| 0 | Clear sky | ☀️ |
| 1, 2, 3 | Mainly clear, partly cloudy | 🌤️ |
| 45, 48 | Foggy | 🌫️ |
| 51–67 | Drizzle / Rain | 🌧️ |
| 80–82 | Rain showers | 🌦️ |
| 95+ | Thunderstorm | ⛈️ |

## Archivos modificados
- `src/hooks/useWeather.ts` — nuevo hook (fetch + cache + mapeo)
- `src/components/assistant/GuestStatusPanel.tsx` — usa el hook en lugar del texto fijo
