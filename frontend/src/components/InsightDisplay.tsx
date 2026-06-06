"use client";

import { MessageSquareText, Newspaper, BrainCircuit, Loader2 } from "lucide-react";
import { AnalysisResponse } from "@/types";

function sentimentColor(sentiment: string) {
  const s = sentiment.toLowerCase();
  if (s === "positive") return "text-green-500 bg-green-500/10 border-green-500/20";
  if (s === "negative") return "text-red-500 bg-red-500/10 border-red-500/20";
  return "text-yellow-500 bg-yellow-500/10 border-yellow-500/20";
}

export function InsightDisplay({ analysis, loading }: { analysis: AnalysisResponse | null, loading: boolean }) {
  if (!analysis) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 opacity-60">
        <div className="space-y-6">
          <div className="p-12 border-2 border-dashed border-gray-900 rounded-3xl flex flex-col items-center justify-center gap-6" role="status" aria-live="polite">
            {loading ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-10 w-10 text-green-500 animate-spin" aria-hidden="true" />
                <span className="text-gray-400 font-bold text-sm">AI is thinking...</span>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <BrainCircuit className="h-8 w-8 text-gray-500 mx-auto" aria-hidden="true" />
                <h3 className="text-2xl font-black">AI Analysis Required</h3>
                <p className="text-gray-500 font-medium">Click "Run AI Analysis" to begin the DeepSeek reasoning process.</p>
              </div>
            )}
          </div>
        </div>
        <div className="bg-[#080808] border border-gray-950 rounded-3xl p-10 flex items-center justify-center" aria-hidden="true">
          <span className="text-gray-800 font-black text-6xl tracking-tighter uppercase opacity-20">No Context</span>
        </div>
      </div>
    );
  }

  const badgeClass = sentimentColor(analysis.sentiment);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
      <div className="space-y-5">
        <h2 className="text-4xl font-extrabold tracking-tight leading-[115%]">AI Strategy & Reasoning Insights</h2>
        <div className="text-lg leading-relaxed text-gray-400 font-medium bg-green-500/5 rounded-xl px-6 py-4">
          {analysis.explanation.split('\n').map((line, i) => (
            <p key={i} className="mb-4 last:mb-0">{line}</p>
          ))}
        </div>
        <div className="flex items-center gap-3 text-xs text-gray-500 font-medium pt-1">
          <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">Analysis complete</span>
          <span>Just now · Powered by Ollama</span>
        </div>
      </div>

      <div className="bg-[#0c0c0c] border border-gray-900 rounded-3xl p-8 space-y-6 h-fit shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <Newspaper className="h-4 w-4" aria-hidden="true" />
            <span className="text-sm font-semibold">News Sentiment</span>
          </div>
          <div className={`px-3 py-1 rounded-full border text-[10px] font-black uppercase tracking-wider ${badgeClass}`}>
            {analysis.sentiment.toUpperCase()}
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-xl font-black tracking-tight leading-snug">News Mood for {analysis.symbol}</h3>
          <p className="text-gray-500 font-medium leading-relaxed text-sm">
            The FinBERT model analyzed the top 5 recent headlines and classified overall sentiment
            as <strong className="text-gray-300">{analysis.sentiment.toLowerCase()}</strong>.
            Sentiment contributes 40% to the final signal.
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 tracking-wide">Source Count</span>
            <span className="text-lg font-bold">5 Headlines</span>
          </div>
          <div className="p-4 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1">
            <span className="text-[10px] font-bold text-gray-400 tracking-wide">Model</span>
            <span className="text-lg font-bold text-blue-400">FinBERT v3</span>
          </div>
        </div>

        <div className="flex items-center gap-4 border-t border-gray-900 pt-5">
          <div className="h-9 w-9 bg-purple-500/20 rounded-xl border border-purple-500/30 flex items-center justify-center shrink-0">
            <MessageSquareText className="h-4 w-4 text-purple-400" aria-hidden="true" />
          </div>
          <p className="text-xs text-gray-400 font-medium leading-snug">
            Sentiment analysis contributes 40% to the final AI signal.
          </p>
        </div>
      </div>
    </div>
  );
}
