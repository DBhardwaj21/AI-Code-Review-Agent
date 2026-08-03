"use client";

import React from "react";
import { GitMerge, Search, AlertTriangle, FileText, CheckCircle2, Loader2, ArrowRight } from "lucide-react";

export type AgentStep = "idle" | "analyzer" | "issue_finder" | "report_generator" | "completed";

interface AgentPipelineProps {
  currentStep: AgentStep;
  elapsedTimeMs?: number;
}

export const AgentPipeline: React.FC<AgentPipelineProps> = ({ currentStep, elapsedTimeMs }) => {
  const steps = [
    {
      id: "analyzer",
      title: "Analyzer Agent",
      subtitle: "Code Structure & Purpose",
      icon: Search,
      color: "indigo",
    },
    {
      id: "issue_finder",
      title: "Issue Finder Agent",
      subtitle: "Detect Bugs & Vulnerabilities",
      icon: AlertTriangle,
      color: "amber",
    },
    {
      id: "report_generator",
      title: "Report Generator Agent",
      subtitle: "Synthesize Fixes & Report",
      icon: FileText,
      color: "emerald",
    },
  ];

  const getStepState = (stepId: string) => {
    if (currentStep === "completed") return "done";
    if (currentStep === "idle") return "idle";
    
    if (stepId === "analyzer") {
      return currentStep === "analyzer" ? "active" : "done";
    }
    if (stepId === "issue_finder") {
      if (currentStep === "analyzer") return "idle";
      return currentStep === "issue_finder" ? "active" : "done";
    }
    if (stepId === "report_generator") {
      return currentStep === "report_generator" ? "active" : "idle";
    }
    return "idle";
  };

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/90 p-4 shadow-xl backdrop-blur-md">
      <div className="flex items-center justify-between mb-4 border-b border-slate-800 pb-3">
        <div className="flex items-center space-x-2">
          <GitMerge className="h-4 w-4 text-indigo-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
            Multi-Agent Execution Graph
          </h3>
        </div>
        {elapsedTimeMs !== undefined && (
          <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-800/50">
            {(elapsedTimeMs / 1000).toFixed(2)}s
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 relative">
        {steps.map((step, idx) => {
          const state = getStepState(step.id);
          const Icon = step.icon;

          return (
            <div
              key={step.id}
              className={`relative flex items-center p-3 rounded-xl border transition-all duration-300 ${
                state === "active"
                  ? "bg-indigo-950/40 border-indigo-500/60 shadow-lg shadow-indigo-500/10 scale-[1.02]"
                  : state === "done"
                  ? "bg-slate-950/60 border-emerald-500/40"
                  : "bg-slate-950/30 border-slate-800/80 opacity-60"
              }`}
            >
              <div
                className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                  state === "active"
                    ? "bg-indigo-600 text-white animate-pulse"
                    : state === "done"
                    ? "bg-emerald-500/20 text-emerald-400"
                    : "bg-slate-800 text-slate-500"
                }`}
              >
                {state === "active" ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : state === "done" ? (
                  <CheckCircle2 className="h-5 w-5 text-emerald-400" />
                ) : (
                  <Icon className="h-5 w-5" />
                )}
              </div>

              <div className="ml-3 flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {step.title}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">Node 0{idx + 1}</span>
                </div>
                <p className="text-[11px] text-slate-400 truncate">{step.subtitle}</p>
              </div>

              {idx < steps.length - 1 && (
                <div className="hidden md:block absolute -right-3.5 top-1/2 -translate-y-1/2 z-10">
                  <ArrowRight className="h-4 w-4 text-slate-600" />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
