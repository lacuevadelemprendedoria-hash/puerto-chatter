

## Two Changes

### 1. Add pharmacy info to Edge Function system prompt
Add a new `=== NEARBY SERVICES ===` section to `supabase/functions/chat/index.ts` (after TRANSPORT, before PLACES) with the pharmacy details:

```
=== NEARBY SERVICES ===
Farmacia de Armas Alonso: 150m away · Calle Bencomo 6 · Monday to Friday 09:00–14:00 and 16:15–19:30 · Saturday 09:00–14:00 · Closed Sundays.
```

Insert at line 112, right after the TRANSPORT section ends.

### 2. Update FAIL detection in AdminTestChat.tsx
Replace the `FAIL_PHRASES` array (lines 41-46) with a shorter, more precise list:

```typescript
const FAIL_PHRASES = [
  "don't have information", "no tengo información", "not in my",
  "i don't know", "no sé", "cannot find",
];
```

Removed: `"don't have"`, `"no dispongo"`, `"no está en"`, `"no tengo esa"`, `"no puedo"`, `"not available"`, `"no available"`, `"sin información"`, `"no information"`, `"i'm not sure"`, `"no estoy seguro"`

### Files changed
- `supabase/functions/chat/index.ts` — add pharmacy section
- `src/pages/AdminTestChat.tsx` — refined FAIL phrases

