import os
from datetime import datetime, timedelta
from typing import Optional

from fastapi import Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from pydantic import BaseModel

from ..models.token import TokenResponse, RefreshResponse


class TokenPayload(BaseModel):
    sub: str
    exp: int
    type: str


class AuthService:
    def __init__(self):
        self.secret_key = os.getenv("SECRET_KEY") or "dev-only-secret-key-change-in-production"
        self.algorithm = "HS256"
        self.client_id = os.getenv("CLIENT_ID") or "portfolio-client"
        self.client_secret = os.getenv("CLIENT_SECRET") or "dev-secret-change-in-production"
        self.access_token_expire_minutes = 30
        self.refresh_token_expire_days = 7

    def verify_credentials(self, client_id: str, client_secret: str) -> bool:
        return client_id == self.client_id and client_secret == self.client_secret

    def create_access_token(self, subject: str) -> str:
        expire = datetime.utcnow() + timedelta(minutes=self.access_token_expire_minutes)
        to_encode = {
            "sub": subject,
            "exp": int(expire.timestamp()),
            "type": "access",
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def create_refresh_token(self, subject: str) -> str:
        expire = datetime.utcnow() + timedelta(days=self.refresh_token_expire_days)
        to_encode = {
            "sub": subject,
            "exp": int(expire.timestamp()),
            "type": "refresh",
        }
        return jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)

    def verify_token(self, token: str) -> TokenPayload:
        try:
            payload = jwt.decode(token, self.secret_key, algorithms=[self.algorithm])
            return TokenPayload(**payload)
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
            )

    def verify_access_token(self, token: str) -> TokenPayload:
        payload = self.verify_token(token)
        if payload.type != "access":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
        if payload.exp < int(datetime.utcnow().timestamp()):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token expired",
            )
        return payload

    def verify_refresh_token(self, token: str) -> TokenPayload:
        payload = self.verify_token(token)
        if payload.type != "refresh":
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token type",
            )
        if payload.exp < int(datetime.utcnow().timestamp()):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid or expired refresh token",
            )
        return payload

    def create_token_response(self, client_id: str) -> TokenResponse:
        access_token = self.create_access_token(client_id)
        refresh_token = self.create_refresh_token(client_id)
        return TokenResponse(
            access_token=access_token,
            refresh_token=refresh_token,
            token_type="bearer",
        )

    def refresh_access_token(self, refresh_token: str) -> RefreshResponse:
        self.verify_refresh_token(refresh_token)
        access_token = self.create_access_token(self.client_id)
        return RefreshResponse(
            access_token=access_token,
            token_type="bearer",
        )


oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


def get_current_user(token: str = Depends(oauth2_scheme)) -> TokenPayload:
    auth_service = AuthService()
    try:
        return auth_service.verify_access_token(token)
    except HTTPException:
        raise
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials",
        )