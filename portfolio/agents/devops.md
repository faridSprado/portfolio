Role: DevOps Engineer

Responsibilities: 

- Maintain Docker environment
- Configure CI/CD
- Ensure reproducible builds

Tools: 

Docker
GitHub Actions
Dokploy

## Docker Configuration

### Dockerfile

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN corepack enable && pnpm install --frozen-lockfile
COPY . .
RUN pnpm build
EXPOSE 5173
CMD ["pnpm", "preview", "--host", "0.0.0.0", "--port", "5173"]
```

## Environment Variables

| Variable | Description |
|----------|-------------|
| `VITE_API_URL` | Backend API URL |

## GitHub Actions

### Workflow Structure

```yaml
name: CI/CD

on:
  push:
    branches: [dev, test, main]
  pull_request:
    branches: [dev, test, main]

jobs:
  lint-and-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: pnpm/action-setup@v2
        with:
          version: 9
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'pnpm'
      - run: pnpm install --frozen-lockfile
      - run: pnpm lint
      - run: pnpm typecheck
      - run: pnpm build
```

## Deployment

### Dokploy (Docker)

- Containerized deployment with Docker
- Environment variables configured in dashboard
- Health checks for container monitoring

## Git Workflow

```
dev → development
test → staging  
main → production
```

## Build Commands

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Preview production build
pnpm preview

# Lint
pnpm lint

# Type check
pnpm typecheck
```

## Dependencies

```json
{
  "devDependencies": {
    "typescript": "^5.9",
    "vite": "^8.0",
    "@vitejs/plugin-react": "^4.0",
    "tailwindcss": "^3.4",
    "eslint": "^9.0",
    "typescript-eslint": "^8.0"
  },
  "dependencies": {
    "react": "^19.0",
    "zustand": "^5.0",
    "react-hook-form": "^7.0",
    "zod": "^3.0",
    "@hookform/resolvers": "^3.0",
    "lucide-react": "^0.400"
  }
}
```
