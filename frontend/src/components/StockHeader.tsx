"use client";

import { TrendingUp, Share2, MoreHorizontal, BrainCircuit, Loader2 } from "lucide-react";

interface StockHeaderProps {
  symbol: string;
  price: number;
  onAnalyze: () => void;
  loading: boolean;
  hasAnalysis: boolean;
}

export function StockHeader({ symbol, price, onAnalyze, loading, hasAnalysis }: StockHeaderProps) {
  return (
    <header className="flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-7xl font-black tracking-tighter leading-none">{symbol}</h1>
        <div className="flex items-center gap-4 text-lg font-medium text-gray-400">
          <span className="uppercase tracking-widest text-sm font-black border border-gray-700 px-2.5 py-1 rounded bg-[#1e1e1e]">NASDAQ</span>
          <span className="font-semibold tracking-tight">Market Analysis Report & AI Reasoning Insight</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-4 mb-4">
          {/* Action Buttons */}
          <button 
                onClick={onAnalyze} 
                disabled={loading}
                className={`flex items-center gap-2 px-6 py-2.5 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
                    loading 
                    ? "bg-white/10 text-gray-500 cursor-not-allowed border border-white/5" 
                    : hasAnalysis 
                        ? "bg-green-600 text-white hover:bg-green-500 shadow-lg shadow-green-500/20 border border-green-400/30"
                        : "bg-white text-black hover:scale-105 shadow-xl shadow-white/5"
                }`}
            >
                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <BrainCircuit className="h-4 w-4" />}
                {loading ? "Reasoning..." : hasAnalysis ? "Re-Analyze Stock" : "Execute AI Analysis"}
          </button>
          
          <button className="p-2.5 bg-gray-600/10 hover:bg-gray-600/20 rounded-xl transition-all border border-gray-800">
            <Share2 className="h-5 w-5 text-gray-300" />
          </button>
          <button className="p-2.5 bg-gray-600/10 hover:bg-gray-600/20 rounded-xl transition-all border border-gray-800">
            <MoreHorizontal className="h-5 w-5 text-gray-300" />
          </button>
        </div>
        
        <div className="text-right">
          <div className="flex items-end gap-3">
            <span className="text-6xl font-black tracking-tighter leading-none">${price.toFixed(2)}</span>
            <div className="flex items-center gap-1.5 text-green-500 bg-green-500/10 px-3 py-1.5 rounded-xl border border-green-500/20 mb-1">
              <TrendingUp className="h-4 w-4 stroke-[3px]" />
              <span className="text-lg font-black tracking-tighter">+1.48%</span>
            </div>
          </div>
          <span className="text-sm font-bold text-gray-500 uppercase tracking-widest mt-1 block">Past Month Performance</span>
        </div>
      </div>
    </header>
  );
}
