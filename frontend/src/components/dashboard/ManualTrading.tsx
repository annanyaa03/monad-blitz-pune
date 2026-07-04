"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther } from "viem";
import { Loader2, Settings2, CheckCircle2, AlertCircle, X, Brain, Zap, Play, Pause } from "lucide-react";
import { SharedState } from "@/hooks/useDashboardState";

const KILL_SWITCH_ABI = [
  {
    "inputs": [
      { "internalType": "uint8", "name": "action", "type": "uint8" },
      { "internalType": "uint256", "name": "size", "type": "uint256" },
      { "internalType": "address", "name": "target", "type": "address" },
      { "internalType": "bytes", "name": "data", "type": "bytes" }
    ],
    "name": "executeTrade",
    "outputs": [{ "internalType": "bytes", "name": "result", "type": "bytes" }],
    "stateMutability": "payable",
    "type": "function"
  }
];

export default function ManualTrading({ state }: { state?: SharedState }) {
  const [mode, setMode] = useState<"MANUAL" | "AUTONOMOUS">("MANUAL");
  const [autonomousEnabled, setAutonomousEnabled] = useState(false);
  
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const { isConnected } = useAccount();

  const { data: hash, error, isPending, writeContract, reset } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });
  const [showConfirm, setShowConfirm] = useState(false);
  
  const [currentMonadPrice, setCurrentMonadPrice] = useState<number>(0);
  const FEED_ID = "e786153cc54abd4b0e53b4c246d54d9f8eb3f3b5a34d4fc5a2e9a423b0ba5d6b";

  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    const fetchPrice = async () => {
      try {
        const res = await fetch(`https://hermes-beta.pyth.network/v2/updates/price/latest?ids[]=${FEED_ID}`);
        if (!res.ok) return;
        const data = await res.json();
        const feed = data.parsed?.[0];
        if (feed && feed.price) {
          const rawPrice = Number(feed.price.price);
          const expo = feed.price.expo;
          setCurrentMonadPrice(rawPrice * Math.pow(10, expo));
        }
      } catch (err) {}
    };

    fetchPrice();
    intervalId = setInterval(fetchPrice, 5000);
    return () => clearInterval(intervalId);
  }, []);
  
  const numAmount = Number(amount) || 0;
  const estimatedReceived = tradeType === "BUY" && currentMonadPrice > 0 
    ? (numAmount / currentMonadPrice) * (1 - Number(slippage)/100) 
    : (numAmount * currentMonadPrice) * (1 - Number(slippage)/100);

  const handlePercentage = (pct: number) => {
    const maxAmount = tradeType === "BUY" ? 1000 : 100;
    setAmount(((maxAmount * pct) / 100).toString());
  };

  const handleTrade = async () => {
    if (!amount || isNaN(numAmount)) return;
    
    const actionEnum = tradeType === "BUY" ? 0 : 1;
    const size = parseEther(amount);
    
    const killSwitchAddr = state?.contracts?.killSwitch || "0x7Cd79d8146002bD32496C26Aa06E9eEA5Ab1d787";
    const dexRouterAddr = state?.contracts?.dexRouter || "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";

    writeContract({
      address: killSwitchAddr as `0x${string}`,
      abi: KILL_SWITCH_ABI,
      functionName: 'executeTrade',
      args: [actionEnum, size, dexRouterAddr as `0x${string}`, "0x"],
      value: tradeType === "BUY" ? size : BigInt(0),
    });
    setShowConfirm(false);
  };

  useEffect(() => {
    if (isConfirmed) setTimeout(() => setAmount(""), 0);
  }, [isConfirmed]);

  return (
    <div className="bg-card rounded-3xl h-full flex flex-col relative overflow-hidden">
      
      {/* Mode Switcher */}
      <div className="flex border-b border-border">
        <button 
          onClick={() => setMode("MANUAL")}
          className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${mode === "MANUAL" ? "text-foreground border-b-2 border-foreground" : "text-muted"}`}
        >
          <Zap size={16} /> Manual Trade
        </button>
        <button 
          onClick={() => setMode("AUTONOMOUS")}
          className={`flex-1 py-4 text-sm font-semibold transition-colors flex items-center justify-center gap-2 ${mode === "AUTONOMOUS" ? "text-[#836EF9] border-b-2 border-[#836EF9]" : "text-muted"}`}
        >
          <Brain size={16} /> Autonomous Mode
        </button>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {mode === "MANUAL" ? (
          <div className="flex-1 flex flex-col h-full space-y-6">
            <div className="flex bg-muted/20 p-1 rounded-xl">
              <button onClick={() => setTradeType("BUY")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tradeType === "BUY" ? "bg-card text-[#16A34A] shadow-sm" : "text-muted"}`}>
                Buy MONAD
              </button>
              <button onClick={() => setTradeType("SELL")} className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${tradeType === "SELL" ? "bg-card text-[#DC2626] shadow-sm" : "text-muted"}`}>
                Sell MONAD
              </button>
            </div>

            <div>
              <div className="flex justify-between items-end mb-3">
                <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Trade Amount</label>
                <div className="flex gap-1.5">
                  {[25, 50, 75, 100].map(pct => (
                    <button key={pct} onClick={() => handlePercentage(pct)} className="text-[10px] font-medium bg-background border border-border hover:border-[#836EF9] hover:text-[#836EF9] text-muted px-2 py-1 rounded transition-colors">
                      {pct === 100 ? 'MAX' : `${pct}%`}
                    </button>
                  ))}
                </div>
              </div>
              <div className="relative">
                <input 
                  type="number" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00"
                  className="w-full bg-background border border-border rounded-2xl pl-6 pr-20 py-4 text-2xl font-mono focus:outline-none focus:border-[#836EF9] focus:ring-1 focus:ring-[#836EF9] transition-all"
                />
                <span className="absolute right-6 top-1/2 -translate-y-1/2 text-foreground font-semibold">{tradeType === "BUY" ? "USDC" : "MONAD"}</span>
              </div>
            </div>

            <div className="bg-background rounded-2xl p-4 border border-border space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-muted">Price</span>
                <span className="font-mono text-foreground">${currentMonadPrice > 0 ? currentMonadPrice.toFixed(4) : "---"}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted">Est. Received</span>
                <span className="font-mono text-foreground font-medium">{estimatedReceived > 0 ? estimatedReceived.toFixed(6) : "0.00"} {tradeType === "BUY" ? "MONAD" : "USDC"}</span>
              </div>
            </div>

            <button 
              onClick={() => setShowConfirm(true)}
              disabled={!isConnected || isPending || isConfirming || !amount || numAmount <= 0}
              className={`w-full mt-auto py-4 rounded-2xl font-medium text-background transition-all flex items-center justify-center gap-2 ${
                !isConnected || !amount || numAmount <= 0 ? "bg-[#D1D5DB] cursor-not-allowed text-[#9CA3AF]" : 
                tradeType === "BUY" ? "bg-foreground hover:bg-black" : "bg-[#DC2626] hover:bg-[#B91C1C]"
              }`}
            >
              {!isConnected ? "Connect Wallet" : `${tradeType === "BUY" ? "Review Buy" : "Review Sell"}`}
            </button>
          </div>
        ) : (
          <div className="flex-1 flex flex-col h-full space-y-6">
            <div className={`p-6 rounded-3xl border-2 flex flex-col items-center justify-center text-center transition-colors ${autonomousEnabled ? "border-[#836EF9] bg-[#836EF9]/5" : "border-border bg-background"}`}>
              <div className={`w-16 h-16 rounded-full flex items-center justify-center mb-4 ${autonomousEnabled ? "bg-[#836EF9] text-background shadow-lg shadow-[#836EF9]/30" : "bg-[#E5E7EB] text-[#9CA3AF]"}`}>
                {autonomousEnabled ? <Play size={24} className="ml-1" /> : <Pause size={24} />}
              </div>
              <h4 className="text-xl font-semibold mb-2">{autonomousEnabled ? "System Running" : "System Paused"}</h4>
              <p className="text-sm text-muted max-w-[250px]">
                {autonomousEnabled ? "The AI is actively monitoring and executing trades." : "The AI will analyze but will NOT execute trades."}
              </p>
              <button 
                onClick={() => setAutonomousEnabled(!autonomousEnabled)}
                className={`mt-6 px-8 py-3 rounded-full text-sm font-medium transition-all ${autonomousEnabled ? "bg-card text-[#DC2626] border border-[#DC2626]/20 hover:bg-[#FEF2F2]" : "bg-foreground text-background hover:bg-black"}`}
              >
                {autonomousEnabled ? "Pause Trading" : "Enable Autonomous Mode"}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4 flex-1">
              <div className="border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted mb-2">Next Evaluation</p>
                <p className="font-mono text-sm text-foreground">in 12s</p>
              </div>
              <div className="border border-border rounded-2xl p-4">
                <p className="text-[10px] uppercase tracking-wider text-muted mb-2">AI Health</p>
                <div className="flex items-center gap-1.5 font-medium text-[#16A34A] text-sm">
                  <div className="w-1.5 h-1.5 bg-[#16A34A] rounded-full animate-pulse" />
                  Optimal
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <AnimatePresence>
        {showConfirm && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-card/90 backdrop-blur-md z-30 flex flex-col p-8 justify-center text-center">
            <button onClick={() => setShowConfirm(false)} className="absolute top-6 right-6 text-muted hover:text-foreground"><X size={24} /></button>
            <h4 className="text-2xl font-medium tracking-tight mb-2">Confirm Execution</h4>
            <p className="text-muted mb-8">Review transaction details below.</p>
            <div className="bg-background rounded-3xl p-6 border border-border mb-8">
              <p className="text-sm text-muted mb-2">{tradeType === "BUY" ? "Paying" : "Selling"}</p>
              <p className="text-4xl font-mono tracking-tight text-foreground mb-6">{amount} <span className="text-xl text-muted">{tradeType === "BUY" ? "USDC" : "MONAD"}</span></p>
              <div className="h-px bg-[#E5E7EB] w-full mb-6" />
              <p className="text-sm text-muted mb-2">Receiving (Est.)</p>
              <p className="text-3xl font-mono text-[#836EF9]">{estimatedReceived.toFixed(6)} <span className="text-lg text-muted">{tradeType === "BUY" ? "MONAD" : "USDC"}</span></p>
            </div>
            <button onClick={handleTrade} className="w-full py-5 rounded-2xl font-medium text-background bg-foreground hover:bg-black text-lg">
              Confirm on Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
