from __future__ import annotations

from pydantic import BaseModel


class DailyLimitStatusSchema(BaseModel):
    status: str
    paused: bool | None = None
    daily_cap: float | None = None
    traded_today: float | None = None
    remaining_cap: float | None = None
    per_trade_limit: float | None = None
    cooldown_seconds: int | None = None
    next_trade_at: int | None = None
    contract_health: str = "unknown"
