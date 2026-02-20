
## Añadir Experiencias Nest en "Planear mi Día"

### Objetivo
Integrar las 5 experiencias reales del hostel Nest en el flujo "Plan My Day", de forma que aparezcan como sugerencias cuando el huésped elige "Nature" o "Explore" + tiempo "Full day" o "Half day". Cuando el huésped pulse en una experiencia, se abre el chat del asistente con una pregunta precargada para reservar o pedir más info.

---

### Experiencias Nest (datos reales confirmados)

| Experiencia | Cuándo | Precio | Recogida | Contacto |
|---|---|---|---|---|
| 🌌 Stargazing Teide | Bajo demanda | A consultar | Ashavana, Medano, Los Amigos, Duque Nest | Claudio +393294096754 |
| 🌋 Teide National Park | Miércoles | A consultar | Gratis en el hostel | Claudio +393294096754 |
| 🌿 Anaga Full Day | Bajo demanda | A consultar | Incluida | Alessio +393391886061 |
| 🌊 Malpaís de Güímar | Bajo demanda | 20€ | Desde Las Eras | Alessio +393391886061 |
| 🧗 Rock Climbing | Bajo demanda | A consultar | — | +34613356187 |

---

### Cambios técnicos

**Archivo: `src/lib/i18n.ts`**

1. Añadir una nueva opción `🧗 Nest Experiences` en el `step1` de `planDay` (en inglés y español), con value `"nest"`.

2. Añadir nuevas claves de resultado en `results` para cubrir las combinaciones con `nest`:
   - `nest_2h` → sugiere Rock Climbing (abre chat)
   - `nest_half` → sugiere Rock Climbing + Malpaís de Güímar (abre chat)
   - `nest_full` → muestra las 5 experiencias: Stargazing, Teide, Anaga, Güímar, Climbing (todas abren chat)

   Cada resultado tendrá `action: "Book now"` / `"Reservar"` que al pulsarlo abre el chat con un mensaje como `"I want to join the Stargazing Teide experience, how do I book?"`.

**Archivo: `src/lib/flows.ts`**

3. En la función `getResultKey`, añadir el caso `nest`:
   ```
   case "planDay":
     if (mood === "nest") return `nest_${time}`;
   ```

---

### Flujo resultante

```text
Plan My Day
  └─ ¿Qué te apetece? 
       ├─ 🌴 Relax
       ├─ 🏔️ Nature
       ├─ 🎉 Social
       ├─ 🗺️ Explore
       └─ 🧗 Nest Experiences  ← NUEVO
            └─ ¿Cuánto tiempo tienes?
                 ├─ 2h  → Rock Climbing
                 ├─ Half day → Climbing + Güímar
                 └─ Full day → Todas las experiencias Nest
```

Cada tarjeta de resultado muestra: nombre, descripción real (con datos confirmados), y un botón que abre el chat con la pregunta de reserva precargada.

---

### Archivos a modificar
- `src/lib/i18n.ts` — añadir opción + resultados (EN y ES)
- `src/lib/flows.ts` — actualizar `getResultKey` para el caso `nest`
