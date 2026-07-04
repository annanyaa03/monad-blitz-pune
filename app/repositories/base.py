from __future__ import annotations

from datetime import datetime, timezone
from typing import Any

from motor.motor_asyncio import AsyncIOMotorDatabase


class RepositoryUnavailable(RuntimeError):
    pass


class BaseRepository:
    collection_name: str

    def __init__(self, db: AsyncIOMotorDatabase[Any] | None) -> None:
        self.db = db

    @property
    def collection(self):
        if self.db is None:
            raise RepositoryUnavailable("MongoDB is not configured.")
        return self.db[self.collection_name]

    @staticmethod
    def now() -> datetime:
        return datetime.now(timezone.utc)
