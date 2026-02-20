
## Corrección de horarios en "Hoy en el hostel"

### Problema encontrado
En `src/components/assistant/ActivityFeed.tsx`, líneas 100–102, hay tres líneas hardcodeadas con horarios incorrectos:

- Recepción: "08:00" → debe ser **14:00–21:00**
- Cocina: "07:00–23:00" → debe ser **08:00–22:30**
- Silencio nocturno: "22:00" → debe ser **23:00–08:00**

### Cambio a realizar

**Archivo:** `src/components/assistant/ActivityFeed.tsx`

Línea 100 — Recepción:
- EN: `"Good morning! Reception opens at 08:00"` → `"Reception open 14:00–21:00"`
- ES: `"¡Buenos días! Recepción abre a las 08:00"` → `"Recepción abierta 14:00–21:00"`

Línea 101 — Cocina:
- EN: `"Kitchen available 07:00–23:00"` → `"Kitchen available 08:00–22:30"`
- ES: `"Cocina disponible 07:00–23:00"` → `"Cocina disponible 08:00–22:30"`

Línea 102 — Silencio:
- EN: `"Quiet hours from 22:00"` → `"Quiet hours 23:00–08:00"`
- ES: `"Silencio nocturno desde las 22:00"` → `"Silencio nocturno 23:00–08:00"`

### Solo se toca ese bloque, sin cambiar nada más.
