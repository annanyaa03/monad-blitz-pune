from __future__ import annotations

from datetime import datetime
from typing import Any

from agent.price_feed import build_client_from_env

from app.schemas.market import PricePointSchema
from app.services.shared_state_service import SharedStateService


class PriceService:
    def __init__(self, shared_state: SharedStateService) -> None:
        self.shared_state = shared_state

    def latest_from_shared_state(self) -> PricePointSchema | None:
        market = self.shared_state.read().get("market", {})
        if not market or market.get("price") is None:
            return None
        observed_at = None
        if market.get("observed_at"):
            try:
                observed_at = datetime.fromisoformat(market["observed_at"])
            except ValueError:
                observed_at = None

        return PricePointSchema(
            symbol=market.get("symbol", "unknown"),
            price=market.get("price"),
            confidence=market.get("confidence"),
            publish_time=market.get("publish_time"),
            observed_at=observed_at,
            source="shared_state",
            age_seconds=market.get("age"),
            is_stale=bool(market.get("is_stale", True)),
            valid=not bool(market.get("is_stale", True)),
        )

    def latest_from_oracle(self) -> PricePointSchema:
        point = build_client_from_env().get_latest_price()
        payload: dict[str, Any] = point.as_dict()
        observed_at = None
        if payload.get("observed_at"):
            observed_at = datetime.fromisoformat(payload["observed_at"])
        return PricePointSchema(
            symbol=payload["symbol"],
            price=payload["price"],
            confidence=payload["confidence"],
            publish_time=payload["publish_time"],
            observed_at=observed_at,
            source="pyth_hermes",
            age_seconds=payload.get("age"),
            is_stale=bool(payload.get("is_stale", False)),
            valid=not bool(payload.get("is_stale", False)),
        )
