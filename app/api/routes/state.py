from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import shared_state_service
from app.services.shared_state_service import SharedStateService

router = APIRouter(prefix="/api/state", tags=["state"])


@router.get("")
async def get_state(shared_state: SharedStateService = Depends(shared_state_service)) -> dict:
    return shared_state.read()
