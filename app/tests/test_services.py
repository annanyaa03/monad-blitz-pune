from __future__ import annotations

import unittest
from datetime import datetime, timezone

from app.market.indicator_engine import IndicatorEngine
from app.risk.risk_service import RiskService
from app.schemas.daily_limit import DailyLimitStatusSchema
from app.schemas.market import IndicatorSnapshotSchema, MarketSnapshotSchema, OracleValidationSchema
from app.schemas.portfolio import PortfolioSnapshotSchema


class ServiceTests(unittest.TestCase):
    def test_indicator_engine_returns_unavailable_without_history(self) -> None:
        snapshot = IndicatorEngine().build([])
        self.assertEqual(snapshot.market_structure, "unavailable")
        self.assertIsNone(snapshot.ema_short)

    def test_indicator_engine_computes_core_values_from_real_history(self) -> None:
        history = [{"price": float(100 + index)} for index in range(30)]
        snapshot = IndicatorEngine().build(history)
        self.assertIsNotNone(snapshot.ema_short)
        self.assertIsNotNone(snapshot.ema_long)
        self.assertIsNotNone(snapshot.rsi)
        self.assertEqual(snapshot.market_structure, "uptrend")

    def test_risk_service_blocks_stale_oracle(self) -> None:
        market = MarketSnapshotSchema(
            status="unavailable",
            price=None,
            oracle=OracleValidationSchema(valid=False, reason="stale oracle price", max_age_seconds=90),
            indicators=IndicatorSnapshotSchema(),
        )
        portfolio = PortfolioSnapshotSchema(status="ok", total_value=100, pnl=0)
        daily_limit = DailyLimitStatusSchema(status="active", paused=False, remaining_cap=50, per_trade_limit=25)

        errors = RiskService().validate_trade("BUY", 10, market, portfolio, daily_limit)
        self.assertIn("oracle invalid: stale oracle price", errors)

    def test_risk_service_blocks_limit_excess(self) -> None:
        market = MarketSnapshotSchema(
            status="ok",
            price=None,
            oracle=OracleValidationSchema(
                valid=True,
                reason="fresh",
                publish_time=int(datetime.now(timezone.utc).timestamp()),
                max_age_seconds=90,
            ),
            indicators=IndicatorSnapshotSchema(),
        )
        portfolio = PortfolioSnapshotSchema(status="ok", total_value=100, pnl=0)
        daily_limit = DailyLimitStatusSchema(status="active", paused=False, remaining_cap=5, per_trade_limit=25)

        errors = RiskService().validate_trade("BUY", 10, market, portfolio, daily_limit)
        self.assertIn("amount exceeds remaining daily limit", errors)


if __name__ == "__main__":
    unittest.main()
