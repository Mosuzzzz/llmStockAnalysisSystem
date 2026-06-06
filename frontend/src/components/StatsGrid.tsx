"use client";

import { Activity, BarChart3, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { AnalysisResponse } from "@/types";

interface StatsGridProps {
    analysis: AnalysisResponse | null;
    volume: number;
}

function getSignalConfig(signal: string | null) {
  if (!signal) return { label: "WAIT", icon: Minus, color: "text-gray-500", bg: "" };
  if (signal.includes("BUY"))  return { label: signal.toUpperCase(), icon: TrendingUp,   color: "text-green-500", bg: "bg-green-500/5 border-green-500/10" };
  if (signal.includes("SELL")) return { label: signal.toUpperCase(), icon: TrendingDown,  color: "text-red-500",   bg: "bg-red-500/5 border-red-500/10" };
  return                                { label: signal.toUpperCase(), icon: Minus,         color: "text-yellow-500", bg: "bg-yellow-500/5 border-yellow-500/10" };
}

export function StatsGrid({ analysis, volume }: StatsGridProps) {
  const signal = getSignalConfig(analysis?.signal ?? null);
  const SignalIcon = signal.icon;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 sm:gap-6" role="region" aria-label="Market statistics">

      {/* Signal card — dominant, spans full width on mobile */}
      <div
        className={`sm:col-span-2 border rounded-3xl p-6 flex items-center justify-between group overflow-hidden relative transition-colors ${
          signal.bg || "bg-white/5 border-white/5 hover:border-white/10"
        } ${!signal.bg ? "" : "border"}`}
        role="status"
        aria-label={`Trading signal: ${signal.label}`}
      >
        <div className="relative z-10 flex flex-col gap-2">
          <span className="text-xs font-bold text-gray-400 tracking-wide">Signal</span>
          <span className={`text-4xl font-black tracking-tighter ${signal.color}`}>
            {signal.label}
          </span>
          {analysis && (
            <span className="text-xs text-gray-500 font-medium">
              Confidence: <span className="text-gray-300 font-bold">{analysis.confidence}</span>
            </span>
          )}
        </div>
        <div className={`relative z-10 p-5 bg-black/30 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform ${signal.color}`}>
          <SignalIcon className="h-8 w-8 stroke-2" aria-hidden="true" />
        </div>
      </div>

      {/* RSI card */}
      <div className="bg-white/5 border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-6 flex items-center justify-between group overflow-hidden relative">
        <div className="relative z-10 flex flex-col gap-1.5">
          <span className="text-xs font-bold text-gray-400 tracking-wide">RSI (14)</span>
          <span className="text-2xl font-black tracking-tighter text-blue-500">
            {analysis ? analysis.rsi.toFixed(1) : "--"}
          </span>
        </div>
        <div className="relative z-10 p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform text-blue-500">
          <Activity className="h-6 w-6 stroke-[2.5px]" aria-hidden="true" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      </div>

      {/* Volume card */}
      <div className="bg-white/5 border border-white/5 hover:border-white/10 transition-colors rounded-3xl p-6 flex items-center justify-between group overflow-hidden relative">
        <div className="relative z-10 flex flex-col gap-1.5">
          <span className="text-xs font-bold text-gray-400 tracking-wide">Volume</span>
          <span className="text-2xl font-black tracking-tighter text-purple-400">
            {(volume / 1_000_000).toFixed(1)}M
          </span>
        </div>
        <div className="relative z-10 p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform text-purple-400">
          <BarChart3 className="h-6 w-6 stroke-[2.5px]" aria-hidden="true" />
        </div>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity" aria-hidden="true" />
      </div>
    </div>
  );
}
