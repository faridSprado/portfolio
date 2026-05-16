import os
from fastapi import FastAPI, Response
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
from .routes.api_route import api_route
from .routes.auth import auth_router
from .routes.content import content_router


load_dotenv()

app = FastAPI(
    title="Farid AI Portfolio API",
    description="Backend conversacional con RAG ligero para el portfolio de Farid Stiven Prado Hoyos.",
    version="1.0.0",
)

_default_origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost:4173",
    "http://127.0.0.1:4173",
    "https://faridprado.dev",
    "https://www.faridprado.dev",
    "https://faridprado.vercel.app",
]
origins = [origin.strip() for origin in os.getenv("FRONTEND_ORIGINS", "").split(",") if origin.strip()] or _default_origins

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _health_payload() -> dict[str, str]:
    return {"status": "ok", "service": "farid-ai-portfolio"}


@app.get("/health")
def health() -> dict[str, str]:
    return _health_payload()


@app.head("/health", status_code=200)
def health_head() -> Response:
    return Response(status_code=200)


@app.get("/api/health")
def api_health() -> dict[str, str]:
    return _health_payload()


@app.head("/api/health", status_code=200)
def api_health_head() -> Response:
    return Response(status_code=200)


app.include_router(api_route)
app.include_router(auth_router)
app.include_router(content_router)
