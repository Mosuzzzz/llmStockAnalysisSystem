"use client";

import { Search, TrendingUp, Info, X } from "lucide-react";
import { useState } from "react";

interface WatchlistItem {
  symbol: string;
  name: string;
}

interface SidebarProps {
  activeSymbol: string;
  watchlist: WatchlistItem[];
  onSelect: (symbol: string) => void;
  onAdd: (symbol: string) => void;
  onRemove: (symbol: string) => void;
  currentPrice?: number;
}

export function Sidebar({ activeSymbol, watchlist, onSelect, onAdd, onRemove, currentPrice }: SidebarProps) {
  const [search, setSearch] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const sym = search.trim().toUpperCase();
    if (sym) {
      onSelect(sym);
      onAdd(sym);
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
            placeholder="Search & Add Ticker"
            className="w-full bg-[#1e1e1e] border-none rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-500 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
          />
        </form>
      </div>

      <div className="px-6 pb-4 flex-1 overflow-y-auto space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold tracking-tight">Watchlist</h2>
          <button className="text-xs font-semibold text-gray-500 hover:text-white uppercase tracking-wider">Sync</button>
        </div>

        <div className="space-y-1 text-sm">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              className={`group w-full flex items-center justify-between p-4 rounded-xl transition-all cursor-pointer ${
                activeSymbol === item.symbol 
                  ? "bg-[#262626] border border-gray-800" 
                  : "hover:bg-white/5 border border-transparent"
              }`}
              onClick={() => onSelect(item.symbol)}
            >
              <div className="flex flex-col items-start gap-1">
                <span className="font-bold text-base">{item.symbol}</span>
                <span className="text-[10px] text-gray-500 font-medium tracking-tight truncate max-w-[80px]">
                  {item.name}
                </span>
              </div>
              
              <div className="text-right flex items-center gap-3">
                <div className="flex flex-col items-end gap-1">
                  <span className="font-bold">
                    {activeSymbol === item.symbol && currentPrice ? `$${currentPrice.toFixed(2)}` : "--"}
                  </span>
                  <div className="px-1.5 py-0.5 bg-green-500/10 rounded flex items-center gap-1">
                    <TrendingUp className="h-2 w-2 text-green-500" />
                    <span className="text-[10px] text-green-500 font-bold tracking-tight">+1.2%</span>
                  </div>
                </div>
                
                {/* Delete Button (Shown on Hover) */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemove(item.symbol);
                  }}
                  className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/20 rounded-lg text-gray-600 hover:text-red-500 transition-all"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#333] flex items-center gap-2 text-gray-500 text-xs mt-auto">
        <div className="p-1.5 bg-gray-800/50 rounded-lg">
          <Info className="h-3 w-3" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-[10px] tracking-widest uppercase opacity-40">Local Storage</span>
          <span className="text-gray-600 font-medium">Watchlist Persisted Locally</span>
        </div>
      </div>
    </aside>
  );
}
