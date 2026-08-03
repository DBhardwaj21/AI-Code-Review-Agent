"use client";

import React from "react";
import { ShieldCheck, Zap, Wrench, Activity, AlertOctagon, CheckCircle } from "lucide-react";

interface ReviewSummaryProps {
  analysis: string;
  issuesCount: number;
}

export const ReviewSummary: React.FC<ReviewSummaryProps> = ({ analysis, issuesCount }) => {
  // Calculate dynamic health score based on issues found
  const baseScore = 95;
  const calculatedScore = Math.max(35, baseScore - issuesCount * 12);

  const getScoreColor = (score: number) => {
    if (score >= 80) return { text: "text-emerald-400", border: "border-emerald-500", bg: "bg-emerald-500/10", stroke: "#10b981" };
    if (score >= 60) return { text: "text-amber-400", border: "border-amber-500", bg: "bg-amber-500/10", stroke: "#f59e0b" };
    return { text: "text-rose-400", border: "border-rose-500", bg: "bg-rose-500/10", stroke: "#f43f5e" };
  };

  const scoreTheme = getScoreColor(calculatedScore);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      
      {/* Code Health Score Card */}
      <div className="flex flex-col items-center justify-center p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md">
        <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
          Overall Code Health
        </h4>

        {/* Circular Progress Gauge */}
        <div className="relative flex items-center justify-center h-32 w-32">
          <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
            <path
              className="text-slate-800"
              strokeWidth="3.5"
              stroke="currentColor"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            <path
              strokeDasharray={`${calculatedScore}, 100`}
              stroke={scoreTheme.stroke}
              strokeWidth="3.5"
              strokeLinecap="round"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              className="transition-all duration-1000 ease-out"
            />
          </svg>
          <div className="absolute flex flex-col items-center justify-center">
            <span className={`text-3xl font-extrabold ${scoreTheme.text}`}>
              {calculatedScore}
            </span>
            <span className="text-[10px] text-slate-400 font-medium">/ 100</span>
          </div>
        </div>

        <div className="mt-3 flex items-center gap-2">
          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${scoreTheme.bg} ${scoreTheme.text} border ${scoreTheme.border}`}>
            {calculatedScore >= 80 ? "Good Quality" : calculatedScore >= 60 ? "Needs Review" : "Critical Fix Required"}
          </span>
        </div>
      </div>

      {/* Sub-Metrics Grid */}
      <div className="lg:col-span-2 flex flex-col justify-between p-5 rounded-2xl border border-slate-800 bg-slate-900/90 shadow-xl backdrop-blur-md">
        
        <div className="flex items-center justify-between mb-3 border-b border-slate-800/80 pb-2">
          <div className="flex items-center space-x-2">
            <Activity className="h-4 w-4 text-indigo-400" />
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300">
              Executive AI Analysis
            </h4>
          </div>
          <span className="text-xs text-slate-400 font-mono">
            {issuesCount} Issue{issuesCount !== 1 ? "s" : ""} Flagged
          </span>
        </div>

        {/* Executive Summary Text */}
        <p className="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/50 p-3 rounded-xl border border-slate-800/60 mb-4">
          {analysis || "No analysis generated yet."}
        </p>

        {/* Metric Pillars */}
        <div className="grid grid-cols-3 gap-2">
          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2">
            <ShieldCheck className="h-4 w-4 text-cyan-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Security</div>
              <div className="text-xs font-bold text-slate-200">
                {issuesCount > 2 ? "High Risk" : issuesCount > 0 ? "Moderate" : "Secure"}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2">
            <Zap className="h-4 w-4 text-amber-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Performance</div>
              <div className="text-xs font-bold text-slate-200">
                {issuesCount > 1 ? "Suboptimal" : "Optimal"}
              </div>
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center space-x-2">
            <Wrench className="h-4 w-4 text-indigo-400 shrink-0" />
            <div>
              <div className="text-[10px] text-slate-400">Maintainability</div>
              <div className="text-xs font-bold text-slate-200">
                {calculatedScore >= 70 ? "High" : "Low"}
              </div>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
