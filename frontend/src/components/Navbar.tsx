"use client";

import { motion } from "framer-motion";
import { Zap, LogOut, User, LayoutDashboard, Settings, CreditCard } from "lucide-react";
import Link from "next/link";
import { ConnectButton } from '@rainbow-me/rainbowkit';
import { useSession, signIn, signOut } from "next-auth/react";
import { useState } from "react";

export default function Navbar() {
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <motion.nav 
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-6 py-4 bg-white/70 backdrop-blur-md border-b border-[#E5E7EB] text-[#111111]"
    >
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-[#111111] flex items-center justify-center text-white">
          <Zap size={16} className="fill-current" />
        </div>
        <span className="font-medium tracking-tight text-lg">Monad AI</span>
      </div>

      <div className="hidden md:flex items-center gap-8 text-sm font-medium opacity-80">
        <Link href="#architecture" className="hover:opacity-100 transition-opacity">Architecture</Link>
        <Link href="/dashboard" className="hover:opacity-100 transition-opacity">Dashboard</Link>
        <Link href="/funding" className="hover:opacity-100 transition-opacity">Funding</Link>
      </div>

      <div className="flex items-center gap-4">
        {!session ? (
          <button 
            onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
            className="text-sm font-medium hover:text-[#836EF9] transition-colors"
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
                className="w-8 h-8 rounded-full border border-[#E5E7EB]" 
              />
            </button>
            
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-[#E5E7EB] rounded-xl shadow-xl overflow-hidden py-1 z-50">
                <div className="px-4 py-2 border-b border-[#E5E7EB] mb-1">
                  <p className="text-sm font-medium truncate">{session.user?.name}</p>
                  <p className="text-xs text-[#6B7280] truncate">{session.user?.email}</p>
                </div>
                
                <Link href="/dashboard" className="flex items-center gap-2 px-4 py-2 text-sm text-[#111111] hover:bg-[#F3F4F6] transition-colors" onClick={() => setDropdownOpen(false)}>
                  <LayoutDashboard size={14} /> Dashboard
                </Link>
                <Link href="/funding" className="flex items-center gap-2 px-4 py-2 text-sm text-[#111111] hover:bg-[#F3F4F6] transition-colors" onClick={() => setDropdownOpen(false)}>
                  <CreditCard size={14} /> Funding
                </Link>
                <div className="flex items-center gap-2 px-4 py-2 text-sm text-[#111111] hover:bg-[#F3F4F6] transition-colors cursor-pointer" onClick={() => setDropdownOpen(false)}>
                  <Settings size={14} /> Settings
                </div>
                
                <div className="border-t border-[#E5E7EB] mt-1 pt-1">
                  <button 
                    onClick={() => signOut({ callbackUrl: "/" })}
                    className="flex w-full items-center gap-2 px-4 py-2 text-sm text-[#DC2626] hover:bg-[#F3F4F6] transition-colors"
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
