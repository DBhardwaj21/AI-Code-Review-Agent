"use client";

import React from "react";
import { X, Settings, Shield, Zap, TestTube, Sparkles, Server } from "lucide-react";

export type ReviewFocus = "all" | "security" | "performance" | "clean_code" | "testing";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewFocus: ReviewFocus;
  onFocusChange: (focus: ReviewFocus) => void;
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  reviewFocus,
  onFocusChange,
  apiUrl,
  onApiUrlChange,
}) => {
  if (!isOpen) return null;

  const focusOptions: { id: ReviewFocus; label: string; icon: any; desc: string }[] = [
    {
      id: "all",
      label: "Balanced Review",
      icon: Sparkles,
      desc: "Full comprehensive analysis covering security, performance, bugs, and code style.",
    },
    {
      id: "security",
      label: "Security & Vulnerabilities",
      icon: Shield,
      desc: "Strict check for OWASP top 10, SQL injection, memory leaks, and hardcoded secrets.",
    },
    {
      id: "performance",
      label: "Performance & Speed",
      icon: Zap,
      desc: "Focus on time complexity, loop optimizations, memory allocations, and async efficiency.",
    },
    {
      id: "testing",
      label: "Testability & Edge Cases",
      icon: TestTube,
      desc: "Focus on unhandled exceptions, null pointer risks, boundary conditions, and testability.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200">
      <div className="w-full max-w-lg rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 overflow-hidden">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">Reviewer Settings & Mode</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Focus Selector */}
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              AI Analysis Focus Priority
            </label>
            <div className="grid grid-cols-1 gap-2.5">
              {focusOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = reviewFocus === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => onFocusChange(opt.id)}
                    className={`cursor-pointer flex items-start space-x-3 p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-indigo-950/50 border-indigo-500/80 shadow-md shadow-indigo-500/10"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div
                      className={`mt-0.5 p-2 rounded-lg ${
                        isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200">{opt.label}</span>
                        {isSelected && (
                          <span className="text-[10px] font-bold text-indigo-400 bg-indigo-500/10 px-2 py-0.5 rounded-full border border-indigo-500/20">
                            Active
                          </span>
                        )}
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Backend URL */}
          <div className="pt-2">
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-indigo-400" />
              FastAPI Endpoint URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => onApiUrlChange(e.target.value)}
              className="w-full rounded-xl bg-slate-950 px-3.5 py-2 text-xs font-mono text-slate-200 border border-slate-800 focus:border-indigo-500 focus:outline-none"
              placeholder="http://localhost:8000"
            />
          </div>
        </div>

        {/* Modal Footer */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 transition"
          >
            Save & Apply
          </button>
        </div>

      </div>
    </div>
  );
};
