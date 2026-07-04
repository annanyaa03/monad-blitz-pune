from __future__ import annotations

from typing import Any

from app.models import collections
from .base import BaseRepository


class TradeRepository(BaseRepository):
    collection_name = collections.TRADES

    async def insert(self, trade: dict[str, Any]) -> str:
        payload = dict(trade)
        payload.setdefault("created_at", self.now())
        result = await self.collection.insert_one(payload)
        return str(result.inserted_id)

    async def recent(self, user_id: str | None = None, limit: int = 50) -> list[dict[str, Any]]:
        query = {"user_id": user_id} if user_id else {}
        cursor = self.collection.find(query).sort("created_at", -1).limit(limit)
        docs = await cursor.to_list(length=limit)
        for doc in docs:
            doc["_id"] = str(doc["_id"])
        return docs
