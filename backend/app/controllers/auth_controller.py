from ..middleware.auth import AuthService
from ..models.token import TokenRequest, TokenResponse, RefreshRequest, RefreshResponse


class TokenController:
    def __init__(self):
        self.auth_service = AuthService()

    def create_token(self, request: TokenRequest) -> TokenResponse:
        if not self.auth_service.verify_credentials(request.client_id, request.client_secret):
            from fastapi import HTTPException, status
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid credentials",
            )
        return self.auth_service.create_token_response(request.client_id)

    def refresh_token(self, request: RefreshRequest) -> RefreshResponse:
        return self.auth_service.refresh_access_token(request.refresh_token)