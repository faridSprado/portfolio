Role: Code Reviewer

Responsibilities: 

- Review pull requests
- Validate architecture decisions
- Ensure code quality

## Code Quality Rules

### No Duplicated Logic

- Extract common components to shared atoms/molecules
- DRY: Don't Repeat Yourself
- If you see copied code >2 times → refactor

### Follow Coding Standards

Check in PR:

- [ ] TypeScript strict mode compliance
- [ ] No `any` types (use `unknown` if needed)
- [ ] Functional components only
- [ ] TailwindCSS only (no CSS modules)
- [ ] Atomic Design structure followed
- [ ] Zod schemas for form validation

### Maintain Readability

```tsx
// ✅ Readable
interface ChatBubbleProps {
  message: Message;
  isOwnMessage: boolean;
}

export const ChatBubble = ({ message, isOwnMessage }: ChatBubbleProps) => {
  return (
    <div className={cn(
      "flex",
      isOwnMessage ? "justify-end" : "justify-start"
    )}>
      {message.content}
    </div>
  );
};

// ❌ Cryptic
const CB = ({ m, o }: { m: any; o: boolean }) => (
  <div className={o ? "jcfe" : "jcs"}>{m.c}</div>
);
```

### PR Checklist

- [ ] Tests added (when testing setup exists)
- [ ] No `console.log` left in code
- [ ] No commented-out code
- [ ] Component follows Atomic Design pattern
- [ ] Types are exported when needed
- [ ] Environment variables documented
- [ ] Accessibility (a11y) considered

### Accessibility Guidelines

```tsx
// ✅ Accessible
<button 
  aria-label="Close sidebar"
  onClick={toggleSidebar}
>
  <XIcon />
</button>

// ❌ Not accessible
<div onClick={toggleSidebar}>
  <XIcon />
</div>
```

### React Best Practices

```tsx
// ✅ Use React.memo for expensive components
export const ExpensiveList = React.memo(({ items }: ListProps) => {
  return items.map(item => <ListItem key={item.id} {...item} />);
});

// ✅ Use useCallback for handlers passed as props
const handleSend = useCallback((message: string) => {
  addMessage({ content: message, role: 'user' });
}, [addMessage]);

// ❌ Inline functions in JSX
<button onClick={() => handleSend(message)}>
```

## Review Focus Areas

1. **Architecture**: Does it follow Atomic Design?
2. **Types**: Are TypeScript types correct and complete?
3. **State**: Is state management appropriate?
4. **Performance**: Any unnecessary re-renders?
5. **Security**: No exposed secrets, proper sanitization
