"use client";

import FundingPanel from "@/components/dashboard/FundingPanel";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft, Zap, Shield, Wallet } from "lucide-react";

export default function FundingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 px-6 max-w-7xl mx-auto pb-12 relative">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-muted hover:text-foreground font-medium text-sm transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Return to Dashboard
        </Link>
        
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-medium tracking-tight mb-2">Fund Your Agent</h1>
          <p className="text-muted text-lg">Deposit capital to increase the agent's position sizing limits.</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
          {/* Left Column: Funding Panel */}
          <div className="md:col-span-7 lg:col-span-8">
            <FundingPanel />
          </div>
          
          {/* Right Column: Info Sidebar */}
          <div className="md:col-span-5 lg:col-span-4">
            <div className="sticky top-24 bg-card rounded-3xl border border-border p-6 shadow-sm">
              <h3 className="font-semibold text-lg mb-6">Funding Benefits</h3>
              
              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent shrink-0">
                    <Zap size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">1. Instant Availability</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">Funds are instantly available for the AI agent to utilize in live trading strategies.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center text-success shrink-0">
                    <Wallet size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">2. Zero Platform Fees</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">We do not take a cut from your deposits. 100% of your capital goes toward your position sizing.</p>
                  </div>
                </div>
                
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center text-warning shrink-0">
                    <Shield size={20} />
                  </div>
                  <div>
                    <h4 className="font-medium text-sm">3. Secure Storage</h4>
                    <p className="text-xs text-muted mt-1 leading-relaxed">Funds are routed through audited smart contracts. Only your connected wallet can initiate withdrawals.</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-6 border-t border-border">
                <p className="text-[10px] text-muted text-center leading-relaxed">
                  By depositing funds, you agree to our Terms of Service. Please note that crypto trading involves significant risk. The AI agent executes trades autonomously based on predefined risk limits.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
