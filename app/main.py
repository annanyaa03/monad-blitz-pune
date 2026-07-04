from __future__ import annotations

from contextlib import asynccontextmanager

from fastapi import FastAPI, WebSocket
from fastapi.middleware.cors import CORSMiddleware

from app.api.dependencies import indicator_engine, price_service, shared_state_service
from app.api.router import api_router
from app.core.config import get_settings
from app.core.logging import configure_logging
from app.database.mongo import close, connect
from app.market.snapshot_builder import MarketSnapshotBuilder
from app.websocket.manager import WebSocketManager


@asynccontextmanager
async def lifespan(app: FastAPI):
    configure_logging()
    settings = get_settings()
    await connect(settings)
    try:
        yield
    finally:
        await close()


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(title=settings.app_name, version="0.1.0", lifespan=lifespan)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["http://localhost:5001", "http://127.0.0.1:5001"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )
    app.include_router(api_router)
    return app


app = create_app()


@app.websocket("/ws/stream")
async def websocket_stream(websocket: WebSocket) -> None:
    settings = get_settings()
    shared_state = shared_state_service()
    prices = price_service(shared_state)
    market = MarketSnapshotBuilder(settings, shared_state, prices, indicator_engine())
    await WebSocketManager(settings, shared_state, market).stream(websocket)
