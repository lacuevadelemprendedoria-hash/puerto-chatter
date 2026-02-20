
# Limpieza de contenido engañoso — Puerto Nest Assistant

## El problema
La app muestra información inventada o promesas que no puede cumplir:
- Botones de "Comprar entradas" / "Book tickets" para Loro Parque, Teide, Los Gigantes — la app no puede vender ni enlazar entradas
- Botones de "Reservar tour" para actividades externas
- Nombres de restaurantes y bares inventados que el hostel no ha verificado
- Referencias a un "bar del hostel" y "happy hour a las 17:00" que pueden no existir
- Botón "Recuérdame" que no tiene funcionalidad real
- Destinos de transporte sin resultados configurados (estación de buses, Teide con rental, etc.)
- Horarios de bus no verificados

## Principio de la corrección
**Solo mostrar lo que la app puede hacer realmente:**
- Información de los propios productos del hostel (Nest Pass, reglas, servicios)
- Orientación general verificable (playa, casco viejo, emergencias)
- Redirigir al chat del asistente para todo lo que requiera detalle real

---

## Cambios a realizar en `src/lib/i18n.ts`

### 1. Resultados de "Plan My Day" — eliminar nombres inventados y botones falsos

**Relax:**
- Playa Jardín → mantener (es real, 5 min)
- Café La Ranilla → cambiar a "Cafés en La Ranilla" sin nombre específico
- Jardín Botánico → mantener (real)
- "Atardecer en el muelle" → mantener (genérico)

**Nature — full day:**
- Teide: cambiar acción de "Book now" → "Ask assistant" (redirige al chat)
- Whale watching: cambiar acción de "Book now" → "Ask assistant"

**Social:**
- "Hostel Happy Hour 17:00" → eliminar (dato inventado)
- "Hostel Bar Night" → eliminar
- Carnival info → mantener (real)
- Bares de La Ranilla → mantener como genérico (sin nombre)

**Explore:**
- Loro Parque: cambiar acción de "Book tickets" → "Ask assistant" — así el chat puede explicar cómo llegar pero no vende entradas
- Los Gigantes: cambiar acción de "Book tour" → "Ask assistant"
- La Orotava → mantener con "Bus info" (redirige a chat)

### 2. Resultados de "Eat & Go Out" — eliminar nombres no verificados

Sustituir todos los nombres específicos de restaurantes inventados por descripciones genéricas basadas en tipo de cocina y zona, con acción siempre redirigiendo al chat del asistente donde el hostel puede tener la info real.

Ejemplos:
- "Tasca El Coto" → "Tapas canarias cerca" + "Ask assistant"
- "Café Dinámico" → "Cafetería local" + "Ask assistant"
- "El Limón" → "Marisquería cercana" + "Ask assistant"
- "La Creperie" → eliminar o hacer genérico
- "Café Rambla" → eliminar o hacer genérico
- "La Cervecería", "Mojo Bar" → descripciones genéricas

### 3. Botones con funcionalidades inexistentes

- "Recuérdame" / "Remind me" → eliminar de los resultados de social (no existe esa función)
- "Horario" / "Schedule" (Carnival parade) → cambiar a "Ask assistant"
- "Timetable" / "Horarios" en los buses → cambiar a "Ask assistant" (el chat sí puede responder con info del hostel)

### 4. Destinos de transporte sin resultados

**Estación de buses (`bus_station`):** actualmente no tiene resultados configurados. Eliminar esa opción del step1 del flujo de transporte, o bien añadir resultado genérico que redirija al chat.

**Teide como destino:** no tiene resultado configurado → eliminar del listado o añadir resultado genérico que diga "consulta al asistente para organizar la excursión".

**Rental (alquiler):** combinaciones no configuradas → eliminar la opción "Alquiler/Rental" del step2 del transporte, ya que no hay resultados para esa combinación.

### 5. Feed de actividad — restaurantes hardcodeados

En `ActivityFeed.tsx` hay 3 nombres de restaurantes hardcodeados (Tasca El Coto, Café Dinámico, El Limón) con tiempos de caminata inventados. Estos se reemplazan con descripciones genéricas y el botón siempre redirige al chat del asistente.

---

## Archivos a modificar

| Archivo | Cambios |
|---|---|
| `src/lib/i18n.ts` | Limpiar todos los `results` de flujos: eliminar nombres inventados, cambiar acciones falsas por "Ask assistant" |
| `src/components/assistant/ActivityFeed.tsx` | Reemplazar los 3 nombres de restaurantes hardcodeados por opciones genéricas |

## Lo que NO cambia

- La lógica de flujos (pasos, opciones)
- El chat del asistente (puede responder con info real del hostel)
- Contenido del Carnaval (general y no específico a un proveedor)
- Información de emergencias y servicios del hostel
- El Nest Pass simulator
- Toda la información del hostel que viene de la base de datos

---

## Resultado esperado

Cada card de resultado hace exactamente lo que dice:
- Orientación general → se muestra
- Detalle específico → siempre redirige al chat del asistente donde el hostel tiene la información real configurada
- Nada promete reservas, horarios exactos o nombres de sitios no verificados
