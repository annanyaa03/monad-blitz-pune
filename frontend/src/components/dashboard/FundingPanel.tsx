"use client";

import { useState } from "react";
import { CreditCard, Bitcoin, ArrowRight, CheckCircle2, Lock } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useAccount } from "wagmi";
import { ConnectButton } from '@rainbow-me/rainbowkit';

export default function FundingPanel() {
  const [method, setMethod] = useState<"CRYPTO" | "STRIPE">("STRIPE");
  const [amount, setAmount] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { isConnected } = useAccount();

  const handleDeposit = () => {
    if (!amount) return;
    setIsProcessing(true);
    // Simulate payment processing delay
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      setTimeout(() => {
        setIsSuccess(false);
        setAmount("");
      }, 3000);
    }, 2000);
  };

  return (
    <div className="bg-white rounded-3xl border border-[#E5E7EB] p-6 shadow-sm flex flex-col h-full relative overflow-hidden min-h-[400px]">
      <div className="mb-6">
        <h3 className="font-semibold text-lg">Fund Account</h3>
        <p className="text-sm text-[#6B7280]">Deposit USDC or Fiat</p>
      </div>

      {!isConnected ? (
        <div className="flex-1 flex flex-col items-center justify-center text-center space-y-4">
          <div className="w-16 h-16 bg-[#F3F4F6] rounded-full flex items-center justify-center text-[#9CA3AF] mb-2">
            <Lock size={24} />
          </div>
          <div>
            <h4 className="font-medium text-lg text-[#111111]">Authentication Required</h4>
            <p className="text-sm text-[#6B7280] max-w-xs mx-auto mt-1 mb-6">Please connect your wallet to access the secure payment portal.</p>
          </div>
          <ConnectButton showBalance={false} />
        </div>
      ) : (
        <>
          <div className="flex gap-2 mb-6 p-1 bg-[#F3F4F6] rounded-xl">
        <button 
          onClick={() => setMethod("STRIPE")}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${method === "STRIPE" ? "bg-white shadow-sm text-[#111111]" : "text-[#6B7280]"}`}
        >
          <CreditCard size={16} /> Card
        </button>
        <button 
          onClick={() => setMethod("CRYPTO")}
          className={`flex-1 py-2 flex items-center justify-center gap-2 rounded-lg text-sm font-medium transition-all ${method === "CRYPTO" ? "bg-white shadow-sm text-[#111111]" : "text-[#6B7280]"}`}
        >
          <Bitcoin size={16} /> Crypto
        </button>
      </div>

      <div className="space-y-5 flex-1">
        <div>
          <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2 block">Deposit Amount (USD)</label>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#6B7280]">$</span>
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              className="w-full bg-[#FAFAFA] border border-[#E5E7EB] rounded-xl pl-8 pr-4 py-3 text-lg font-mono focus:outline-none focus:border-[#836EF9] transition-colors"
            />
          </div>
        </div>

        {method === "STRIPE" && (
          <div className="space-y-3">
            <label className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider block">Card Details</label>
            <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] space-y-4">
              {/* Fake Stripe Element UI for visual fidelity without requiring client secret */}
              <div className="flex items-center gap-3">
                <CreditCard size={20} className="text-[#9CA3AF]" />
                <input type="text" placeholder="Card number" className="bg-transparent outline-none text-sm w-full font-mono placeholder:font-sans" />
              </div>
              <div className="flex gap-4 border-t border-[#E5E7EB] pt-3">
                <input type="text" placeholder="MM / YY" className="bg-transparent outline-none text-sm w-1/2 font-mono placeholder:font-sans" />
                <input type="text" placeholder="CVC" className="bg-transparent outline-none text-sm w-1/2 font-mono placeholder:font-sans" />
              </div>
            </div>
            <p className="text-[10px] text-[#9CA3AF] flex items-center justify-center gap-1 mt-2">
              <LockIcon /> Payments are securely processed by Stripe
            </p>
          </div>
        )}

        {method === "CRYPTO" && (
          <div className="p-4 rounded-xl border border-[#E5E7EB] bg-[#FAFAFA] flex flex-col items-center justify-center text-center">
            <div className="w-32 h-32 bg-white rounded-lg p-2 mb-3 border border-[#E5E7EB]">
              {/* Placeholder for QR Code */}
              <div className="w-full h-full bg-[#F3F4F6] flex items-center justify-center text-[#9CA3AF]">QR</div>
            </div>
            <p className="text-xs text-[#6B7280] mb-1">Send USDC on Monad Testnet</p>
            <p className="text-[10px] font-mono break-all text-[#111111] bg-white px-2 py-1 border border-[#E5E7EB] rounded">
              0x742d35Cc6634C0532925a3b844Bc454e4438f44e
            </p>
          </div>
        )}
      </div>

        <button 
          onClick={handleDeposit}
          disabled={!amount || isProcessing}
          className={`w-full mt-6 py-3 rounded-xl font-medium text-white transition-all flex items-center justify-center gap-2 ${
            !amount ? "bg-[#D1D5DB] cursor-not-allowed" : "bg-[#111111] hover:bg-black"
          }`}
        >
          {isProcessing ? "Processing..." : `Simulate Mock Deposit ($${amount || "0"})`} <ArrowRight size={16} />
        </button>

      <AnimatePresence>
        {isSuccess && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white z-20 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="w-16 h-16 bg-[#16A34A]/10 text-[#16A34A] rounded-full flex items-center justify-center mb-4">
              <CheckCircle2 size={32} />
            </div>
            <h4 className="font-semibold text-lg mb-1">Deposit Successful</h4>
            <p className="text-sm text-[#6B7280]">Your funds are now available for AI trading.</p>
          </motion.div>
        )}
      </AnimatePresence>
        </>
      )}
    </div>
  );
}

function LockIcon() {
  return (
    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
    </svg>
  );
}
