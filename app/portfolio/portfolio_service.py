from __future__ import annotations

from statistics import mean
from typing import Any

from app.repositories.base import RepositoryUnavailable
from app.repositories.decision_repository import DecisionRepository
from app.repositories.trade_repository import TradeRepository
from app.schemas.portfolio import PortfolioSnapshotSchema
from app.services.shared_state_service import SharedStateService


class PortfolioService:
    def __init__(
        self,
        shared_state: SharedStateService,
        trade_repository: TradeRepository | None = None,
        decision_repository: DecisionRepository | None = None,
    ) -> None:
        self.shared_state = shared_state
        self.trade_repository = trade_repository
        self.decision_repository = decision_repository

    async def snapshot(self, user_id: str | None = None) -> PortfolioSnapshotSchema:
        state = self.shared_state.read()
        portfolio = state.get("portfolio", {})
        if portfolio.get("mark_to_market_quote") is None:
            return PortfolioSnapshotSchema(status="unavailable")

        trades = await self._recent_trades(user_id)
        decisions = await self._recent_decisions(user_id)
        total_value = portfolio.get("mark_to_market_quote")
        pnl = portfolio.get("pnl_quote")
        base_balance = float(portfolio.get("base_balance") or 0)
        quote_balance = float(portfolio.get("quote_balance") or 0)
        allocation = self._allocation(base_balance, quote_balance, total_value)
        largest_position = None
        if allocation:
            largest_position = max(allocation, key=allocation.get)

        return PortfolioSnapshotSchema(
            status="ok",
            total_value=total_value,
            pnl=pnl,
            realized_pnl=None,
            unrealized_pnl=pnl,
            allocation=allocation,
            exposure=allocation.get("base") if allocation else None,
            trade_count=len(trades),
            win_rate=self._win_rate(trades),
            average_confidence=self._average_confidence(decisions),
            largest_position=largest_position,
        )

    async def _recent_trades(self, user_id: str | None) -> list[dict[str, Any]]:
        state_trades = self.shared_state.read().get("recent_trades", [])
        if self.trade_repository is None:
            return state_trades
        try:
            db_trades = await self.trade_repository.recent(user_id=user_id, limit=100)
            return db_trades or state_trades
        except RepositoryUnavailable:
            return state_trades

    async def _recent_decisions(self, user_id: str | None) -> list[dict[str, Any]]:
        if self.decision_repository is None:
            raw = self.shared_state.read().get("decision", {}).get("raw_model_output")
            return [{"raw_model_output": raw}] if raw else []
        try:
            latest = await self.decision_repository.latest(user_id=user_id)
            return [latest] if latest else []
        except RepositoryUnavailable:
            return []

    def _allocation(self, base_balance: float, quote_balance: float, total_value: float | None) -> dict[str, float]:
        if not total_value or total_value <= 0:
            return {}
        return {
            "base": base_balance / total_value,
            "quote": quote_balance / total_value,
        }

    def _win_rate(self, trades: list[dict[str, Any]]) -> float | None:
        outcomes = [trade.get("pnl") for trade in trades if trade.get("pnl") is not None]
        if not outcomes:
            return None
        wins = [pnl for pnl in outcomes if float(pnl) > 0]
        return len(wins) / len(outcomes) * 100

    def _average_confidence(self, decisions: list[dict[str, Any]]) -> float | None:
        values: list[float] = []
        for decision in decisions:
            confidence = decision.get("confidence")
            if confidence is not None:
                values.append(float(confidence))
        return mean(values) if values else None
