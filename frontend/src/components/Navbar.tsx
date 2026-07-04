"use client";

import { motion } from "framer-motion";
import { Zap, LogOut, LayoutDashboard, Settings, CreditCard, Code, FileText, ChevronDown } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";
import ThemeToggle from "./ThemeToggle";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 py-6 bg-background/80 backdrop-blur-xl text-foreground transition-colors duration-300"
    >
      {/* Left: Logo */}
      <Link href="/" className="flex items-center gap-3 group">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background group-hover:scale-105 transition-transform">
          <Zap size={14} className="fill-current" />
        </div>
        <span className="font-semibold tracking-tight text-lg">Monad AI</span>
      </Link>

      {/* Center: Navigation Links removed as requested */}

      {/* Right: Actions & Auth */}
      <div className="flex items-center gap-6">
        <ThemeToggle />
        {!session ? (
          <button 
            onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
            className="text-[13px] font-medium hover:text-[#836EF9] transition-colors flex items-center gap-2"
          >
            Google Login
          </button>
        ) : (
          <div className="flex items-center gap-6">
            <Link href="/dashboard" className="text-[13px] font-medium hover:text-[#836EF9] transition-colors hidden md:block">
              Dashboard
            </Link>
            
            <div className="relative">
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition-opacity"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img 
                  src={session.user?.image || "https://ui-avatars.com/api/?name=" + session.user?.name} 
                  alt="Avatar" 
                  className="w-8 h-8 rounded-full border border-border" 
                />
                <ChevronDown size={14} className="text-muted" />
              </button>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-3 w-56 bg-card border border-border rounded-2xl shadow-xl overflow-hidden py-2 z-50">
                  <div className="px-5 py-3 border-b border-border mb-2 bg-muted/10">
                    <p className="text-sm font-medium text-foreground truncate">{session.user?.name}</p>
                    <p className="text-xs text-muted truncate mt-0.5">{session.user?.email}</p>
                  </div>
                  
                  <Link href="/dashboard" className="flex items-center gap-3 px-5 py-2.5 text-sm text-muted hover:text-foreground hover:bg-background transition-all" onClick={() => setDropdownOpen(false)}>
                    <LayoutDashboard size={16} /> Dashboard
                  </Link>
                  <Link href="/funding" className="flex items-center gap-3 px-5 py-2.5 text-sm text-muted hover:text-foreground hover:bg-background transition-all" onClick={() => setDropdownOpen(false)}>
                    <CreditCard size={16} /> Funding
                  </Link>
                  <Link href="/settings" className="flex items-center gap-3 px-5 py-2.5 text-sm text-muted hover:text-foreground hover:bg-background transition-all" onClick={() => setDropdownOpen(false)}>
                    <Settings size={16} /> Settings
                  </Link>
                  
                  <div className="border-t border-border mt-2 pt-2">
                    <button 
                      onClick={() => signOut({ callbackUrl: "/" })}
                      className="flex w-full items-center gap-3 px-5 py-2.5 text-sm text-[#DC2626] hover:bg-[#FEF2F2] transition-all"
                    >
                      <LogOut size={16} /> Log Out
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* Divider removed */}
        <div className="scale-90 origin-right">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </motion.nav>
  );
}
