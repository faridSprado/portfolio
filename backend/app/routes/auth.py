from fastapi import APIRouter, Depends, HTTPException, status

from ..controllers.auth_controller import TokenController
from ..middleware.auth import get_current_user, TokenPayload
from ..models.token import TokenRequest, TokenResponse, RefreshRequest, RefreshResponse

auth_router = APIRouter(prefix="/auth", tags=["auth"])


def get_token_controller():
    return TokenController()


@auth_router.post("/token", response_model=TokenResponse)
def get_token(
    request: TokenRequest,
    controller: TokenController = Depends(get_token_controller),
):
    return controller.create_token(request)


@auth_router.post("/refresh", response_model=RefreshResponse)
def refresh_token(
    request: RefreshRequest,
    controller: TokenController = Depends(get_token_controller),
):
    return controller.refresh_token(request)


@auth_router.get("/verify")
def verify_token(current_user: TokenPayload = Depends(get_current_user)):
    return {"valid": True, "sub": current_user.sub}