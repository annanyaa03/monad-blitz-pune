"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BrainCircuit, Activity, ChevronDown, ChevronUp } from "lucide-react";
import { SharedState } from "@/hooks/useDashboardState";

const TypingEffect = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  const [displayedText, setDisplayedText] = useState("");

  useEffect(() => {
    setDisplayedText("");
    let i = 0;
    const timer = setTimeout(() => {
      const interval = setInterval(() => {
        setDisplayedText(text.slice(0, i + 1));
        i++;
        if (i >= text.length) clearInterval(interval);
      }, 20); // typing speed
      return () => clearInterval(interval);
    }, delay);
    return () => clearTimeout(timer);
  }, [text, delay]);

  return <span>{displayedText}</span>;
};

export default function AIReasoning({ state }: { state?: SharedState }) {
  const decision = state?.decision;
  const action = decision?.action?.toUpperCase() || "HOLD";
  const [expanded, setExpanded] = useState(false);
  
  let rationale = decision?.rationale || "Awaiting reasoning data from MiniMax...";
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

  const getActionColor = () => {
    if (action === "BUY") return "text-[#16A34A]";
    if (action === "SELL") return "text-[#DC2626]";
    return "text-[#836EF9]";
  };

  const getActionBg = () => {
    if (action === "BUY") return "bg-[#16A34A]";
    if (action === "SELL") return "bg-[#DC2626]";
    return "bg-[#836EF9]";
  };

  return (
    <div className="flex-1 flex flex-col p-8 h-full text-background w-full">
      <div className="flex items-center justify-between mb-8 border-b border-[#333] pb-6">
        <div className="flex items-center gap-3">
          <BrainCircuit className="text-[#836EF9]" size={24} />
          <h3 className="font-medium tracking-tight text-xl text-background">Agent Reasoning</h3>
        </div>
        <div className="flex items-center gap-2 text-xs font-medium bg-[#1A1A1A] text-background px-3 py-1.5 rounded-full border border-[#333]">
          <Activity size={12} className="text-[#16A34A] animate-pulse" />
          {state?.reasoning?.status === "thinking" ? "MiniMax Thinking" : "MiniMax Idle"}
        </div>
      </div>
      
      <div className="flex-1 flex flex-col gap-8 overflow-y-auto no-scrollbar">
        
        {/* Core Decision Header */}
        <div className="flex flex-col items-center justify-center text-center py-6">
          <p className="text-sm text-[#9CA3AF] uppercase tracking-[0.2em] mb-4">Current Recommendation</p>
          <motion.div 
            key={action}
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className={`text-5xl md:text-6xl font-medium tracking-tight ${getActionColor()}`}
          >
            {action}
          </motion.div>
          <div className="mt-6 flex items-center gap-4 text-sm font-mono">
            <span className="text-[#9CA3AF]">Confidence:</span>
            <span className="text-background font-medium">{confidence}%</span>
            <span className="text-[#333]">&bull;</span>
            <span className="text-[#9CA3AF]">Risk:</span>
            <span className={riskLevel === "HIGH" ? "text-[#DC2626]" : riskLevel === "ELEVATED" ? "text-[#F59E0B]" : "text-[#16A34A]"}>{riskLevel}</span>
          </div>
        </div>

        {/* Detailed Metrics Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 border-t border-b border-[#333] py-6">
          <div>
            <p className="text-muted text-xs uppercase tracking-widest mb-1">Market Trend</p>
            <p className="font-mono text-sm">{marketTrend}</p>
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-widest mb-1">Position Size</p>
            <p className="font-mono text-sm">{(confidence > 80 ? "MAX" : confidence > 60 ? "75%" : "25%")}</p>
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-widest mb-1">Target</p>
            <p className="font-mono text-sm">Dynamic EMA</p>
          </div>
          <div>
            <p className="text-muted text-xs uppercase tracking-widest mb-1">Timestamp</p>
            <p className="font-mono text-sm">{timestamp}</p>
          </div>
        </div>

        {/* Expandable Reasoning */}
        <div>
          <button 
            onClick={() => setExpanded(!expanded)}
            className="w-full flex items-center justify-between py-4 text-sm font-medium text-[#E5E7EB] hover:text-background transition-colors group"
          >
            <span className="uppercase tracking-widest text-xs">View MiniMax Rationale</span>
            {expanded ? <ChevronUp size={16} className="text-muted group-hover:text-background" /> : <ChevronDown size={16} className="text-muted group-hover:text-background" />}
          </button>
          
          <AnimatePresence>
            {expanded && (
              <motion.div 
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-[#1A1A1A] p-6 rounded-2xl border border-[#333] text-sm text-[#E5E7EB] leading-relaxed font-light mt-2">
                  <TypingEffect text={rationale} />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
