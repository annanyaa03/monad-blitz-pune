from __future__ import annotations

from fastapi import APIRouter

from app.api.routes import ai, auth, daily_limit, health, market, portfolio, state, trades

api_router = APIRouter()
api_router.include_router(health.router)
api_router.include_router(state.router)
api_router.include_router(market.router)
api_router.include_router(portfolio.router)
api_router.include_router(daily_limit.router)
api_router.include_router(ai.router)
api_router.include_router(trades.router)
api_router.include_router(auth.router)
