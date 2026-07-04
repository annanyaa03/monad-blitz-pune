from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class PricePointSchema(BaseModel):
    symbol: str
    price: float | None
    confidence: float | None
    publish_time: int | None
    observed_at: datetime | None
    source: str
    age_seconds: int | None = None
    is_stale: bool = True
    valid: bool = False


class OracleValidationSchema(BaseModel):
    valid: bool
    reason: str
    publish_time: int | None = None
    confidence: float | None = None
    age_seconds: int | None = None
    max_age_seconds: int


class IndicatorSnapshotSchema(BaseModel):
    ema_short: float | None = None
    ema_long: float | None = None
    rsi: float | None = None
    macd: float | None = None
    macd_signal: float | None = None
    atr: float | None = None
    vwap: float | None = None
    momentum: float | None = None
    volatility: float | None = None
    trend_strength: float | None = None
    market_structure: str = "unavailable"
    volume_analysis: str = "unavailable"


class MarketSnapshotSchema(BaseModel):
    status: str
    price: PricePointSchema | None = None
    oracle: OracleValidationSchema
    indicators: IndicatorSnapshotSchema
    warnings: list[str] = Field(default_factory=list)
