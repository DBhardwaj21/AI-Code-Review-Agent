"use client";

import React, { useState } from "react";
import ReactMarkdown from "react-markdown";
import { FileText, Download, Copy, Check, FileJson } from "lucide-react";

interface MarkdownReportProps {
  reportText: string;
  analysisText: string;
  issues: string[];
}

export const MarkdownReport: React.FC<MarkdownReportProps> = ({
  reportText,
  analysisText,
  issues,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(reportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadMD = () => {
    const element = document.createElement("a");
    const file = new Blob([reportText], { type: "text/markdown" });
    element.href = URL.createObjectURL(file);
    element.download = `sentinel-code-review-${Date.now()}.md`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleDownloadJSON = () => {
    const data = {
      timestamp: new Date().toISOString(),
      analysis: analysisText,
      issues: issues,
      report: reportText,
    };
    const element = document.createElement("a");
    const file = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    element.href = URL.createObjectURL(file);
    element.download = `sentinel-code-review-${Date.now()}.json`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-5 shadow-xl backdrop-blur-md">
      
      {/* Header toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 pb-4 mb-4">
        <div className="flex items-center space-x-2">
          <FileText className="h-5 w-5 text-indigo-400" />
          <h3 className="text-sm font-bold text-slate-200">
            Full Markdown Report
          </h3>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopy}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition border border-slate-700"
          >
            {copied ? <Check className="h-3.5 w-3.5 text-emerald-400" /> : <Copy className="h-3.5 w-3.5 text-slate-400" />}
            <span>Copy MD</span>
          </button>

          <button
            onClick={handleDownloadMD}
            className="flex items-center space-x-1.5 rounded-lg bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 hover:text-white transition border border-slate-700"
          >
            <Download className="h-3.5 w-3.5 text-slate-400" />
            <span>Export .md</span>
          </button>

          <button
            onClick={handleDownloadJSON}
            className="flex items-center space-x-1.5 rounded-lg bg-indigo-950/80 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-900 hover:text-white transition border border-indigo-800/60"
          >
            <FileJson className="h-3.5 w-3.5 text-indigo-400" />
            <span>Export .json</span>
          </button>
        </div>
      </div>

      {/* Markdown Content */}
      <div className="prose prose-invert max-w-none prose-pre:bg-slate-950 prose-pre:border prose-pre:border-slate-800 text-xs sm:text-sm leading-relaxed text-slate-300 bg-slate-950/50 p-6 rounded-xl border border-slate-800/80">
        <ReactMarkdown>{reportText}</ReactMarkdown>
      </div>

    </div>
  );
};
