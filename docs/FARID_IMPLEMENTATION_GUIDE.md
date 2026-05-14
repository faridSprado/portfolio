# Guía de implementación

## Componentes principales

| Área | Archivo |
|---|---|
| API principal | `backend/app/main.py` |
| Chat Gemini | `backend/app/services/gemini_connection.py` |
| Contexto editable | `backend/app/services/context.py` |
| Store JSON persistente | `backend/app/services/content_store.py` |
| Rutas de chat/contacto | `backend/app/routes/api_route.py` |
| Rutas admin/contenido | `backend/app/routes/content.py` |
| Frontend principal | `portfolio/src/App.tsx` |
| Chat UI | `portfolio/src/components/organisms/ChatInterface/ChatInterface.tsx` |
| Sidebar | `portfolio/src/components/organisms/Sidebar/Sidebar.tsx` |
| Admin | `portfolio/src/components/organisms/AdminPanel/AdminPanel.tsx` |
| Fallback de contenido | `portfolio/src/data/defaultContent.ts` |

## Flujo del asistente

1. El usuario escribe en el chat.
2. El frontend solicita token si lo necesita.
3. El frontend llama `POST /chat`.
4. El backend recupera contenido desde `data/portfolio_content.json`.
5. Gemini responde en streaming SSE.
6. El frontend muestra la respuesta progresivamente.

## Flujo del admin

1. El usuario abre `/admin`.
2. Ingresa `ADMIN_SECRET`.
3. El frontend consulta o guarda con `X-Admin-Secret`.
4. El backend persiste cambios en `data/portfolio_content.json`.
5. El portfolio y el asistente usan ese contenido actualizado.

## Antes de subir a producción

- Define `GEMINI_API_KEY` en el backend o plataforma de deploy.
- Cambia `ADMIN_SECRET`, `SECRET_KEY` y `CLIENT_SECRET`.
- Verifica `FRONTEND_ORIGINS` con tu dominio real.
- No subas archivos `.env` reales.
- Mantén `data/portfolio_content.json` versionado si quieres que GitHub tenga tu contenido actual.
