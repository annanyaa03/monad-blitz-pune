from __future__ import annotations

from fastapi import Depends

from app.agent.ai_validation_service import AiValidationService
from app.core.config import Settings, get_settings
from app.database.mongo import get_database
from app.execution.daily_limit_service import DailyLimitService
from app.execution.execution_service import ExecutionService
from app.market.indicator_engine import IndicatorEngine
from app.market.price_service import PriceService
from app.market.snapshot_builder import MarketSnapshotBuilder
from app.notifications.notification_service import NotificationService
from app.portfolio.portfolio_service import PortfolioService
from app.repositories.activity_repository import ActivityRepository
from app.repositories.decision_repository import DecisionRepository
from app.repositories.market_repository import MarketRepository
from app.repositories.trade_repository import TradeRepository
from app.repositories.user_repository import UserRepository
from app.risk.risk_service import RiskService
from app.services.shared_state_service import SharedStateService


def shared_state_service() -> SharedStateService:
    return SharedStateService()


def price_service(shared_state: SharedStateService = Depends(shared_state_service)) -> PriceService:
    return PriceService(shared_state)


def indicator_engine() -> IndicatorEngine:
    return IndicatorEngine()


def market_snapshot_builder(
    settings: Settings = Depends(get_settings),
    shared_state: SharedStateService = Depends(shared_state_service),
    prices: PriceService = Depends(price_service),
    indicators: IndicatorEngine = Depends(indicator_engine),
) -> MarketSnapshotBuilder:
    return MarketSnapshotBuilder(settings, shared_state, prices, indicators)


def trade_repository() -> TradeRepository:
    return TradeRepository(get_database())


def decision_repository() -> DecisionRepository:
    return DecisionRepository(get_database())


def user_repository() -> UserRepository:
    return UserRepository(get_database())


def market_repository() -> MarketRepository:
    return MarketRepository(get_database())


def activity_repository() -> ActivityRepository:
    return ActivityRepository(get_database())


def portfolio_service(
    shared_state: SharedStateService = Depends(shared_state_service),
    trades: TradeRepository = Depends(trade_repository),
    decisions: DecisionRepository = Depends(decision_repository),
) -> PortfolioService:
    return PortfolioService(shared_state, trades, decisions)


def daily_limit_service(shared_state: SharedStateService = Depends(shared_state_service)) -> DailyLimitService:
    return DailyLimitService(shared_state)


def risk_service() -> RiskService:
    return RiskService()


def ai_validation_service(risk: RiskService = Depends(risk_service)) -> AiValidationService:
    return AiValidationService(risk)


def execution_service(
    settings: Settings = Depends(get_settings),
    market: MarketSnapshotBuilder = Depends(market_snapshot_builder),
    portfolio: PortfolioService = Depends(portfolio_service),
    daily_limit: DailyLimitService = Depends(daily_limit_service),
    risk: RiskService = Depends(risk_service),
    trades: TradeRepository = Depends(trade_repository),
) -> ExecutionService:
    return ExecutionService(settings, market, portfolio, daily_limit, risk, trades)


def notification_service(activity: ActivityRepository = Depends(activity_repository)) -> NotificationService:
    return NotificationService(activity)
