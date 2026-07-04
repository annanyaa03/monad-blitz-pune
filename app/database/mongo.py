from __future__ import annotations

import logging
from typing import Any

from motor.motor_asyncio import AsyncIOMotorClient, AsyncIOMotorDatabase

from app.core.config import Settings
from app.models import collections

LOGGER = logging.getLogger(__name__)

_client: AsyncIOMotorClient[Any] | None = None
_database: AsyncIOMotorDatabase[Any] | None = None


async def connect(settings: Settings) -> None:
    global _client, _database
    if not settings.mongodb_uri:
        LOGGER.warning("MONGODB_URI is not configured; persistence services will report unavailable.")
        return

    _client = AsyncIOMotorClient(settings.mongodb_uri, serverSelectionTimeoutMS=5000)
    _database = _client[settings.mongodb_database]
    await _client.admin.command("ping")
    await _create_indexes(_database)
    LOGGER.info("Connected to MongoDB database %s", settings.mongodb_database)


async def close() -> None:
    global _client, _database
    if _client is not None:
        _client.close()
    _client = None
    _database = None


def get_database() -> AsyncIOMotorDatabase[Any] | None:
    return _database


async def _create_indexes(db: AsyncIOMotorDatabase[Any]) -> None:
    await db[collections.USERS].create_index("google_id", unique=True, sparse=True)
    await db[collections.USERS].create_index("email", unique=True, sparse=True)
    await db[collections.WALLETS].create_index([("user_id", 1), ("address", 1)], unique=True)
    await db[collections.TRADES].create_index("tx_hash", unique=True, sparse=True)
    await db[collections.TRADES].create_index([("user_id", 1), ("created_at", -1)])
    await db[collections.AI_DECISIONS].create_index([("user_id", 1), ("created_at", -1)])
    await db[collections.ACTIVITY].create_index([("user_id", 1), ("created_at", -1)])
    await db[collections.NOTIFICATIONS].create_index([("user_id", 1), ("created_at", -1)])
    await db[collections.MARKET_CACHE].create_index([("symbol", 1), ("created_at", -1)])
