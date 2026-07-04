"use client";

import { motion } from "framer-motion";
import { Wallet, ArrowUpRight, ArrowDownRight } from "lucide-react";
import { SharedState } from "@/hooks/useDashboardState";

export default function Portfolio({ state }: { state?: SharedState }) {
  const pnl = state?.portfolio?.pnl_quote || 0;
  const isPositive = pnl >= 0;
  
  const baseBalance = state?.portfolio?.base_balance || 0;
  const quoteBalance = state?.portfolio?.quote_balance || 0;
  const mtm = state?.portfolio?.mark_to_market_quote || 0;
  
  const totalValue = quoteBalance + mtm;
  
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(val);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex justify-between items-center mb-8">
        <div className="flex items-center gap-2">
          <div className="bg-[#111111] p-2 rounded-xl text-white">
            <Wallet size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-lg leading-tight">Agent Portfolio</h3>
            <p className="text-xs text-[#6B7280]">Real-time Balance</p>
          </div>
        </div>
        <div className="text-right">
          <p className={`text-sm font-medium flex items-center justify-end gap-1 ${isPositive ? 'text-[#16A34A]' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />} 
            {formatMoney(Math.abs(pnl))}
          </p>
          <p className="text-xs text-[#6B7280]">Total PnL</p>
        </div>
      </div>

      <div className="mb-8">
        <motion.p 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-5xl font-medium tracking-tight font-mono"
        >
          {formatMoney(totalValue)}
        </motion.p>
      </div>

      <div className="flex-1 flex flex-col justify-end">
        <h4 className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-4">Asset Allocation</h4>
        
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#836EF9]/10 flex items-center justify-center text-[#836EF9] font-bold text-xs">M</div>
              <div>
                <p className="font-medium text-sm">MONAD</p>
                <p className="text-xs text-[#6B7280]">{baseBalance.toFixed(4)} M</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm font-mono">{formatMoney(mtm)}</p>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-[#2775CA]/10 flex items-center justify-center text-[#2775CA] font-bold text-xs">$</div>
              <div>
                <p className="font-medium text-sm">USDC</p>
                <p className="text-xs text-[#6B7280]">{quoteBalance.toFixed(2)} USDC</p>
              </div>
            </div>
            <div className="text-right">
              <p className="font-medium text-sm font-mono">{formatMoney(quoteBalance)}</p>
              <p className="text-xs text-[#6B7280]">Stable</p>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-[#F3F4F6] grid grid-cols-3 gap-2 text-center">
          <div>
            <p className="text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">Trades</p>
            <p className="text-sm font-medium font-mono">{state?.recent_trades?.length || 0}</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">Win Rate</p>
            <p className="text-sm font-medium font-mono">{state?.computed?.winRate || 0}%</p>
          </div>
          <div>
            <p className="text-[10px] text-[#6B7280] uppercase tracking-widest mb-1">Avg Conf</p>
            <p className="text-sm font-medium font-mono">{(state?.computed?.avgConfidence || 0).toFixed(2)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
