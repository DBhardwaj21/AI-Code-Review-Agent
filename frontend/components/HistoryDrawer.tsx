"use client";

import React from "react";
import { X, History, Trash2, ArrowRight, Code2, Calendar } from "lucide-react";

export interface ReviewHistoryItem {
  id: string;
  timestamp: string;
  code: string;
  language: string;
  analysis: string;
  issues: string[];
  report: string;
}

interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: ReviewHistoryItem[];
  onSelectHistory: (item: ReviewHistoryItem) => void;
  onClearHistory: () => void;
}

export const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-950/60 backdrop-blur-sm transition-opacity animate-in fade-in duration-200">
      
      {/* Click outside backdrop */}
      <div className="flex-1" onClick={onClose} />

      {/* Drawer Card */}
      <div className="flex w-full max-w-md flex-col bg-slate-900 border-l border-slate-800 shadow-2xl h-full">
        
        {/* Drawer Header */}
        <div className="flex items-center justify-between border-b border-slate-800 p-4">
          <div className="flex items-center space-x-2">
            <History className="h-5 w-5 text-indigo-400" />
            <h3 className="text-sm font-bold text-slate-200">Review History</h3>
            <span className="rounded-full bg-slate-800 px-2 py-0.5 text-xs text-slate-400 font-mono">
              {history.length}
            </span>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                title="Clear History"
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-rose-400 transition"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Drawer Items */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <History className="h-10 w-10 text-slate-700 mb-2" />
              <p className="text-sm font-semibold text-slate-400">No review history yet</p>
              <p className="text-xs text-slate-600 mt-1">
                Reviews you run will be saved here automatically.
              </p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                onClick={() => {
                  onSelectHistory(item);
                  onClose();
                }}
                className="group cursor-pointer rounded-xl border border-slate-800 bg-slate-950/60 p-3.5 transition-all hover:border-indigo-500/50 hover:bg-slate-950"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="flex items-center text-[10px] font-mono text-slate-400 gap-1">
                    <Calendar className="h-3 w-3 text-slate-500" />
                    {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} • {new Date(item.timestamp).toLocaleDateString()}
                  </span>
                  <span className="rounded bg-indigo-500/10 px-2 py-0.5 text-[10px] font-bold text-indigo-400 border border-indigo-500/20">
                    {item.issues?.length || 0} Issues
                  </span>
                </div>

                <div className="flex items-center space-x-2 text-xs font-mono text-slate-300 bg-slate-900/80 p-2 rounded border border-slate-800 truncate mb-2">
                  <Code2 className="h-3.5 w-3.5 text-indigo-400 shrink-0" />
                  <span className="truncate">{item.code.split("\n")[0]}</span>
                </div>

                <div className="flex items-center justify-between text-xs text-slate-400 group-hover:text-indigo-300">
                  <span className="text-[11px] truncate max-w-[240px]">{item.analysis.slice(0, 50)}...</span>
                  <ArrowRight className="h-3.5 w-3.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            ))
          )}
        </div>

      </div>

    </div>
  );
};
