# Architecture Specification

## Frontend Stack

| Component | Technology |
|-----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 (strict mode) |
| Build | Vite 8 |
| State | Zustand 5 |
| Styling | TailwindCSS 3.4 |
| UI Components | Shadcn |
| Forms | react-hook-form + Zod |
| Email | Backend /sendEmail |

## Architecture Pattern

**Atomic Design**

```
atoms          → Primitive UI (Button, Input, Avatar)
molecules      → Simple combinations (SearchBar, ContactForm)
organisms      → Complex components (ChatInterface, Sidebar)
templates      → Layouts without logic (ChatLayout)
pages          → Route-level compositions (HomePage)
```

## Folder Structure

```
src/
├── components/
│   ├── atoms/
│   │   ├── Button/
│   │   ├── Input/
│   │   ├── Avatar/
│   │   └── Badge/
│   ├── molecules/
│   │   ├── ChatBubble/
│   │   ├── ChatInput/
│   │   ├── SuggestionChips/
│   │   └── ContactForm/
│   ├── organisms/
│   │   ├── ChatInterface/
│   │   ├── Sidebar/
│   │   └── Header/
│   ├── templates/
│   │   └── ChatLayout/
│   └── pages/
│       └── HomePage/
├── data/
│   └── responses.ts (chat content data)
├── store/
│   ├── chatStore.ts (Zustand)
│   └── themeStore.ts (theme state)
├── lib/
│   └── api/
│       └── contact.ts (contact form API)
│   └── api/
│       └── contact.ts (contact form API)
├── hooks/
├── utils/
├── types/
│   └── index.ts (global types)
├── styles/
└── App.tsx
```

## State Management

### Zustand Stores

```typescript
// chatStore.ts
interface ChatState {
  messages: Message[];
  isTyping: boolean;
  sidebarOpen: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setTyping: (typing: boolean) => void;
  toggleSidebar: () => void;
}

// themeStore.ts
interface ThemeState {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
}
```

## API Integration

### Contact Form

```typescript
// POST /sendEmail
interface ContactRequest {
  name: string;
  email: string;
  message: string;
}

interface ContactResponse {
  success: boolean;
  message: string;
}
```

## Git Strategy

```
main → production
test → staging
dev → development
```

## CI/CD

**GitHub Actions**

Pipeline:
1. Install dependencies (pnpm)
2. Run lint
3. Run typecheck
4. Build project

## Known Issues

### 1. Client/Backend Contract Drift (MEDIUM)

- **Severity**: CRITICAL
- **Location**: `src/lib/api/contact.ts`
- **Problem**: Frontend endpoint must match backend contract
- **Fix**: Align frontend to POST `/sendEmail`

### 2. Dead Code: ContactForm

- **Severity**: Low
- **Location**: `src/components/molecules/ContactForm/ContactForm.tsx`
- **Problem**: Component exists but NOT imported in ChatInterface or Sidebar — never rendered
- **Fix**: Delete or integrate into chat

### 3. Incomplete Feature: New Conversation

- **Severity**: Medium
- **Location**: `src/store/chatStore.ts`
- **Problem**: `clearMessages()` function exists but "New Conversation" button is not connected
- **Fix**: Add button that calls `clearMessages()`

### 4. No Tests

- **Severity**: Medium
- **Location**: Project without test folder
- **Problem**: No test coverage configured
- **Fix**: Add Vitest + React Testing Library

### 5. Hardcoded Links

- **Severity**: Low
- **Location**: `src/components/organisms/Sidebar/Sidebar.tsx`
- **Problem**: Social links hardcoded, not environment variables
- **Fix**: Move to config or env vars

## Future Considerations

- [ ] Chat history persistence (localStorage/DB)
- [ ] Real-time AI responses via backend
- [ ] More interactive project showcases
- [ ] Analytics integration
