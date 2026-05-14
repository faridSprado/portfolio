# Farid AI Portfolio

Portfolio profesional conversacional de **Farid Stiven Prado Hoyos**.

**Link:** https://faridprado.vercel.app

El proyecto combina una interfaz moderna de portfolio con un asistente de IA que responde sobre el perfil, proyectos, trayectoria, habilidades y datos de contacto de Farid. El contenido se administra desde un panel privado y se guarda en un JSON persistente dentro del proyecto.

## Stack principal

- **Frontend:** React, TypeScript, Vite y Tailwind CSS.
- **Backend:** FastAPI, Python y streaming SSE.
- **IA:** Gemini API / Google AI Studio mediante `google-genai`.
- **Contenido editable:** `data/portfolio_content.json`.
- **Admin privado:** `/admin` protegido con `ADMIN_SECRET`.
- **Contacto:** formulario conversacional con Resend.
- **Infraestructura:** Docker Compose, Nginx, healthchecks y configuración para VPS/Dokploy.
- **Extras técnicos:** herramientas en Go, Rust, SQL y Bash para ampliar la diversidad tecnológica del repositorio.

## Estructura

```text
.
├── backend/                  # API FastAPI + Gemini + contenido editable
├── portfolio/                # Frontend React/Vite
├── data/                     # Contenido persistente del portfolio
├── db/                       # Esquema SQL portable futuro
├── docs/                     # Guías de uso y verificación
├── nginx/                    # Proxy para Docker Compose
├── tools/                    # Utilidades en Go y Rust
├── docker-compose.yml
└── README.md
```

## Preparar variables de entorno

Copia los ejemplos y coloca tus valores reales localmente o en tu plataforma de deploy:

```bash
cp .env.example .env
cp backend/.env.example backend/.env
cp portfolio/.env.example portfolio/.env
```

Variables clave:

- `GEMINI_API_KEY`: API key de Google AI Studio.
- `GEMINI_MODEL`: modelo Gemini. Por defecto: `gemini-2.5-flash`.
- `ADMIN_SECRET`: clave privada para entrar y guardar cambios desde `/admin`.
- `SECRET_KEY`: clave fuerte para firmar JWT.
- `CLIENT_ID` y `CLIENT_SECRET`: credenciales usadas por el frontend para solicitar token público.
- `FRONTEND_ORIGINS`: orígenes permitidos por CORS.
- `RESEND_API_KEY`, `RESEND_FROM_EMAIL`, `CONTACT_EMAIL`: envío de contacto.

> Los archivos `.env` reales no deben subirse al repositorio. Solo se versionan los `.env.example`.

## Desarrollo local en Windows / VS Code

Backend:

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

Frontend:

```powershell
cd portfolio
pnpm install
pnpm dev
```

Abre:

```text
http://localhost:5173
```

Admin:

```text
http://localhost:5173/admin
```

## Desarrollo local con Docker

```bash
cp .env.example .env
# Edita GEMINI_API_KEY, ADMIN_SECRET, SECRET_KEY y CLIENT_SECRET
docker compose up --build
```

Con la configuración incluida, el proxy queda disponible en:

```text
http://localhost:8080
```

## Contenido editable

El panel privado guarda los cambios en:

```text
data/portfolio_content.json
```

Ese archivo es la fuente principal para:

- Cards públicas del portfolio.
- Proyectos, imágenes, enlaces y tecnologías.
- Trayectoria/experiencia.
- Texto de perfil/about.
- Ecosistema técnico.
- Contexto recuperado por el asistente de IA.

También se mantiene sincronizado el contenido semilla en:

```text
backend/app/db/portfolio_content.json
```

y el fallback del frontend en:

```text
portfolio/src/data/defaultContent.ts
```

## Imágenes de proyectos

Guarda imágenes públicas en:

```text
portfolio/public/projects
```

En el admin usa rutas relativas, por ejemplo:

```text
/projects/InsightAgent-SaaG.png
```

No uses rutas de Windows ni `localhost` dentro del contenido si vas a desplegarlo.

## Endpoints principales

| Método | Ruta | Descripción |
|---|---|---|
| GET | `/health` | Healthcheck |
| GET | `/content` | Contenido público del portfolio |
| GET | `/admin/content` | Lee contenido con `X-Admin-Secret` |
| PUT | `/admin/content` | Guarda contenido con `X-Admin-Secret` |
| POST | `/auth/token` | Obtiene access token y refresh token |
| POST | `/auth/refresh` | Refresca access token |
| POST | `/chat` | Chat conversacional con Gemini + contexto editable |
| POST | `/sendEmail` | Envío de contacto |

## Scripts útiles

Frontend:

```bash
cd portfolio
pnpm install
pnpm build
pnpm lint
```

Backend:

```bash
cd backend
python -m compileall app
```

Auditoría Go del contenido:

```bash
go run tools/go-content-audit/main.go data/portfolio_content.json
```