import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const backendUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_API_URL;
    if (backendUrl) {
      const response = await fetch(`${backendUrl.replace(/\/$/, "")}/api/state`, { cache: "no-store" });
      if (!response.ok) {
        return NextResponse.json({ error: "Backend state unavailable" }, { status: response.status });
      }
      return NextResponse.json(await response.json());
    }

    // The Next.js app is at /frontend, the shared_state is at /.runtime/shared_state.json
    const statePath = path.resolve(process.cwd(), "../.runtime/shared_state.json");

    if (!fs.existsSync(statePath)) {
      return NextResponse.json({ error: "State file not found" }, { status: 404 });
    }

    const data = fs.readFileSync(statePath, "utf-8");
    const json = JSON.parse(data);

    // --- Computed Fields (state-backed only; never fabricate unavailable values) ---
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

    // Average Confidence (from validated LLM output if available)
    let avgConfidence: number | null = null;
    try {
      if (json.decision?.raw_model_output) {
        const parsed = JSON.parse(json.decision.raw_model_output);
        if (typeof parsed.confidence === "number") {
          avgConfidence = parsed.confidence;
        }
      }
    } catch {
      // ignore
    }

    // Add computed fields
    json.computed = {
      ema5: sma5,
      ema20: sma20,
      marketTrend,
      avgConfidence,
      winRate: null,
      riskLevel: json.kill_switch?.status || null
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
