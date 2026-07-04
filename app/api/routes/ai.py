from __future__ import annotations

from fastapi import APIRouter, Depends

from app.agent.ai_validation_service import AiValidationService
from app.api.dependencies import (
    ai_validation_service,
    daily_limit_service,
    market_snapshot_builder,
    portfolio_service,
    decision_repository,
)
from app.execution.daily_limit_service import DailyLimitService
from app.market.snapshot_builder import MarketSnapshotBuilder
from app.portfolio.portfolio_service import PortfolioService
from app.repositories.base import RepositoryUnavailable
from app.repositories.decision_repository import DecisionRepository
from app.schemas.ai import AiDecisionPayload, AiValidationResult

router = APIRouter(prefix="/api/ai", tags=["ai"])


@router.get("/latest")
async def latest_ai_decision(repo: DecisionRepository = Depends(decision_repository)) -> dict:
    try:
        latest = await repo.latest()
    except RepositoryUnavailable:
        latest = None
    return {"status": "ok" if latest else "unavailable", "decision": latest}


@router.post("/validate", response_model=AiValidationResult)
async def validate_ai_decision(
    decision: AiDecisionPayload,
    validator: AiValidationService = Depends(ai_validation_service),
    market_builder: MarketSnapshotBuilder = Depends(market_snapshot_builder),
    portfolio: PortfolioService = Depends(portfolio_service),
    daily_limit: DailyLimitService = Depends(daily_limit_service),
) -> AiValidationResult:
    market = market_builder.build(prefer_live_oracle=False)
    portfolio_snapshot = await portfolio.snapshot()
    daily_limit_status = daily_limit.status()
    return validator.validate(decision, market, portfolio_snapshot, daily_limit_status)
