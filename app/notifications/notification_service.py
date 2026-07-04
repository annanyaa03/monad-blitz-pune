from __future__ import annotations

from typing import Any

from app.repositories.activity_repository import ActivityRepository
from app.repositories.base import RepositoryUnavailable


class NotificationService:
    def __init__(self, activity_repository: ActivityRepository | None = None) -> None:
        self.activity_repository = activity_repository

    async def record(self, event_type: str, payload: dict[str, Any], user_id: str | None = None) -> None:
        if self.activity_repository is None:
            return
        try:
            await self.activity_repository.log(event_type=event_type, payload=payload, user_id=user_id)
        except RepositoryUnavailable:
            return
