from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import user_repository
from app.core.security import require_backend_auth
from app.repositories.base import RepositoryUnavailable
from app.repositories.user_repository import UserRepository
from app.schemas.auth import GoogleUserUpsert

router = APIRouter(prefix="/api/auth", tags=["auth"], dependencies=[Depends(require_backend_auth)])


@router.post("/google/upsert")
async def upsert_google_user(payload: GoogleUserUpsert, repo: UserRepository = Depends(user_repository)) -> dict:
    try:
        user_id = await repo.upsert_google_user(payload.model_dump())
        return {"status": "ok", "user_id": user_id}
    except RepositoryUnavailable:
        return {"status": "unavailable", "message": "MongoDB is not configured."}
