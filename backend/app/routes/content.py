import hmac
import os
from fastapi import APIRouter, Header, HTTPException, status

from ..models.content import PortfolioContent
from ..services.content_store import PortfolioContentStore

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


@content_router.get("/content", response_model=PortfolioContent)
def get_content() -> PortfolioContent:
    return store.load()


@content_router.get("/admin/content", response_model=PortfolioContent)
def get_admin_content(x_admin_secret: str = Header(default="")) -> PortfolioContent:
    require_admin_secret(x_admin_secret)
    return store.load()


@content_router.put("/admin/content", response_model=PortfolioContent)
def update_content(content: PortfolioContent, x_admin_secret: str = Header(default="")) -> PortfolioContent:
    require_admin_secret(x_admin_secret)
    return store.save(content)
