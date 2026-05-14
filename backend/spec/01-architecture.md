# Arquitectura Backend

El backend está construido con FastAPI y organiza la lógica en rutas, controladores, modelos, middleware y servicios.

## Estructura relevante

```text
backend/app
├── controllers
│   ├── agent_controller.py
│   ├── auth_controller.py
│   └── send_email_controller.py
├── db
│   ├── portfolio_content.json
│   └── system_prompt.md
├── middleware
│   └── auth.py
├── models
├── routes
│   ├── api_route.py
│   ├── auth.py
│   └── content.py
└── services
    ├── content_store.py
    ├── context.py
    ├── gemini_connection.py
    └── send_email.py
```

## Flujo de chat

- `POST /chat` recibe el mensaje del visitante.
- `AgentController` delega en `GeminiService`.
- `Context` construye contexto desde el contenido editable actual.
- `GeminiService` llama a Gemini y transmite fragmentos SSE.

## Fuente de verdad

El contenido administrable se guarda en `data/portfolio_content.json`. El archivo `backend/app/db/portfolio_content.json` funciona como semilla/fallback.
