"use client";

import React, { useState } from "react";
import { GitCompare, CheckCircle2, ArrowRight, Sparkles, Copy, Check } from "lucide-react";

interface DiffViewerProps {
  originalCode: string;
  reportText: string;
  onApplyFix: (fixedCode: string) => void;
}

export const DiffViewer: React.FC<DiffViewerProps> = ({ originalCode, reportText, onApplyFix }) => {
  const [applied, setApplied] = useState(false);
  const [copied, setCopied] = useState(false);

  // Extract code block from markdown report if present, or generate clean refactored version
  const extractCodeFromReport = (report: string): string => {
    const codeBlockMatch = report.match(/```(?:\w+)?\n([\s\S]*?)```/);
    if (codeBlockMatch && codeBlockMatch[1]) {
      return codeBlockMatch[1].trim();
    }
    // Fallback: If no markdown code block is in the report, provide clean refactored guidance
    return `// AI Refactored Code Suggestion\n// Based on Report Recommendations:\n${report
      .split("\n")
      .map((line) => `// ${line}`)
      .join("\n")}`;
  };

  const refactoredCode = extractCodeFromReport(reportText);

  const handleApply = () => {
    onApplyFix(refactoredCode);
    setApplied(true);
    setTimeout(() => setApplied(false), 2500);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(refactoredCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <GitCompare className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">
            AI Code Refactoring & Diff
          </h3>
          <span className="rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            Optimized Fix
          </span>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>Copy Refactored Code</span>
          </button>

          <button
            onClick={handleApply}
            className={`flex items-center space-x-1.5 rounded-lg px-3.5 py-1.5 text-xs font-semibold text-white transition shadow-md ${
              applied
                ? "bg-emerald-600 shadow-emerald-500/20"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-emerald-600/20"
            }`}
          >
            {applied ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                <span>Applied to Editor!</span>
              </>
            ) : (
              <>
                <Sparkles className="h-3.5 w-3.5 text-amber-300" />
                <span>Apply Fix to Editor</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Side by Side Diff Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        
        {/* Left: Original Code */}
        <div className="flex flex-col rounded-xl border border-rose-500/20 bg-slate-950/80 overflow-hidden">
          <div className="flex items-center justify-between border-b border-rose-500/20 bg-rose-950/30 px-3 py-2">
            <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-rose-500" />
              Original Code (Vulnerable)
            </span>
          </div>
          <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto max-h-96 leading-relaxed whitespace-pre-wrap">
            {originalCode}
          </pre>
        </div>

        {/* Right: AI Refactored Code */}
        <div className="flex flex-col rounded-xl border border-emerald-500/20 bg-slate-950/80 overflow-hidden">
          <div className="flex items-center justify-between border-b border-emerald-500/20 bg-emerald-950/30 px-3 py-2">
            <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
              <span className="h-2 w-2 rounded-full bg-emerald-500" />
              AI Refactored Code (Clean)
            </span>
          </div>
          <pre className="p-4 text-xs font-mono text-emerald-300 overflow-x-auto max-h-96 leading-relaxed whitespace-pre-wrap">
            {refactoredCode}
          </pre>
        </div>

      </div>

    </div>
  );
};
