# Development Tasks

> Portfolio with ChatGPT-style conversational UI. Sidebar sections act as "chat history" —
> clicking a section renders its content in the main chat container as an assistant response.

---

## Phase 1 — Project Setup ✅

- [x] **TASK-001** — Initialize React + TypeScript project with Vite 8
- [x] **TASK-002** — Install and configure TailwindCSS v3 with PostCSS, dark mode, CSS variables
- [x] **TASK-003** — Set up Atomic Design folder structure (`atoms/`, `molecules/`, `organisms/`, `templates/`, `pages/`)
- [x] **TASK-004** — Configure ESLint (Prettier not used)
- [x] **TASK-005** — Define base types (`Message`, `SidebarSection`, `ChatState`, `ThemeState`)
- [x] **TASK-006** — Create Zustand stores: `chatStore` + `themeStore`
- [x] **TASK-007** — Create placeholder data in `src/data/responses.ts`

---

## Phase 2 — Chat Interface Shell ✅ DONE

- [x] **TASK-010** — Create `ChatInterface` organism with welcome screen and typing indicator
- [x] **TASK-011** — Create `ChatBubble` molecule (renders a single message)
- [x] **TASK-012** — Create `ChatInput` molecule (expandable textarea, Enter to send, Shift+Enter newline)
- [x] **TASK-013** — Create `Sidebar` organism with section list, social links, theme toggle
- [x] **TASK-014** — Create `ContactForm` molecule with Zod validation (exists but orphaned)
- [x] **TASK-015** — Create suggestion chips in `WelcomeScreen`

---

## Iteration 1 — "Sobre mí" Section ✅ DONE

> Goal: First end-to-end proof that clicking a sidebar section injects content into the chat.

- [x] **TASK-100** — Define `SectionContent` data structure  
- [x] **TASK-101** — Create "Sobre mí" content data  
- [x] **TASK-102** — Wire sidebar "Sobre mí" button to inject assistant message  
- [x] **TASK-103** — Add simulated typing delay utility  

### Chat Layout Adjustments (completed as part of Iteration 1)

- [x] **TASK-CHAT-001** — Center messages with rounded bubble styling
- [x] **TASK-CHAT-002** — Align assistant messages left, user messages right
- [x] **TASK-CHAT-003** — Add separator line between role changes
- [x] **TASK-CHAT-004** — Position avatars on outer side of each bubble
- [x] **TASK-CHAT-005** — Align user name and text left within user bubble

---

## Iteration 2 — "Proyectos" Section 🔲

> Goal: Rich content inside chat — project cards rendered as an assistant message.

- [ ] **TASK-200** — Design project data model  
  ```typescript
  interface Project {
    title: string;
    description: string;
    technologies: string[];
    projectUrl?: string;
    repoUrl?: string;
    imageUrl?: string;
  }
  ```

- [ ] **TASK-201** — Create `ProjectCard` molecule  
  Renders single project with title, description, tech tags, and links.

- [ ] **TASK-202** — Extend `Message` type for rich content rendering  
  `ChatBubble` needs to detect `contentType` and render appropriate layout.

- [ ] **TASK-203** — Create project data  
  Populate `src/data/` with real projects (3-4 entries).

- [ ] **TASK-204** — Wire sidebar "Proyectos" button  
  Inject project cards using typing simulation.

---

## Iteration 3 — "Experiencia" Section 🔲

> Goal: Work experience timeline rendered in chat.

- [ ] **TASK-300** — Design experience data model  
  ```typescript
  interface Experience {
    company: string;
    role: string;
    period: { start: string; end: string };
    description: string;
    technologies: string[];
  }
  ```

- [ ] **TASK-301** — Create `ExperienceCard` molecule  
  Timeline or card style, responsive.

- [ ] **TASK-302** — Create experience data  
  Populate `src/data/` with work experience entries.

- [ ] **TASK-303** — Wire sidebar "Experiencia" button  

---

## Iteration 4 — "Contacto" Section 🔲

> Goal: Contact form rendered inline as a chat message.

- [x] **TASK-400** — ContactForm exists but NOT connected  
  > Note: Component exists but never rendered in chat.

- [ ] **TASK-401** — Integrate `ContactForm` in rich message system  
  Handle form submission feedback as new assistant message.

- [ ] **TASK-402** — Integrate backend `/sendEmail` endpoint

---

## Iteration 5 — Polish & Interactions 🔲

> Goal: Connect remaining UI pieces, improve UX.

- [ ] **TASK-500** — Wire suggestion chips in `WelcomeScreen`  
  Each chip triggers same section response as sidebar click.

- [ ] **TASK-501** — Wire "New conversation" button to `clearMessages()`  
  > Note: `clearMessages()` exists in `chatStore.ts` but not connected.

- [x] **TASK-502** — Personalize social links  
  > Note: Links hardcoded in `Sidebar.tsx`, not environment variables.

- [ ] **TASK-503** — Mobile responsive sidebar  
  Auto-collapse on small screens, overlay with backdrop.

---

## Iteration 6 — DevOps 🔲

> Goal: Fix CI/CD pipeline and containerization.

- [ ] **TASK-600** — Review: Dokploy deployment (Docker)  
  > Note: Uses Dokploy with Docker, not Vercel. Dockerfile needs pnpm update.

- [ ] **TASK-601** — Fix GitHub Actions workflow  
  Move to `.github/workflows/`, update to use pnpm, remove `|| true` from lint.

---

## Dependency Summary

```
TASK-100 (SectionContent type)
  ├── TASK-101 (sobre mí data) ──┐
  ├── TASK-103 (typing helper) ──┤
  │                              ├── TASK-102 (wire sobre mí)
  │                              │
  ├── TASK-202 (rich messages) ──┤
  │   ├── TASK-201 (ProjectCard) │
  │   │                          ├── TASK-204 (wire proyectos)
  │   │   TASK-203 (project data)┘
  │   │
  │   ├── TASK-301 (ExperienceCard)
  │   │                          ┌── TASK-303 (wire experiencia)
  │   │   TASK-302 (exp data) ───┘
  │   │
  │   └────────────────────────────── TASK-400 (wire contacto)
  │                                     └── TASK-401 (form integration)
  │                                           └── TASK-402 (/sendEmail integration)
  │
  └── TASK-500 (suggestion chips) — depends on all 4 sections wired

TASK-501, TASK-502, TASK-503, TASK-600, TASK-601 — independent
```

---

## Running Tasks

```bash
# Install dependencies
pnpm install

# Development
pnpm dev

# Build
pnpm build

# Preview
pnpm preview

# Lint
pnpm lint

# Type check
pnpm typecheck
```
