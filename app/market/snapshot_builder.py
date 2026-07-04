from __future__ import annotations

from app.core.config import Settings
from app.market.indicator_engine import IndicatorEngine
from app.market.oracle_validator import OracleValidator
from app.market.price_service import PriceService
from app.schemas.market import MarketSnapshotSchema
from app.services.shared_state_service import SharedStateService


class MarketSnapshotBuilder:
    def __init__(
        self,
        settings: Settings,
        shared_state: SharedStateService,
        price_service: PriceService,
        indicator_engine: IndicatorEngine,
    ) -> None:
        self.settings = settings
        self.shared_state = shared_state
        self.price_service = price_service
        self.indicator_engine = indicator_engine
        self.oracle_validator = OracleValidator(settings.max_oracle_age_seconds)

    def build(self, prefer_live_oracle: bool = False) -> MarketSnapshotSchema:
        warnings: list[str] = []
        point = None

        if prefer_live_oracle:
            try:
                point = self.price_service.latest_from_oracle()
            except Exception as exc:  # noqa: BLE001
                warnings.append(f"live oracle read failed: {exc}")

        if point is None:
            point = self.price_service.latest_from_shared_state()

        oracle = self.oracle_validator.validate(point)
        state = self.shared_state.read()
        indicators = self.indicator_engine.build(state.get("market", {}).get("history", []))
        status = "ok" if oracle.valid else "unavailable"

        return MarketSnapshotSchema(
            status=status,
            price=point,
            oracle=oracle,
            indicators=indicators,
            warnings=warnings,
        )
