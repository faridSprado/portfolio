# Product Specification

## Project

Personal Developer Portfolio with AI Chat Interface

## Vision

Create a modern developer portfolio with a conversational interface inspired by AI chat systems.

The interface allows visitors to explore:

- Skills (Technologies)
- Projects
- Technical experience
- Contact options

through a chat-based UI.

## Users

### Primary User
Recruiters and potential clients.

### Secondary User
Developers reviewing technical capabilities.

## Core Features

1. **Chat Interface Navigation** — ChatGPT-style conversational UI
2. **Projects Showcase** — Display portfolio projects in chat
3. **Technical Case Study** — Detailed project information per project
4. **Contact Form** — Email delivery via backend endpoint
5. **Responsive UI** — Mobile-first design

## Frontend Stack

| Component | Technology |
|-----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build | Vite 8 |
| State | Zustand 5 |
| Styling | TailwindCSS + Shadcn |
| Forms | react-hook-form + Zod |
| Email | Backend /sendEmail |

## State Management

- **Zustand** — Global chat state (messages, typing indicator, sidebar)
- **Local State** — Component-specific state with useState

## Success Criteria

- Portfolio communicates technical expertise
- Contact messages delivered successfully
- Clean developer experience and architecture
- AI assistant restricted to portfolio topics only
