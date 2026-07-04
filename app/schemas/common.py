from __future__ import annotations

from datetime import datetime
from typing import Any

from pydantic import BaseModel, Field


class ServiceStatus(BaseModel):
    status: str = Field(description="ok, degraded, unavailable, or disabled")
    message: str | None = None
    updated_at: datetime | None = None


class StructuredError(BaseModel):
    code: str
    message: str
    details: dict[str, Any] = Field(default_factory=dict)
