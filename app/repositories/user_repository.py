from __future__ import annotations

from typing import Any

from app.models import collections
from .base import BaseRepository


class UserRepository(BaseRepository):
    collection_name = collections.USERS

    async def upsert_google_user(self, payload: dict[str, Any]) -> str:
        now = self.now()
        update = {
            "$set": {
                "google_id": payload["google_id"],
                "email": payload["email"],
                "avatar": payload.get("avatar"),
                "wallet_address": payload.get("wallet_address"),
                "preferences": payload.get("preferences", {}),
                "portfolio": payload.get("portfolio", {}),
                "theme": payload.get("theme", "system"),
                "last_login": now,
                "updated_at": now,
            },
            "$setOnInsert": {"created_at": now},
        }
        result = await self.collection.update_one({"google_id": payload["google_id"]}, update, upsert=True)
        return str(result.upserted_id or payload["google_id"])
