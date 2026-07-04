"use client";

import { Zap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-foreground text-background py-12 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
        <div className="flex items-center gap-2 mb-6 md:mb-0">
          <div className="w-8 h-8 rounded-full bg-background flex items-center justify-center text-foreground">
            <Zap size={16} className="fill-current" />
          </div>
          <span className="font-medium tracking-tight text-lg">Monad AI</span>
        </div>

        <div className="flex items-center gap-8 text-sm text-background/60">
          <Link href="#" className="hover:text-background transition-colors">Documentation</Link>
          <Link href="#" className="hover:text-background transition-colors">Monad Ecosystem</Link>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-background/20 flex flex-col md:flex-row items-center justify-between text-xs text-background/60">
        <p>© 2026 Monad AI Agent. Built for the Monad Hackathon.</p>
        <p className="mt-2 md:mt-0">Premium Autonomous Trading.</p>
      </div>
    </footer>
  );
}
