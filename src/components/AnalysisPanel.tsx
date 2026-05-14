import React from 'react';
import { motion } from 'motion/react';

interface AnalysisResult {
  score: number;
  weaknesses: string[];
  missing_keywords: string[];
  suggestions: string[];
}

interface AnalysisPanelProps {
  result: AnalysisResult | null;
  isAnalyzing: boolean;
}

export function AnalysisPanel({ result, isAnalyzing }: AnalysisPanelProps) {
  if (isAnalyzing) {
    return (
      <div className="space-y-8 animate-pulse">
        <div>
          <div className="h-24 w-48 bg-slate-100 mb-4"></div>
          <div className="h-2 w-full bg-slate-100"></div>
        </div>
        <div className="space-y-4">
          <div className="h-32 bg-slate-100"></div>
          <div className="h-32 bg-slate-100"></div>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-12 border border-black border-dashed bg-gray-50/50">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">Waiting for analysis...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 overflow-x-hidden">
      <div>
        <div className="flex justify-between items-start mb-2">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 font-display">Resume Power</span>
          <span className="text-[10px] font-mono text-blue-600 font-bold">ATS_V4_PASS</span>
        </div>
        <div className="flex items-baseline gap-2 sm:gap-4 flex-wrap">
          <h2 className="text-6xl sm:text-8xl font-extrabold tracking-tighter leading-none font-display">{result.score}</h2>
          <div className="flex flex-col">
            <span className="text-xs sm:text-sm font-black uppercase leading-tight">Score</span>
            <span className="text-[10px] sm:text-xs text-green-600 font-black italic tracking-tighter">+{Math.floor(result.score * 0.15)} Potential</span>
          </div>
        </div>
        <div className="w-full h-2 bg-black mt-4 flex">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${result.score}%` }}
            className="h-full bg-blue-600"
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">Critical Improvements</h3>
          <div className="space-y-3">
            {result.weaknesses.map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-red-50/30 border border-transparent hover:border-red-100 transition-colors">
                <div className="w-4 h-4 bg-red-100 flex items-center justify-center shrink-0 mt-0.5 border border-black">
                  <div className="w-1.5 h-1.5 bg-red-600"></div>
                </div>
                <p className="text-xs sm:text-[13px] leading-snug font-bold break-words">{item}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">Missing Keywords</h3>
          <div className="flex flex-wrap gap-2">
            {result.missing_keywords.map((item, i) => (
              <span key={i} className="text-[9px] sm:text-[10px] font-mono bg-black text-white px-2 py-1 font-bold uppercase tracking-wider">
                {item}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-[10px] font-black uppercase tracking-[0.2em] mb-4 text-gray-500">Optimization Steps</h3>
          <div className="space-y-3">
            {result.suggestions.map((item, i) => (
              <div key={i} className="flex gap-3 items-start p-3 bg-emerald-50/30 border border-transparent hover:border-emerald-100 transition-colors">
                <div className="w-4 h-4 bg-emerald-100 flex items-center justify-center shrink-0 mt-0.5 border border-black">
                  <div className="w-1.5 h-1.5 bg-emerald-600"></div>
                </div>
                <p className="text-xs sm:text-[13px] leading-snug font-bold italic break-words">"{item}"</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
