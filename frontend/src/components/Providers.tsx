"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { WagmiProvider, http, useAccount } from "wagmi";
import { monadTestnet } from "wagmi/chains";
import { RainbowKitProvider, getDefaultConfig } from '@rainbow-me/rainbowkit';
import { walletConnectWallet } from '@rainbow-me/rainbowkit/wallets';
import { AlertCircle } from "lucide-react";
import '@rainbow-me/rainbowkit/styles.css';
import { SessionProvider, useSession } from "next-auth/react";

// We use standard monadTestnet from wagmi/chains to ensure proper balance formatting (fixes NaN MON)

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

// 2. Configure Wagmi strictly without dummy project IDs
const config = projectId ? getDefaultConfig({
  appName: 'Monad AI Agent',
  projectId,
  chains: [monadTestnet],
  wallets: [
    {
      groupName: 'Connect via QR Code',
      wallets: [walletConnectWallet],
    },
  ],
  ssr: true,
  transports: {
    [monadTestnet.id]: http('https://testnet-rpc.monad.xyz'),
  },
}) : null;

function WalletSync() {
  const { address } = useAccount();
  const { data: session, update } = useSession();

  useEffect(() => {
    if (session && session.user && address !== (session.user as any).walletAddress) {
      fetch('/api/user/wallet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ walletAddress: address || null }),
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            update({ walletAddress: data.walletAddress });
          }
        })
        .catch(console.error);
    }
  }, [address, session, update]);

  return null;
}

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  // 3. Fallback Developer UI if WalletConnect ID is missing
  if (!projectId || !config) {
    return (
      <div className="min-h-screen bg-[#FAFAFA] flex flex-col items-center justify-center p-6 text-center">
        <div className="bg-[#FEF2F2] text-[#991B1B] p-6 rounded-3xl max-w-lg border border-[#FCA5A5] shadow-sm">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-[#FEE2E2] rounded-full flex items-center justify-center text-[#DC2626]">
              <AlertCircle size={32} />
            </div>
          </div>
          <h2 className="text-xl font-bold mb-2">Developer Configuration Required</h2>
          <p className="text-sm mb-4">
            The Web3 wallet connection layer requires a valid <strong>WalletConnect Project ID</strong> to initialize securely. No fallback IDs are allowed.
          </p>
          <div className="text-left bg-white p-4 rounded-xl border border-[#FCA5A5] mb-4">
            <p className="text-xs font-mono mb-2">1. Get a free Project ID from <a href="https://cloud.walletconnect.com/" target="_blank" rel="noreferrer" className="underline font-bold text-[#DC2626]">WalletConnect Cloud</a></p>
            <p className="text-xs font-mono">2. Add it to your <span className="bg-[#FEE2E2] px-1 rounded">frontend/.env.local</span> file:</p>
            <code className="block bg-[#F9FAFB] p-2 mt-2 text-xs border border-[#E5E7EB] rounded text-[#111111]">
              NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_project_id_here
            </code>
          </div>
          <p className="text-xs opacity-80">Restart the development server after adding the environment variable.</p>
        </div>
      </div>
    );
  }

  return (
    <SessionProvider>
      <WagmiProvider config={config}>
        <QueryClientProvider client={queryClient}>
          <RainbowKitProvider>
            <WalletSync />
            {children}
          </RainbowKitProvider>
        </QueryClientProvider>
      </WagmiProvider>
    </SessionProvider>
  );
}
