from __future__ import annotations

from typing import Any

from app.models import collections
from .base import BaseRepository


class DecisionRepository(BaseRepository):
    collection_name = collections.AI_DECISIONS

    async def insert(self, decision: dict[str, Any]) -> str:
        payload = dict(decision)
        payload.setdefault("created_at", self.now())
        result = await self.collection.insert_one(payload)
        return str(result.inserted_id)

    async def latest(self, user_id: str | None = None) -> dict[str, Any] | None:
        query = {"user_id": user_id} if user_id else {}
        doc = await self.collection.find_one(query, sort=[("created_at", -1)])
        if doc:
            doc["_id"] = str(doc["_id"])
        return doc
