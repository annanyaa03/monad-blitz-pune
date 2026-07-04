from __future__ import annotations

from typing import Any

from app.models import collections
from .base import BaseRepository


class MarketRepository(BaseRepository):
    collection_name = collections.MARKET_CACHE

    async def insert_snapshot(self, snapshot: dict[str, Any]) -> str:
        payload = dict(snapshot)
        payload.setdefault("created_at", self.now())
        result = await self.collection.insert_one(payload)
        return str(result.inserted_id)
