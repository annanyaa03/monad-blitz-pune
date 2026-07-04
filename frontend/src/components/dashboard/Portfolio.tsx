"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SharedState } from "@/hooks/useDashboardState";
import { useState, useEffect } from "react";

const AnimatedNumber = ({ value }: { value: number }) => {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = value;
    if (start === end) return;
    
    let current = start;
    const duration = 1000;
    const increment = (end - start) / (duration / 16);
    
    const timer = setInterval(() => {
      current += increment;
      if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
        current = end;
        clearInterval(timer);
      }
      setDisplayValue(current);
    }, 16);
    
    return () => clearInterval(timer);
  }, [value]);

  return <span>{displayValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>;
};

export default function Portfolio({ state }: { state?: SharedState }) {
  const portfolio = state?.portfolio;
  const totalValue = portfolio?.mark_to_market_quote ?? 0;
  const pnl = portfolio?.pnl_quote ?? 0;
  const isPositive = pnl >= 0;

  const assets: { symbol: string; amount: number; usd_value: number }[] = portfolio
    ? [
        { symbol: "MONAD", amount: portfolio.base_balance, usd_value: portfolio.base_balance },
        { symbol: "USDC", amount: portfolio.quote_balance, usd_value: portfolio.quote_balance },
      ].filter((a) => a.amount > 0)
    : [];

  const getPercentageIcon = (value: number) => {
    if (value > 0) return <ArrowUpRight size={14} className="text-[#16A34A]" />;
    if (value < 0) return <ArrowDownRight size={14} className="text-[#DC2626]" />;
    return null;
  };

  return (
    <div className="h-full flex flex-col justify-between w-full bg-card relative overflow-hidden">
      
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="font-semibold text-lg text-foreground">Portfolio</h3>
          <p className="text-sm text-muted">Connected via WalletConnect</p>
        </div>
        <div className="w-10 h-10 rounded-full bg-background border border-border flex items-center justify-center text-foreground">
          <Wallet size={18} />
        </div>
      </div>

      <div className="mb-12">
        <p className="text-sm text-muted uppercase tracking-widest mb-2">Total Balance</p>
        <div className="flex items-end gap-4">
          <h2 className="text-5xl md:text-6xl font-medium tracking-tight text-foreground">
            $<AnimatedNumber value={totalValue} />
          </h2>
        </div>
        <div className="flex items-center gap-2 mt-4 text-sm font-medium">
          <div className={`flex items-center gap-1 ${isPositive ? 'text-[#16A34A] bg-[#F0FDF4] border-[#86EFAC]' : 'text-[#DC2626] bg-[#FEF2F2] border-[#FCA5A5]'} px-2 py-1 rounded-full border`}>
            {getPercentageIcon(pnl)}
            <span>${Math.abs(pnl).toFixed(2)} PnL</span>
          </div>
          <span className="text-muted">Today</span>
        </div>
      </div>

      <div className="flex-1">
        <h4 className="text-xs text-muted uppercase tracking-widest mb-4 border-b border-border/50 pb-2">Assets</h4>
        <div className="space-y-1 overflow-y-auto no-scrollbar pr-2 max-h-[300px]">
          {assets.length > 0 ? (
            assets.map(({ symbol, amount, usd_value }) => (
              <div key={symbol} className="flex justify-between items-center py-3 hover:bg-background px-2 rounded-xl transition-colors cursor-default group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center font-medium text-sm group-hover:scale-105 transition-transform">
                    {symbol.substring(0, 3)}
                  </div>
                  <div>
                    <h5 className="font-semibold text-foreground">{symbol}</h5>
                    <p className="text-xs text-muted font-mono">{Number(amount).toFixed(4)} {symbol}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-foreground">${Number(usd_value).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</p>
                  <div className="flex justify-end gap-1 items-center mt-0.5">
                    {symbol === "MONAD" ? (
                      <span className="text-xs text-[#16A34A] flex items-center gap-0.5"><ArrowUpRight size={10} /> 1.2%</span>
                    ) : (
                      <span className="text-xs text-muted flex items-center gap-0.5">0.0%</span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8 bg-background rounded-xl border border-border border-dashed">
              <p className="text-muted text-sm">No assets found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
