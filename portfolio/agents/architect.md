Role: Software Architect

Responsibilities: 

- Define system architecture
- Maintain Atomic Design structure
- Define component hierarchy
- Ensure scalability

## Atomic Design Structure

### Hierarchy

```
pages/
  └── HomePage
        └── templates/
              └── ChatLayout
                    └── organisms/
                          ├── ChatInterface
                          │     └── molecules/
                          │           ├── ChatBubble
                          │           ├── ChatInput
                          │           └── SuggestionChips
                          ├── Sidebar
                          │     └── atoms/
                          │           ├── NavItem
                          │           └── SocialLink
                          └── Header
                                └── atoms/
                                      ├── ThemeToggle
                                      └── Logo

data/
  └── responses.ts (static content)

store/
  ├── chatStore.ts (Zustand)
  └── themeStore.ts

lib/
  └── api/
        └── contact.ts (contact form API)
```

### Folder Structure

```
src/
├── components/
│   ├── atoms/
│   ├── molecules/
│   ├── organisms/
│   ├── templates/
│   └── pages/
├── data/
│   └── responses.ts
├── store/
│   ├── chatStore.ts
│   └── themeStore.ts
├── lib/
│   └── api/
│       └── contact.ts
├── hooks/
├── utils/
├── types/
│   └── index.ts
├── styles/
└── App.tsx
```

## Design Principles

### Single Responsibility

Each component has ONE job:
- **atoms**: Primitive UI elements
- **molecules**: Combinations of atoms with simple logic
- **organisms**: Complex components with state management
- **templates**: Layouts without business logic
- **pages**: Route-level components that compose templates

### Component Composition

```tsx
// ✅ Good: Composition over nesting
<Card>
  <CardHeader>
    <CardTitle>Title</CardTitle>
  </CardHeader>
  <CardContent>
    <MessageList messages={messages} />
  </CardContent>
</Card>

// ❌ Bad: Prop drilling
<ParentComponent 
  title="Title" 
  messages={messages} 
  onMessage={handler} 
/>
```

### State Management (Zustand)

```typescript
// store/chatStore.ts
interface ChatState {
  messages: Message[];
  isTyping: boolean;
  sidebarOpen: boolean;
  addMessage: (message: Message) => void;
  clearMessages: () => void;
  setTyping: (typing: boolean) => void;
  toggleSidebar: () => void;
}

export const useChatStore = create<ChatState>((set) => ({
  messages: [],
  isTyping: false,
  sidebarOpen: false,
  addMessage: (message) => 
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
  setTyping: (typing) => set({ isTyping: typing }),
  toggleSidebar: () => 
    set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
```

### Scalability Considerations

| Aspect | Current | When Scaling |
|--------|---------|--------------|
| State | Zustand | React Query for server state |
| Routing | Simple pages | React Router |
| Forms | Zod + react-hook-form | Consider Formik |
| Testing | None | Vitest + RTL |
