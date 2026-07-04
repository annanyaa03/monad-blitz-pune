from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from .config import Settings, get_settings

bearer = HTTPBearer(auto_error=False)


async def require_backend_auth(
    request: Request,
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer),
    settings: Settings = Depends(get_settings),
) -> None:
    """Protect mutating API routes when BACKEND_API_TOKEN is configured.

    In local hackathon development the token can be omitted, but production
    deployments should set it and send Authorization: Bearer <token>.
    """

    if not settings.backend_api_token:
        return

    if credentials is None or credentials.credentials != settings.backend_api_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail={"code": "unauthorized", "message": "Missing or invalid backend token."},
        )
