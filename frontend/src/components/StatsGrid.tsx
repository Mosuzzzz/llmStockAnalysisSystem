"use client";

import { Activity, BarChart3, AlertTriangle, ShieldCheck } from "lucide-react";
import { AnalysisResponse } from "@/types";

interface StatsGridProps {
    analysis: AnalysisResponse | null;
    volume: number;
}

export function StatsGrid({ analysis, volume }: StatsGridProps) {
  const stats = [
    { label: "RSI (14)", value: analysis ? analysis.rsi.toFixed(2) : "--", icon: Activity, color: "text-blue-500" },
    { label: "Volume", value: (volume / 1000000).toFixed(1) + "M", icon: BarChart3, color: "text-purple-500" },
    { label: "Signal", value: analysis ? analysis.signal.toUpperCase() : "WAIT", icon: AlertTriangle, color: analysis ? (analysis.signal.includes("BUY") ? "text-green-500" : analysis.signal.includes("SELL") ? "text-red-500" : "text-yellow-500") : "text-gray-700" },
    { label: "Confidence", value: analysis ? analysis.confidence : "--", icon: ShieldCheck, color: "text-gray-400" },
  ];

  return (
    <div className="grid grid-cols-4 gap-8">
      {stats.map((stat, idx) => (
        <div 
          key={idx} 
          className="bg-white/5 border border-white/5 hover:border-white/10 transition-all rounded-3xl p-6 flex items-center justify-between group overflow-hidden relative"
        >
          <div className="relative z-10 flex flex-col gap-1.5">
            <span className="text-xs font-black uppercase tracking-widest text-gray-400">{stat.label}</span>
            <span className={`text-2xl font-black tracking-tighter ${stat.color}`}>
              {stat.value}
            </span>
          </div>
          <div className={`relative z-10 p-4 bg-black/40 rounded-2xl border border-white/5 group-hover:scale-110 transition-transform ${stat.color}`}>
            <stat.icon className="h-6 w-6 stroke-[2.5px]" />
          </div>
          
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-3xl -translate-y-16 translate-x-16 opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      ))}
    </div>
  );
}
