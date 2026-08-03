"use client";

import React, { useState } from "react";
import { AlertCircle, AlertTriangle, ShieldAlert, CheckCircle2, ChevronRight, Filter } from "lucide-react";

interface IssuesListProps {
  issues: string[];
}

export const IssuesList: React.FC<IssuesListProps> = ({ issues }) => {
  const [filter, setFilter] = useState<"all" | "critical" | "warning">("all");

  const parsedIssues = issues.map((issueStr, idx) => {
    const cleanText = issueStr.replace(/^-\s*/, "").trim();
    
    // Categorize severity based on keywords
    let severity: "critical" | "warning" | "info" = "warning";
    if (/security|vulnerability|injection|leak|overflow|crash|unhandled|critical/i.test(cleanText)) {
      severity = "critical";
    } else if (/style|naming|comment|format|minor/i.test(cleanText)) {
      severity = "info";
    }

    return {
      id: idx + 1,
      text: cleanText,
      severity,
    };
  });

  const filteredIssues = parsedIssues.filter((item) => {
    if (filter === "critical") return item.severity === "critical";
    if (filter === "warning") return item.severity === "warning";
    return true;
  });

  const criticalCount = parsedIssues.filter((i) => i.severity === "critical").length;
  const warningCount = parsedIssues.filter((i) => i.severity === "warning").length;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5 text-amber-400" />
          <h3 className="text-sm font-bold text-slate-200">
            Detected Code Issues
          </h3>
          <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-bold text-slate-300">
            {issues.length}
          </span>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center space-x-1.5 bg-slate-950/80 p-1 rounded-xl border border-slate-800">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              filter === "all" ? "bg-indigo-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            All ({parsedIssues.length})
          </button>
          <button
            onClick={() => setFilter("critical")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              filter === "critical" ? "bg-rose-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Critical ({criticalCount})
          </button>
          <button
            onClick={() => setFilter("warning")}
            className={`px-3 py-1 text-xs font-semibold rounded-lg transition ${
              filter === "warning" ? "bg-amber-600 text-white" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Warnings ({warningCount})
          </button>
        </div>
      </div>

      {/* Issues List Body */}
      {filteredIssues.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <CheckCircle2 className="h-10 w-10 text-emerald-400 mb-2" />
          <p className="text-sm font-semibold text-slate-300">No issues matching filter</p>
          <p className="text-xs text-slate-500">Your code passed all checks for this severity category.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredIssues.map((item) => (
            <div
              key={item.id}
              className={`group flex items-start space-x-3 p-4 rounded-xl border transition-all duration-200 ${
                item.severity === "critical"
                  ? "bg-rose-950/20 border-rose-500/30 hover:border-rose-500/60"
                  : item.severity === "warning"
                  ? "bg-amber-950/20 border-amber-500/30 hover:border-amber-500/60"
                  : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
              }`}
            >
              {/* Severity Icon */}
              <div className="mt-0.5 shrink-0">
                {item.severity === "critical" ? (
                  <ShieldAlert className="h-5 w-5 text-rose-400" />
                ) : item.severity === "warning" ? (
                  <AlertCircle className="h-5 w-5 text-amber-400" />
                ) : (
                  <AlertTriangle className="h-5 w-5 text-cyan-400" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-2 mb-1">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                      item.severity === "critical"
                        ? "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                        : item.severity === "warning"
                        ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                        : "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30"
                    }`}
                  >
                    {item.severity}
                  </span>
                  <span className="text-[11px] font-mono text-slate-500">Issue #{item.id}</span>
                </div>
                <p className="text-xs text-slate-200 leading-relaxed font-sans font-medium">
                  {item.text}
                </p>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
