# Desarrollo local en Windows

## Requisitos

- Node.js LTS
- pnpm
- Python 3.11+
- API key de Gemini / Google AI Studio

## Variables

Backend: `backend/.env`

```env
GEMINI_API_KEY=tu_api_key_de_gemini
GEMINI_MODEL=gemini-2.5-flash
GEMINI_TEMPERATURE=0.55
GEMINI_MAX_OUTPUT_TOKENS=2500
ADMIN_SECRET=change-this-admin-secret
PORTFOLIO_CONTENT_PATH=../data/portfolio_content.json
SECRET_KEY=change-this-with-a-secure-random-key-min-32-chars
CLIENT_ID=portfolio-client
CLIENT_SECRET=change-this-client-secret
FRONTEND_ORIGINS=http://localhost:5173,http://127.0.0.1:5173
```

Frontend: `portfolio/.env`

```env
VITE_API_URL=http://localhost:8000
VITE_CLIENT_ID=portfolio-client
VITE_CLIENT_SECRET=change-this-client-secret
```

`CLIENT_SECRET` y `VITE_CLIENT_SECRET` deben coincidir en desarrollo.

## Ejecutar backend

```powershell
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
```

## Ejecutar frontend

```powershell
cd portfolio
pnpm install
pnpm dev
```

Abre `http://localhost:5173` y `/admin` para administrar contenido.
