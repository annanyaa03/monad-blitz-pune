from __future__ import annotations

from decimal import Decimal

from app.core.config import Settings
from app.execution.daily_limit_service import DailyLimitService
from app.market.snapshot_builder import MarketSnapshotBuilder
from app.portfolio.portfolio_service import PortfolioService
from app.repositories.base import RepositoryUnavailable
from app.repositories.trade_repository import TradeRepository
from app.risk.risk_service import RiskService
from app.schemas.trade import ManualTradeRequest, TradePreview, TradeRecordSchema


class ExecutionService:
    def __init__(
        self,
        settings: Settings,
        market_builder: MarketSnapshotBuilder,
        portfolio_service: PortfolioService,
        daily_limit_service: DailyLimitService,
        risk_service: RiskService,
        trade_repository: TradeRepository | None = None,
    ) -> None:
        self.settings = settings
        self.market_builder = market_builder
        self.portfolio_service = portfolio_service
        self.daily_limit_service = daily_limit_service
        self.risk_service = risk_service
        self.trade_repository = trade_repository

    async def preview_manual_trade(self, request: ManualTradeRequest) -> TradePreview:
        market = self.market_builder.build(prefer_live_oracle=False)
        portfolio = await self.portfolio_service.snapshot(user_id=request.user_id)
        daily_limit = self.daily_limit_service.status()
        validation_errors = self.risk_service.validate_trade(
            action=request.action,
            amount=request.amount,
            market=market,
            portfolio=portfolio,
            daily_limit=daily_limit,
        )
        return TradePreview(
            status="blocked" if validation_errors else "ready",
            action=request.action,
            amount=request.amount,
            estimated_price=market.price.price if market.price else None,
            validation_errors=validation_errors,
            requires_confirmation=True,
        )

    async def execute_manual_trade(self, request: ManualTradeRequest) -> TradeRecordSchema:
        preview = await self.preview_manual_trade(request)
        if preview.validation_errors:
            return TradeRecordSchema(
                action=request.action,
                amount=request.amount,
                status="blocked",
                metadata={"validation_errors": preview.validation_errors},
            )
        if not request.confirm:
            return TradeRecordSchema(
                action=request.action,
                amount=request.amount,
                status="confirmation_required",
                metadata={"preview": preview.model_dump()},
            )
        if not self.settings.enable_live_swaps:
            return TradeRecordSchema(
                action=request.action,
                amount=request.amount,
                status="disabled",
                metadata={"reason": "ENABLE_LIVE_SWAPS is false"},
            )

        from agent.chain_client import KillSwitchClient

        client = KillSwitchClient()
        if preview.estimated_price is not None:
            client.set_reference_price(Decimal(str(preview.estimated_price)))
        result = client.execute_trade(request.action.lower(), request.amount)
        record = TradeRecordSchema(
            action=request.action,
            amount=request.amount,
            status=result.status,
            tx_hash=result.tx_hash,
            metadata={"receipt_status": result.receipt_status, "verification": result.verification},
        )
        if self.trade_repository is not None:
            try:
                await self.trade_repository.insert(record.model_dump())
            except RepositoryUnavailable:
                pass
        return record
