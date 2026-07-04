from __future__ import annotations

from app.schemas.daily_limit import DailyLimitStatusSchema
from app.schemas.market import MarketSnapshotSchema
from app.schemas.portfolio import PortfolioSnapshotSchema


class RiskService:
    def validate_trade(
        self,
        action: str,
        amount: float,
        market: MarketSnapshotSchema,
        portfolio: PortfolioSnapshotSchema,
        daily_limit: DailyLimitStatusSchema,
    ) -> list[str]:
        errors: list[str] = []
        if action.upper() not in {"BUY", "SELL"}:
            errors.append("unsupported action")
        if amount <= 0:
            errors.append("amount must be positive")
        if not market.oracle.valid:
            errors.append(f"oracle invalid: {market.oracle.reason}")
        if daily_limit.paused:
            errors.append("daily limit contract is paused")
        if daily_limit.status in {"cap_hit", "unavailable"}:
            errors.append(f"daily limit status is {daily_limit.status}")
        if daily_limit.remaining_cap is not None and amount > daily_limit.remaining_cap:
            errors.append("amount exceeds remaining daily limit")
        if daily_limit.per_trade_limit is not None and amount > daily_limit.per_trade_limit:
            errors.append("amount exceeds per-trade limit")
        if portfolio.status == "unavailable":
            errors.append("portfolio unavailable")
        return errors

    def validate_ai_confidence(self, confidence: float) -> bool:
        return 0 <= confidence <= 100
