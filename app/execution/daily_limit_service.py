from __future__ import annotations

import logging

from web3 import Web3

from agent.chain_client import KillSwitchClient

from app.schemas.daily_limit import DailyLimitStatusSchema
from app.services.shared_state_service import SharedStateService

LOGGER = logging.getLogger(__name__)


class DailyLimitService:
    def __init__(self, shared_state: SharedStateService) -> None:
        self.shared_state = shared_state

    def status(self) -> DailyLimitStatusSchema:
        try:
            client = KillSwitchClient()
            payload = client.get_status()
            per_trade_limit = None
            try:
                raw_limit = client.contract.functions.perTradeLimit().call()
                per_trade_limit = float(Web3.from_wei(raw_limit, "ether"))
            except Exception as exc:  # noqa: BLE001
                LOGGER.warning("Could not read perTradeLimit: %s", exc)
            return DailyLimitStatusSchema(
                status=payload.get("status", "unknown"),
                paused=payload.get("paused"),
                daily_cap=payload.get("daily_cap"),
                traded_today=payload.get("traded_today"),
                remaining_cap=payload.get("remaining_cap"),
                per_trade_limit=per_trade_limit,
                cooldown_seconds=payload.get("cooldown_seconds"),
                next_trade_at=payload.get("next_trade_at"),
                contract_health="ok",
            )
        except Exception as exc:  # noqa: BLE001
            state = self.shared_state.read().get("kill_switch", {})
            return DailyLimitStatusSchema(
                status=state.get("status", "unavailable"),
                paused=state.get("paused"),
                daily_cap=state.get("daily_cap"),
                traded_today=state.get("traded_today"),
                remaining_cap=state.get("remaining_cap"),
                cooldown_seconds=state.get("cooldown_seconds"),
                next_trade_at=state.get("next_trade_at"),
                contract_health=f"unavailable: {exc}",
            )
