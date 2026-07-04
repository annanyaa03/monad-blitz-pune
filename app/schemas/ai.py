from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class AiDecisionPayload(BaseModel):
    market_summary: str
    technical_analysis: str
    risk_assessment: str
    confidence: float = Field(ge=0, le=100)
    action: Literal["BUY", "SELL", "HOLD"]
    position_size: float = Field(ge=0)
    stop_loss: float | None = None
    take_profit: float | None = None
    expected_duration: str | None = None
    alternative_scenario: str | None = None
    reasoning: str
    timestamp: datetime


class AiValidationResult(BaseModel):
    accepted: bool
    action: Literal["BUY", "SELL", "HOLD"]
    reasons: list[str]
    decision: AiDecisionPayload | None = None
