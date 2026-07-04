"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useWriteContract, useWaitForTransactionReceipt, useAccount } from "wagmi";
import { parseEther } from "viem";
import { Loader2, ArrowRightLeft, Settings2, CheckCircle2, AlertCircle, X } from "lucide-react";
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
  const [amount, setAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [tradeType, setTradeType] = useState<"BUY" | "SELL">("BUY");
  const { isConnected } = useAccount();

  const { data: hash, error, isPending, writeContract, reset } = useWriteContract();
  
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash,
  });
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
  
  // Calculate est received
  const numAmount = Number(amount) || 0;
  const estimatedReceived = tradeType === "BUY" && currentMonadPrice > 0 
    ? (numAmount / currentMonadPrice) * (1 - Number(slippage)/100) 
    : (numAmount * currentMonadPrice) * (1 - Number(slippage)/100);

  const handlePercentage = (pct: number) => {
    // In a real app, calculate based on actual wallet balance. Using mocked max for demo.
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

  // Reset state after success
  useEffect(() => {
    if (isConfirmed) {
      setTimeout(() => setAmount(""), 0);
    }
  }, [isConfirmed]);

  return (
    <div className="bg-card rounded-3xl border border-border p-6 shadow-sm flex flex-col relative overflow-hidden h-full">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-semibold text-lg flex items-center gap-2">
          <ArrowRightLeft size={18} className="text-accent" />
          Manual Execution
        </h3>
        <button className="text-muted hover:text-foreground transition-colors">
          <Settings2 size={18} />
        </button>
      </div>

      <div className="flex bg-muted/10 p-1 rounded-xl mb-6">
        <button 
          onClick={() => setTradeType("BUY")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tradeType === "BUY" ? "bg-card text-success shadow-sm" : "text-muted"}`}
        >
          Buy MONAD
        </button>
        <button 
          onClick={() => setTradeType("SELL")}
          className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${tradeType === "SELL" ? "bg-card text-danger shadow-sm" : "text-muted"}`}
        >
          Sell MONAD
        </button>
      </div>

      <div className="space-y-4 flex-1">
        <div>
          <div className="flex justify-between items-end mb-2">
            <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Amount</label>
            <div className="flex gap-1">
              {[25, 50, 75, 100].map(pct => (
                <button 
                  key={pct} 
                  onClick={() => handlePercentage(pct)}
                  className="text-[10px] font-medium bg-muted/10 hover:bg-border text-muted px-2 py-0.5 rounded"
                >
                  {pct}%
                </button>
              ))}
            </div>
          </div>
          <div className="relative">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-background border border-border rounded-xl px-4 py-3 text-xl font-mono focus:outline-none focus:ring-2 focus:ring-[#836EF9]/50 transition-all"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex items-center gap-2">
              <span className="text-muted text-sm font-medium">{tradeType === "BUY" ? "USDC" : "MONAD"}</span>
            </div>
          </div>
        </div>

        <div>
          <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-2 block">Slippage Tolerance</label>
          <div className="flex gap-2">
            {["0.1", "0.5", "1.0"].map((val) => (
              <button 
                key={val}
                onClick={() => setSlippage(val)}
                className={`flex-1 py-2 rounded-lg border text-sm font-medium transition-colors ${slippage === val ? "border-accent bg-accent/5 text-accent" : "border-border text-muted"}`}
              >
                {val}%
              </button>
            ))}
            <div className="relative flex-1">
              <input 
                type="number"
                value={slippage}
                onChange={(e) => setSlippage(e.target.value)}
                className="w-full h-full border border-border rounded-lg px-3 text-sm text-center focus:outline-none focus:border-accent"
              />
              <span className="absolute right-2 top-1/2 -translate-y-1/2 text-xs text-muted">%</span>
            </div>
          </div>
        </div>

        {/* Trade Details */}
        <div className="bg-[#F9FAFB] rounded-xl p-3 text-xs space-y-2 border border-border">
          <div className="flex justify-between">
            <span className="text-muted">Current Price</span>
            <span className="font-mono font-medium">${currentMonadPrice > 0 ? currentMonadPrice.toFixed(4) : "---"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Est. Received</span>
            <span className="font-mono font-medium">{estimatedReceived > 0 ? estimatedReceived.toFixed(6) : "0.00"} {tradeType === "BUY" ? "MONAD" : "USDC"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Price Impact</span>
            <span className="font-mono font-medium text-success">&lt; 0.01%</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted">Network Fee</span>
            <span className="font-mono font-medium">~0.0001 MONAD</span>
          </div>
        </div>
      </div>

      <div className="mt-6">
        <button 
          onClick={() => setShowConfirm(true)}
          disabled={!isConnected || isPending || isConfirming || !amount || numAmount <= 0}
          className={`w-full py-4 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 ${
            !isConnected || !amount || numAmount <= 0 ? "bg-[#D1D5DB] cursor-not-allowed" : 
            tradeType === "BUY" ? "bg-success hover:bg-[#15803d]" : "bg-danger hover:bg-[#b91c1c]"
          }`}
        >
          {isPending || isConfirming ? (
            <><Loader2 size={18} className="animate-spin" /> {isConfirming ? "Confirming On-Chain..." : "Awaiting Wallet..."}</>
          ) : !isConnected ? (
            "Connect Wallet to Trade"
          ) : (
            `${tradeType === "BUY" ? "Review Buy" : "Review Sell"} Order`
          )}
        </button>
      </div>

      {/* Confirmation Modal */}
      <AnimatePresence>
        {showConfirm && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-card/80 backdrop-blur-md z-30 flex flex-col p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h4 className="font-semibold text-lg">Confirm Trade</h4>
              <button onClick={() => setShowConfirm(false)} className="text-muted hover:text-foreground">
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 flex flex-col justify-center gap-4">
              <div className="text-center">
                <p className="text-sm text-muted mb-1">You are about to {tradeType.toLowerCase()}</p>
                <p className="text-3xl font-mono font-medium">{amount} {tradeType === "BUY" ? "USDC" : "MONAD"}</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted mb-1">and receive approx.</p>
                <p className="text-2xl font-mono font-medium text-accent">{estimatedReceived.toFixed(6)} {tradeType === "BUY" ? "MONAD" : "USDC"}</p>
              </div>
            </div>

            <button 
              onClick={handleTrade}
              className={`w-full py-4 rounded-xl font-medium text-white transition-all ${tradeType === "BUY" ? "bg-success hover:bg-[#15803d]" : "bg-danger hover:bg-[#b91c1c]"}`}
            >
              Confirm via Wallet
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Transaction Status Overlays */}
      {isConfirmed && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-card/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mb-4">
            <CheckCircle2 size={32} />
          </div>
          <h4 className="font-semibold text-lg mb-1">Trade Confirmed</h4>
          <p className="text-sm text-muted mb-6">Your trade was executed successfully on Monad testnet.</p>
          <button onClick={() => { reset(); }} className="px-6 py-2 bg-muted/10 rounded-full text-sm font-medium">Continue Trading</button>
        </motion.div>
      )}

      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="absolute inset-0 bg-card/95 backdrop-blur-md z-40 flex flex-col items-center justify-center p-6 text-center"
        >
          <div className="w-16 h-16 bg-danger/10 text-danger rounded-full flex items-center justify-center mb-4">
            <AlertCircle size={32} />
          </div>
          <h4 className="font-semibold text-lg mb-1">Execution Failed</h4>
          <p className="text-xs text-danger mb-6 max-w-[200px] truncate">{error.message}</p>
          <button onClick={() => { reset(); }} className="px-6 py-2 bg-muted/10 rounded-full text-sm font-medium">Dismiss</button>
        </motion.div>
      )}
    </div>
  );
}
