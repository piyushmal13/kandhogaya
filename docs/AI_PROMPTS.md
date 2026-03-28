# IFX TRADES - AI EXECUTION PROMPTS
## THE ENGINEERING BIBLE v1.0

### 🧱 1. UNIVERSAL FILE-SAFE TEMPLATE
**TASK: [FEATURE NAME]**

**STEP 1: FILE VALIDATION**
- Check if file exists.
- If NOT exists → create file.
- If exists → extend safely (DO NOT overwrite entire file).

**STEP 2: IMPLEMENTATION**
- Add new logic inside proper structure.
- Do NOT remove existing functionality.
- Avoid duplicate functions or imports.

**STEP 3: SAFETY RULES**
- Maintain TypeScript safety.
- Preserve existing exports.
- Ensure backward compatibility.

**STEP 4: INTEGRATION**
- Ensure file is correctly imported wherever needed.
- If new component → connect to parent module.

**STEP 5: VALIDATION**
- Ensure project builds successfully.
- No runtime errors.
- No unused variables.

**IMPORTANT:**
- Never assume file exists.
- Never overwrite full file unless explicitly instructed.

---

### 🔥 2. SUPABASE SAFE TEMPLATE
**TASK: SUPABASE DATA IMPLEMENTATION**

**STEP 1: TABLE VALIDATION**
- Check if table exists.
- If NOT → create table with proper schema.
- If exists → DO NOT drop or overwrite existing data.

**STEP 2: QUERY SAFETY**
- Always use safe fallback: `res?.data ?? []`

**STEP 3: RLS SAFETY**
- Ensure SELECT works for: `anon + authenticated` (if public data).
- Do NOT break existing policies.

**STEP 4: ERROR HANDLING**
- Log errors using `logger` system.
- Prevent UI crashes.

**STEP 5: PERFORMANCE**
- Avoid full table fetch if large.
- Use `limit/order` when needed.

**IMPORTANT:**
- Never break existing RLS.
- Never assume schema blindly.

---

### 🔥 3. UI COMPONENT SAFE PROMPT
**TASK: UI COMPONENT IMPLEMENTATION**

**STEP 1: FILE CHECK**
- Check component file exists.
- If not → create.
- If exists → extend safely.

**STEP 2: UI RULES**
- Maintain current design system.
- Do NOT break layout.
- Add new UI as modular block.

**STEP 3: STATE SAFETY**
- Avoid unnecessary re-renders.
- Use proper hooks (`useEffect`/`useCallback`).

**STEP 4: DATA SAFETY**
- Always handle `null`/empty states.
- Show fallback UI if no data.

**STEP 5: INTEGRATION**
- Ensure component is used properly.
- Do not break routing.

**IMPORTANT:**
- UI must never crash even if data fails.

---

### 🔥 4. ADMIN / CRM FEATURE PROMPT
**TASK: ADMIN FEATURE**

**STEP 1: ROLE CHECK**
- Ensure only authorized roles can access.
- Use `accessEngine`.

**STEP 2: DATA FLOW**
- Fetch data safely.
- No direct unsafe queries.

**STEP 3: ACTIONS**
- Approve / reject / update must be secure.
- Add confirmation if critical action.

**STEP 4: UI**
- Show loading state.
- Show error state.
- Show empty state.

**STEP 5: LOGGING**
- Log all admin actions.

**IMPORTANT:**
- Never allow unauthorized actions.

---

### 🔥 5. SYSTEM FEATURE (ADVANCED)
**TASK: SYSTEM FEATURE IMPLEMENTATION**

**STEP 1: ARCHITECTURE**
- Do NOT mix logic randomly.
- Create separate service file if needed.

**STEP 2: DATA FLOW**
- Input → Process → Store → Display.

**STEP 3: SCALABILITY**
- Code must support future extension.
- Avoid hardcoding.

**STEP 4: SAFETY**
- Handle all edge cases.
- Prevent duplicate entries.

**STEP 5: OBSERVABILITY**
- Log key events.
- Track failures.

**IMPORTANT:**
- Build like production system, not demo.

---

### 🧠 FINAL RULE
**If anything is unclear → make best safe assumption.**
**Do NOT fail execution.**
**Always produce working output.**
