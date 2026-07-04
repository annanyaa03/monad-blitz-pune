"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white py-12 px-6">
      <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center text-[#111111]">
            <Zap size={16} className="fill-current" />
          </div>
          <span className="font-medium tracking-tight text-lg">Monad AI</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-[#6B7280]">
          <Link href="#" className="hover:text-white transition-colors">Documentation</Link>
          <Link href="#" className="hover:text-white transition-colors">Monad Ecosystem</Link>
        </div>
      </div>
      
      <div className="max-w-[1400px] mx-auto mt-12 pt-8 border-t border-[#333333] flex flex-col md:flex-row items-center justify-between text-xs text-[#6B7280]">
        <p>© 2026 Monad AI Agent. Built for the Monad Hackathon.</p>
        <p className="mt-2 md:mt-0">Premium Autonomous Trading.</p>
      </div>
    </footer>
  );
}
