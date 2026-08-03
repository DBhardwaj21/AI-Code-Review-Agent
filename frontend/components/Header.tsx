"use client";

import React from "react";
import { Cpu, History, Sparkles, Server, Settings } from "lucide-react";
import { CODE_PRESETS, CodePreset } from "@/constants/presets";

interface HeaderProps {
  onSelectPreset: (preset: CodePreset) => void;
  onOpenHistory: () => void;
  onOpenSettings: () => void;
  historyCount: number;
  isBackendConnected: boolean | null;
}

export const Header: React.FC<HeaderProps> = ({
  onSelectPreset,
  onOpenHistory,
  onOpenSettings,
  historyCount,
  isBackendConnected,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Brand Logo & Title */}
        <div className="flex items-center space-x-3">
          <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-purple-500 to-cyan-400 p-[1px] shadow-lg shadow-indigo-500/20">
            <div className="flex h-full w-full items-center justify-center rounded-[11px] bg-slate-950">
              <Cpu className="h-5 w-5 text-indigo-400 animate-pulse" />
            </div>
          </div>
          <div>
            <h1 className="bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-lg font-bold text-transparent">
              AI Code Review Agent
            </h1>
            <p className="text-xs text-slate-400">Autonomous Code Review & Refactoring Engine</p>
          </div>
        </div>

        {/* Middle Preset Quick Loader */}
        <div className="hidden md:flex items-center space-x-2">
          <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            Sample Bugs:
          </span>
          <div className="flex gap-1.5">
            {CODE_PRESETS.map((preset) => (
              <button
                key={preset.id}
                onClick={() => onSelectPreset(preset)}
                className="rounded-lg bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300 transition-all hover:bg-slate-800 hover:text-white border border-slate-800 hover:border-slate-700"
              >
                {preset.name.split(" ")[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Right Status Badges & Actions */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          
          {/* Backend Connection Indicator */}
          <div className="flex items-center space-x-1.5 rounded-full bg-slate-900/90 px-3 py-1 text-xs border border-slate-800">
            <Server className="h-3.5 w-3.5 text-slate-400" />
            {isBackendConnected === true && (
              <span className="flex items-center gap-1.5 text-emerald-400 font-medium">
                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                FastAPI Connected
              </span>
            )}
            {isBackendConnected === false && (
              <span className="flex items-center gap-1.5 text-amber-400 font-medium" title="Backend unreachable - using client-side simulated AI reviewer">
                <span className="h-2 w-2 rounded-full bg-amber-500" />
                Demo Mode
              </span>
            )}
            {isBackendConnected === null && (
              <span className="text-slate-400">Checking...</span>
            )}
          </div>

          {/* Review History Button */}
          <button
            onClick={onOpenHistory}
            className="relative flex items-center space-x-1.5 rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white border border-slate-800"
          >
            <History className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">History</span>
            {historyCount > 0 && (
              <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-indigo-500 text-[10px] font-bold text-white">
                {historyCount}
              </span>
            )}
          </button>

          {/* Settings Button */}
          <button
            onClick={onOpenSettings}
            title="Settings & Review Options"
            className="flex items-center space-x-1.5 rounded-lg bg-slate-900 p-1.5 sm:px-3 sm:py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800 hover:text-white border border-slate-800"
          >
            <Settings className="h-3.5 w-3.5 text-slate-400" />
            <span className="hidden sm:inline">Settings</span>
          </button>

        </div>

      </div>
    </header>
  );
};
