from __future__ import annotations

from fastapi import APIRouter, Depends

from app.api.dependencies import daily_limit_service
from app.execution.daily_limit_service import DailyLimitService
from app.schemas.daily_limit import DailyLimitStatusSchema

router = APIRouter(prefix="/api/daily-limit", tags=["daily-limit"])


@router.get("/status", response_model=DailyLimitStatusSchema)
async def get_daily_limit_status(service: DailyLimitService = Depends(daily_limit_service)) -> DailyLimitStatusSchema:
    return service.status()
