Role: Frontend Engineer

Stack: 

React 19
TypeScript
Vite
TailwindCSS
Shadcn
Zustand
Zod

## Coding Rules

### TypeScript

- **Strict mode** — all type checks enabled
- **No `any`** — use `unknown` if type is truly unknown
- **Prefer interfaces** — over type aliases for object shapes

```typescript
// ✅ CORRECT
interface User {
  id: string;
  name: string;
  email: string;
}

// ❌ INCORRECT
const user: any = { ... };
```

### React

#### Functional Components Only

```tsx
// ✅ CORRECT
export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};

// ❌ INCORRECT — Class components not allowed
class Button extends Component { ... }
```

#### Component Structure

```tsx
// Pattern: imports → types → component → exports
import { useState } from 'react';
import { Button } from './Button';

interface ButtonProps {
  label: string;
  onClick: () => void;
}

export const Button = ({ label, onClick }: ButtonProps) => {
  return <button onClick={onClick}>{label}</button>;
};
```

### TailwindCSS

- **Only TailwindCSS** — no CSS modules or styled-components
- **Shadcn components** — use shadcn/ui component library
- **CSS variables** — for theme values (colors, spacing)
- **Dark mode** — support both light and dark themes

### Forms

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  email: z.string().email(),
  message: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

const ContactForm = () => {
  const { register, handleSubmit } = useForm<FormData>({
    resolver: zodResolver(schema),
  });
  
  // ...
};
```

### Email (Backend endpoint)

```typescript
// src/lib/api/contact.ts
export async function sendContactEmail(data: ContactEmailData) {
  const response = await fetch(`${API_BASE_URL}/sendEmail`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })

  if (!response.ok) {
    const error = await response.json()
    return { success: false, error }
  }

  const result = await response.json()
  return { success: true, data: result }
}
```

### No Inline Business Logic

```tsx
// ✅ CORRECT — Logic in hooks or utils
const handleSubmit = () => {
  const result = calculateDiscount(price, discount);
  setTotal(result);
};

// ❌ INCORRECT — Inline calculations
const handleSubmit = () => {
  setTotal(price - (price * discount / 100));
};
```

## Component Rules

### Atomic Design

| Level | Examples |
|-------|----------|
| **atoms** | Button, Input, Avatar, Badge |
| **molecules** | SearchBar, ContactForm, MessageBubble |
| **organisms** | ChatInterface, Sidebar, Header |
| **templates** | ChatLayout, PageLayout |
| **pages** | HomePage, ChatPage |

### Component File Structure

```
components/
├── atoms/
│   ├── Button/
│   │   ├── Button.tsx
│   │   └── index.ts
│   └── Input/
│       ├── Input.tsx
│       └── index.ts
├── molecules/
│   └── ContactForm/
│       ├── ContactForm.tsx
│       └── index.ts
└── organisms/
    └── ChatInterface/
        ├── ChatInterface.tsx
        └── index.ts
```

### Export Pattern

```typescript
// index.ts
export { Button } from './Button';
export type { ButtonProps } from './Button';
```
