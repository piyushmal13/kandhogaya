# TASK: UI COMPONENT IMPLEMENTATION
## STEP 1: FILE CHECK
- Check component file exists.
- If not -> create.
- If exists -> extend safely.

## STEP 2: UI RULES
- Maintain current design system.
- Do NOT break layout.
- Add new UI as modular block.

## STEP 3: STATE SAFETY
- Avoid unnecessary re-renders.
- Use proper hooks (`useEffect`/`useCallback`).

## STEP 4: DATA SAFETY
- Always handle `null`/empty states.
- Show fallback UI if no data.

## STEP 5: INTEGRATION
- Ensure component is used properly.
- Do not break routing.

## IMPORTANT:
- UI must never crash even if data fails.
