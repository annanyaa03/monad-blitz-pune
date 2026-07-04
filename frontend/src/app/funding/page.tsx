"use client";

import { motion } from "framer-motion";
import { CreditCard, CheckCircle2, ChevronRight, AlertCircle, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useSession } from "next-auth/react";

export default function FundingPage() {
  const { data: session } = useSession();
  const [amount, setAmount] = useState("100");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  
  const handleFund = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate Stripe API call
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
          <span className="font-semibold tracking-tight text-lg">Deposit Funds</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/withdraw" className="text-sm font-medium text-muted hover:text-foreground transition-colors">
            Withdrawals
          </Link>
          <div className="w-px h-4 bg-[#E5E7EB]" />
          <div className="text-sm font-medium text-foreground flex items-center gap-2">
            <CreditCard size={16} className="text-[#836EF9]" />
            Powered by Stripe
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
              <h2 className="text-2xl font-semibold mb-2">Deposit Successful</h2>
              <p className="text-muted mb-8">Your funds have been deposited to your internal account and will be available for AI trading shortly.</p>
              <Link href="/dashboard" className="block w-full py-4 rounded-xl font-medium text-background bg-foreground hover:bg-black transition-colors">
                Return to Dashboard
              </Link>
            </motion.div>
          ) : (
            <div>
              <h1 className="text-4xl font-medium tracking-tight mb-4">Add Funds</h1>
              <p className="text-muted mb-10 text-lg">Top up your internal account balance to enable automated AI trading using fiat or crypto.</p>
              
              <form onSubmit={handleFund} className="space-y-8">
                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 block">Amount to deposit (USD)</label>
                  <div className="relative">
                    <span className="absolute left-6 top-1/2 -translate-y-1/2 text-2xl text-muted">$</span>
                    <input 
                      type="number" 
                      value={amount} 
                      onChange={(e) => setAmount(e.target.value)}
                      className="w-full bg-card border border-border rounded-2xl pl-12 pr-6 py-5 text-4xl font-mono focus:outline-none focus:border-[#836EF9] focus:ring-1 focus:ring-[#836EF9] transition-all"
                      required
                    />
                  </div>
                  <div className="flex gap-2 mt-4">
                    {["100", "500", "1000", "5000"].map(val => (
                      <button 
                        key={val} type="button" onClick={() => setAmount(val)}
                        className="flex-1 py-2 text-sm font-medium border border-border bg-card hover:border-[#836EF9] hover:text-[#836EF9] rounded-xl transition-colors"
                      >
                        ${val}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-muted uppercase tracking-wider mb-3 block">Payment Method</label>
                  <div className="bg-card border-2 border-[#836EF9] rounded-2xl p-4 flex items-center justify-between cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-background border border-border rounded-lg flex items-center justify-center">
                        <CreditCard size={20} className="text-foreground" />
                      </div>
                      <div>
                        <p className="font-semibold text-sm">Credit / Debit Card</p>
                        <p className="text-xs text-muted">Instant transfer</p>
                      </div>
                    </div>
                    <div className="w-5 h-5 rounded-full border-4 border-[#836EF9] bg-card" />
                  </div>
                </div>

                <button 
                  type="submit" 
                  disabled={loading || !amount || Number(amount) <= 0}
                  className="w-full py-5 rounded-2xl font-medium text-background bg-foreground hover:bg-black transition-colors flex items-center justify-center gap-2 text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Processing..." : `Deposit $${amount}`}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Right Column: Info */}
        <div className="flex-1 hidden md:block">
          <div className="bg-card rounded-3xl p-8 border border-border sticky top-24">
            <h3 className="font-semibold text-lg mb-6">Deposit Information</h3>
            
            <div className="space-y-6">
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">1</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Instant Availability</h4>
                  <p className="text-sm text-muted">Funds deposited via Stripe are instantly available for the AI Agent to use in trading.</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">2</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Zero Platform Fees</h4>
                  <p className="text-sm text-muted">Monad AI charges no fees on deposits. Standard Stripe processing rates apply (approx 2.9% + 30¢).</p>
                </div>
              </div>
              
              <div className="flex gap-4">
                <div className="mt-1">
                  <div className="w-8 h-8 rounded-full bg-background border border-border flex items-center justify-center">
                    <span className="text-xs font-bold text-foreground">3</span>
                  </div>
                </div>
                <div>
                  <h4 className="font-medium text-sm mb-1">Secure Storage</h4>
                  <p className="text-sm text-muted">Internal balances are backed 1:1 with USDC held in an institutional-grade multi-sig vault.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 pt-6 border-t border-border/50">
              <div className="flex items-start gap-3 p-4 bg-[#F9FAFB] rounded-xl text-sm">
                <AlertCircle size={16} className="text-muted mt-0.5" />
                <p className="text-muted">Deposits are subject to AML/KYC checks if they exceed $10,000 within a 30-day period.</p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
