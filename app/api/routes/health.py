from __future__ import annotations

from fastapi import APIRouter, Depends

from app.core.config import Settings, get_settings
from app.database.mongo import get_database

router = APIRouter(tags=["health"])


@router.get("/health")
async def health(settings: Settings = Depends(get_settings)) -> dict:
    return {
        "status": "ok",
        "environment": settings.environment,
        "chain_id": settings.monad_chain_id,
        "mongodb": "configured" if get_database() is not None else "unavailable",
    }
