"use client";

import { motion } from "framer-motion";
import { BrainCircuit, Activity, TrendingUp, TrendingDown, Minus, AlertTriangle, ShieldCheck, Info } from "lucide-react";
import { SharedState } from "@/hooks/useDashboardState";

export default function AIReasoning({ state }: { state?: SharedState }) {
  const decision = state?.decision;
  const reasoning = state?.reasoning;
  const action = decision?.action?.toUpperCase() || "HOLD";
  
  // Try to parse raw JSON reasoning if available
  let rationale = decision?.rationale || "Awaiting reasoning data...";
  try {
    if (decision?.raw_model_output) {
      const parsed = JSON.parse(decision.raw_model_output);
      if (parsed.reason) rationale = parsed.reason;
    }
  } catch {
    // ignore
  }

  const confidence = state?.computed?.avgConfidence 
    ? (state.computed.avgConfidence <= 1 ? Math.round(state.computed.avgConfidence * 100) : Math.round(state.computed.avgConfidence)) 
    : 0;

  const riskLevel = state?.computed?.riskLevel || "NORMAL";
  const marketTrend = state?.computed?.marketTrend || "NEUTRAL";
  const timestamp = state?.updated_at ? new Date(state.updated_at).toLocaleTimeString() : "---";

  // Helpers for UI styling
  const getTrendIcon = () => {
    if (marketTrend === "BULLISH") return <TrendingUp size={16} className="text-[#16A34A]" />;
    if (marketTrend === "BEARISH") return <TrendingDown size={16} className="text-[#DC2626]" />;
    return <Minus size={16} className="text-[#6B7280]" />;
  };

  const getRiskIcon = () => {
    if (riskLevel === "HIGH") return <AlertTriangle size={16} className="text-[#DC2626]" />;
    if (riskLevel === "ELEVATED") return <AlertTriangle size={16} className="text-[#F59E0B]" />;
    return <ShieldCheck size={16} className="text-[#16A34A]" />;
  };

  const getActionColor = () => {
    if (action === "BUY") return "text-[#16A34A] bg-[#16A34A]/10 border-[#16A34A]/20";
    if (action === "SELL") return "text-[#DC2626] bg-[#DC2626]/10 border-[#DC2626]/20";
    return "text-[#836EF9] bg-[#836EF9]/10 border-[#836EF9]/20";
  };

  return (
    <div className="flex-1 flex flex-col p-6 h-full min-h-[400px] text-white">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <BrainCircuit className="text-[#836EF9]" size={20} />
          <h3 className="font-semibold text-lg text-white">AI Reasoning</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-[#1A1A1A] text-white px-2 py-1 rounded-full border border-[#333]">
          <Activity size={12} className="text-[#16A34A] animate-pulse" />
          {reasoning?.status === "thinking" ? "MiniMax Thinking" : "MiniMax Idle"}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-6 overflow-y-auto pr-2 no-scrollbar">
        {/* Market Summary */}
        <div className="space-y-2">
          <h4 className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold flex items-center gap-2">
            <Info size={14} /> Market Summary
          </h4>
          <p className="text-sm text-[#E5E7EB] font-light leading-relaxed">
            The market is currently exhibiting a {marketTrend.toLowerCase()} trend. 
            Technical indicators combined with real-time sentiment analysis 
            suggest a {confidence}% confidence level in the current market direction.
          </p>
        </div>

        {/* Dynamic Metrics */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] mb-1">Current Trend</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              {getTrendIcon()}
              <span className={marketTrend === "BULLISH" ? "text-[#16A34A]" : marketTrend === "BEARISH" ? "text-[#DC2626]" : "text-[#E5E7EB]"}>
                {marketTrend}
              </span>
            </div>
          </div>
          <div className="bg-[#1A1A1A] border border-[#333] rounded-xl p-4">
            <p className="text-xs text-[#6B7280] mb-1">Risk Assessment</p>
            <div className="flex items-center gap-2 text-sm font-medium">
              {getRiskIcon()}
              <span className={riskLevel === "HIGH" ? "text-[#DC2626]" : riskLevel === "ELEVATED" ? "text-[#F59E0B]" : "text-[#16A34A]"}>
                {riskLevel}
              </span>
            </div>
          </div>
        </div>

        {/* Reasoning Rationale */}
        <div className="space-y-2 flex-1">
          <h4 className="text-xs uppercase tracking-wider text-[#6B7280] font-semibold flex items-center gap-2">
            <BrainCircuit size={14} /> Reasoning
          </h4>
          <div className="bg-[#111111] border border-[#333] rounded-xl p-4 text-sm text-[#9CA3AF] font-light leading-relaxed italic">
            "{rationale}"
          </div>
        </div>
      </div>
      
      {/* Recommended Action */}
      <motion.div className="mt-4 pt-4 border-t border-[#333]">
        <div className={`flex justify-between items-center rounded-xl p-4 border ${getActionColor()}`}>
          <div>
            <p className="text-xs opacity-80 font-sans mb-1">Recommended Action</p>
            <p className="font-semibold font-sans text-xl">EXECUTE_{action}</p>
            <div className="flex gap-3 mt-1">
              <p className="text-[10px] font-sans opacity-70">
                Risk: {riskLevel}
              </p>
              <p className="text-[10px] font-sans opacity-70">{timestamp}</p>
            </div>
          </div>
          
          <div className="relative w-14 h-14 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle cx="28" cy="28" r="24" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" fill="none" />
              <motion.circle 
                cx="28" cy="28" r="24" 
                stroke="currentColor" 
                strokeWidth="4" 
                fill="none"
                strokeDasharray="150.7"
                initial={{ strokeDashoffset: 150.7 }}
                animate={{ strokeDashoffset: 150.7 * (1 - (confidence / 100)) }}
                transition={{ duration: 1, delay: 0.5 }}
              />
            </svg>
            <span className="absolute text-xs font-bold font-sans">{confidence}%</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
