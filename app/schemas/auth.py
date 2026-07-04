from __future__ import annotations

from pydantic import BaseModel, EmailStr


class GoogleUserUpsert(BaseModel):
    google_id: str
    email: EmailStr
    avatar: str | None = None
    wallet_address: str | None = None
    preferences: dict = {}
    portfolio: dict = {}
    theme: str = "system"
