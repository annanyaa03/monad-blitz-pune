from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import portfolio_service
from app.portfolio.portfolio_service import PortfolioService
from app.schemas.portfolio import PortfolioSnapshotSchema

router = APIRouter(prefix="/api/portfolio", tags=["portfolio"])


@router.get("", response_model=PortfolioSnapshotSchema)
async def get_portfolio(
    user_id: str | None = Query(default=None),
    service: PortfolioService = Depends(portfolio_service),
) -> PortfolioSnapshotSchema:
    return await service.snapshot(user_id=user_id)
