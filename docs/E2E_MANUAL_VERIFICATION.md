# Manual E2E Verification Checklist

## AI Chat Context Per Section — E2E Test Scenarios

### Prerequisites

- [ ] Backend running: `cd backend && uvicorn app.main:app --reload`
- [ ] Frontend running: `cd portfolio && pnpm dev`
- [ ] Ollama running with `qwen2.5:0.5b` model
- [ ] Browser DevTools Network tab open to verify API calls

---

## Test Scenario 1: Initial State

**Purpose**: Verify initial section state is null

- [ ] Open the portfolio application
- [ ] Verify chat input is enabled (not disabled)
- [ ] Verify placeholder text shows "Escribi un mensaje..."
- [ ] Open DevTools → Application → check Zustand state if possible
- [ ] Expected: `currentSection` should be `null`

---

## Test Scenario 2: About Section Context

**Purpose**: Verify AI responds with About-focused context

1. [ ] Click "Sobre mi" in the sidebar
2. [ ] Verify assistant responds with About section intro
3. [ ] Type a question: "What are your values?"
4. [ ] Check Network tab: POST /chat body should include `"section": "about"`
5. [ ] Verify AI response focuses on:
   - [ ] Professional profile and background
   - [ ] Personal values and work philosophy
   - [ ] Education and learning
6. [ ] Ask "What projects have you built?" — response should mention projects but focus remains on About context

**Expected**: AI prioritizes personal/professional background over technical details

---

## Test Scenario 3: Projects Section Context

**Purpose**: Verify AI responds with Projects-focused context

1. [ ] Click "Proyectos" in the sidebar
2. [ ] Verify assistant responds with Projects intro
3. [ ] Type a question: "What technologies do you use?"
4. [ ] Check Network tab: POST /chat body should include `"section": "projects"`
5. [ ] Verify AI response focuses on:
   - [ ] Technical projects
   - [ ] Technologies and frameworks
   - [ ] Architecture decisions
6. [ ] Ask "What's your background?" — response should mention background but focus remains on technical aspects

**Expected**: AI prioritizes technical details and project work

---

## Test Scenario 4: Experience Section Context

**Purpose**: Verify AI responds with Experience-focused context

1. [ ] Click "Experiencia" in the sidebar
2. [ ] Verify assistant responds with Experience intro
3. [ ] Type a question: "What companies have you worked for?"
4. [ ] Check Network tab: POST /chat body should include `"section": "experience"`
5. [ ] Verify AI response focuses on:
   - [ ] Work history and roles
   - [ ] Career achievements
   - [ ] Professional growth
6. [ ] Ask "What are your technical skills?" — response should mention skills but focus remains on career context

**Expected**: AI prioritizes work history and professional roles

---

## Test Scenario 5: Contact Section Disabled

**Purpose**: Verify chat is disabled in Contact section

1. [ ] Send a message in any section first (so chat history exists)
2. [ ] Click "Contacto" in the sidebar
3. [ ] Verify:
   - [ ] Chat input field is disabled (cannot type)
   - [ ] Placeholder shows "Chat deshabilitado en la sección Contacto"
   - [ ] Send button is disabled
   - [ ] Previous chat messages remain visible
   - [ ] Can scroll through chat history
4. [ ] Verify contact form flow starts (asks for name)
5. [ ] Try to interact with contact form — should work normally

**Expected**: Chat input disabled, contact form works, history visible

---

## Test Scenario 6: Re-enable Chat After Contact

**Purpose**: Verify chat re-enables when leaving Contact section

1. [ ] Navigate to Contact section (chat should be disabled)
2. [ ] Click "Sobre mi" section
3. [ ] Verify:
   - [ ] Chat input is now enabled
   - [ ] Placeholder reverts to "Escribi un mensaje..."
   - [ ] Send button becomes active
   - [ ] Can type and send messages

**Expected**: Chat functionality restored when leaving Contact

---

## Test Scenario 7: Section Context Persists in Conversation

**Purpose**: Verify section context stays consistent during conversation

1. [ ] Click "Proyectos" section
2. [ ] Send message: "Tell me about your projects"
3. [ ] Check Network: section should be "projects"
4. [ ] Send another message: "What technologies?"
5. [ ] Check Network: section should still be "projects"
6. [ ] Send third message: "Architecture decisions?"
7. [ ] Check Network: section should still be "projects"

**Expected**: All API calls in same section have consistent section parameter

---

## Test Scenario 8: Backward Compatibility (No Section)

**Purpose**: Verify API works without section parameter

1. [ ] Using curl or Postman, send request:
   ```bash
   curl -X POST http://localhost:8000/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello"}'
   ```
2. [ ] Verify response returns 200 with valid response
3. [ ] No errors in backend logs

**Expected**: API backward compatible with no section field

---

## Test Scenario 9: Invalid Section Handling

**Purpose**: Verify API gracefully handles invalid sections

1. [ ] Using curl or Postman, send request:
   ```bash
   curl -X POST http://localhost:8000/chat \
     -H "Content-Type: application/json" \
     -d '{"message": "Hello", "section": "invalid"}'
   ```
2. [ ] Verify response returns 422 validation error (Pydantic Literal validation)

**Expected**: Pydantic rejects invalid section values

---

## Test Scenario 10: Page Refresh Resets Section

**Purpose**: Verify section resets on page refresh

1. [ ] Navigate to "Proyectos" section
2. [ ] Refresh the page (F5)
3. [ ] Verify chat input is enabled
4. [ ] Send a message
5. [ ] Check Network: section should be null or omitted

**Expected**: currentSection resets to null after refresh

---

## Bug Reporting Template

If any test fails, document using this template:

```
## Bug: [Brief Description]

**Test Scenario**: #[number]
**Expected**: [What should happen]
**Actual**: [What actually happened]
**Steps to Reproduce**:
1. 
2. 
3. 

**Screenshots/Logs**: [Attach if relevant]
**Browser**: [Chrome/Firefox/Safari version]
```

---

## Sign-off

| Tester | Date | Pass/Fail | Notes |
|--------|------|-----------|-------|
|        |      |           |       |

---

*Generated by SDD Apply Phase for change: ai-chat-per-section*
