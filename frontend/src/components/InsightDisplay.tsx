"use client";

import { MessageSquareText, Newspaper, BrainCircuit, Play, Loader2 } from "lucide-react";
import { AnalysisResponse } from "@/types";

export function InsightDisplay({ analysis, loading }: { analysis: AnalysisResponse | null, loading: boolean }) {
  if (!analysis) {
    return (
        <div className="grid grid-cols-2 gap-10 opacity-60">
            <div className="space-y-6">
                <div className="flex items-center gap-3 text-gray-700">
                <BrainCircuit className="h-5 w-5" />
                <span className="text-[12px] font-black uppercase tracking-[0.2em] border-b border-gray-900 pb-1 pr-6">RAG Pipeline Inactive</span>
                </div>
                <div className="p-12 border-2 border-dashed border-gray-900 rounded-3xl flex flex-col items-center justify-center gap-6">
                    {loading ? (
                        <div className="flex flex-col items-center gap-2">
                            <Loader2 className="h-10 w-10 text-green-500 animate-spin" />
                            <span className="text-gray-400 font-bold uppercase tracking-widest text-xs">AI is thinking...</span>
                        </div>
                    ) : (
                        <div className="text-center space-y-2">
                             <h3 className="text-2xl font-black">AI Analysis Required</h3>
                             <p className="text-gray-500 font-medium">Click "Execute AI Analysis" to begin DeepSeek reasoning process.</p>
                        </div>
                    )}
                </div>
            </div>
            <div className="bg-[#080808] border border-gray-950 rounded-3xl p-10 flex items-center justify-center">
                 <span className="text-gray-800 font-black text-6xl tracking-tighter uppercase opacity-20">No Context</span>
            </div>
        </div>
    );
  }

  return (
    <div className="grid grid-cols-2 gap-10">
      <div className="space-y-6">
        <div className="flex items-center gap-3 text-gray-500">
          <BrainCircuit className="h-5 w-5" />
          <span className="text-[12px] font-black uppercase tracking-[0.2em] border-b border-gray-800 pb-1 pr-6">DeepSeek RAG Analysis</span>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-extrabold tracking-tight leading-[115%]">AI Strategy & Reasoning Insights</h2>
          <div className="text-lg leading-relaxed text-gray-400 font-medium border-l-[3px] border-green-500 pl-8 py-2">
            {analysis.explanation.split('\n').map((line, i) => (
              <p key={i} className="mb-4">{line}</p>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs font-bold text-gray-600 uppercase tracking-widest pt-4">
            <span className="px-3 py-1 bg-white/5 rounded-lg border border-white/5">Analysis Update</span>
            <span>Just Now • Powered by Ollama</span>
          </div>
        </div>
      </div>

      <div className="bg-[#0c0c0c] border border-gray-900 rounded-3xl p-10 space-y-8 h-fit shadow-inner">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-500">
            <Newspaper className="h-5 w-5" />
            <span className="text-[11px] font-black uppercase tracking-[0.15em]">Market News Sentiment</span>
          </div>
          <div className="px-3 py-1 bg-green-500/10 rounded-full border border-green-500/20 text-[10px] font-black text-green-500 uppercase tracking-widest">
            {analysis.sentiment.toUpperCase()}
          </div>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-2xl font-black tracking-tight leading-snug">Current News Mood & Momentum Analysis</h3>
          <p className="text-gray-500 font-medium leading-relaxed">
            The overall market sentiment for {analysis.symbol} is currently <strong>{analysis.sentiment.toUpperCase()}</strong>. 
            This classification is derived from the FinBERT model which analyzed the top 5 news headlines 
            for keywords, context, and financial jargon.
          </p>
          
          <div className="pt-6 grid grid-cols-2 gap-4">
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Source Count</span>
               <span className="text-xl font-bold">5 Headliners</span>
            </div>
            <div className="p-5 bg-white/5 rounded-2xl border border-white/5 flex flex-col gap-1.5">
               <span className="text-[10px] font-black text-gray-600 uppercase tracking-widest">Model Pipeline</span>
               <span className="text-xl font-bold text-blue-400">FinBERT v3</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-5 border-t border-gray-900 pt-8 mt-2">
          <div className="h-10 w-10 bg-purple-500/20 rounded-xl border border-purple-500/30 flex items-center justify-center">
             <MessageSquareText className="h-5 w-5 text-purple-400" />
          </div>
          <div className="text-[10px] font-black uppercase tracking-widest text-gray-600 leading-tight">
             Sentiment analysis contributes 40% <br/> to the final AI Signal generation.
          </div>
        </div>
      </div>
    </div>
  );
}
