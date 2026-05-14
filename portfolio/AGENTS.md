# Frontend Coding Standards

> **Index** — See specific files for each section.

## Documentation Structure

| File | Description |
|------|-------------|
| [`agents/frontend.md`](agents/frontend.md) | Stack, React, TypeScript, TailwindCSS patterns |
| [`agents/architect.md`](agents/architect.md) | Atomic Design, component hierarchy |
| [`agents/devops.md`](agents/devops.md) | Docker, CI/CD, deployment |
| [`agents/reviewer.md`](agents/reviewer.md) | Code review rules |
| [`specs/01-product-spec.md`](specs/01-product-spec.md) | Feature specification |
| [`specs/02-architecture.md`](specs/02-architecture.md) | Technical design |
| [`specs/03-tasks.md`](specs/03-tasks.md) | Implementation tasks |

## Quick Reference

### Tech Stack

- **Framework**: React 19
- **Language**: TypeScript 5.9 (strict mode)
- **Build**: Vite
- **State**: Zustand
- **Styling**: TailwindCSS + Shadcn
- **Forms**: react-hook-form + Zod
- **Email**: Backend /sendEmail

### Git Workflow

```
dev → development
test → staging
main → production
```
