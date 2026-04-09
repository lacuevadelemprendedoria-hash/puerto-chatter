

## Corregir coordenadas del mapa + build errors

### Coordenadas verificadas — qué está mal y qué cambia

Usando datos de latitude.to, mapio.net, y GeoHack (Wikipedia):

| Punto | Coordenadas actuales | Coordenadas correctas | Problema |
|-------|---------------------|----------------------|----------|
| **Hostel** (Víctor Machado 12, Punta Brava) | 28.4138, -16.5497 | **28.4168, -16.5558** | Estaba en el centro, no en Punta Brava |
| **Loro Parque** | 28.4197, -16.5609 | **28.4084, -16.5642** | Demasiado al norte — confirmado en latitude.to |
| **Playa del Bollullo** | 28.4290, -16.5700 | **28.4025, -16.5155** | Totalmente al revés — está al ESTE de Puerto, no al noroeste |
| **Rambla de Castro** | 28.4291, -16.5604 | **28.3950, -16.5700** | Está al SUR/oeste hacia Los Realejos, no al norte |
| **Castillo San Felipe** | 28.4160, -16.5490 | **28.4143, -16.5582** | Confirmado en mapio.net — junto a Playa Jardín |

Estos 5 son los que están mal. Los demás (Playa Jardín, Playa Martiánez, Plaza del Charco, Lago Martiánez, Jardín Botánico, Mercado, La Ranilla, Parque Taoro, Siam Park, Teide) tienen coordenadas razonables.

### Archivos a modificar

**1. `src/lib/mapPoints.ts`** — Actualizar las 5 coordenadas incorrectas

**2. `src/components/assistant/NeighborhoodMap.tsx`** — Actualizar:
- Hostel coords (lat/lng en LOCATIONS + marker en MAP_EMBED_URL + link "Open map")
- Loro Parque coords en LOCATIONS
- Recentrar el bbox del iframe OSM para que Punta Brava quede visible

**3. `src/lib/hostel.config.ts`** — Cambiar latitude/longitude del hostel a 28.4168, -16.5558

**4. `src/components/map/ActivityMap.tsx`** — Cambiar center del mapa Leaflet a [28.4168, -16.5558]

### Build errors a corregir

**5. `src/components/admin/ContentList.tsx`**
- Quitar `CardContent` del import (no se usa)
- Cambiar interfaz `ContentItem`: `sort_order: number | null` y `is_active: boolean | null`

**6. `src/components/admin/FeedEditor.tsx`**
- En línea 80, al hacer `setForm({...EMPTY, ...data, ...})`, hacer spread con defaults para campos nullable: `emoji: data.emoji || "📌"` etc.

**7. `src/components/assistant/GuidedFlow.tsx`**
- Prefijar `_` a las variables no usadas: `_t`, `_onOpenChat`, `_onClose`

**8. `src/components/assistant/QuickActionsBar.tsx`**
- Quitar la línea de imports de lucide-react (no se usan los iconos)

**9. `src/components/chat/LanguageToggle.tsx`**
- Cambiar `language` a `_language` en los props destructurados

**10. `src/components/ui/calendar.tsx`**
- Cambiar `{ ..._props }` a `_props` (sin destructuring) en las dos líneas de IconLeft/IconRight

