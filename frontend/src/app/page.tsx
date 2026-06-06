"use client";

import { useEffect, useRef, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { StockChart } from "@/components/StockChart";
import { StockHeader } from "@/components/StockHeader";
import { StatsGrid } from "@/components/StatsGrid";
import { InsightDisplay } from "@/components/InsightDisplay";
import { AnalysisResponse, StockData } from "@/types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

const INITIAL_TICKS = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "BTC-USD", name: "Bitcoin USD" },
];

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [period, setPeriod] = useState("1mo");
  const [watchlist, setWatchlist] = useState<{ symbol: string; name: string }[]>([]);

  const [stockData, setStockData] = useState<StockData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);

  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const hasLoadedWatchlist = useRef(false);

  useEffect(() => {
    const saved = localStorage.getItem("my-stock-watchlist");
    if (saved) {
      setWatchlist(JSON.parse(saved));
    } else {
      setWatchlist(INITIAL_TICKS);
    }
    hasLoadedWatchlist.current = true;
  }, []);

  useEffect(() => {
    if (!hasLoadedWatchlist.current) return;
    localStorage.setItem("my-stock-watchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  useEffect(() => {
    fetchStockInfo(symbol, period);
    setAnalysisData(null);
  }, [symbol, period]);

  const fetchStockInfo = async (sym: string, per: string) => {
    setLoadingStock(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/stock/${sym}?period=${per}`);
      if (!response.ok) throw new Error("Failed to fetch stock data");
      const result = await response.json();
      setStockData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingStock(false);
    }
  };

  const runAnalysis = async () => {
    if (!symbol) return;
    setLoadingAnalysis(true);
    setError(null);
    try {
      const response = await fetch(`${API_URL}/analyze`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol, period }),
      });
      if (!response.ok) throw new Error("Analysis failed");
      const result = await response.json();
      setAnalysisData(result);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingAnalysis(false);
    }
  };

  const addToWatchlist = (sym: string) => {
    if (watchlist.some((item) => item.symbol === sym)) return;
    setWatchlist([...watchlist, { symbol: sym, name: "New Ticker" }]);
  };

  const removeFromWatchlist = (sym: string) => {
    setWatchlist(watchlist.filter((item) => item.symbol !== sym));
  };

  const priceChange =
    stockData && stockData.historical.length > 1
      ? ((stockData.price - stockData.historical[0].close) / stockData.historical[0].close) * 100
      : 0;

  return (
    <div className="flex h-screen w-screen bg-[#000] text-white overflow-hidden font-sans">
      {/* aria-live region — announces analysis state changes to screen readers */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        {loadingAnalysis
          ? "AI analysis is running. Please wait."
          : analysisData
          ? `Analysis complete for ${analysisData.symbol}. Signal: ${analysisData.signal}.`
          : ""}
      </div>

      <Sidebar
        activeSymbol={symbol}
        watchlist={watchlist}
        onSelect={(s) => setSymbol(s)}
        onAdd={addToWatchlist}
        onRemove={removeFromWatchlist}
        currentPrice={stockData?.symbol === symbol ? stockData.price : undefined}
      />

      <main className="flex-1 flex flex-col p-6 lg:p-10 overflow-y-auto" aria-label="Stock analysis">
        {loadingStock && !stockData && (
          <div className="flex-1 flex items-center justify-center" aria-label="Loading stock data">
            <div
              className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"
              aria-hidden="true"
            />
          </div>
        )}

        {stockData && (
          <>
            <StockHeader
              symbol={stockData.symbol}
              price={stockData.price}
              priceChange={priceChange}
              period={period}
              onAnalyze={runAnalysis}
              loading={loadingAnalysis}
              hasAnalysis={!!analysisData}
            />

            <div className="mt-8 flex flex-col gap-8 lg:gap-10">
              <StockChart
                history={stockData.historical}
                symbol={stockData.symbol}
                currentPeriod={period}
                onPeriodChange={(p) => setPeriod(p)}
              />

              <StatsGrid analysis={analysisData} volume={stockData.volume} />

              <hr className="border-gray-800" />

              <InsightDisplay analysis={analysisData} loading={loadingAnalysis} />
            </div>
          </>
        )}

        {error && (
          <div
            role="alert"
            className="mt-4 p-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg"
          >
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
