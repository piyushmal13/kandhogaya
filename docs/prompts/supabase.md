# TASK: SUPABASE DATA IMPLEMENTATION
## STEP 1: TABLE VALIDATION
- Check if table exists.
- If NOT -> create table with proper schema.
- If exists -> DO NOT drop or overwrite existing data.

## STEP 2: QUERY SAFETY
- Always use safe fallback: `res?.data ?? []`

## STEP 3: RLS SAFETY
- Ensure SELECT works for: `anon + authenticated` (if public data).
- Do NOT break existing policies.

## STEP 4: ERROR HANDLING
- Log errors using `logger` system.
- Prevent UI crashes.

## STEP 5: PERFORMANCE
- Avoid full table fetch if large.
- Use `limit/order` when needed.

## IMPORTANT:
- Never break existing RLS.
- Never assume schema blindly.
