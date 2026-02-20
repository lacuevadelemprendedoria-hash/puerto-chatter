
# Rediseño: Puerto Nest Assistant — Panel Interactivo de Estancia

## Concepto
Transformar la app de un chatbot clásico a una **herramienta operativa del hostel**: panel interactivo mobile-first donde el chat es secundario. El huésped navega por acciones, no por texto.

---

## Lo que se mantiene sin cambios
- Backend de IA (edge function `chat`)
- Sistema de autenticación admin
- Panel de administración de contenido
- Base de datos existente (`hostel_content`, `admin_users`, etc.)
- Branding y colores (teal/verde)

---

## Arquitectura de la nueva pantalla principal

```text
┌─────────────────────────────────────┐
│  HEADER                             │
│  [Logo Nest]  [EN/ES]  [⚙️]         │
├─────────────────────────────────────┤
│  PANEL DE ESTADO DEL HUÉSPED        │
│  Buenos días ☀️ | Clima: 22°C       │
│  Eventos hoy: Carnaval Puerto Cruz  │
│  [Necesito ayuda rápida]            │
├─────────────────────────────────────┤
│  ACCIONES RÁPIDAS (scroll horizontal)│
│  [🗓 Planear día] [🏠 Hostel]       │
│  [🎉 Eventos] [🚌 Transporte]       │
│  [🍽 Comer] [🆘 Ayuda]             │
├─────────────────────────────────────┤
│  FEED DE ACTIVIDAD                  │
│  ▶ Hoy en el hostel                 │
│  ▶ Carnaval: Santa Cruz vs PLC      │
│  ▶ Nest Pass — ahorra hasta 30%     │
│  ▶ Lugares recomendados             │
├─────────────────────────────────────┤
│              [💬 Hablar]            │  ← botón flotante
└─────────────────────────────────────┘
```

---

## Flujo de conversación guiada (sin texto libre)

Cuando el usuario toca una acción rápida, se abre un flujo de pasos con botones:

```text
Usuario toca "Planear mi día"
→ Pantalla: ¿Qué prefieres hoy?
  [🌴 Relax]  [🏔 Naturaleza]  [🎉 Social]  [🗺 Explorar]

→ Pantalla: ¿Cuánto tiempo tienes?
  [2 horas]  [Medio día]  [Día completo]

→ Resultado: Cards con actividades recomendadas
  ┌─────────────────┐
  │ 🏖 Playa Martia │
  │ 20 min en bus   │
  │ [Cómo llegar]   │
  └─────────────────┘
```

---

## Nuevos componentes a crear

### Pantalla Principal (`src/pages/GuestChat.tsx` — reescritura completa)
- Header fijo con logo, selector idioma, ajustes
- Panel estado del huésped (saludo por hora, clima placeholder, eventos)
- Scroll horizontal de acciones rápidas
- Feed de actividad con items expandibles
- Botón flotante del chat

### `src/components/assistant/GuestStatusPanel.tsx`
- Saludo dinámico por hora del día (buenos días/tardes/noches)
- Clima hardcoded inicialmente (con placeholder para API futura)
- Eventos destacados del día
- Botón "Necesito ayuda rápida"

### `src/components/assistant/QuickActionsBar.tsx`
- Scroll horizontal de 6 acciones principales
- Cada acción tiene icono grande + texto
- Efecto ripple al tocar

### `src/components/assistant/GuidedFlow.tsx`
- Modal/Panel deslizable desde abajo (usando `vaul` Drawer ya instalado)
- Controla los pasos del flujo guiado
- Estado: pasos, selecciones del usuario, resultado final

### `src/components/assistant/FlowStep.tsx`
- Renderiza opciones como botones grandes seleccionables
- Animación de transición entre pasos

### `src/components/assistant/ResultCard.tsx`
- Card interactiva para mostrar resultados del flujo
- Incluye: título, icono, descripción corta, botones de acción

### `src/components/assistant/ActivityFeed.tsx`
- Lista vertical de items expandibles
- Categorías: hostel hoy, eventos, Carnaval, Nest Pass, recomendados

### `src/components/assistant/ChatPanel.tsx`
- Panel lateral deslizable (Drawer desde la derecha o bottom sheet)
- Reutiliza `useChat` existente y `ChatMessage` existente
- Se activa con botón flotante

### `src/components/assistant/NestPassSimulator.tsx`
- Calculadora de ahorro del Nest Pass
- Input: número de noches
- Output: ahorro estimado en cards

---

## Flujos guiados a implementar

| Acción | Pasos | Resultado |
|--------|-------|-----------|
| Planear mi día | Preferencia → Tiempo → Actividades recomendadas |
| Información del hostel | Categoría → Respuesta en cards |
| Eventos hoy | Lista de eventos del día con horarios |
| Transporte | Destino → Opciones (bus/taxi) → Info específica |
| Comer y salir | Tipo → Distancia → Recomendaciones |
| Necesito ayuda | Tipo de problema → Pasos de solución |

---

## Feed de actividad — items estáticos + dinámicos

Los items del feed se basarán en el contenido de `hostel_content` existente más contenido estático:
- **Hoy en el hostel** → pull de categoría `check_in_out`
- **Carnaval** → item fijo con info de Santa Cruz y PLC con emojis
- **Nest Pass** → item fijo con simulador integrado
- **Dónde comer** → pull de `where_to_eat_go_out`

---

## Detalles técnicos de implementación

### Archivos nuevos
- `src/components/assistant/GuestStatusPanel.tsx`
- `src/components/assistant/QuickActionsBar.tsx`
- `src/components/assistant/GuidedFlow.tsx`
- `src/components/assistant/FlowStep.tsx`
- `src/components/assistant/ResultCard.tsx`
- `src/components/assistant/ActivityFeed.tsx`
- `src/components/assistant/ChatPanel.tsx`
- `src/components/assistant/NestPassSimulator.tsx`
- `src/lib/flows.ts` — definición de todos los flujos guiados

### Archivos modificados
- `src/pages/GuestChat.tsx` — reescritura completa de la UI principal
- `src/lib/i18n.ts` — agregar todas las traducciones nuevas (EN/ES)

### Archivos sin cambios
- `src/hooks/useChat.ts` — se reutiliza igual
- `src/components/chat/ChatMessage.tsx` — se reutiliza en el ChatPanel
- `supabase/functions/chat/index.ts` — sin cambios
- Todo el sistema admin — sin cambios

### Librería vaul (Drawer)
Ya está instalada. Se usará para:
- El panel de chat flotante (bottom sheet)
- Los flujos guiados (bottom sheet deslizable)

---

## Estado de la app

```text
GuestChat state:
├── language: "en" | "es"
├── activeFlow: FlowDefinition | null    ← flujo activo
├── flowStep: number                      ← paso actual
├── flowSelections: Record<string, string> ← respuestas del usuario
├── chatOpen: boolean                     ← panel chat abierto
└── expandedFeedItem: string | null       ← item del feed expandido
```

---

## Consideraciones UX importantes
- Todo el texto del huésped debe ser mínimo: prioridad a botones
- Animaciones suaves entre pasos (CSS transitions)
- El chat sigue disponible como escape hatch si el flujo no cubre su necesidad
- El panel de estado usa la hora del navegador del huésped para el saludo
- Mobile-first: diseño pensado para pantalla de 390px primero
