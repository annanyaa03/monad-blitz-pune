"use client";

import { motion } from "framer-motion";
import { ShieldAlert, Lock, Unlock, Loader2 } from "lucide-react";
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
  const usagePercent = dailyLimit > 0 ? (currentUsage / dailyLimit) * 100 : 0;
  
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

  return (
    <div className="h-full flex flex-col justify-between">
      <div className="flex items-center justify-between z-10 relative">
        <div className="flex items-center gap-2">
          <ShieldAlert className={isLocked ? "text-[#DC2626]" : "text-[#16A34A]"} size={24} />
          <h3 className="font-semibold text-lg">KillSwitch Module</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5 ${isLocked ? "bg-[#DC2626]/20 text-[#DC2626]" : "bg-[#16A34A]/20 text-[#16A34A]"}`}>
          <div className={`w-1.5 h-1.5 rounded-full ${isLocked ? "bg-[#DC2626]" : "bg-[#16A34A] animate-pulse"}`} />
          {isLocked ? `LOCKED: ${ks?.status}` : "SYSTEM ACTIVE"}
        </div>
      </div>

      <div className="flex items-center justify-center my-8 relative z-10">
        <button 
          onClick={handleToggle}
          disabled={isButtonDisabled}
          className={`w-32 h-32 rounded-full border-4 flex items-center justify-center shadow-2xl transition-colors duration-500 relative z-20 ${
            isLocked ? "border-[#DC2626] bg-[#DC2626]/10 hover:bg-[#DC2626]/20" : "border-[#333333] bg-[#1a1a1a] hover:bg-[#222]"
          } ${isButtonDisabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
        >
          {isPending || isConfirming ? (
            <Loader2 size={40} className={`animate-spin ${isLocked ? "text-[#DC2626]" : "text-[#6B7280]"}`} />
          ) : isLocked ? (
            <Lock size={40} className="text-[#DC2626]" />
          ) : (
            <Unlock size={40} className="text-[#6B7280]" />
          )}
        </button>

        {/* Rotating rings when active */}
        {!isLocked && (
          <>
            <motion.div 
              animate={{ rotate: 360 }}
              transition={{ repeat: Infinity, duration: 8, ease: "linear" }}
              className="absolute w-40 h-40 rounded-full border border-dashed border-[#6B7280]/50 z-10"
            />
            <motion.div 
              animate={{ rotate: -360 }}
              transition={{ repeat: Infinity, duration: 12, ease: "linear" }}
              className="absolute w-48 h-48 rounded-full border border-[#333333] z-10"
            />
          </>
        )}
      </div>

      <div className="space-y-4 z-10 relative">
        <div>
          <div className="flex justify-between text-xs mb-1 text-[#a1a1aa]">
            <span>Daily Trading Limit</span>
            <span className="font-mono">{formatMoney(currentUsage)} / {formatMoney(dailyLimit)}</span>
          </div>
          <div className="w-full h-1.5 bg-[#333333] rounded-full overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${usagePercent}%` }}
              transition={{ duration: 1, delay: 0.2 }}
              className={`h-full ${usagePercent > 80 ? "bg-[#DC2626]" : "bg-[#836EF9]"}`}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#333333]">
            <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Paused</p>
            <p className="font-mono text-sm font-medium">{ks?.paused ? "YES" : "NO"}</p>
          </div>
          <div className="bg-[#1a1a1a] rounded-xl p-3 border border-[#333333]">
            <p className="text-[10px] text-[#6B7280] uppercase tracking-wider mb-1">Cooldown</p>
            <p className="font-mono text-sm font-medium text-[#16A34A]">{ks?.cooldown_seconds || 0}s</p>
          </div>
        </div>

        <div className="mt-4 pt-4 border-t border-[#333333] flex justify-between items-center">
          <span className="text-[10px] text-[#6B7280] uppercase tracking-wider">Contract Address</span>
          <span className="font-mono text-xs text-[#a1a1aa] truncate max-w-[150px]" title={state?.contracts?.killSwitch}>
            {state?.contracts?.killSwitch ? `${state.contracts.killSwitch.substring(0, 6)}...${state.contracts.killSwitch.substring(38)}` : "Not Connected"}
          </span>
        </div>
      </div>
      
      {/* Background glow */}
      <div className={`absolute -bottom-24 -right-24 w-64 h-64 rounded-full blur-[100px] transition-colors duration-1000 ${isLocked ? "bg-[#DC2626]/20" : "bg-[#836EF9]/10"}`} />
    </div>
  );
}
