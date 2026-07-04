import FundingPanel from "@/components/dashboard/FundingPanel";
import Navbar from "@/components/Navbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function FundingPage() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <Navbar />
      <div className="pt-24 px-6 max-w-[1400px] mx-auto pb-12 relative">
        <Link 
          href="/dashboard" 
          className="inline-flex items-center gap-2 text-[#6B7280] hover:text-[#111111] font-medium text-sm transition-colors mb-6"
        >
          <ArrowLeft size={16} />
          Return to Dashboard
        </Link>
        
        <div className="mb-8">
          <h1 className="text-4xl font-medium tracking-tight mb-2">Fund Your Agent</h1>
          <p className="text-[#6B7280]">Deposit capital to increase the agent's position sizing limits.</p>
        </div>
        <div className="max-w-md mx-auto">
          <FundingPanel />
        </div>
      </div>
    </div>
  );
}
