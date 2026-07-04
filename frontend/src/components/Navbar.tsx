"use client";

import { motion } from "framer-motion";
import { Zap, LogOut, User, LayoutDashboard, Settings, CreditCard, Sun, Moon } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-background/80 backdrop-blur-xl border-b border-border text-foreground"
    >
      <Link href="/" className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-foreground flex items-center justify-center text-background">
          <Zap size={16} className="fill-current" />
        </div>
        <span className="font-medium tracking-tight text-lg">Monad AI</span>
      </Link>

      <div className="flex items-center gap-4">
        <button 
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
          className="p-2 rounded-full hover:bg-muted/20 transition-colors"
          aria-label="Toggle theme"
        >
          {mounted ? (
            theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />
          ) : (
            <div className="w-[18px] h-[18px]" />
          )}
        </button>

        {!session ? (
          <button 
            onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
            className="text-sm font-medium hover:text-accent transition-colors"
          >
            Sign In
          </button>
        ) : (
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
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-xl shadow-xl overflow-hidden py-1 z-50">
                <div className="px-4 py-2 border-b border-border mb-1">
                  <p className="text-sm font-medium truncate">{session.user?.name}</p>
                  <p className="text-xs text-muted truncate">{session.user?.email}</p>
                </div>
                
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/10 transition-colors" onClick={() => setDropdownOpen(false)}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link href="/funding" className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/10 transition-colors" onClick={() => setDropdownOpen(false)}>
                  <CreditCard size={14} /> Funding
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted/10 transition-colors cursor-pointer" onClick={() => setDropdownOpen(false)}>
                  <Settings size={14} /> Settings
                </div>
                
                <div className="border-t border-border mt-1 pt-1">
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-muted/10 transition-colors"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        )}
        
        <div className="scale-90 origin-right">
          <ConnectButton showBalance={false} />
        </div>
      </div>
    </motion.nav>
  );
}
