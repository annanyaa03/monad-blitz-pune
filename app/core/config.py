from __future__ import annotations

import os
from dataclasses import dataclass
from functools import lru_cache
from pathlib import Path

from dotenv import load_dotenv

ROOT_DIR = Path(__file__).resolve().parents[2]
load_dotenv(ROOT_DIR / ".env")


def _bool_env(name: str, default: bool = False) -> bool:
    raw = os.getenv(name)
    if raw is None:
        return default
    return raw.strip().lower() in {"1", "true", "yes", "y", "on"}


@dataclass(frozen=True)
class Settings:
    app_name: str = "Monad AI Agent API"
    environment: str = os.getenv("APP_ENV", "development")
    root_dir: Path = ROOT_DIR
    shared_state_path: Path = ROOT_DIR / os.getenv("SHARED_STATE_PATH", ".runtime/shared_state.json")
    monad_rpc_url: str = os.getenv("MONAD_TESTNET_RPC_URL", "https://testnet-rpc.monad.xyz")
    monad_chain_id: int = int(os.getenv("MONAD_TESTNET_CHAIN_ID", "10143"))
    mongodb_uri: str | None = os.getenv("MONGODB_URI")
    mongodb_database: str = os.getenv("MONGODB_DATABASE", "monad_ai_agent")
    backend_api_token: str | None = os.getenv("BACKEND_API_TOKEN")
    enable_live_swaps: bool = _bool_env("ENABLE_LIVE_SWAPS", False)
    autonomous_mode_enabled: bool = _bool_env("AUTONOMOUS_MODE_ENABLED", False)
    websocket_interval_seconds: float = float(os.getenv("WEBSOCKET_INTERVAL_SECONDS", "2"))
    max_oracle_age_seconds: int = int(os.getenv("PYTH_MAX_STALENESS_SECONDS", "90"))


@lru_cache
def get_settings() -> Settings:
    return Settings()
