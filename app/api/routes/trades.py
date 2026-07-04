from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import execution_service, trade_repository
from app.core.security import require_backend_auth
from app.execution.execution_service import ExecutionService
from app.repositories.base import RepositoryUnavailable
from app.repositories.trade_repository import TradeRepository
from app.schemas.trade import ManualTradeRequest, TradePreview, TradeRecordSchema

router = APIRouter(prefix="/api/trades", tags=["trades"])


@router.get("/recent")
async def recent_trades(
    user_id: str | None = Query(default=None),
    limit: int = Query(default=50, ge=1, le=200),
    repo: TradeRepository = Depends(trade_repository),
) -> dict:
    try:
        trades = await repo.recent(user_id=user_id, limit=limit)
        return {"status": "ok", "trades": trades}
    except RepositoryUnavailable:
        return {"status": "unavailable", "trades": []}


@router.post("/manual/preview", response_model=TradePreview)
async def preview_manual_trade(
    request: ManualTradeRequest,
    service: ExecutionService = Depends(execution_service),
) -> TradePreview:
    return await service.preview_manual_trade(request)


@router.post(
    "/manual/execute",
    response_model=TradeRecordSchema,
    dependencies=[Depends(require_backend_auth)],
)
async def execute_manual_trade(
    request: ManualTradeRequest,
    service: ExecutionService = Depends(execution_service),
) -> TradeRecordSchema:
    return await service.execute_manual_trade(request)
