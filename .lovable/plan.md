
# Plan: Agregar tarjeta de Carnaval

## Resumen
Agregar una nueva tarjeta de acción "Carnaval" junto a "Nest Pass" para que los huéspedes puedan obtener información sobre días festivos y eventos de carnaval.

## Cambios a realizar

### 1. Agregar traducciones (src/lib/i18n.ts)
Añadir textos bilingües para la nueva tarjeta:
- **Inglés**: "Carnival" / "Festivities, parades, events"
- **Español**: "Carnaval" / "Fiestas, desfiles, eventos"

### 2. Agregar la tarjeta en la pantalla principal (src/pages/GuestChat.tsx)
- Importar icono `PartyPopper` de lucide-react (perfecto para representar fiestas/carnaval)
- Insertar nueva `ActionCard` después de "Nest Pass"
- Marcarla como `highlighted` igual que Nest Pass para destacarla
- Configurar el mensaje que se enviará al chat al hacer clic

### 3. Ajuste del layout
Actualmente hay 4 tarjetas en grid 2x2. Con 5 tarjetas:
- Las primeras 2 (Nest Pass + Carnaval) ocuparán la primera fila destacadas
- Las otras 3 ocuparán las filas siguientes

## Vista previa del resultado

```text
┌─────────────┐  ┌─────────────┐
│  Nest Pass  │  │  Carnaval   │  <- Ambas destacadas
│  (destacada)│  │  (destacada)│
└─────────────┘  └─────────────┘
┌─────────────┐  ┌─────────────┐
│ Hostel Info │  │ Excursiones │
└─────────────┘  └─────────────┘
┌─────────────┐  ┌─────────────┐
│ Transporte  │  │             │
└─────────────┘  └─────────────┘
```

## Detalles técnicos

**Archivos modificados:**
- `src/lib/i18n.ts` - Agregar traducciones
- `src/pages/GuestChat.tsx` - Agregar tarjeta y su handler
