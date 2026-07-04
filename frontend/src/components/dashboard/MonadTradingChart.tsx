"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, ColorType, IChartApi, CandlestickSeries, ISeriesApi } from "lightweight-charts";

const FEEDS: Record<string, string> = {
  "MON/USD": "e786153cc54abd4b0e53b4c246d54d9f8eb3f3b5a34d4fc5a2e9a423b0ba5d6b",
  "ETH/USD": "ff61491a931112ddf1bd8147cd1b641375f79f5825126d665480874634fd0ace"
};

export default function MonadTradingChart() {
  const chartContainerRef = useRef<HTMLDivElement>(null);
  const chartRef = useRef<IChartApi | null>(null);
  const candleSeriesRef = useRef<ISeriesApi<"Candlestick"> | null>(null);
  const lastCandleRef = useRef<any>(null);
  
  const [symbol, setSymbol] = useState<"MON/USD" | "ETH/USD">("MON/USD");
  const [timeRange, setTimeRange] = useState<"LIVE" | "1M" | "2M">("LIVE");
  const [currentPrice, setCurrentPrice] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize Chart
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

  // Fetch History on Symbol or Range Change
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
        
        const res = await fetch(`https://benchmarks.pyth.network/v1/shims/tradingview/history?symbol=Crypto.${symbol}&resolution=${resolution}&from=${from}&to=${to}`);
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
  }, [symbol, timeRange]);

  // Live Polling
  useEffect(() => {
    let intervalId: NodeJS.Timeout;
    
    const fetchPrice = async () => {
      try {
        const res = await fetch(`https://hermes-beta.pyth.network/v2/updates/price/latest?ids[]=${FEEDS[symbol]}`);
        if (!res.ok) return;
        const data = await res.json();
        const feed = data.parsed?.[0];
        if (feed && feed.price) {
          const rawPrice = Number(feed.price.price);
          const expo = feed.price.expo;
          const scaledPrice = rawPrice * Math.pow(10, expo);
          const publishTime = feed.price.publish_time;

          setCurrentPrice(scaledPrice);

          if (candleSeriesRef.current && !isLoading) {
            const bucketSize = timeRange === "LIVE" ? 60 : 86400;
            const bucket = Math.floor(publishTime / bucketSize) * bucketSize;
            
            let candle = lastCandleRef.current;
            
            if (!candle || candle.time < bucket) {
              candle = { time: bucket, open: scaledPrice, high: scaledPrice, low: scaledPrice, close: scaledPrice };
            } else if (candle.time === bucket) {
              candle.high = Math.max(candle.high, scaledPrice);
              candle.low = Math.min(candle.low, scaledPrice);
              candle.close = scaledPrice;
            }
            
            lastCandleRef.current = candle;
            
            try {
              candleSeriesRef.current.update(candle);
            } catch (e) {
              // Ignore lightweight-charts errors for duplicate/older times
            }
          }
        }
      } catch (err) {
        console.error("Failed to fetch live Pyth Price", err);
      }
    };

    fetchPrice(); // initial fetch
    intervalId = setInterval(fetchPrice, 5000); // poll every 5s

    return () => clearInterval(intervalId);
  }, [symbol, timeRange, isLoading]);

  return (
    <div className="w-full h-full min-h-[400px] flex flex-col pt-4">
      <div className="px-6 pb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center z-10 gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <select 
              value={symbol}
              onChange={(e) => setSymbol(e.target.value as "MON/USD" | "ETH/USD")}
              className="bg-transparent text-xl font-semibold outline-none cursor-pointer hover:text-[#836EF9] transition-colors"
            >
              <option value="MON/USD">MON/USD</option>
              <option value="ETH/USD">ETH/USD</option>
            </select>
            <span className="text-xs bg-[#E5E7EB] text-[#111111] px-2 py-0.5 rounded-md font-medium">LIVE</span>
          </div>
          <p className="text-sm text-[#6B7280]">
            Real-time Pyth Oracle Price: <span className="font-mono text-[#111111]">${currentPrice ? currentPrice.toFixed(4) : "---"}</span>
          </p>
        </div>
        
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
