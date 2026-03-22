"use client";

import { Search, TrendingUp, Info } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeSymbol: string;
  onSelect: (symbol: string) => void;
  currentPrice?: number;
}

const INITIAL_WATCHLIST = [
  { symbol: "AAPL", name: "Apple Inc." },
  { symbol: "NVDA", name: "NVIDIA Corp." },
  { symbol: "TSLA", name: "Tesla, Inc." },
  { symbol: "BTC-USD", name: "Bitcoin USD" },
  { symbol: "MSFT", name: "Microsoft Corp." },
  { symbol: "META", name: "Meta Platforms" },
];

export function Sidebar({ activeSymbol, onSelect, currentPrice }: SidebarProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search.trim()) {
      onSelect(search.trim().toUpperCase());
      setSearch("");
    }
  };

  return (
    <aside className="w-80 bg-[#141414] border-r border-[#333] flex flex-col h-full shrink-0">
      <div className="p-6">
        <form onSubmit={handleSearch} className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search Stocks"
            className="w-full bg-[#1e1e1e] border-none rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
          />
        </form>
      </div>

      <div className="px-6 pb-4 flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Watchlist</h2>
          <button className="text-xs font-semibold text-gray-500 hover:text-white uppercase tracking-wider">Edit</button>
        </div>

        <div className="space-y-1 text-sm">
          {INITIAL_WATCHLIST.map((item) => (
            <button
              key={item.symbol}
              onClick={() => onSelect(item.symbol)}
              className={`w-full flex items-center justify-between p-4 rounded-xl transition-all ${
                activeSymbol === item.symbol 
                  ? "bg-[#262626] border border-gray-800" 
                  : "hover:bg-white/5 border border-transparent"
              }`}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-bold text-base">{item.symbol}</span>
                <span className="text-[10px] text-gray-500 font-medium tracking-tight truncate max-w-[100px]">
                  {item.name}
                </span>
              </div>
              
              <div className="text-right flex flex-col items-end gap-1">
                <span className="font-bold">
                  {activeSymbol === item.symbol && currentPrice ? `$${currentPrice.toFixed(2)}` : "--"}
                </span>
                <div className="px-1.5 py-0.5 bg-green-500/10 rounded flex items-center gap-1">
                  <TrendingUp className="h-2 w-2 text-green-500" />
                  <span className="text-[10px] text-green-500 font-bold tracking-tight">+1.2%</span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#333] flex items-center gap-2 text-gray-500 text-xs">
        <div className="p-1.5 bg-gray-800/50 rounded-lg">
          <Info className="h-3 w-3" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[10px] tracking-widest uppercase opacity-40">Market Service</span>
          <span className="text-gray-600 font-medium">Yahoo Finance Live Feed</span>
        </div>
      </div>
    </aside>
  );
}
