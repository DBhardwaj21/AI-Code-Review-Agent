"use client";

import React, { useState } from "react";
import { X, Settings, Shield, Zap, TestTube, Sparkles, Server, Cpu, Key, Database } from "lucide-react";

export type ReviewFocus = "all" | "security" | "performance" | "clean_code" | "testing";
export type AIProvider = "ollama" | "groq" | "openai" | "azure" | "smart_offline";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  reviewFocus: ReviewFocus;
  onFocusChange: (focus: ReviewFocus) => void;
  apiUrl: string;
  onApiUrlChange: (url: string) => void;
  selectedProvider: AIProvider;
  onProviderChange: (provider: AIProvider) => void;
  apiKey: string;
  onApiKeyChange: (key: string) => void;
  modelName: string;
  onModelNameChange: (model: string) => void;
}

export const SettingsModal: React.FC<SettingsModalProps> = ({
  isOpen,
  onClose,
  reviewFocus,
  onFocusChange,
  apiUrl,
  onApiUrlChange,
  selectedProvider,
  onProviderChange,
  apiKey,
  onApiKeyChange,
  modelName,
  onModelNameChange,
}) => {
  if (!isOpen) return null;

  const providers: { id: AIProvider; name: string; desc: string; badge: string; icon: any }[] = [
    {
      id: "ollama",
      name: "Local Ollama",
      desc: "100% Free & Offline running on your laptop.",
      badge: "Free Local",
      icon: Cpu,
    },
    {
      id: "groq",
      name: "Groq API",
      desc: "Ultra-fast free cloud inference (Llama 3.3 70B).",
      badge: "Free Cloud",
      icon: Zap,
    },
    {
      id: "openai",
      name: "OpenAI API",
      desc: "Standard GPT-4o & GPT-4o-mini models.",
      badge: "API Key",
      icon: Sparkles,
    },
    {
      id: "azure",
      name: "Azure OpenAI",
      desc: "Enterprise Azure OpenAI endpoint.",
      badge: "Enterprise",
      icon: Server,
    },
    {
      id: "smart_offline",
      name: "Smart Offline Heuristics",
      desc: "Rule-based static analysis (Zero API key required).",
      badge: "Fallback",
      icon: Database,
    },
  ];

  const focusOptions: { id: ReviewFocus; label: string; icon: any; desc: string }[] = [
    {
      id: "all",
      label: "Balanced Review",
      icon: Sparkles,
      desc: "Full comprehensive analysis covering security, performance, bugs, and style.",
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
      desc: "Focus on time complexity, loop optimizations, memory allocations, and async code.",
    },
    {
      id: "testing",
      label: "Testability & Edge Cases",
      icon: TestTube,
      desc: "Focus on unhandled exceptions, null pointer risks, and testability.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/70 backdrop-blur-md p-4 animate-in fade-in duration-200 overflow-y-auto">
      <div className="w-full max-w-xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 my-8 max-h-[90vh] overflow-y-auto">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4 mb-4">
          <div className="flex items-center space-x-2">
            <Settings className="h-5 w-5 text-indigo-400" />
            <h3 className="text-base font-bold text-slate-100">AI Reviewer & Model Provider Settings</h3>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="space-y-5">
          
          {/* AI Model Provider Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block flex items-center gap-1.5">
              <Cpu className="h-3.5 w-3.5 text-indigo-400" />
              Select AI Engine / Provider
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {providers.map((p) => {
                const Icon = p.icon;
                const isSelected = selectedProvider === p.id;

                return (
                  <div
                    key={p.id}
                    onClick={() => {
                      onProviderChange(p.id);
                      if (p.id === "ollama") onModelNameChange("llama3.2:latest");
                      else if (p.id === "groq") onModelNameChange("llama-3.3-70b-versatile");
                      else if (p.id === "openai") onModelNameChange("gpt-4o-mini");
                    }}
                    className={`cursor-pointer flex items-start space-x-2.5 p-3 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-indigo-950/60 border-indigo-500/80 shadow-md shadow-indigo-500/10"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-200 truncate">{p.name}</span>
                        <span className="text-[9px] font-bold text-indigo-400 bg-indigo-500/10 px-1.5 py-0.2 rounded border border-indigo-500/20 shrink-0">
                          {p.badge}
                        </span>
                      </div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{p.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Model Name & Key Configuration */}
          {selectedProvider !== "smart_offline" && (
            <div className="p-3.5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3">
              
              {/* Model Name */}
              <div>
                <label className="text-[11px] font-bold text-slate-300 mb-1 block">
                  Model Name:
                </label>
                {selectedProvider === "ollama" ? (
                  <select
                    value={modelName}
                    onChange={(e) => onModelNameChange(e.target.value)}
                    className="w-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs text-slate-200 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  >
                    <option value="llama3.2:latest">llama3.2:latest (2.0 GB)</option>
                    <option value="qwen2:7b">qwen2:7b (4.4 GB)</option>
                    <option value="phi3.5:latest">phi3.5:latest (2.2 GB)</option>
                    <option value="Mistral:latest">Mistral:latest (4.1 GB)</option>
                    <option value="llama2:latest">llama2:latest (3.8 GB)</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={modelName}
                    onChange={(e) => onModelNameChange(e.target.value)}
                    placeholder={selectedProvider === "groq" ? "llama-3.3-70b-versatile" : "gpt-4o-mini"}
                    className="w-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-200 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                )}
              </div>

              {/* API Key Input for Cloud Providers */}
              {(selectedProvider === "groq" || selectedProvider === "openai" || selectedProvider === "azure") && (
                <div>
                  <label className="text-[11px] font-bold text-slate-300 mb-1 flex items-center gap-1">
                    <Key className="h-3 w-3 text-amber-400" />
                    API Key (Optional if configured in backend .env):
                  </label>
                  <input
                    type="password"
                    value={apiKey}
                    onChange={(e) => onApiKeyChange(e.target.value)}
                    placeholder={selectedProvider === "groq" ? "gsk_..." : "sk-..."}
                    className="w-full rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-mono text-slate-200 border border-slate-800 focus:border-indigo-500 focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Analysis Focus Selector */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 block">
              Analysis Priority Focus
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {focusOptions.map((opt) => {
                const Icon = opt.icon;
                const isSelected = reviewFocus === opt.id;

                return (
                  <div
                    key={opt.id}
                    onClick={() => onFocusChange(opt.id)}
                    className={`cursor-pointer flex items-start space-x-2.5 p-2.5 rounded-xl border transition-all ${
                      isSelected
                        ? "bg-indigo-950/50 border-indigo-500/80 shadow-md shadow-indigo-500/10"
                        : "bg-slate-950/40 border-slate-800 hover:border-slate-700"
                    }`}
                  >
                    <div className={`mt-0.5 p-1.5 rounded-lg shrink-0 ${isSelected ? "bg-indigo-600 text-white" : "bg-slate-800 text-slate-400"}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-slate-200">{opt.label}</div>
                      <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{opt.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* API Backend URL */}
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5 flex items-center gap-1.5">
              <Server className="h-3.5 w-3.5 text-indigo-400" />
              FastAPI Endpoint URL
            </label>
            <input
              type="text"
              value={apiUrl}
              onChange={(e) => onApiUrlChange(e.target.value)}
              className="w-full rounded-xl bg-slate-950 px-3.5 py-1.5 text-xs font-mono text-slate-200 border border-slate-800 focus:border-indigo-500 focus:outline-none"
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
