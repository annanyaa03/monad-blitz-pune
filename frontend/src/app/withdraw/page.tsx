"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowUpRight, CheckCircle2, Clock, Landmark, Wallet } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

export default function WithdrawPage() {
  const [amount, setAmount] = useState("");
  const [destination, setDestination] = useState<"BANK" | "WALLET">("BANK");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const availableBalance = 12500.50;

  const handleWithdraw = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col font-sans">
      
      {/* Header */}
      <header className="px-8 py-6 border-b border-border bg-card flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <Link href="/dashboard" className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-muted/20 transition-colors text-muted hover:text-foreground">
            <ArrowLeft size={18} />
          </Link>
          <span className="font-semibold tracking-tight text-lg">Withdraw Funds</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/funding" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Deposit
          </Link>
          <div className="w-px h-4 bg-[#E5E7EB]" />
          <div className="text-sm font-medium text-foreground flex items-center gap-2">
            Available: ${availableBalance.toLocaleString('en-US', { minimumFractionDigits: 2 })}
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-[1000px] w-full mx-auto px-6 py-12 flex flex-col md:flex-row gap-12">
        
        {/* Left Column: Form */}
        <div className="flex-1 max-w-[500px]">
          {success ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
              className="bg-card rounded-3xl p-10 border border-border text-center"
            >
              <div className="w-16 h-16 bg-[#F0FDF4] text-[#16A34A] rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle2 size={32} />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Withdrawal Initiated</h2>
              <p className="text-muted mb-8">Your funds are on the way. They will arrive in your {destination === "BANK" ? "bank account in 1-3 business days" : "wallet shortly"}.</p>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl font-medium text-background bg-foreground hover:bg-black transition-colors">
                Return to Dashboard
              </Link>
            </motion.div>
          ) : (
            <div>
              <h1 className="text-4xl font-medium tracking-tight mb-4">Withdraw</h1>
              <p className="text-muted mb-10 text-lg">Transfer your internal balance to your bank account or Web3 wallet.</p>
              
              <form onSubmit={handleWithdraw} className="space-y-8">
                
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 block">Destination</label>
                  <div className="grid grid-cols-2 gap-4">
                    <button 
                      type="button"
                      onClick={() => setDestination("BANK")}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${destination === "BANK" ? "border-[#836EF9] bg-[#836EF9]/5" : "border-border bg-card hover:border-[#836EF9]/50"}`}
                    >
                      <Landmark size={20} className={destination === "BANK" ? "text-[#836EF9] mb-3" : "text-muted mb-3"} />
                      <h4 className="font-semibold text-sm mb-1 text-foreground">Bank Account</h4>
                      <p className="text-xs text-muted">1-3 Business Days</p>
                    </button>
                    <button 
                      type="button"
                      onClick={() => setDestination("WALLET")}
                      className={`p-4 rounded-2xl border-2 text-left transition-all ${destination === "WALLET" ? "border-[#836EF9] bg-[#836EF9]/5" : "border-border bg-card hover:border-[#836EF9]/50"}`}
                    >
                      <Wallet size={20} className={destination === "WALLET" ? "text-[#836EF9] mb-3" : "text-muted mb-3"} />
                      <h4 className="font-semibold text-sm mb-1 text-foreground">Web3 Wallet</h4>
                      <p className="text-xs text-muted">USDC on Monad</p>
                    </button>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-end mb-3">
                    <label className="text-xs font-semibold text-muted uppercase tracking-wider block">Amount to withdraw (USD)</label>
                    <button type="button" onClick={() => setAmount(availableBalance.toString())} className="text-[10px] font-medium bg-background border border-border hover:border-[#836EF9] hover:text-[#836EF9] text-muted px-2 py-1 rounded transition-colors">
                      MAX
                    </button>
                  </div>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-muted">$</span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      max={availableBalance}
                      className="w-full bg-card border border-border rounded-2xl pl-12 pr-6 py-5 text-4xl font-mono focus:outline-none focus:border-[#836EF9] focus:ring-1 focus:ring-[#836EF9] transition-all"
                      required
                    />
                  </div>
                  {Number(amount) > availableBalance && (
                    <p className="text-xs text-[#DC2626] mt-2">Amount exceeds available balance.</p>
                  )}
                </div>

                <div className="bg-[#F9FAFB] rounded-xl p-4 border border-border/50 text-sm space-y-2">
                  <div className="flex justify-between text-muted">
                    <span>Amount</span>
                    <span>${Number(amount) > 0 ? Number(amount).toFixed(2) : "0.00"}</span>
                  </div>
                  <div className="flex justify-between text-muted">
                    <span>Network Fee</span>
                    <span>$0.00</span>
                  </div>
                  <div className="h-px w-full bg-[#E5E7EB] my-2" />
                  <div className="flex justify-between font-medium text-foreground">
                    <span>Total You'll Receive</span>
                    <span>${Number(amount) > 0 ? Number(amount).toFixed(2) : "0.00"}</span>
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !amount || Number(amount) <= 0 || Number(amount) > availableBalance}
                  className="w-full py-5 rounded-2xl font-medium text-background bg-foreground hover:bg-black transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : `Withdraw $${amount}`}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="flex-1 hidden md:block">
          <div className="bg-card rounded-3xl p-8 border border-border sticky top-24">
            <h3 className="font-semibold text-lg mb-6">Withdrawal Info</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                    <Clock size={14} className="text-foreground" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Processing Times</h4>
                  <p className="text-sm text-muted">Bank transfers typically take 1-3 business days. Web3 wallet transfers are processed within minutes.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                    <ArrowUpRight size={14} className="text-foreground" />
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Limits</h4>
                  <p className="text-sm text-muted">Maximum daily withdrawal limit is $50,000. Contact support for higher limits.</p>
                </div>
              </div>
            </div>
            
          </div>
        </div>

      </div>
    </div>
  );
}
