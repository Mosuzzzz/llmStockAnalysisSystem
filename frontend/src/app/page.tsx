"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { StockChart } from "@/components/StockChart";
import { StockHeader } from "@/components/StockHeader";
import { StatsGrid } from "@/components/StatsGrid";
import { InsightDisplay } from "@/components/InsightDisplay";
import { AnalysisResponse, StockData } from "@/types";

const INITIAL_TICKS = [
    { symbol: "AAPL", name: "Apple Inc." },
    { symbol: "NVDA", name: "NVIDIA Corp." },
    { symbol: "TSLA", name: "Tesla, Inc." },
    { symbol: "BTC-USD", name: "Bitcoin USD" },
];

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [period, setPeriod] = useState("1mo");
  const [watchlist, setWatchlist] = useState<{symbol: string, name: string}[]>([]);
  
  const [stockData, setStockData] = useState<StockData | null>(null);
  const [analysisData, setAnalysisData] = useState<AnalysisResponse | null>(null);
  
  const [loadingStock, setLoadingStock] = useState(false);
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load Watchlist from LocalStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("my-stock-watchlist");
    if (saved) {
        setWatchlist(JSON.parse(saved));
    } else {
        setWatchlist(INITIAL_TICKS);
    }
  }, []);

  // Save Watchlist whenever it changes
  useEffect(() => {
    if (watchlist.length > 0) {
        localStorage.setItem("my-stock-watchlist", JSON.stringify(watchlist));
    }
  }, [watchlist]);

  useEffect(() => {
    fetchStockInfo(symbol, period);
    setAnalysisData(null);
  }, [symbol, period]);

  const fetchStockInfo = async (sym: string, per: string) => {
    setLoadingStock(true);
    setError(null);
    try {
      const response = await fetch(`http://localhost:8080/stock/${sym}?period=${per}`);
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
      const response = await fetch("http://localhost:8080/analyze", {
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
    if (watchlist.some(item => item.symbol === sym)) return;
    setWatchlist([...watchlist, { symbol: sym, name: "New Ticker" }]);
  };

  const removeFromWatchlist = (sym: string) => {
    setWatchlist(watchlist.filter(item => item.symbol !== sym));
  };

  return (
    <div className="flex h-screen w-screen bg-[#000] text-white overflow-hidden font-sans">
      <Sidebar 
        activeSymbol={symbol} 
        watchlist={watchlist}
        onSelect={(s) => setSymbol(s)} 
        onAdd={addToWatchlist}
        onRemove={removeFromWatchlist}
        currentPrice={stockData?.symbol === symbol ? stockData.price : undefined}
      />

      <main className="flex-1 flex flex-col p-10 overflow-y-auto">
        {loadingStock && !stockData && (
          <div className="flex-1 flex items-center justify-center">
            <div className="animate-spin h-8 w-8 border-4 border-green-500 border-t-transparent rounded-full"></div>
          </div>
        )}

        {stockData && (
          <>
            <StockHeader 
              symbol={stockData.symbol} 
              price={stockData.price} 
              onAnalyze={runAnalysis} 
              loading={loadingAnalysis}
              hasAnalysis={!!analysisData}
            />
            
            <div className="mt-8 flex flex-col gap-10">
              <div className="w-full">
                <StockChart 
                    history={stockData.historical} 
                    symbol={stockData.symbol} 
                    currentPeriod={period}
                    onPeriodChange={(p) => setPeriod(p)}
                />
              </div>
              
              <StatsGrid analysis={analysisData} volume={stockData.volume} />
              
              <hr className="border-gray-800" />
              
              <InsightDisplay analysis={analysisData} loading={loadingAnalysis} />
            </div>
          </>
        )}

        {error && (
          <div className="mt-4 p-4 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg">
            {error}
          </div>
        )}
      </main>
    </div>
  );
}
