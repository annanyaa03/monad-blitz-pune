"use client";

import { motion } from "framer-motion";
import { ShieldAlert, ShieldCheck, Loader2, Activity } from "lucide-react";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { SharedState } from "@/hooks/useDashboardState";

const KILL_SWITCH_ABI = [
  {
    "inputs": [],
    "name": "pause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "unpause",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

export default function KillSwitch({ state }: { state?: SharedState }) {
  const ks = state?.kill_switch;
  const isLocked = ks?.status !== "ACTIVE" && ks?.status !== "unknown";
  const dailyLimit = ks?.daily_cap || 0;
  const currentUsage = ks?.traded_today || 0;
  const usagePercent = dailyLimit > 0 ? Math.min((currentUsage / dailyLimit) * 100, 100) : 0;
  
  const formatMoney = (val: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0
    }).format(val);
  };

  const { isConnected } = useAccount();
  const { data: hash, isPending, writeContract } = useWriteContract();
  const { isLoading: isConfirming } = useWaitForTransactionReceipt({ hash });

  const handleToggle = () => {
    if (!isConnected || !state?.contracts?.killSwitch) return;
    const functionName = ks?.paused ? 'unpause' : 'pause';
    writeContract({
      address: state.contracts.killSwitch as `0x${string}`,
      abi: KILL_SWITCH_ABI,
      functionName,
    });
  };

  const isButtonDisabled = isPending || isConfirming || !isConnected;

  const getHealthColor = () => {
    if (isLocked) return "text-[#DC2626]";
    if (usagePercent > 80) return "text-[#F59E0B]";
    return "text-[#16A34A]";
  };

  return (
    <div className="h-full flex flex-col justify-between w-full bg-card relative overflow-hidden">
      <div className="flex items-center justify-between z-10 relative mb-8">
        <div>
          <h3 className="font-semibold text-lg text-foreground">Daily Limit</h3>
          <p className="text-sm text-muted">Risk Management Contract</p>
        </div>
        <div className={`px-3 py-1.5 rounded-full text-xs font-medium flex items-center gap-2 border ${isLocked ? "bg-[#FEF2F2] border-[#FCA5A5] text-[#DC2626]" : "bg-[#F0FDF4] border-[#86EFAC] text-[#16A34A]"}`}>
          {isLocked ? <ShieldAlert size={14} /> : <ShieldCheck size={14} />}
          {isLocked ? `LOCKED: ${ks?.status}` : "SYSTEM ACTIVE"}
        </div>
      </div>

      <div className="flex items-center justify-center my-6 relative z-10">
        <div className="relative w-48 h-48 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="96" cy="96" r="80" stroke="#F3F4F6" strokeWidth="12" fill="none" />
            <motion.circle 
              cx="96" cy="96" r="80" 
              stroke={usagePercent > 80 ? "#F59E0B" : isLocked ? "#DC2626" : "#836EF9"} 
              strokeWidth="12" 
              fill="none"
              strokeDasharray="502.6"
              initial={{ strokeDashoffset: 502.6 }}
              animate={{ strokeDashoffset: 502.6 * (1 - (usagePercent / 100)) }}
              transition={{ duration: 1.5, ease: "easeOut" }}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center text-center">
            <span className="text-3xl font-mono font-medium tracking-tight text-foreground">{Math.round(usagePercent)}%</span>
            <span className="text-xs text-muted uppercase tracking-widest mt-1">Capacity</span>
          </div>
        </div>
      </div>

      <div className="space-y-6 z-10 relative mt-4">
        <div className="flex justify-between items-end border-b border-border/50 pb-4">
          <div>
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Remaining Capacity</p>
            <p className="font-mono text-lg font-medium">{formatMoney(Math.max(0, dailyLimit - currentUsage))}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-muted uppercase tracking-wider mb-1">Daily Cap</p>
            <p className="font-mono text-lg text-foreground">{formatMoney(dailyLimit)}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Cooldown</p>
            <p className="font-mono text-base font-medium">{ks?.cooldown_seconds || 0}s</p>
          </div>
          <div className="bg-background rounded-xl p-4 border border-border">
            <p className="text-[10px] text-muted uppercase tracking-wider mb-1">Health</p>
            <div className={`flex items-center gap-1.5 font-medium text-sm ${getHealthColor()}`}>
              <Activity size={14} /> {isLocked ? "CRITICAL" : usagePercent > 80 ? "WARNING" : "OPTIMAL"}
            </div>
          </div>
        </div>

        <button 
          onClick={handleToggle}
          disabled={isButtonDisabled}
          className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
            isLocked 
              ? "bg-foreground hover:bg-black text-background" 
              : "bg-card border border-border hover:bg-[#FEF2F2] hover:border-[#FCA5A5] hover:text-[#DC2626] text-muted"
          } ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : ""}`}
        >
          {isPending || isConfirming ? (
            <Loader2 size={18} className="animate-spin" />
          ) : isLocked ? (
            "Authorize System Reset"
          ) : (
            "Manual Override (Pause)"
          )}
        </button>
      </div>
    </div>
  );
}
