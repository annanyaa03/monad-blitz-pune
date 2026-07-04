from __future__ import annotations

from typing import Any

from app.models import collections
from .base import BaseRepository


class ActivityRepository(BaseRepository):
    collection_name = collections.ACTIVITY

    async def log(self, event_type: str, payload: dict[str, Any], user_id: str | None = None) -> None:
        await self.collection.insert_one(
            {
                "event_type": event_type,
                "user_id": user_id,
                "payload": payload,
                "created_at": self.now(),
            }
        )
