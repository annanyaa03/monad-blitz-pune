from __future__ import annotations

from datetime import datetime
from typing import Literal

from pydantic import BaseModel, Field


class ManualTradeRequest(BaseModel):
    action: Literal["BUY", "SELL"]
    amount: float = Field(gt=0)
    stop_loss: float | None = Field(default=None, gt=0)
    take_profit: float | None = Field(default=None, gt=0)
    confirm: bool = False
    user_id: str | None = None


class TradePreview(BaseModel):
    status: str
    action: str
    amount: float
    estimated_price: float | None
    validation_errors: list[str] = []
    requires_confirmation: bool = True


class TradeRecordSchema(BaseModel):
    action: str
    amount: float
    status: str
    tx_hash: str | None = None
    created_at: datetime | None = None
    metadata: dict = {}
