from __future__ import annotations

import math
from statistics import pstdev

from app.schemas.market import IndicatorSnapshotSchema


class IndicatorEngine:
    def build(self, history: list[dict]) -> IndicatorSnapshotSchema:
        prices = [float(item["price"]) for item in history if item.get("price") is not None]
        if not prices:
            return IndicatorSnapshotSchema()

        ema_short = self._ema(prices, 5)
        ema_long = self._ema(prices, 20)
        macd_line, macd_signal = self._macd(prices)
        momentum = prices[-1] - prices[-5] if len(prices) >= 5 else None
        volatility = pstdev(prices[-20:]) if len(prices) >= 2 else None
        trend_strength = None
        market_structure = "unavailable"

        if ema_short is not None and ema_long is not None and prices[-1] != 0:
            trend_strength = abs(ema_short - ema_long) / prices[-1] * 10_000
            market_structure = "uptrend" if ema_short > ema_long else "downtrend" if ema_short < ema_long else "range"

        return IndicatorSnapshotSchema(
            ema_short=ema_short,
            ema_long=ema_long,
            rsi=self._rsi(prices),
            macd=macd_line,
            macd_signal=macd_signal,
            atr=None,
            vwap=None,
            momentum=momentum,
            volatility=volatility,
            trend_strength=trend_strength,
            market_structure=market_structure,
            volume_analysis="unavailable",
        )

    def _ema(self, prices: list[float], period: int) -> float | None:
        if len(prices) < period:
            return None
        alpha = 2 / (period + 1)
        value = prices[0]
        for price in prices[1:]:
            value = (price * alpha) + (value * (1 - alpha))
        return value

    def _rsi(self, prices: list[float], period: int = 14) -> float | None:
        if len(prices) <= period:
            return None
        gains: list[float] = []
        losses: list[float] = []
        for prev, current in zip(prices[-period - 1 : -1], prices[-period:]):
            delta = current - prev
            gains.append(max(delta, 0))
            losses.append(abs(min(delta, 0)))
        avg_gain = sum(gains) / period
        avg_loss = sum(losses) / period
        if avg_loss == 0:
            return 100.0
        rs = avg_gain / avg_loss
        return 100 - (100 / (1 + rs))

    def _macd(self, prices: list[float]) -> tuple[float | None, float | None]:
        ema12 = self._ema(prices, 12)
        ema26 = self._ema(prices, 26)
        if ema12 is None or ema26 is None:
            return None, None
        macd = ema12 - ema26
        if len(prices) < 35:
            return macd, None
        macd_series = []
        for idx in range(26, len(prices) + 1):
            short = self._ema(prices[:idx], 12)
            long = self._ema(prices[:idx], 26)
            if short is not None and long is not None:
                macd_series.append(short - long)
        return macd, self._ema(macd_series, 9)
