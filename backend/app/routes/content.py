import hmac
import os
from typing import Any

from fastapi import APIRouter, Header, HTTPException, status

from app.services.github_sync import GitHubSyncError, sync_portfolio_content_to_github

from ..models.content import PortfolioContent
from ..services.content_store import PortfolioContentStore

from pathlib import Path

content_router = APIRouter()
store = PortfolioContentStore()


def _admin_secret_candidates() -> list[str]:
    """Return accepted admin secrets.

    ADMIN_SECRET is the canonical variable. ADMIN_TOKEN is accepted as a
    compatibility alias for local setups that followed older instructions.
    The two local development defaults are accepted only when no env value was
    configured, so the admin panel is easier to test right after unzipping.
    """
    configured = [
        os.getenv("ADMIN_SECRET", "").strip(),
        os.getenv("ADMIN_TOKEN", "").strip(),
    ]
    configured = [secret for secret in configured if secret]
    if configured:
        return configured
    return ["change-this-admin-secret", "dev-admin-secret-change-me"]


def require_admin_secret(x_admin_secret: str = Header(default="")) -> None:
    provided = x_admin_secret.strip()
    if not provided or not any(
        hmac.compare_digest(provided, expected)
        for expected in _admin_secret_candidates()
    ):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Admin secret inválido",
        )


def _content_to_json_dict(content: PortfolioContent) -> dict[str, Any]:
    """Convert Pydantic content to a JSON-compatible dict."""
    if hasattr(content, "model_dump"):
        return content.model_dump(mode="json")
    return content.dict()


@content_router.get("/content", response_model=PortfolioContent)
def get_content() -> PortfolioContent:
    return store.load()

@content_router.get("/content/debug")
def get_content_debug() -> dict[str, str | bool]:
    path = store.content_path
    return {
        "content_path": str(path),
        "resolved_path": str(path.resolve()),
        "exists": path.exists(),
        "headline": store.load().profile.headline,
    }

@content_router.get("/admin/content", response_model=PortfolioContent)
def get_admin_content(x_admin_secret: str = Header(default="")) -> PortfolioContent:
    require_admin_secret(x_admin_secret)
    return store.load()


@content_router.put("/admin/content", response_model=PortfolioContent)
async def update_content(
    content: PortfolioContent,
    x_admin_secret: str = Header(default=""),
) -> PortfolioContent:
    require_admin_secret(x_admin_secret)

    saved_content = store.save(content)

    try:
        await sync_portfolio_content_to_github(_content_to_json_dict(saved_content))
    except GitHubSyncError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=(
                "El contenido se guardó en Render, pero no se pudo publicar "
                f"en GitHub: {exc}"
            ),
        ) from exc

    return saved_content