"use client";

import { TrendingUp, Share2, MoreHorizontal } from "lucide-react";
import { AnalysisResponse } from "@/types";

export function StockHeader({ data }: { data: AnalysisResponse }) {
  return (
    <header className="flex items-start justify-between">
      <div className="space-y-2">
        <h1 className="text-7xl font-black tracking-tighter leading-none">{data.symbol}</h1>
        <div className="flex items-center gap-4 text-lg font-medium text-gray-400">
          <span className="uppercase tracking-widest text-sm font-black border border-gray-700 px-2.5 py-1 rounded bg-[#1e1e1e]">NASDAQ</span>
          <span className="font-semibold tracking-tight">Market Analysis Report & AI Reasoning Insight</span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2">
        <div className="flex items-center gap-4 mb-4">
          <button className="p-2.5 bg-gray-600/10 hover:bg-gray-600/20 rounded-xl transition-all border border-gray-800">
            <Share2 className="h-5 w-5 text-gray-300" />
          </button>
          <button className="p-2.5 bg-gray-600/10 hover:bg-gray-600/20 rounded-xl transition-all border border-gray-800">
            <MoreHorizontal className="h-5 w-5 text-gray-300" />
          </button>
        </div>
        
        <div className="text-right">
          <div className="flex items-end gap-3">
            <span className="text-6xl font-black tracking-tighter leading-none">${data.price.toFixed(2)}</span>
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
