# Portfolio — Farid Stiven Prado Hoyos

## Project Overview

Professional portfolio with AI assistant integrated for recruiters.

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                        portfolio/                                │
│                 Frontend (React 19, TypeScript)                 │
│                   Atomic Design + Zustand                        │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP /chat
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        backend/                                  │
│                FastAPI + Ollama (RAG)                            │
│           Professional AI Assistant (Farid)               │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ LLM
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                        ollama/                                   │
│                  Local LLM (qwen2.5:0.5b)                       │
└─────────────────────────────────────────────────────────────────┘
```

## Agents & Delegation

When working on this project, follow these delegation rules:

### Agent Selection

| If the task is about... | Delegate to | Documentation |
|------------------------|-------------|---------------|
| UI components, pages, styling | Frontend | See `portfolio/AGENTS.md` |
| API endpoints, AI | Backend | See `backend/AGENTS.md` |
| Docker, CI/CD, deployment | DevOps | See `backend/.agents/devops.md` |
| Code review, PR validation | Reviewer | See `backend/.agents/reviewer.md` |
| Architecture decisions | Architect | See `backend/.agents/architect.md` |
| New skills for AI agents | Skill Creation | See `skill-creator` skill |

### Frontend Stack

- **Framework**: React 19 + Vite 8
- **Language**: TypeScript 5.9 (strict mode)
- **State**: Zustand 5
- **Styling**: TailwindCSS + Shadcn
- **Forms**: react-hook-form + Zod
- **Architecture**: Atomic Design
- **Email**: Resend API

### Backend Stack

- **Framework**: FastAPI + Uvicorn
- **Language**: Python 3.12
- **AI**: Ollama
- **Validation**: Pydantic
- **Computing**: numpy (cosine similarity)

### Infrastructure

- **Containerization**: Docker Compose
- **Services**: Ollama, Backend (FastAPI), Frontend (Vite)
- **Ports**: Frontend (5173), Backend (8000), Ollama (11434)

## Git Workflow

```
dev → development
test → staging
main → production
```

## Quick Start

```bash
# Start all services
docker compose up --build

# Or run locally
cd portfolio && npm run dev     # Frontend
cd backend && uvicorn app.main:app --reload  # Backend
```

## Documentation Index

| Documentation | Location | Purpose |
|---------------|----------|---------|
| Frontend Standards | `portfolio/AGENTS.md` | TypeScript, React, Atomic Design rules |
| Backend Standards | `backend/AGENTS.md` | Index to backend docs |
| Backend Agent Rules | `backend/.agents/backend.md` | Python, FastAPI, Ollama, RAG |
| Architecture | `backend/.agents/architect.md` | Module structure, POO |
| DevOps | `backend/.agents/devops.md` | Docker, CI/CD, env vars |
| Code Review | `backend/.agents/reviewer.md` | PR checklist |
| Product Spec | `backend/specs/01-product-spec.md` | Features, API contract |
| Technical Design | `backend/specs/02-architecture.md` | Architecture diagrams |
| Tasks | `backend/specs/03-tasks.md` | Implementation status |
