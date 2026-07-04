from __future__ import annotations

from datetime import datetime
from typing import Any

from agent.shared_state import SharedStateStore


class SharedStateService:
    def __init__(self, store: SharedStateStore | None = None) -> None:
        self.store = store or SharedStateStore()

    def read(self) -> dict[str, Any]:
        return self.store.read()

    def last_updated_at(self) -> datetime | None:
        raw = self.read().get("updated_at")
        if not raw:
            return None
        try:
            return datetime.fromisoformat(raw)
        except ValueError:
            return None
