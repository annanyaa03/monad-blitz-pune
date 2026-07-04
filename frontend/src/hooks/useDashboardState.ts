import { useQuery } from "@tanstack/react-query";

export type SharedState = {
  updated_at: string | null;
  market: {
    symbol: string;
    price: number | null;
    confidence: number | null;
    publish_time: number | null;
    history: { price: number; [key: string]: unknown }[];
  };
  decision: {
    action: string;
    size: number;
    source: string;
    raw_model_output: string;
    rationale: string;
  };
  reasoning: {
    status: string;
    stream: string;
    display: string;
    last_complete: string;
  };
  recent_trades: unknown[];
  portfolio: {
    base_balance: number;
    quote_balance: number;
    mark_to_market_quote: number;
    pnl_quote: number;
  };
  kill_switch: {
    status: string;
    paused: boolean | null;
    remaining_cap: number | null;
    daily_cap: number | null;
    traded_today: number | null;
    cooldown_seconds: number | null;
    next_trade_at: number | null;
  };
  errors: unknown[];
  computed?: {
    ema5: number | null;
    ema20: number | null;
    marketTrend: string;
    avgConfidence: number;
    winRate: number;
    riskLevel: string;
  };
  contracts?: {
    killSwitch: string;
    dexRouter: string;
  };
};

export function useDashboardState() {
  return useQuery<SharedState>({
    queryKey: ["dashboardState"],
    queryFn: async () => {
      const response = await fetch(`/api/state?t=${Date.now()}`, { cache: 'no-store' });
      if (!response.ok) {
        throw new Error("Failed to fetch state");
      }
      return response.json();
    },
    refetchInterval: 2000, // Poll every 2 seconds
  });
}
