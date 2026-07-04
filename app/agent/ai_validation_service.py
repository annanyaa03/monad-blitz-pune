from __future__ import annotations

from app.risk.risk_service import RiskService
from app.schemas.ai import AiDecisionPayload, AiValidationResult
from app.schemas.daily_limit import DailyLimitStatusSchema
from app.schemas.market import MarketSnapshotSchema
from app.schemas.portfolio import PortfolioSnapshotSchema


class AiValidationService:
    def __init__(self, risk_service: RiskService) -> None:
        self.risk_service = risk_service

    def validate(
        self,
        decision: AiDecisionPayload,
        market: MarketSnapshotSchema,
        portfolio: PortfolioSnapshotSchema,
        daily_limit: DailyLimitStatusSchema,
    ) -> AiValidationResult:
        reasons: list[str] = []
        if not self.risk_service.validate_ai_confidence(decision.confidence):
            reasons.append("confidence outside allowed range")
        if not market.oracle.valid:
            reasons.append(f"oracle invalid: {market.oracle.reason}")

        if decision.action != "HOLD":
            reasons.extend(
                self.risk_service.validate_trade(
                    action=decision.action,
                    amount=decision.position_size,
                    market=market,
                    portfolio=portfolio,
                    daily_limit=daily_limit,
                )
            )

        if reasons:
            return AiValidationResult(accepted=False, action="HOLD", reasons=reasons, decision=decision)

        return AiValidationResult(accepted=True, action=decision.action, reasons=[], decision=decision)
