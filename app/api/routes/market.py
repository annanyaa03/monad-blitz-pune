from __future__ import annotations

from fastapi import APIRouter, Depends, Query

from app.api.dependencies import market_snapshot_builder
from app.market.snapshot_builder import MarketSnapshotBuilder
from app.schemas.market import MarketSnapshotSchema

router = APIRouter(prefix="/api/market", tags=["market"])


@router.get("/snapshot", response_model=MarketSnapshotSchema)
async def market_snapshot(
    live_oracle: bool = Query(False),
    builder: MarketSnapshotBuilder = Depends(market_snapshot_builder),
) -> MarketSnapshotSchema:
    return builder.build(prefer_live_oracle=live_oracle)
