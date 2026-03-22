"use client";

import { useEffect, useState } from "react";
import { Sidebar } from "@/components/Sidebar";
import { StockChart } from "@/components/StockChart";
import { StockHeader } from "@/components/StockHeader";
import { StatsGrid } from "@/components/StatsGrid";
import { InsightDisplay } from "@/components/InsightDisplay";
import { AnalysisResponse } from "@/types";

export default function Home() {
  const [symbol, setSymbol] = useState("AAPL");
  const [data, setData] = useState<AnalysisResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData(symbol);
  }, [symbol]);

  const fetchData = async (sym: string) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch("http://localhost:8080/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ symbol: sym }),
      });
      if (!response.ok) throw new Error("Failed to fetch analysis");
      const result = await response.json();
      setData(result);
    } catch (err: any) {
      console.error(err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen w-screen bg-[#000] text-white overflow-hidden">
      {/* Watchlist Sidebar */}
      <Sidebar 
        activeSymbol={symbol} 
        onSelect={(s) => setSymbol(s)} 
        currentPrice={data?.symbol === symbol ? data.price : undefined}
      />

      {/* Main Analysis Terminal */}
      <main className="flex-1 flex flex-col p-10 overflow-y-auto">
        {loading && !data && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50">
            <div className="flex flex-col items-center gap-4">
              <div className="h-12 w-12 border-4 border-green-500 border-t-transparent animate-spin rounded-full"></div>
              <span className="text-gray-400 font-medium tracking-wider">Crunching RAG Analysis...</span>
            </div>
          </div>
        )}

        {data ? (
          <>
            <StockHeader data={data} />
            
            <div className="mt-8 flex flex-col gap-10">
              <div className="w-full">
                <StockChart history={data.historical} symbol={data.symbol} />
              </div>
              
              <StatsGrid data={data} />
              
              <hr className="border-gray-800" />
              
              <InsightDisplay data={data} />
            </div>
          </>
        ) : (
          !loading && <div className="flex-1 flex items-center justify-center text-gray-500">Search for a ticker to get started</div>
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
