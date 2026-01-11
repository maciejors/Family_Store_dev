`dbTypes.ts` is an auto-generated file by Supabase CLI. We will need to 
regenerate it every time we make changes to the database schema to update
TS types.

Steps:

1. Run the command:

```bash
npx supabase gen types typescript --project-id ggbpzyvanxsbpypmmzrd --schema public > src/lib/supabase/dbTypes.ts
```

2. Remeber to reformat the generated file with prettier
