"use client";

import { Search, Info, X } from "lucide-react";
import { useState, type SyntheticEvent } from "react";

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

  const handleSearch = (e: SyntheticEvent<HTMLFormElement>) => {
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
        <form onSubmit={handleSearch} role="search" className="relative group">
          <label htmlFor="ticker-search" className="sr-only">Search and add ticker symbol</label>
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500 group-focus-within:text-white transition-colors" aria-hidden="true" />
          <input
            id="ticker-search"
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search & Add Ticker"
            className="w-full bg-[#1e1e1e] border-none rounded-xl py-3.5 pl-11 pr-4 text-white placeholder-gray-400 focus:ring-1 focus:ring-green-500/50 outline-none transition-all"
          />
        </form>
      </div>

      <div className="px-6 pb-4 flex-1 overflow-y-auto space-y-4">
        <h2 className="text-xl font-bold tracking-tight">Watchlist</h2>

        <div className="space-y-1 text-sm" role="list" aria-label="Watchlist">
          {watchlist.map((item) => (
            <div
              key={item.symbol}
              role="listitem"
              className={`group flex items-center justify-between rounded-xl transition-all ${
                activeSymbol === item.symbol
                  ? "bg-[#262626] border border-gray-800"
                  : "border border-transparent"
              }`}
            >
              <button
                type="button"
                onClick={() => onSelect(item.symbol)}
                aria-pressed={activeSymbol === item.symbol}
                className="flex-1 flex items-center justify-between p-4 rounded-xl hover:bg-white/5 transition-all text-left"
              >
                <div className="flex flex-col items-start gap-1">
                  <span className="font-bold text-base">{item.symbol}</span>
                  <span className="text-[10px] text-gray-500 font-medium tracking-tight truncate max-w-20">
                    {item.name}
                  </span>
                </div>

                <div className="text-right flex flex-col items-end gap-1 mr-2">
                  <span className="font-bold">
                    {activeSymbol === item.symbol && currentPrice ? `$${currentPrice.toFixed(2)}` : "--"}
                  </span>
                </div>
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  onRemove(item.symbol);
                }}
                aria-label={`Remove ${item.symbol} from watchlist`}
                className="opacity-0 group-hover:opacity-100 mr-3 p-2 min-w-11 min-h-11 flex items-center justify-center hover:bg-red-500/20 rounded-lg text-gray-500 hover:text-red-500 transition-all"
              >
                <X className="h-4 w-4" aria-hidden="true" />
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="p-6 border-t border-[#333] flex items-center gap-2 text-gray-500 text-xs mt-auto">
        <div className="p-1.5 bg-gray-800/50 rounded-lg" aria-hidden="true">
          <Info className="h-3 w-3" />
        </div>
        <span className="text-gray-400 font-medium">Watchlist saved locally</span>
      </div>
    </aside>
  );
}
