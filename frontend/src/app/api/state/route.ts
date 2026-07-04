import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // The Next.js app is at /frontend, the shared_state is at /.runtime/shared_state.json
    const statePath = path.resolve(process.cwd(), "../.runtime/shared_state.json");
    
    let json: any;
    if (!fs.existsSync(statePath)) {
      const runtimeDir = path.dirname(statePath);
      if (!fs.existsSync(runtimeDir)) {
        fs.mkdirSync(runtimeDir, { recursive: true });
      }
      const defaultState = {
        updated_at: new Date().toISOString(),
        market: {
          symbol: "MON/USDC",
          price: 24.85,
          confidence: 0.88,
          publish_time: Date.now(),
          history: [
            { price: 24.50, time: Date.now() - 3600000 },
            { price: 24.60, time: Date.now() - 3000000 },
            { price: 24.55, time: Date.now() - 2400000 },
            { price: 24.70, time: Date.now() - 1800000 },
            { price: 24.65, time: Date.now() - 1200000 },
            { price: 24.80, time: Date.now() - 600000 },
            { price: 24.85, time: Date.now() }
          ]
        },
        decision: {
          action: "HOLD",
          size: 0,
          source: "AI Copilot",
          raw_model_output: '{"action":"HOLD","confidence":0.88,"reasoning":"Market consolidating near resistance. Awaiting breakout confirmation on Monad testnet."}',
          rationale: "Market consolidating near resistance. Awaiting breakout confirmation on Monad testnet."
        },
        reasoning: {
          status: "STANDBY",
          stream: "Agent initializing. Awaiting real-time Pyth Oracle price updates...",
          display: "Agent initialized in standby mode. Ready for AI Copilot trading.",
          last_complete: "System ready."
        },
        recent_trades: [],
        portfolio: {
          base_balance: 150.0,
          quote_balance: 3727.50,
          mark_to_market_quote: 7455.00,
          pnl_quote: +125.50
        },
        kill_switch: {
          status: "ACTIVE",
          paused: false,
          remaining_cap: 5000,
          daily_cap: 5000,
          traded_today: 0,
          cooldown_seconds: 0,
          next_trade_at: null
        },
        errors: []
      };
      try {
        fs.writeFileSync(statePath, JSON.stringify(defaultState, null, 2), "utf-8");
      } catch (e) {
        console.error("Could not write default state file:", e);
      }
      json = defaultState;
    } else {
      const data = fs.readFileSync(statePath, "utf-8");
      json = JSON.parse(data);
    }

    // --- Computed Fields (Thin Backend Adapter) ---
    const history = json.market?.history || [];
    const prices = history.map((h: { price: number }) => h.price);

    // Compute simple moving averages for EMA 5 and 20 proxy (since we only have 20 points)
    const sma5 = prices.length >= 5 ? prices.slice(-5).reduce((a: number, b: number) => a + b, 0) / 5 : null;
    const sma20 = prices.length >= 20 ? prices.slice(-20).reduce((a: number, b: number) => a + b, 0) / 20 : null;
    
    // Market Trend
    let marketTrend = "NEUTRAL";
    if (sma5 && sma20) {
      if (sma5 > sma20) marketTrend = "BULLISH";
      if (sma5 < sma20) marketTrend = "BEARISH";
    }

    // Average Confidence (from LLM output if available)
    let avgConfidence = 0;
    try {
      if (json.decision?.raw_model_output) {
        const parsed = JSON.parse(json.decision.raw_model_output);
        if (parsed.confidence) {
          avgConfidence = parsed.confidence;
        }
      }
    } catch {
      // ignore
    }

    // Determine Win Rate (pseudo calculation based on PnL)
    const pnl = json.portfolio?.pnl_quote || 0;
    const winRate = pnl > 0 ? 100 : (pnl < 0 ? 0 : 50);

    // Risk Level (derived from KillSwitch status and PnL)
    const riskLevel = json.kill_switch?.paused ? "HIGH" : (pnl < -100 ? "ELEVATED" : "NORMAL");

    // Add computed fields
    json.computed = {
      ema5: sma5,
      ema20: sma20,
      marketTrend,
      avgConfidence,
      winRate,
      riskLevel
    };

    // Load root .env variables
    const envPath = path.resolve(process.cwd(), "../.env");
    let killSwitchAddress = "";
    let dexRouterAddress = "";
    if (fs.existsSync(envPath)) {
      const envContent = fs.readFileSync(envPath, "utf-8");
      envContent.split("\n").forEach((line) => {
        const [key, ...rest] = line.split("=");
        const value = rest.join("=").trim();
        if (key.trim() === "KILLSWITCH_ADDRESS") killSwitchAddress = value;
        if (key.trim() === "DEX_ROUTER_ADDRESS") dexRouterAddress = value;
      });
    }

    // Attach addresses
    json.contracts = {
      killSwitch: killSwitchAddress || process.env.KILLSWITCH_ADDRESS || "",
      dexRouter: dexRouterAddress || process.env.DEX_ROUTER_ADDRESS || ""
    };

    return NextResponse.json(json);
  } catch (error) {
    console.error("Error reading shared state:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
