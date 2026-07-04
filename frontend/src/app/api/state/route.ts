import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    // The Next.js app is at /frontend, the shared_state is at /.runtime/shared_state.json
    const statePath = path.resolve(process.cwd(), "../.runtime/shared_state.json");
    
    if (!fs.existsSync(statePath)) {
      return NextResponse.json({ error: "State file not found" }, { status: 404 });
    }

    const data = fs.readFileSync(statePath, "utf-8");
    const json = JSON.parse(data);

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
