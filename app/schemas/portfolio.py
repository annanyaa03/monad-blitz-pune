from __future__ import annotations

from pydantic import BaseModel


class PortfolioSnapshotSchema(BaseModel):
    status: str
    total_value: float | None = None
    pnl: float | None = None
    realized_pnl: float | None = None
    unrealized_pnl: float | None = None
    allocation: dict[str, float] = {}
    exposure: float | None = None
    trade_count: int = 0
    win_rate: float | None = None
    average_confidence: float | None = None
    largest_position: str | None = None
