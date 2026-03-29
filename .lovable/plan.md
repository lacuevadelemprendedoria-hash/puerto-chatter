

## Daily Curiosities Feature

### Overview
Add a "Did you know?" section to the activity feed that automatically shows a different curiosity each day of the week, driven entirely by the database.

### Step 1 — Database migration
Two schema changes in one migration:
1. Add `day_of_week integer` (nullable) column to `feed_items`
2. Add `'curiosity'` to the `feed_item_type` enum

```sql
ALTER TYPE public.feed_item_type ADD VALUE 'curiosity';
ALTER TABLE public.feed_items ADD COLUMN day_of_week integer;
```

### Step 2 — Insert the 7 curiosity records
Use the insert tool to add 7 rows to `feed_items` with `type='curiosity'` and `day_of_week` 0-6, containing all the provided EN/ES content for Barraquito, Guachinches, Papas Arrugadas, El Teide, Plátano Canario, Laurisilva de Anaga, and Mojo Canario.

### Step 3 — Update ActivityFeed.tsx
- Add `day_of_week` to the `FeedItem` interface
- Add `"curiosity"` to the type union
- Split fetched items into two groups: regular items (`type !== "curiosity"`) and curiosities (`type === "curiosity"`)
- Filter curiosities to show only the one matching `new Date().getDay()`
- Render the curiosity section below the main feed with:
  - Title: "¿Sabías que...? 🌴" / "Did you know? 🌴"
  - Card background: `#FEF3EA`
  - Badge: "Dato del día" / "Daily tip" in `#E37C25`

### Step 4 — Update FeedEditor.tsx
- Add `"curiosity"` to `FeedItemType` union and `typeLabels`
- Add `day_of_week` field to `FeedItem` interface and `EMPTY` default (null)
- When `type === "curiosity"`, show a day-of-week selector (Lunes/Monday through Domingo/Sunday) that saves the numeric value (0-6)

### Files changed
- `supabase/migrations/` — new migration file
- `src/components/assistant/ActivityFeed.tsx`
- `src/components/admin/FeedEditor.tsx`
- Database: 7 new rows in `feed_items`

