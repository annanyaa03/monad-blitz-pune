"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, CandlestickSeries, ISeriesApi } from "lightweight-charts";
import { SharedState } from "@/hooks/useDashboardState";

export default function TradingChart({ state }: { state?: SharedState }) {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lastCandleRef = useRef<any>(null);
  const [currentPrice, setCurrentPrice] = useState<number>(0);

  useEffect(() => {
    if (!chartContainerRef.current) return;

    const handleResize = () => {
      if (chartRef.current && chartContainerRef.current) {
        chartRef.current.applyOptions({ width: chartContainerRef.current.clientWidth });
      }
    };

    const chart = createChart(chartContainerRef.current, {
      layout: {
        background: { type: ColorType.Solid, color: "transparent" },
        textColor: "#6B7280",
        fontFamily: "Inter, sans-serif",
      },
      grid: {
        vertLines: { color: "#F3F4F6", style: 1 },
        horzLines: { color: "#F3F4F6", style: 1 },
      },
      rightPriceScale: {
        borderVisible: false,
      },
      timeScale: {
        borderVisible: false,
        timeVisible: true,
        secondsVisible: false,
      },
      crosshair: {
        mode: 1,
        vertLine: {
          color: "#836EF9",
          width: 1,
          style: 3,
          labelBackgroundColor: "#836EF9",
        },
        horzLine: {
          color: "#836EF9",
          width: 1,
          style: 3,
          labelBackgroundColor: "#836EF9",
        },
      },
    });

    chartRef.current = chart;

    const candlestickSeries = chart.addSeries(CandlestickSeries, {
      upColor: "#16A34A",
      downColor: "#DC2626",
      borderVisible: false,
      wickUpColor: "#16A34A",
      wickDownColor: "#DC2626",
    });
    
    candleSeriesRef.current = candlestickSeries;

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      chart.remove();
    };
  }, []);

  const [timeRange, setTimeRange] = useState<"LIVE" | "1M" | "2M">("LIVE");
  const [isLoading, setIsLoading] = useState(false);
  const [localSymbol, setLocalSymbol] = useState<string>("");

  useEffect(() => {
    if (state?.market?.symbol && !localSymbol) {
      setLocalSymbol(state.market.symbol);
    }
  }, [state?.market?.symbol, localSymbol]);

  const activeSymbol = localSymbol || state?.market?.symbol || "MONAD/USDC";

  // Fetch History on Range Change
  useEffect(() => {
    const loadHistory = async () => {
      setIsLoading(true);
      try {
        const to = Math.floor(Date.now() / 1000);
        let from = to - 86400; // 1 day for LIVE
        let resolution = "1"; // 1 min candles
        
        if (timeRange === "1M") {
          from = to - 86400 * 30;
          resolution = "D";
        } else if (timeRange === "2M") {
          from = to - 86400 * 60;
          resolution = "D";
        }

        let pythSymbol = "Crypto.MON/USD";
        if (activeSymbol === "ETH/USDC") {
          pythSymbol = "Crypto.ETH/USD";
        }

        const res = await fetch(`https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=${pythSymbol}&resolution=${resolution}&from=${from}&to=${to}`);
        const data = await res.json();
        
        if (data.s === "ok" && data.t) {
          const formattedData = data.t.map((time: number, i: number) => ({
            time,
            open: data.o[i],
            high: data.h[i],
            low: data.l[i],
            close: data.c[i]
          }));
          
          if (candleSeriesRef.current) {
            candleSeriesRef.current.setData(formattedData);
            if (formattedData.length > 0) {
              lastCandleRef.current = formattedData[formattedData.length - 1];
              setCurrentPrice(formattedData[formattedData.length - 1].close);
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch historical data", err);
      }
      setIsLoading(false);
    };

    loadHistory();
  }, [timeRange, activeSymbol]);

  // Update chart when state.market.price changes for live append
  useEffect(() => {
    // Only append live price if we are viewing the agent's active symbol
    if (state?.market?.price && candleSeriesRef.current && !isLoading && activeSymbol === state?.market?.symbol) {
      setCurrentPrice(state.market.price);
      
      const time = state.market.publish_time || Math.floor(Date.now() / 1000);
      const close = state.market.price;
      const bucketSize = timeRange === "LIVE" ? 60 : 86400;
      const bucket = Math.floor(time / bucketSize) * bucketSize;
      
      let candle = lastCandleRef.current;
      if (!candle || candle.time < bucket) {
        candle = { time: bucket, open: close, high: close, low: close, close: close };
      } else if (candle.time === bucket) {
        candle.high = Math.max(candle.high, close);
        candle.low = Math.min(candle.low, close);
        candle.close = close;
      }
      
      lastCandleRef.current = candle;

      try {
        candleSeriesRef.current.update(candle);
      } catch {
        // lightweight-charts throws if time is older than the last point, ignore
      }
    }
  }, [state?.market?.price, isLoading, timeRange]);

  const pnlQuote = state?.portfolio?.pnl_quote || 0;
  const isPositive = pnlQuote >= 0;

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col pt-4">
      <div className="px-6 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center z-10 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <select 
              value={activeSymbol}
              onChange={(e) => setLocalSymbol(e.target.value)}
              className="bg-transparent text-xl font-semibold outline-none cursor-pointer hover:text-[#836EF9] transition-colors"
            >
              <option value="MONAD/USDC">MONAD/USDC</option>
              <option value="ETH/USDC">ETH/USDC</option>
            </select>
            <span className="text-xs bg-[#E5E7EB] text-[#111111] px-2 py-0.5 rounded-md font-medium">LIVE</span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Real-time Pyth Oracle Price: <span className="font-mono text-[#111111]">${currentPrice ? currentPrice.toFixed(4) : "---"}</span>
          </p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="flex items-center bg-[#F3F4F6] p-1 rounded-lg">
            {(["LIVE", "1M", "2M"] as const).map((range) => (
              <button
                key={range}
                onClick={() => setTimeRange(range)}
                className={`px-3 py-1.5 text-xs font-medium rounded-md transition-all ${
                  timeRange === range 
                    ? "bg-white text-[#836EF9] shadow-sm" 
                    : "text-[#6B7280] hover:text-[#111111]"
                }`}
              >
                {range}
              </button>
            ))}
          </div>

          <div className="text-right ml-4">
            <p className="text-xs text-[#6B7280]">Agent PNL</p>
            <p className={`font-medium ${isPositive ? 'text-[#16A34A]' : 'text-red-500'}`}>
              {isPositive ? '+' : ''}{pnlQuote.toFixed(2)}
            </p>
          </div>
        </div>
      </div>
      <div className="flex-1 w-full relative">
        {isLoading && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-white/50 backdrop-blur-sm">
            <div className="animate-spin w-8 h-8 border-4 border-[#E5E7EB] border-t-[#836EF9] rounded-full" />
          </div>
        )}
        <div ref={chartContainerRef} className="absolute inset-0" />
      </div>
    </div>
  );
}
