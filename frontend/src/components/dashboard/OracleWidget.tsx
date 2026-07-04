"use client";

import { motion } from "framer-motion";
import { Network } from "lucide-react";
import { useEffect, useState } from "react";
import { SharedState } from "@/hooks/useDashboardState";

export default function OracleWidget({ state }: { state?: SharedState }) {
  const [pulse, setPulse] = useState(false);
  const price = state?.market?.price ? state.market.price.toFixed(4) : "---";

  let change24h = "---";
  let changeColor = "text-[#6B7280]";
  if (state?.market?.history && state.market.history.length > 0 && state.market.price) {
    const firstPrice = state.market.history[0].price;
    const currentPrice = state.market.price;
    if (firstPrice && currentPrice) {
      const diff = currentPrice - firstPrice;
      const pct = (diff / firstPrice) * 100;
      change24h = `${diff >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
      changeColor = diff > 0 ? "text-[#10B981]" : diff < 0 ? "text-[#EF4444]" : "text-[#6B7280]";
    }
  }

  useEffect(() => {
    // Pulse every time price updates
    const tm1 = setTimeout(() => setPulse(true), 0);
    const tm2 = setTimeout(() => setPulse(false), 500);
    return () => {
      clearTimeout(tm1);
      clearTimeout(tm2);
    };
  }, [price]);

  const [latency, setLatency] = useState(0);

  useEffect(() => {
    if (state?.market?.publish_time) {
      setTimeout(() => setLatency(Math.max(0, Math.floor(Date.now() / 1000) - (state.market.publish_time as number))), 0);
    }
  }, [state?.market?.publish_time, price]);

  return (
    <div className="h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Network size={20} className="text-[#836EF9]" />
          <h3 className="font-semibold text-lg">Pyth Oracle</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${pulse ? "bg-[#16A34A]" : "bg-[#E5E7EB]"} transition-colors duration-200`} />
          <span className="text-xs font-mono text-[#6B7280]">LIVE FEED</span>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-center relative mt-4">
        {/* Abstract Node Network */}
        <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
          <svg width="100%" height="100%" viewBox="0 0 200 150">
            {/* Lines */}
            <motion.line x1="20" y1="20" x2="100" y2="75" stroke="#E5E7EB" strokeWidth="1" />
            <motion.line x1="180" y1="30" x2="100" y2="75" stroke="#E5E7EB" strokeWidth="1" />
            <motion.line x1="30" y1="130" x2="100" y2="75" stroke="#E5E7EB" strokeWidth="1" />
            <motion.line x1="170" y1="120" x2="100" y2="75" stroke="#E5E7EB" strokeWidth="1" />
            
            {/* Animated Particle traveling along a line */}
            <motion.circle 
              r="2" 
              fill="#836EF9"
              initial={{ cx: 20, cy: 20, opacity: 0 }}
              animate={{ 
                cx: [20, 100], 
                cy: [20, 75],
                opacity: pulse ? [0, 1, 0] : 0
              }}
              transition={{ duration: 0.8, ease: "easeIn" }}
            />
             <motion.circle 
              r="2" 
              fill="#836EF9"
              initial={{ cx: 180, cy: 30, opacity: 0 }}
              animate={{ 
                cx: [180, 100], 
                cy: [30, 75],
                opacity: pulse ? [0, 1, 0] : 0
              }}
              transition={{ duration: 0.8, delay: 0.2, ease: "easeIn" }}
            />

            {/* Nodes */}
            <circle cx="20" cy="20" r="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
            <circle cx="180" cy="30" r="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
            <circle cx="30" cy="130" r="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
            <circle cx="170" cy="120" r="4" fill="#F3F4F6" stroke="#D1D5DB" strokeWidth="1" />
            
            {/* Center Node */}
            <motion.circle 
              cx="100" cy="75" r="8" 
              fill="#FFFFFF" 
              stroke="#836EF9" 
              strokeWidth="2"
              animate={{ 
                scale: pulse ? [1, 1.3, 1] : 1,
                boxShadow: pulse ? "0 0 20px #836EF9" : "none"
              }}
              transition={{ duration: 0.5 }}
            />
          </svg>
        </div>

        <div className="z-10 text-center bg-white/80 backdrop-blur-sm p-4 rounded-2xl border border-[#F3F4F6]">
          <p className="text-xs text-[#6B7280] font-medium tracking-widest mb-1">{state?.market?.symbol || "MONAD/USDC"}</p>
          <motion.h4 
            key={price}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-mono font-medium text-[#111111] flex flex-col items-center gap-1"
          >
            ${price}
            <span className={`text-sm ${changeColor}`}>{change24h} (24h)</span>
          </motion.h4>
          <div className="mt-2 text-[10px] text-[#9CA3AF] flex justify-center gap-3 font-mono">
            <span>EMA5: {state?.computed?.ema5 ? state.computed.ema5.toFixed(4) : "---"}</span>
            <span>EMA20: {state?.computed?.ema20 ? state.computed.ema20.toFixed(4) : "---"}</span>
          </div>
        </div>
      </div>
      
      <div className="mt-auto pt-4 border-t border-[#F3F4F6] grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs text-[#6B7280]">Market Trend</p>
          <p className={`text-sm font-medium ${state?.computed?.marketTrend === "BULLISH" ? "text-[#10B981]" : state?.computed?.marketTrend === "BEARISH" ? "text-[#EF4444]" : "text-[#6B7280]"}`}>
            {state?.computed?.marketTrend || "NEUTRAL"}
          </p>
        </div>
        <div className="text-right">
          <p className="text-xs text-[#6B7280]">Latency</p>
          {(() => {
            if (!state?.market?.publish_time) return <p className="text-sm font-medium text-[#111111]">---</p>;
            if (latency <= 5) return <p className="text-sm font-medium text-[#10B981]">Live ({latency}s ago)</p>;
            if (latency <= 15) return <p className="text-sm font-medium text-[#F59E0B]">Refreshing...</p>;
            return <p className="text-sm font-medium text-[#EF4444]">Stale</p>;
          })()}
        </div>
      </div>
    </div>
  );
}
