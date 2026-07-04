from __future__ import annotations

import asyncio
import logging

from fastapi import WebSocket, WebSocketDisconnect

from app.core.config import Settings
from app.market.snapshot_builder import MarketSnapshotBuilder
from app.services.shared_state_service import SharedStateService

LOGGER = logging.getLogger(__name__)


class WebSocketManager:
    def __init__(
        self,
        settings: Settings,
        shared_state: SharedStateService,
        market_builder: MarketSnapshotBuilder,
    ) -> None:
        self.settings = settings
        self.shared_state = shared_state
        self.market_builder = market_builder

    async def stream(self, websocket: WebSocket) -> None:
        await websocket.accept()
        LOGGER.info("WebSocket connected")
        try:
            while True:
                state = self.shared_state.read()
                market = self.market_builder.build(prefer_live_oracle=False)
                await websocket.send_json(
                    {
                        "type": "platform_state",
                        "market": market.model_dump(mode="json"),
                        "portfolio": state.get("portfolio", {}),
                        "decision": state.get("decision", {}),
                        "trades": state.get("recent_trades", []),
                        "wallet": {"status": "connected" if state.get("portfolio") else "unknown"},
                        "daily_limit": state.get("kill_switch", {}),
                        "activity": state.get("errors", []),
                        "reasoning": state.get("reasoning", {}),
                    }
                )
                await asyncio.sleep(self.settings.websocket_interval_seconds)
        except WebSocketDisconnect:
            LOGGER.info("WebSocket disconnected")
