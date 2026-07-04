from __future__ import annotations

import time

from app.schemas.market import OracleValidationSchema, PricePointSchema


class OracleValidator:
    def __init__(self, max_age_seconds: int) -> None:
        self.max_age_seconds = max_age_seconds

    def validate(self, point: PricePointSchema | None) -> OracleValidationSchema:
        if point is None:
            return OracleValidationSchema(
                valid=False,
                reason="price unavailable",
                max_age_seconds=self.max_age_seconds,
            )
        if point.price is None or point.price <= 0:
            return OracleValidationSchema(
                valid=False,
                reason="invalid price",
                publish_time=point.publish_time,
                confidence=point.confidence,
                age_seconds=point.age_seconds,
                max_age_seconds=self.max_age_seconds,
            )
        if point.confidence is None or point.confidence < 0:
            return OracleValidationSchema(
                valid=False,
                reason="invalid confidence interval",
                publish_time=point.publish_time,
                confidence=point.confidence,
                age_seconds=point.age_seconds,
                max_age_seconds=self.max_age_seconds,
            )
        if point.publish_time is None:
            return OracleValidationSchema(
                valid=False,
                reason="missing publish time",
                confidence=point.confidence,
                max_age_seconds=self.max_age_seconds,
            )

        age = int(time.time()) - point.publish_time
        if age > self.max_age_seconds:
            return OracleValidationSchema(
                valid=False,
                reason="stale oracle price",
                publish_time=point.publish_time,
                confidence=point.confidence,
                age_seconds=age,
                max_age_seconds=self.max_age_seconds,
            )

        return OracleValidationSchema(
            valid=True,
            reason="fresh",
            publish_time=point.publish_time,
            confidence=point.confidence,
            age_seconds=age,
            max_age_seconds=self.max_age_seconds,
        )
