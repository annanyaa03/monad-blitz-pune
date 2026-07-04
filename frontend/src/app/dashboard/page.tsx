"use client";

import AIReasoning from "@/components/dashboard/AIReasoning";
import TradingChart from "@/components/dashboard/TradingChart";
import MonadTradingChart from "@/components/dashboard/MonadTradingChart";
import KillSwitch from "@/components/dashboard/KillSwitch";
import Portfolio from "@/components/dashboard/Portfolio";
import OracleWidget from "@/components/dashboard/OracleWidget";
import ManualTrading from "@/components/dashboard/ManualTrading";
import { useSession } from "next-auth/react";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useDashboardState } from "@/hooks/useDashboardState";
import Navbar from "@/components/Navbar";

export default function DashboardPage() {
  const { data: state, isLoading } = useDashboardState();
  const { data: session } = useSession();

  return (
    <main className="w-full min-h-screen bg-background text-foreground">
      <Navbar />
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <header className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-medium tracking-tight">Intelligence at Work.</h1>
            <div className="flex items-center gap-3 mt-4 h-8">
              {isLoading ? (
                <div className="flex items-center gap-2 bg-muted/10 px-3 py-1.5 rounded-full border border-border">
                  <div className="w-2 h-2 rounded-full bg-accent animate-pulse" />
                  <span className="text-sm font-medium text-muted">Syncing Data...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2 bg-success/10 px-3 py-1.5 rounded-full border border-success/20">
                  <div className="w-2 h-2 rounded-full bg-success" />
                  <span className="text-sm font-medium text-success">Synced</span>
                </div>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            {session && (
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-semibold">{session.user?.name}</p>
                </div>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name} 
                  alt="Avatar" 
                  className="w-10 h-10 rounded-full border border-border" 
                />
              </div>
            )}
            <div className="hidden md:block">
              <ConnectButton showBalance={false} />
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="h-[450px] bg-card rounded-2xl border border-border p-1 shadow-sm overflow-hidden relative">
                <TradingChart state={state} />
              </div>
              <div className="h-[450px] bg-card rounded-2xl border border-border p-1 shadow-sm overflow-hidden relative">
                <MonadTradingChart />
              </div>
            </div>
            <div className="bg-[#111111] text-[#FAFAFA] rounded-2xl p-6 shadow-sm overflow-hidden">
              <AIReasoning state={state} />
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <OracleWidget state={state} />
            </div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <Portfolio state={state} />
            </div>
            <div className="bg-card rounded-2xl border border-border p-0 shadow-sm overflow-hidden">
              <ManualTrading state={state} />
            </div>
            <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
              <KillSwitch state={state} />
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
