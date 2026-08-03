"use client";

import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { CodeEditor } from "@/components/CodeEditor";
import { AgentPipeline, AgentStep } from "@/components/AgentPipeline";
import { ReviewSummary } from "@/components/ReviewSummary";
import { IssuesList } from "@/components/IssuesList";
import { DiffViewer } from "@/components/DiffViewer";
import { MarkdownReport } from "@/components/MarkdownReport";
import { HistoryDrawer, ReviewHistoryItem } from "@/components/HistoryDrawer";
import { CODE_PRESETS, CodePreset } from "@/constants/presets";
import { LayoutDashboard, AlertTriangle, GitCompare, FileText, Sparkles, Terminal } from "lucide-react";

export default function Home() {
  const [code, setCode] = useState<string>(CODE_PRESETS[0].code);
  const [language, setLanguage] = useState<string>(CODE_PRESETS[0].language);
  const [result, setResult] = useState<{ analysis: string; issues: string[]; report: string } | null>(null);
  
  const [loading, setLoading] = useState<boolean>(false);
  const [agentStep, setAgentStep] = useState<AgentStep>("idle");
  const [elapsedTimeMs, setElapsedTimeMs] = useState<number>(0);
  
  const [activeTab, setActiveTab] = useState<"overview" | "issues" | "diff" | "report">("overview");
  const [isBackendConnected, setIsBackendConnected] = useState<boolean | null>(null);
  
  const [history, setHistory] = useState<ReviewHistoryItem[]>([]);
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Check backend health on mount
  useEffect(() => {
    checkBackendHealth();
    loadHistoryFromStorage();
  }, []);

  const checkBackendHealth = async () => {
    try {
      const res = await fetch("http://localhost:8000/docs", { method: "HEAD", signal: AbortSignal.timeout(2000) });
      setIsBackendConnected(res.ok || res.status === 404 || res.status === 200);
    } catch {
      setIsBackendConnected(false);
    }
  };

  const loadHistoryFromStorage = () => {
    try {
      const saved = localStorage.getItem("sentinel_review_history");
      if (saved) {
        setHistory(JSON.parse(saved));
      }
    } catch (e) {
      console.error("Failed to load history", e);
    }
  };

  const saveReviewToHistory = (item: Omit<ReviewHistoryItem, "id" | "timestamp">) => {
    const newItem: ReviewHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toISOString(),
      ...item,
    };
    const updated = [newItem, ...history.slice(0, 19)]; // Keep latest 20
    setHistory(updated);
    try {
      localStorage.setItem("sentinel_review_history", JSON.stringify(updated));
    } catch (e) {
      console.error("Failed to save history", e);
    }
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem("sentinel_review_history");
  };

  const handleSelectPreset = (preset: CodePreset) => {
    setCode(preset.code);
    setLanguage(preset.language);
  };

  const simulateDemoReview = async (userCode: string) => {
    // Stage 1: Analyzer
    setAgentStep("analyzer");
    await new Promise((r) => setTimeout(r, 900));

    // Stage 2: Issue Finder
    setAgentStep("issue_finder");
    await new Promise((r) => setTimeout(r, 1000));

    // Stage 3: Report Generator
    setAgentStep("report_generator");
    await new Promise((r) => setTimeout(r, 900));

    // Generate intelligent simulated response based on code keywords
    const isPython = userCode.includes("def ") || userCode.includes("import ");
    const isCpp = userCode.includes("#include") || userCode.includes("BufferHandler");

    let demoAnalysis = "";
    let demoIssues: string[] = [];
    let demoReport = "";

    if (isCpp) {
      demoAnalysis = "Analysis of the C++ code reveals dynamic memory allocation without destructor safety checks, unhandled buffer size boundaries in strcpy, and potential dangling pointer leaks.";
      demoIssues = [
        "- Potential Buffer Overflow vulnerability: strcpy used without verifying input length against allocated buffer size.",
        "- Severe Memory Leak: Object dynamically allocated with 'new BufferHandler' is never freed before process termination.",
        "- Rule of Three Violation: Class manages raw pointer resource without explicit copy constructor or assignment operator."
      ];
      demoReport = `### Executive Summary
The analyzed C++ source code exhibits high-risk memory management flaws. Using raw pointers with unchecked string copying procedures creates buffer overflow crash hazards.

### Key Issues & Security Risks
1. **Buffer Overflow Risk**: \`strcpy\` writes unbounded input string data directly into a 64-byte array buffer.
2. **Resource Leak**: Memory allocated via \`new\` is lost when function scope terminates without an explicit \`delete\`.

### Recommended Refactored Implementation

\`\`\`cpp
#include <iostream>
#include <string font-mono>
#include <memory>

class SafeBufferHandler {
private:
    std::string data;

public:
    SafeBufferHandler(const std::string& input) : data(input) {}

    void printData() const {
        std::cout << "Safe Buffer Content: " << data << std::endl;
    }
};

void processRequest() {
    // Smart pointer automatically manages deallocation
    auto buf = std::make_unique<SafeBufferHandler>("Sanitized Safe Input Data");
    buf->printData();
}
\`\`\``;
    } else if (isPython) {
      demoAnalysis = "Python code inspection highlights raw string interpolation in SQL queries, exposing the database to SQL injection attacks, along with silent exception handling and unclosed connection leaks.";
      demoIssues = [
        "- Severe Security Vulnerability: SQL Injection via unsanitized string formatting in database query.",
        "- Hardcoded Security Credential: Raw plaintext password stored directly in source file.",
        "- Database Connection Leak: Missing 'conn.close()' or context manager in database execution cycle.",
        "- Anti-Pattern: Bare 'except' block swallows errors silently without logging stack trace."
      ];
      demoReport = `### Executive Summary
The Python script contains critical security vulnerabilities, notably unescaped user inputs directly interpolated into SQL statements and hardcoded sensitive credentials.

### Key Remediation Steps
1. **Parameterized Queries**: Replace raw string formatting \`f"SELECT..."\` with parameterized placeholders \`cursor.execute("...?", (user, pass))\`.
2. **Context Managers**: Utilize \`with sqlite3.connect(...)\` to automatically handle connection cleanup and transaction commits.
3. **Secure Secrets**: Store passwords in environment variables (\`os.getenv\`) rather than plaintext.

### Recommended Refactored Implementation

\`\`\`python
import sqlite3
import os
import logging

def authenticate_and_fetch_profile(username: str, password: str):
    try:
        with sqlite3.connect("app_database.db") as conn:
            cursor = conn.cursor()
            # Parameterized query prevents SQL injection
            query = "SELECT * FROM users WHERE username = ? AND password = ?"
            cursor.execute(query, (username, password))
            user_data = cursor.fetchone()
            
            if user_data:
                return user_data
            return None
    except sqlite3.Error as e:
        logging.error(f"Database error during authentication: {e}")
        return None
\`\`\``;
    } else {
      demoAnalysis = "The JavaScript/TypeScript module was reviewed. Identified issues include off-by-one array index boundary errors, floating-point precision inaccuracies, and string coercion during math additions.";
      demoIssues = [
        "- Array Out of Bounds Exception: Loop condition 'i <= items.length' attempts to access undefined index.",
        "- Type Coercion Bug: Adding string price representations causes unexpected string concatenation.",
        "- Floating Point Inaccuracy: Direct multiplication for currency tax calculations introduces rounding drift.",
        "- Logic Flaw: Discount application lacks floor validation, resulting in potential negative checkout totals."
      ];
      demoReport = `### Executive Summary
The calculation routine suffers from runtime edge-case vulnerabilities, including out-of-bounds array reads and JavaScript type coercion quirks during currency evaluation.

### Key Remediation Steps
1. **Array Loop Fix**: Correct loop comparison from \`i <= items.length\` to \`i < items.length\` (or use \`reduce\`).
2. **Type Safety**: Ensure numeric parsing on \`item.price\` using \`Number()\` or \`parseFloat()\`.
3. **Currency Guard**: Enforce \`Math.max(0, total - discount)\` to prevent negative values.

### Recommended Refactored Implementation

\`\`\`javascript
function calculateCartTotal(items = [], discountCode = "", taxRate = 0) {
  if (!Array.isArray(items)) return 0;

  // Use Array.reduce for type-safe accumulation
  let total = items.reduce((sum, item) => {
    const price = Number(item?.price) || 0;
    const quantity = Number(item?.quantity) || 1;
    return sum + (price * quantity);
  }, 0);

  // Apply discount with floor validation
  if (discountCode === "SUMMER20") {
    total = Math.max(0, total - 20);
  }

  // Calculate tax and round to 2 decimal places
  const tax = total * Number(taxRate);
  const finalPrice = Math.round((total + tax) * 100) / 100;

  return finalPrice;
}
\`\`\``;
    }

    return { analysis: demoAnalysis, issues: demoIssues, report: demoReport };
  };

  const reviewCode = async () => {
    if (!code.trim()) return;

    setLoading(true);
    setResult(null);
    setAgentStep("analyzer");
    const startTime = Date.now();

    // Start timer counter
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setElapsedTimeMs(Date.now() - startTime);
    }, 50);

    try {
      let data: { analysis: string; issues: string[]; report: string };

      if (isBackendConnected) {
        // Step 1: Analyzer node UI state
        setAgentStep("analyzer");
        await new Promise((r) => setTimeout(r, 400));
        
        // Step 2: Issue finder UI state
        setAgentStep("issue_finder");

        const response = await fetch("http://localhost:8000/review", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ code }),
        });

        if (!response.ok) {
          throw new Error("Backend server responded with error status");
        }

        // Step 3: Report Generator UI state
        setAgentStep("report_generator");
        await new Promise((r) => setTimeout(r, 400));

        data = await response.json();
      } else {
        // Use realistic Simulated Agent Pipeline
        data = await simulateDemoReview(code);
      }

      setAgentStep("completed");
      setResult(data);
      setActiveTab("overview");

      // Save to history
      saveReviewToHistory({
        code,
        language,
        analysis: data.analysis,
        issues: data.issues,
        report: data.report,
      });

    } catch (error) {
      console.warn("Backend request failed, falling back to simulated review agent...", error);
      setIsBackendConnected(false);
      const demoData = await simulateDemoReview(code);
      setAgentStep("completed");
      setResult(demoData);
      setActiveTab("overview");

      saveReviewToHistory({
        code,
        language,
        analysis: demoData.analysis,
        issues: demoData.issues,
        report: demoData.report,
      });
    } finally {
      setLoading(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleApplyFix = (fixedCode: string) => {
    setCode(fixedCode);
  };

  return (
    <div className="min-h-screen bg-[#090d16] bg-grid-pattern text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      
      {/* Navigation Header */}
      <Header
        onSelectPreset={handleSelectPreset}
        onOpenHistory={() => setIsHistoryOpen(true)}
        historyCount={history.length}
        isBackendConnected={isBackendConnected}
      />

      {/* Main Workspace Layout */}
      <main className="flex-1 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Top Hero Banner */}
        <div className="relative overflow-hidden rounded-2xl border border-indigo-500/20 bg-gradient-to-r from-slate-900 via-indigo-950/40 to-slate-900 p-6 shadow-2xl">
          <div className="absolute -top-24 -right-24 h-64 w-64 rounded-full bg-indigo-500/10 blur-3xl" />
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <div className="flex items-center space-x-2">
                <span className="flex h-2 w-2 rounded-full bg-indigo-400 animate-ping" />
                <span className="text-xs font-semibold text-indigo-400 uppercase tracking-widest">
                  LangGraph Powered
                </span>
              </div>
              <h2 className="text-2xl font-extrabold text-white sm:text-3xl mt-1 tracking-tight">
                AI Code Review Agent
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl">
                Paste your source code or select a vulnerability preset. The AI Code Review Agent executes multi-agent graph nodes to detect security flaws, memory leaks, and performance bottlenecks in seconds.
              </p>
            </div>

          </div>
        </div>

        {/* Agent Graph Pipeline Bar */}
        <AgentPipeline currentStep={agentStep} elapsedTimeMs={elapsedTimeMs} />

        {/* Editor & Results Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Left Column: Code Editor Workspace (5 cols on lg) */}
          <div className="lg:col-span-5 flex flex-col space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 flex items-center gap-2">
                <Terminal className="h-4 w-4 text-indigo-400" />
                Input Source Workspace
              </h3>
            </div>
            <CodeEditor
              code={code}
              onChange={setCode}
              onReview={reviewCode}
              loading={loading}
              language={language}
              onLanguageChange={setLanguage}
              onSelectPreset={handleSelectPreset}
            />
          </div>

          {/* Right Column: Review Results & Dashboard (7 cols on lg) */}
          <div className="lg:col-span-7 flex flex-col space-y-4">
            
            {/* Results Navigation Tabs */}
            <div className="flex items-center justify-between border-b border-slate-800 pb-2">
              <div className="flex items-center space-x-1 sm:space-x-2 bg-slate-900/90 p-1 rounded-xl border border-slate-800 overflow-x-auto">
                <button
                  onClick={() => setActiveTab("overview")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "overview"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <LayoutDashboard className="h-3.5 w-3.5" />
                  <span>Overview</span>
                </button>

                <button
                  onClick={() => setActiveTab("issues")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition relative ${
                    activeTab === "issues"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <AlertTriangle className="h-3.5 w-3.5" />
                  <span>Issues</span>
                  {result?.issues && (
                    <span className="ml-1 rounded-full bg-rose-500/20 px-1.5 py-0.2 text-[10px] font-bold text-rose-300">
                      {result.issues.length}
                    </span>
                  )}
                </button>

                <button
                  onClick={() => setActiveTab("diff")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "diff"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <GitCompare className="h-3.5 w-3.5" />
                  <span>AI Refactored Diff</span>
                </button>

                <button
                  onClick={() => setActiveTab("report")}
                  className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                    activeTab === "report"
                      ? "bg-indigo-600 text-white shadow-md shadow-indigo-500/20"
                      : "text-slate-400 hover:text-slate-200"
                  }`}
                >
                  <FileText className="h-3.5 w-3.5" />
                  <span>Full Report</span>
                </button>
              </div>
            </div>

            {/* Tab Views Content */}
            {!result && !loading && (
              <div className="flex flex-col items-center justify-center min-h-[420px] rounded-2xl border border-dashed border-slate-800 bg-slate-900/40 p-8 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-950/60 border border-indigo-800/40 mb-4 shadow-lg">
                  <Sparkles className="h-8 w-8 text-indigo-400 animate-pulse" />
                </div>
                <h3 className="text-lg font-bold text-slate-200 mb-1">Ready for Code Inspection</h3>
                <p className="text-xs text-slate-400 max-w-sm mb-4">
                  Select a bug preset above or paste your code in the left workspace, then click "Analyze Code with AI".
                </p>
                <button
                  onClick={reviewCode}
                  className="rounded-xl bg-indigo-600 px-5 py-2 text-xs font-semibold text-white shadow-lg hover:bg-indigo-500 transition"
                >
                  Run Instant Inspection
                </button>
              </div>
            )}

            {loading && (
              <div className="flex flex-col items-center justify-center min-h-[420px] rounded-2xl border border-slate-800 bg-slate-900/80 p-8 text-center backdrop-blur-md">
                <div className="relative flex h-16 w-16 items-center justify-center mb-4">
                  <div className="absolute inset-0 rounded-full border-4 border-indigo-500/20 border-t-indigo-500 animate-spin" />
                  <Sparkles className="h-6 w-6 text-indigo-400" />
                </div>
                <h4 className="text-sm font-bold text-slate-200">Executing LangGraph Agent Nodes...</h4>
                <p className="text-xs text-slate-400 mt-1">
                  Analyzing syntax tree, checking memory bounds, and preparing refactored recommendations.
                </p>
              </div>
            )}

            {result && !loading && (
              <div className="space-y-4">
                {activeTab === "overview" && (
                  <div className="space-y-4 animate-in fade-in duration-300">
                    <ReviewSummary
                      analysis={result.analysis}
                      issuesCount={result.issues?.length || 0}
                    />
                    <IssuesList issues={result.issues || []} />
                  </div>
                )}

                {activeTab === "issues" && (
                  <div className="animate-in fade-in duration-300">
                    <IssuesList issues={result.issues || []} />
                  </div>
                )}

                {activeTab === "diff" && (
                  <div className="animate-in fade-in duration-300">
                    <DiffViewer
                      originalCode={code}
                      reportText={result.report}
                      onApplyFix={handleApplyFix}
                    />
                  </div>
                )}

                {activeTab === "report" && (
                  <div className="animate-in fade-in duration-300">
                    <MarkdownReport
                      reportText={result.report}
                      analysisText={result.analysis}
                      issues={result.issues}
                    />
                  </div>
                )}
              </div>
            )}

          </div>

        </div>

      </main>

      {/* History Slide-over Drawer */}
      <HistoryDrawer
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectHistory={(item) => {
          setCode(item.code);
          setLanguage(item.language || "javascript");
          setResult({
            analysis: item.analysis,
            issues: item.issues,
            report: item.report,
          });
          setActiveTab("overview");
        }}
        onClearHistory={handleClearHistory}
      />

    </div>
  );
}