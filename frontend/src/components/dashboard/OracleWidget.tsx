"use client";

import { motion } from "framer-motion";
import { Activity, Clock, Zap, CheckCircle2 } from "lucide-react";
import { SharedState } from "@/hooks/useDashboardState";

export default function OracleWidget({ state }: { state?: SharedState }) {
  const isConnected = state?.contracts?.pythOracle !== undefined;
  
  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Zap className="text-[#836EF9]" size={20} />
          <h3 className="font-semibold text-lg">Pyth Oracle</h3>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
          <span className="text-xs text-[#10B981] font-medium">LIVE</span>
        </div>
      </div>

      <div className="flex-1 grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-[#F9FAFB] rounded-xl p-4 border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted mb-2">
            <CheckCircle2 size={16} />
            <span className="text-xs uppercase tracking-wider font-semibold">Status</span>
          </div>
          <p className="font-mono text-sm font-medium text-foreground">Connected</p>
        </div>

        <div className="bg-[#F9FAFB] rounded-xl p-4 border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Activity size={16} />
            <span className="text-xs uppercase tracking-wider font-semibold">Latency</span>
          </div>
          <p className="font-mono text-sm font-medium text-foreground">~400ms</p>
        </div>

        <div className="bg-[#F9FAFB] rounded-xl p-4 border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Clock size={16} />
            <span className="text-xs uppercase tracking-wider font-semibold">Updated</span>
          </div>
          <p className="font-mono text-sm font-medium text-foreground truncate" title={state?.updated_at}>
            {state?.updated_at ? new Date(state.updated_at).toLocaleTimeString() : "Just now"}
          </p>
        </div>
        
        <div className="bg-[#F9FAFB] rounded-xl p-4 border border-border flex flex-col justify-center">
          <div className="flex items-center gap-2 text-muted mb-2">
            <Zap size={16} />
            <span className="text-xs uppercase tracking-wider font-semibold">Feeds</span>
          </div>
          <p className="font-mono text-sm font-medium text-foreground">MON, USDC</p>
        </div>
      </div>

      <div className="mt-4 pt-4 border-t border-border flex justify-between items-center text-xs">
        <span className="text-muted">Oracle Contract</span>
        <span className="font-mono text-[#9CA3AF] truncate max-w-[200px]" title={state?.contracts?.pythOracle}>
          {state?.contracts?.pythOracle ? `${state.contracts.pythOracle.substring(0, 8)}...${state.contracts.pythOracle.substring(36)}` : "Not Available"}
        </span>
      </div>
    </div>
  );
}
